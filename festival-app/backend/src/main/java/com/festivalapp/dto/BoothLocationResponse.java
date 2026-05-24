package com.festivalapp.dto;

import com.festivalapp.domain.booth.BoothLocation;

public record BoothLocationResponse(
    String zone,
    String area,
    String detail,
    int mapX,
    int mapY) {

  public static BoothLocationResponse from(BoothLocation location) {
    return new BoothLocationResponse(
        location.zone(),
        location.area(),
        location.detail(),
        location.mapX(),
        location.mapY());
  }
}
