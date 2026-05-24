package com.festivalapp.dto;

public record BoothReservationCreateRequest(
    String boothId,
    String applicantId,
    String applicantName,
    int requestedTables) {}
