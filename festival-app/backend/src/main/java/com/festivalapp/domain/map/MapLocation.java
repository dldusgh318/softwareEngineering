package com.festivalapp.domain.map;

public record MapLocation(
    Long id,
    String name,
    String category,
    double x,
    double y,
    double width,
    double height,
    String description) {}
