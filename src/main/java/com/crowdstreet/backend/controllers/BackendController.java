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
import java.io.IOException;
import java.sql.SQLException;
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
        String uuid = UUID.randomUUID().toString();
        logger.trace("Unique Request ID is %s.".formatted(uuid));
        String callbackWithId = String.format("/callback/%s", uuid);
        DocumentWithCallbackDTO request = new DocumentWithCallbackDTO(documentDTO.body(), callbackWithId);
        try {
            String fullPath = ServletUriComponentsBuilder.fromCurrentRequest().build().toString();
            String relativePath = ServletUriComponentsBuilder.fromCurrentRequest().build().getPath();
            logger.info("Calling Third Service.");
            thirdService.processDocument(request);
            logger.info("Call to Third Service succeeded.");
            StatusDTO statusDTO = new StatusDTO("STARTED", "Document processing has started.", documentDTO.body());
            restTemplate.postForEntity(fullPath.replace(relativePath, callbackWithId), statusDTO, StatusDTO.class);
        } catch (Exception e) {
            logger.error("Call to Third Service has failed.");
            return new ResponseEntity<>("Call to Third Service has failed. Please Contact Customer Support.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("Your request has been submitted.", HttpStatus.OK);
    }

    @PostMapping("/callback/{id}")
    public ResponseEntity<String> postRequestStatus(@PathVariable("id") String id, @RequestBody StatusDTO status, HttpSession session) {
        logger.info("Post call from Third Service with status %s.".formatted(status.toString()));
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
    public ResponseEntity<StatusWithTimeDTO> getRequestStatus(@PathVariable("id") String requestID, HttpSession session) throws SQLException, IOException, ClassNotFoundException {
        if(session.getAttribute("requestStatuses") != null) {
            logger.info("Status for request ID %s is in session Therefor grabbing status from session.".formatted(requestID));
            StatusDTO statusDTO = ((Map<String, StatusDTO>) session.getAttribute("requestStatuses")).get(requestID);
            Long creationTime = session.getCreationTime();
            Long lastAccessedTime = session.getLastAccessedTime();
            return new ResponseEntity<>(new StatusWithTimeDTO(statusDTO.status(), statusDTO.detail(), statusDTO.body(), creationTime, lastAccessedTime), HttpStatus.OK);
        } else {
            logger.info("Status for request ID %s is not in session therefor calling DB.".formatted(requestID));
            Map<String, StatusDTO> primaryIDAndStatusDTO = dbService.getPrimaryIDAndStatusDTOFromRequestID(requestID);
            String primaryID = primaryIDAndStatusDTO.keySet().toArray()[0].toString();
            StatusDTO statusDTO = primaryIDAndStatusDTO.get(primaryID);
            Map<String, Long> creationAndLastAccessedTimeMap = dbService.getCreationTimeAndLastAccessTimeForAGivenPrimaryID(primaryID);
            return new ResponseEntity<>(new StatusWithTimeDTO(statusDTO.status(), statusDTO.detail(), statusDTO.body(), creationAndLastAccessedTimeMap.get("creation_time"), creationAndLastAccessedTimeMap.get("last_access_time")), HttpStatus.OK);
        }
    }
}
