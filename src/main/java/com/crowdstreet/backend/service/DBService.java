/*
The way the JDBC Session works is that it creates 2 tables, SPRING_SESSION and SPRING_SESSION_ATTRIBUTES
and they both share the same PRIMARY_ID.
SPRING_SESSION has PRIMARY_ID, SESSION_ID, CREATION_TIME and LAST_ACCESS_TIME
SPRING_SESSION_ATTRIBUTES has the PRIMARY_ID along with the status stored in bytes
getCreationTimeAndLastAccessTimeForAGivenPrimaryID method is used to retrieve the
CREATION_TIME and LAST_ACCESS_TIME from the SPRING_SESSION table with the given PRIMARY_ID
For simplicity i'm just grabbing the first resultSet(Which can work most of the time but
not recommended in general. In production a more detailed approach should be discussed)
getPrimaryIDAndStatusDTOFromRequestID calls the SPRING_SESSION_ATTRIBUTES to retrieve the PRIMARY_ID
based on the requestID. However since the attribute is stored in bytes, looping had to be done
through the result set then convert each byte array to object until
we get the right resultSet that has our request_ID and then take the PRIMARY_ID from that resultSet.
Same as method one, i'm retrieving the first value however inconsistencies may occur and more than
one row could've existed so a more detailed approach should be implemented for production.
*/


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
