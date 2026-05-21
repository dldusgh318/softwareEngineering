package com.festivalapp.dto;

import java.time.Instant;

public record HealthResponse(String status, String service, Instant checkedAt) {}
