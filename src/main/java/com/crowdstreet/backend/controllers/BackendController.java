package com.crowdstreet.backend.controllers;

import com.crowdstreet.backend.dto.DocumentDTO;
import com.crowdstreet.backend.dto.DocumentWithCallbackDTO;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
public class BackendController {

    @PostMapping("/request")
    public String testo(@RequestBody DocumentDTO documentDTO) {
        String uuid = UUID.randomUUID().toString();
        String callbackWithId = String.format("/callback/%s", uuid);
        DocumentWithCallbackDTO documentWithCallbackDTO = new DocumentWithCallbackDTO(documentDTO.body(), callbackWithId);
        //TODO: Call third service
        return "hello world";
    }
}
