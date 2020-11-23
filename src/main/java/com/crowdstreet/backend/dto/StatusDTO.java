package com.crowdstreet.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record StatusDTO(@JsonProperty("status") String status, @JsonProperty("detail") String detail) {
}
