package com.festivalapp.domain.booth;

public record Booth(
    String id,
    String name,
    String teamName,
    String description,
    String category,
    String operatingHours,
    int availableTables,
    BoothLocation location) {}
