package com.crowdstreet.backend.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BackendControllerTest {

    @Autowired
    private BackendController backendController;

    @Test
    public void contextLoads() throws Exception {
        assertNotNull(backendController);
    }
}