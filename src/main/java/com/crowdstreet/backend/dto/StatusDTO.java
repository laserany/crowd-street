package com.crowdstreet.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;

public record StatusDTO(@JsonProperty("status") String status, @JsonProperty("detail") String detail, @JsonProperty("body") String body) implements Serializable {
}
