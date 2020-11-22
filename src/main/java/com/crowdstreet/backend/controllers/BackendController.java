package com.crowdstreet.backend.controllers;

import com.crowdstreet.backend.configuration.ThirdService;
import com.crowdstreet.backend.dto.DocumentDTO;
import com.crowdstreet.backend.dto.DocumentWithCallbackDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
public class BackendController {

    @Autowired
    private ThirdService thirdService;

    @PostMapping("/request")
    public String submitRequest(@RequestBody DocumentDTO documentDTO) {
        String uuid = UUID.randomUUID().toString();
        String callbackWithId = String.format("/callback/%s", uuid);
        DocumentWithCallbackDTO request = new DocumentWithCallbackDTO(documentDTO.body(), callbackWithId);
        thirdService.processDocument(request);
        return "Your request has been submitted";
    }
}
