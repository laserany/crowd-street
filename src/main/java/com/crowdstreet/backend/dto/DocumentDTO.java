package com.crowdstreet.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;

public record DocumentDTO(@JsonProperty("body") String body) implements Serializable {
}
