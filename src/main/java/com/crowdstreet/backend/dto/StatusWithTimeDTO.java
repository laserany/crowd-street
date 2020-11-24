package com.crowdstreet.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;

public record StatusWithTimeDTO(@JsonProperty("status") String status, @JsonProperty("detail") String detail, @JsonProperty("body") String body, @JsonProperty("creation_time") Long creation_time, @JsonProperty("last_access_time") Long last_access_time) implements Serializable {
}
