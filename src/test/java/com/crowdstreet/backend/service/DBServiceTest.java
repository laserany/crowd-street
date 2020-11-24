/*
Unit tests that are testing the functionality of our DB Service. This is mocking the call to the DB.
 */

package com.crowdstreet.backend.service;

import com.crowdstreet.backend.dto.StatusDTO;
import com.crowdstreet.backend.util.DBUtility;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
class DBServiceTest {

    @Autowired
    private DBService dbService;

    @MockBean
    private Connection connection;
    @MockBean
    private DBUtility dbUtility;

    @Mock
    private Statement statement;
    @Mock
    private ResultSet resultSet;

    @BeforeEach
    public void setUp() throws SQLException {
        when(connection.createStatement()).thenReturn(statement);
        when(statement.executeQuery(any())).thenReturn(resultSet);
    }

    @Test
    public void testGetCreationTimeAndLastAccessTimeForAGivenPrimaryID() throws Exception {
        Long creationTime = 123L;
        Long lastAccessedTime = 456L;
        String primaryId = "testPrimaryID";
        when(resultSet.getLong("CREATION_TIME")).thenReturn(creationTime);
        when(resultSet.getLong("LAST_ACCESS_TIME")).thenReturn(lastAccessedTime);
        Map<String, Long> creationAndLastAccessTime = dbService.getCreationTimeAndLastAccessTimeForAGivenPrimaryID(primaryId);
        assertEquals(creationTime, creationAndLastAccessTime.get("creation_time"));
        assertEquals(lastAccessedTime, creationAndLastAccessTime.get("last_access_time"));
    }

    @Test
    public void testGetPrimaryIDAndStatusDTOFromRequestID() throws Exception {
        String requestID = "testRequestID";
        String primaryID = "testPrimaryID";
        StatusDTO statusDTO = new StatusDTO("testStatus", "testDetail", "testBody");
        Map<String, StatusDTO> statusDTOMap = new HashMap<>();
        statusDTOMap.put(requestID, statusDTO);
        byte[] attributeBytes = new byte[]{};

        when(resultSet.next()).thenReturn(true, false);
        when(resultSet.getString("SESSION_PRIMARY_ID")).thenReturn(primaryID);
        when(resultSet.getBytes("ATTRIBUTE_BYTES")).thenReturn(attributeBytes);
        when(dbUtility.attributeBytesToObjectConvertor(attributeBytes)).thenReturn(statusDTOMap);
        Map<String, StatusDTO> result = dbService.getPrimaryIDAndStatusDTOFromRequestID(requestID);
        assertAll(()-> assertEquals(primaryID, result.keySet().toArray()[0]), () -> assertEquals(statusDTO, result.get(primaryID)));
    }

}