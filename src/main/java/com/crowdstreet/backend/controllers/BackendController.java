package com.crowdstreet.backend.controllers;

import com.crowdstreet.backend.configuration.ThirdService;
import com.crowdstreet.backend.dto.DocumentDTO;
import com.crowdstreet.backend.dto.DocumentWithCallbackDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
public class BackendController {

    @Autowired
    private ThirdService thirdService;

    @PostMapping("/request")
    public ResponseEntity<String> submitRequest(@RequestBody DocumentDTO documentDTO) {
        String uuid = UUID.randomUUID().toString();
        String callbackWithId = String.format("/callback/%s", uuid);
        DocumentWithCallbackDTO request = new DocumentWithCallbackDTO(documentDTO.body(), callbackWithId);
        try {
            thirdService.processDocument(request);
        } catch (Exception e) {
            return new ResponseEntity<>("Call to Third Service has failed. Please Contact Customer Support.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("Your request has been submitted.", HttpStatus.OK);
    }

    @PostMapping("/callback/{id}")
    public ResponseEntity<String> receiveRequest(@RequestBody String status) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
