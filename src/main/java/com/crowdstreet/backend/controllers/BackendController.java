package com.crowdstreet.backend.controllers;

import com.crowdstreet.backend.configuration.ThirdService;
import com.crowdstreet.backend.dto.DocumentDTO;
import com.crowdstreet.backend.dto.DocumentWithCallbackDTO;
import com.crowdstreet.backend.dto.StatusDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.UUID;

@RestController
public class BackendController {

    @Autowired
    private ThirdService thirdService;
    @Autowired
    private RestTemplate restTemplate;

    @PostMapping("/request")
    public ResponseEntity<String> submitRequest(@RequestBody DocumentDTO documentDTO) {
        UriComponentsBuilder builder = ServletUriComponentsBuilder.fromCurrentRequest();
        String testo = builder.build().getPath();
        String uuid = UUID.randomUUID().toString();
        String callbackWithId = String.format("/callback/%s", uuid);
        DocumentWithCallbackDTO request = new DocumentWithCallbackDTO(documentDTO.body(), callbackWithId);
        try {
            String fullPath = ServletUriComponentsBuilder.fromCurrentRequest().build().toString();
            String relativePath = ServletUriComponentsBuilder.fromCurrentRequest().build().getPath();
            thirdService.processDocument(request);
            restTemplate.postForEntity(fullPath.replace(relativePath, callbackWithId), "STARTED", String.class);
        } catch (Exception e) {
            return new ResponseEntity<>("Call to Third Service has failed. Please Contact Customer Support.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("Your request has been submitted.", HttpStatus.OK);
    }

    @PostMapping("/callback/{id}")
    public ResponseEntity<String> postRequestStatus(@RequestBody String status) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/callback/{id}")
    public ResponseEntity<String> updateRequestStatus(@RequestBody StatusDTO statusDTO) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
