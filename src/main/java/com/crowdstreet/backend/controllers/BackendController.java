/*
This Controller has all the four endpoints needed for the projects. Details are
explained for each endpoint below.

The main structure is to store the request statuses to the JDBC session in the H2 in memory database.
However this is not recommended for production. In production, a real Database should be used instead to
persist the data but for simplicity i'm only storing the status in session using in memory database.
We also shouldn't depend solely on the session in production.
Other recommendations is to cache the data when making get requests. Also statuses can be stored
in a static variable (HOWEVER THIS IS NOT Recommended as this can cause a lot of issues specially in multi-thread
environment).
 */

package com.crowdstreet.backend.controllers;

import com.crowdstreet.backend.configuration.ThirdService;
import com.crowdstreet.backend.dto.DocumentDTO;
import com.crowdstreet.backend.dto.DocumentWithCallbackDTO;
import com.crowdstreet.backend.dto.StatusDTO;
import com.crowdstreet.backend.dto.StatusWithTimeDTO;
import com.crowdstreet.backend.service.DBService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
public class BackendController {

    Logger logger = LoggerFactory.getLogger(BackendController.class);

    @Autowired
    private ThirdService thirdService;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private DBService dbService;

    @PostMapping("/request")
    public ResponseEntity<String> submitRequest(@RequestBody DocumentDTO documentDTO, HttpSession session) {
        logger.trace("incoming Document DTO %s.".formatted(documentDTO.toString()));
        //this uuid is used to create a unique request ID
        String uuid = UUID.randomUUID().toString();
        logger.trace("Unique Request ID is %s.".formatted(uuid));
        String callbackWithId = String.format("/callback/%s", uuid);
        DocumentWithCallbackDTO request = new DocumentWithCallbackDTO(documentDTO.body(), callbackWithId);
        try {
            String fullPath = ServletUriComponentsBuilder.fromCurrentRequest().build().toString();
            String relativePath = ServletUriComponentsBuilder.fromCurrentRequest().build().getPath();
            logger.info("Calling Third Service.");
            //This is to call AWS lambda. The call is real but the function does nothing for simplicity
            thirdService.processDocument(request);
            logger.info("Call to Third Service succeeded.");
            StatusDTO statusDTO = new StatusDTO("STARTED", "Document processing has started.", documentDTO.body());
            //This is to simulate the call from 3rd service to the call back URL
            restTemplate.postForEntity(fullPath.replace(relativePath, callbackWithId), statusDTO, StatusDTO.class);
        } catch (Exception e) {
            logger.error("Call to Third Service has failed.", e);
            return new ResponseEntity<>("Call to Third Service has failed. Please Contact Customer Support.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("Your request has been submitted.", HttpStatus.OK);
    }

    @PostMapping("/callback/{id}")
    public ResponseEntity<String> postRequestStatus(@PathVariable("id") String id, @RequestBody StatusDTO status, HttpSession session) {
        logger.info("Post call from Third Service with status %s.".formatted(status.toString()));
        //Posting status to session as a map that has the request unique ID as the key and statusDTO(status,detail,body) as value
        Map<String, StatusDTO> statusMap = session.getAttribute("requestStatuses") == null? new HashMap<>(): (Map<String, StatusDTO>) session.getAttribute("requestStatuses");
        statusMap.put(id, status);
        session.setAttribute("requestStatuses", statusMap);
        logger.info("A new Status was created successfully.");
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/callback/{id}")
    public ResponseEntity<String> updateRequestStatus(@PathVariable("id") String id, @RequestBody StatusDTO status, HttpSession session) {
        logger.info("Update call from Third Service with status %s.".formatted(status.toString()));
        Map<String, StatusDTO> statusMap = (Map<String, StatusDTO>) session.getAttribute("requestStatuses");
        //updating the status, needed to make sure we are providing the right status and that the
        // unique Request ID actually exists
        //otherwise a different response status should be sent
        if(statusMap == null || !statusMap.containsKey(id)) {
            logger.error("statusMap was either Null or the request ID %s did not exist".formatted(id));
            return new ResponseEntity<>(String.format("Request with ID %s does not exist.", id), HttpStatus.BAD_REQUEST);
        } else if (!(status.status().equals("PROCESSED") || status.status().equals("COMPLETED") || status.status().equals("ERROR"))) {
            logger.error("inocrrect status was provided from Third Service.");
            return new ResponseEntity<>("Incorrect status was provided.", HttpStatus.BAD_REQUEST);
        } else {
            statusMap.put(id, status);
            session.setAttribute("requestStatuses", statusMap);
            logger.info("Status was updated successfully.");
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @GetMapping("/status/{id}")
    public ResponseEntity<StatusWithTimeDTO> getRequestStatus(@PathVariable("id") String requestID, HttpSession session) {
        //trying to retrieve the data based on the given ID. If it was already stored in the session then
        //we can retrieve it from the session otherwise we have to call the DB to achieve that.
        if(session.getAttribute("requestStatuses") != null) {
            logger.info("Status for request ID %s is in session Therefor grabbing status from session.".formatted(requestID));
            StatusDTO statusDTO = ((Map<String, StatusDTO>) session.getAttribute("requestStatuses")).get(requestID);
            Long creationTime = session.getCreationTime();
            Long lastAccessedTime = session.getLastAccessedTime();
            return new ResponseEntity<>(new StatusWithTimeDTO(statusDTO.status(), statusDTO.detail(), statusDTO.body(), creationTime, lastAccessedTime), HttpStatus.OK);
        } else {
            logger.info("Status for request ID %s is not in session therefor calling DB.".formatted(requestID));
            StatusDTO statusDTO;
            Map<String, Long> creationAndLastAccessedTimeMap;
            try {
                Map<String, StatusDTO> primaryIDAndStatusDTO = dbService.getPrimaryIDAndStatusDTOFromRequestID(requestID);
                logger.info("PrimaryID and StatusDTO was retrieved successfully.");
                String primaryID = primaryIDAndStatusDTO.keySet().toArray()[0].toString();
                statusDTO = primaryIDAndStatusDTO.get(primaryID);
                creationAndLastAccessedTimeMap = dbService.getCreationTimeAndLastAccessTimeForAGivenPrimaryID(primaryID);
            } catch (Exception e) {
                logger.error("Call to DB has failed.", e);
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
            logger.info("Creation time and last access time was retrieved successfully.");
            return new ResponseEntity<>(new StatusWithTimeDTO(statusDTO.status(), statusDTO.detail(), statusDTO.body(), creationAndLastAccessedTimeMap.get("creation_time"), creationAndLastAccessedTimeMap.get("last_access_time")), HttpStatus.OK);
        }
    }
}
