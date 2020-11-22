package com.crowdstreet.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record DocumentWithCallbackDTO(@JsonProperty("body") String body, @JsonProperty("callback") String callback) {
}
