package com.crowdstreet.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record DocumentDTO(@JsonProperty("body") String body) {
}
