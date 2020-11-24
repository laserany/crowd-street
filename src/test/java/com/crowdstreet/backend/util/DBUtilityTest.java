package com.crowdstreet.backend.util;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class DBUtilityTest {

    @Autowired
    private DBUtility dbUtility;

    @Test
    public void testAttributeBytesToObjectConvertor() throws IOException, ClassNotFoundException {
        assertEquals("test", dbUtility.attributeBytesToObjectConvertor(new byte[]{-84, -19, 0, 5, 116, 0, 4, 116, 101, 115, 116}));
    }

    @Test
    public void testObjectToAttributeBytesConvertor() throws IOException {
        assertArrayEquals(new byte[]{-84, -19, 0, 5, 116, 0, 4, 116, 101, 115, 116}, dbUtility.objectToAttributeBytesConvertor("test"));
    }

}