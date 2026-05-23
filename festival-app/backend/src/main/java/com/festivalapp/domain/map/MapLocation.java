package com.festivalapp.domain.map;

public record MapLocation(
    Long id,
    String name,
    MapLocationCategory category,
    MapArea area,
    String description) {}
