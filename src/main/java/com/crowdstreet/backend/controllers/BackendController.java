package com.crowdstreet.backend.controllers;

import com.crowdstreet.backend.configuration.ThirdService;
import com.crowdstreet.backend.dto.DocumentDTO;
import com.crowdstreet.backend.dto.DocumentWithCallbackDTO;
import com.crowdstreet.backend.dto.StatusDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
public class BackendController {

    @Autowired
    private ThirdService thirdService;
    @Autowired
    private RestTemplate restTemplate;

    @PostMapping("/request")
    public ResponseEntity<String> submitRequest(@RequestBody DocumentDTO documentDTO, HttpSession session) {
        String uuid = UUID.randomUUID().toString();
        String callbackWithId = String.format("/callback/%s", uuid);
        DocumentWithCallbackDTO request = new DocumentWithCallbackDTO(documentDTO.body(), callbackWithId);
        try {
            String fullPath = ServletUriComponentsBuilder.fromCurrentRequest().build().toString();
            String relativePath = ServletUriComponentsBuilder.fromCurrentRequest().build().getPath();
            thirdService.processDocument(request);
            StatusDTO statusDTO = new StatusDTO("STARTED", "Document processing has started.", documentDTO.body());
            restTemplate.postForEntity(fullPath.replace(relativePath, callbackWithId), statusDTO, StatusDTO.class);
        } catch (Exception e) {
            return new ResponseEntity<>("Call to Third Service has failed. Please Contact Customer Support.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("Your request has been submitted.", HttpStatus.OK);
    }

    @PostMapping("/callback/{id}")
    public ResponseEntity<String> postRequestStatus(@PathVariable("id") String id, @RequestBody StatusDTO status, HttpServletRequest request) {
        Map<String, StatusDTO> statusMap = request.getSession().getAttribute("requestStatuses") == null? new HashMap<>(): (Map<String, StatusDTO>) request.getSession().getAttribute("requestStatuses");
        statusMap.put(id, status);
        request.getSession().setAttribute("requestStatuses", statusMap);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/callback/{id}")
    public ResponseEntity<String> updateRequestStatus(@PathVariable("id") String id, @RequestBody StatusDTO status, HttpServletRequest request) {
        Map<String, StatusDTO> statusMap = (Map<String, StatusDTO>) request.getSession().getAttribute("requestStatuses");
        if(statusMap == null || !statusMap.containsKey(id)) {
            return new ResponseEntity<>(String.format("Request with ID %s does not exist", id), HttpStatus.BAD_REQUEST);
        } else {
            statusMap.put(id, status);
            request.getSession().setAttribute("requestStatuses", statusMap);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @GetMapping("/status/{id}")
    public ResponseEntity<StatusDTO> getRequestStatus(@PathVariable("id") String id, HttpSession session) {
        return new ResponseEntity<>((StatusDTO) session.getAttribute(id), HttpStatus.OK);
    }
}
