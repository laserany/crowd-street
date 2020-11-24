package com.crowdstreet.backend.util;

import org.springframework.stereotype.Service;

import java.io.*;

@Service
public class DBUtility {

    public Object attributeBytesToObjectConvertor(byte[] attributeBytes) throws IOException, ClassNotFoundException {
        return new ObjectInputStream(new ByteArrayInputStream(attributeBytes)).readObject();
    }

    public byte[] objectToAttributeBytesConvertor(Object object) throws IOException, ClassNotFoundException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ObjectOutputStream objectOutputStream = new ObjectOutputStream(byteArrayOutputStream);
        objectOutputStream.writeObject(object);
        objectOutputStream.flush();
        return byteArrayOutputStream.toByteArray();
    }
}
