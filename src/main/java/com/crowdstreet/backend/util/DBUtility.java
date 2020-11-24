/*
Simple Utility class that allows us to convert between Objects and byte arrays.
This is used in the DB service when we try to retrieve objects from the SPRING_SESSION_ATTRIBUTES
table that stores these objects in bytes
 */

package com.crowdstreet.backend.util;

import org.springframework.stereotype.Service;

import java.io.*;

@Service
public class DBUtility {

    public Object attributeBytesToObjectConvertor(byte[] attributeBytes) throws IOException, ClassNotFoundException {
        return new ObjectInputStream(new ByteArrayInputStream(attributeBytes)).readObject();
    }

    public byte[] objectToAttributeBytesConvertor(Object object) throws IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ObjectOutputStream objectOutputStream = new ObjectOutputStream(byteArrayOutputStream);
        objectOutputStream.writeObject(object);
        objectOutputStream.flush();
        return byteArrayOutputStream.toByteArray();
    }
}
