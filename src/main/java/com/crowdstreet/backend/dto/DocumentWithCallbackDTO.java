package com.crowdstreet.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;

public record DocumentWithCallbackDTO(@JsonProperty("body") String body, @JsonProperty("callback") String callback) implements Serializable {
}
