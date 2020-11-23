package com.crowdstreet.backend.controllers;

import com.crowdstreet.backend.configuration.ThirdService;
import com.crowdstreet.backend.dto.DocumentDTO;
import com.crowdstreet.backend.dto.DocumentWithCallbackDTO;
import com.crowdstreet.backend.dto.StatusDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class BackendControllerTest {

    @Autowired
    private BackendController backendController;
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    ThirdService thirdService;
    @MockBean
    RestTemplate restTemplate;

    @Test
    public void contextLoads() throws Exception {
        assertNotNull(backendController);
    }

    @Test
    public void shouldReturnOkResponseIfCallToThirdServiceWasSuccessful() throws Exception {
        this.mockMvc.perform(post("/request")
                .contentType(MediaType.APPLICATION_JSON)
                .content(writeValueAsJson(new DocumentDTO("testRequest")))
                .param("callbackURL", "testCallbackURL"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("Your request has been submitted."));
        verify(thirdService).processDocument(any(DocumentWithCallbackDTO.class));
        verify(restTemplate).postForEntity(contains("/callback"), eq("STARTED"), eq(String.class));
    }

    @Test
    public void shouldReturnInternalServerErrorResponseIfCallToThirdServiceFailed() throws Exception {
        doThrow(Exception.class).when(thirdService).processDocument(any(DocumentWithCallbackDTO.class));
        this.mockMvc.perform(post("/request")
                .contentType(MediaType.APPLICATION_JSON)
                .content(writeValueAsJson(new DocumentDTO("testRequest"))))
                .andDo(print())
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Call to Third Service has failed. Please Contact Customer Support."));
        verify(thirdService).processDocument(any(DocumentWithCallbackDTO.class));
        verify(restTemplate, times(0)).postForEntity(contains("/callback"), eq("STARTED"), eq(String.class));
    }

    @Test
    public void shouldReturnBadRequestResponseIfRequestIsNull() throws Exception {
        this.mockMvc.perform(post("/request")
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
        verify(thirdService, times(0)).processDocument(any(DocumentWithCallbackDTO.class));
        verify(restTemplate, times(0)).postForEntity(contains("/callback"), eq("STARTED"), eq(String.class));
    }

    @Test
    public void shouldReturnNoContentResponseForCallbackPostEndpoint() throws Exception {
        this.mockMvc.perform(post("/callback/1")
        .contentType(MediaType.APPLICATION_JSON)
        .content("STARTED"))
        .andDo(print())
        .andExpect(status().isNoContent());
    }

    @Test
    public void shouldReturnNoContentResponseForCallbackPutEndpoint() throws Exception {
        this.mockMvc.perform(post("/callback/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(writeValueAsJson(new StatusDTO("PROCESSED", "Document has been processed."))))
                .andDo(print())
                .andExpect(status().isNoContent());
    }

    private String writeValueAsJson(Object object) throws JsonProcessingException {
        return new ObjectMapper().writeValueAsString(object);
    }
}