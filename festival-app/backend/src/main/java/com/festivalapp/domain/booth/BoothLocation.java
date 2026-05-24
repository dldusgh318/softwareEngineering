package com.festivalapp.domain.booth;

public record BoothLocation(
    String zone,
    String area,
    String detail,
    int mapX,
    int mapY) {}
