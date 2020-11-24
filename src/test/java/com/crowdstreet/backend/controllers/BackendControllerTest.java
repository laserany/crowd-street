package com.crowdstreet.backend.controllers;

import com.crowdstreet.backend.configuration.ThirdService;
import com.crowdstreet.backend.dto.DocumentDTO;
import com.crowdstreet.backend.dto.DocumentWithCallbackDTO;
import com.crowdstreet.backend.dto.StatusDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.io.ByteArrayInputStream;
import java.io.ObjectInput;
import java.io.ObjectInputStream;
import java.net.URI;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest(webEnvironment= SpringBootTest.WebEnvironment.RANDOM_PORT)
class BackendControllerTest {

    @Autowired
    private BackendController backendController;
    @Autowired
    private TestRestTemplate testRestTemplate;

    @LocalServerPort
    int randomServerPort;

    @MockBean
    private ThirdService thirdService;
    @MockBean
    private RestTemplate restTemplate;

    private String baseURL;
    private HttpHeaders headers;

    @BeforeEach
    public void setUp() throws SQLException {
        clearSpringSessionTables();
        baseURL = "http://localhost:"+randomServerPort;
        headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
    }

    @Test
    public void contextLoads() throws Exception {
        assertNotNull(backendController);
    }

    @Test
    public void shouldReturnOkResponseIfCallToThirdServiceWasSuccessful() throws Exception {

        URI uri = new URI(baseURL + "/request");
        HttpEntity<DocumentDTO> request = new HttpEntity<>(new DocumentDTO("testRequest"), headers);
        ResponseEntity<String> result = testRestTemplate.postForEntity(uri, request, String.class);
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals("Your request has been submitted.", result.getBody());
        verify(thirdService).processDocument(any(DocumentWithCallbackDTO.class));
        verify(restTemplate).postForEntity(contains("/callback"), eq(new StatusDTO("STARTED", "Document processing has started.", "testRequest")), eq(StatusDTO.class));
    }

    @Test
    public void shouldReturnInternalServerErrorResponseIfCallToThirdServiceFailed() throws Exception {
        doThrow(Exception.class).when(thirdService).processDocument(any(DocumentWithCallbackDTO.class));
        URI uri = new URI(baseURL + "/request");
        HttpEntity<DocumentDTO> request = new HttpEntity<>(new DocumentDTO("testRequest"), headers);
        ResponseEntity<String> result = testRestTemplate.postForEntity(uri, request, String.class);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        assertEquals("Call to Third Service has failed. Please Contact Customer Support.", result.getBody());
        verify(thirdService).processDocument(any(DocumentWithCallbackDTO.class));
        verify(restTemplate, times(0)).postForEntity(contains("/callback"), eq(new StatusDTO("STARTED", "Document processing has started.", "testRequest")), eq(StatusDTO.class));
    }

    @Test
    public void shouldReturnBadRequestResponseIfRequestIsNull() throws Exception {
        URI uri = new URI(baseURL + "/request");
        HttpEntity<DocumentDTO> request = null;
        ResponseEntity<String> result = testRestTemplate.postForEntity(uri, request, String.class);
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        verify(thirdService, times(0)).processDocument(any(DocumentWithCallbackDTO.class));
        verify(restTemplate, times(0)).postForEntity(contains("/callback"), eq(new StatusDTO("STARTED", "Document processing has started.", "testRequest")), eq(StatusDTO.class));
    }

    @Test
    public void shouldReturnNoContentResponseForCallbackPostEndpoint() throws Exception {
        URI uri = new URI(baseURL + "/callback/1");
        HttpEntity<StatusDTO> request = new HttpEntity<>(new StatusDTO("PROCESSED", "Document has been processed.", "1"), headers);
        ResponseEntity<String> result = testRestTemplate.postForEntity(uri, request, String.class);
        assertEquals(HttpStatus.NO_CONTENT, result.getStatusCode());
    }

    @Test
    public void shouldReturnBadRequestResponseForCallbackPutEndpointWhenRequestIDDoesNotExist() throws Exception {
        URI uri = new URI(baseURL + "/callback/1");
        HttpEntity<StatusDTO> request = new HttpEntity<>(new StatusDTO("PROCESSED", "Document has been processed.", "1"), headers);
        ResponseEntity<String> result = testRestTemplate.exchange(uri, HttpMethod.PUT, request, String.class);
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        assertEquals("Request with ID 1 does not exist", result.getBody());
    }

    @Test
    public void shouldReturnRequestStatusForgivenId() throws Exception {
        URI uri = new URI(baseURL + "/status/1");
        ResponseEntity<StatusDTO> result = testRestTemplate.getForEntity(uri, StatusDTO.class);
        assertEquals(HttpStatus.OK, result.getStatusCode());
    }

    @Test
    public void whenH2DbIsNotQueriedthenSessionInfoIsEmpty() throws Exception {
        assertEquals(0, getSessionIdsFromDatabase().size());
        assertEquals(0, getSessionAttributeBytesFromDatabase().size());
    }

    @Test
    public void whenH2DbIsQueriedthenOneSessionIsCreated() throws Exception {
        URI uri = new URI(baseURL + "/status/1");
        testRestTemplate.getForEntity(uri, String.class);
        assertEquals(1, getSessionIdsFromDatabase().size());
    }

    @Test
    public void whenDataIsInsertedIntoH2DbthenSessionAttributeIsRetrieved() throws Exception {
        URI uri = new URI(baseURL + "/callback/1");
        StatusDTO statusDTO = new StatusDTO("PROCESSED", "Document has been processed.", "1");
        HttpEntity<StatusDTO> request = new HttpEntity<>(statusDTO, headers);
        testRestTemplate.postForObject(uri, request, String.class);
        List<byte[]> queryResponse = getSessionAttributeBytesFromDatabase();
        assertEquals(1, queryResponse.size());
        ObjectInput in = new ObjectInputStream(new ByteArrayInputStream(queryResponse.get(0)));
        HashMap<String, StatusDTO> obj = (HashMap<String, StatusDTO>) in.readObject();
        assertEquals(statusDTO, obj.get("1"));
    }

    private List<String> getSessionIdsFromDatabase() throws SQLException {

        List<String> result = new ArrayList<>();
        ResultSet rs = getResultSet(
                "SELECT * FROM SPRING_SESSION");

        while (rs.next()) {
            result.add(rs.getString("SESSION_ID"));
        }
        return result;
    }

    private List<byte[]> getSessionAttributeBytesFromDatabase() throws SQLException {

        List<byte[]> result = new ArrayList<>();
        ResultSet rs = getResultSet("SELECT * FROM SPRING_SESSION_ATTRIBUTES");

        while (rs.next()) {
            result.add(rs.getBytes("ATTRIBUTE_BYTES"));
        }
        return result;
    }

    private ResultSet getResultSet(String sql) throws SQLException {

        Connection conn = DriverManager.getConnection("jdbc:h2:mem:testdb", "sa", "");
        Statement stat = conn.createStatement();
        return stat.executeQuery(sql);
    }

    private void clearSpringSessionTables() throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:h2:mem:testdb", "sa", "");
        Statement stat = conn.createStatement();
        stat.execute("DELETE FROM SPRING_SESSION");
        stat.execute("DELETE FROM SPRING_SESSION_ATTRIBUTES");
    }

}