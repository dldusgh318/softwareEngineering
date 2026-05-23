package com.festivalapp.dto;

import com.festivalapp.domain.map.MapLocation;

public record MapLocationResponse(
    Long id,
    String name,
    String category,
    double x,
    double y,
    double width,
    double height,
    String description) {

  public static MapLocationResponse from(MapLocation location) {
    return new MapLocationResponse(
        location.id(),
        location.name(),
        location.category().name(),
        location.area().x(),
        location.area().y(),
        location.area().width(),
        location.area().height(),
        location.description());
  }
}
