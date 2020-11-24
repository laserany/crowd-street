package com.crowdstreet.backend.service;

import com.crowdstreet.backend.dto.StatusDTO;
import com.crowdstreet.backend.util.DBUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.*;

@Service
public class DBService {

    @Autowired
    private Connection connection;
    @Autowired
    private DBUtility dbUtility;

    public Map<String, Long> getCreationTimeAndLastAccessTimeForAGivenPrimaryID(String primaryID) throws Exception {
        Map<String, Long> creationAndLastAccessTime = new HashMap<>();
        Statement statement = connection.createStatement();
        ResultSet resultSet = statement.executeQuery("""
                SELECT * FROM SPRING_SESSION
                WHERE PRIMARY_ID = '%s'
                """.formatted(primaryID));
        resultSet.next();
        creationAndLastAccessTime.put("creation_time", resultSet.getLong("CREATION_TIME"));
        creationAndLastAccessTime.put("last_access_time", resultSet.getLong("LAST_ACCESS_TIME"));
        return creationAndLastAccessTime;
    }

    public Map<String, StatusDTO> getPrimaryIDAndStatusDTOFromRequestID(String requestID) throws Exception {
        Statement statement = connection.createStatement();
        ResultSet resultSet = statement.executeQuery("""
                SELECT * FROM SPRING_SESSION_ATTRIBUTES
                """);
        while(resultSet.next()) {
            byte[] attributeBytes = resultSet.getBytes("ATTRIBUTE_BYTES");
            Map<String, StatusDTO> statusDTOMap = (Map<String, StatusDTO>) dbUtility.attributeBytesToObjectConvertor(attributeBytes);
            if (statusDTOMap.containsKey(requestID)) {
                return Collections.singletonMap(resultSet.getString("SESSION_PRIMARY_ID"), statusDTOMap.get(requestID));
            }
        }
        return null;
    }
}
