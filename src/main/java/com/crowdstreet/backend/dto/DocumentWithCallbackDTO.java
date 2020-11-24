package com.crowdstreet.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;

//using Java 15 feature, we can use records instead of classes that creates our variables,
//constructor in one line as shown below. JsonProperty and implementing serializable was needed
//to allow them to be used in resttemplates to pass the data as JSON
public record DocumentWithCallbackDTO(@JsonProperty("body") String body, @JsonProperty("callback") String callback) implements Serializable {
}
