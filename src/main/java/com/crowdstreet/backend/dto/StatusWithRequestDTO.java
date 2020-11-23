package com.crowdstreet.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record StatusWithRequestDTO(@JsonProperty("status") String status, @JsonProperty("detail") String detail, @JsonProperty("body") String body)  {
}
