package com.festivalapp.dto;

import com.festivalapp.domain.booth.Booth;

public record BoothResponse(
    String id,
    String name,
    String teamName,
    String description,
    String category,
    String operatingHours,
    int availableTables,
    BoothLocationResponse location) {

  public static BoothResponse from(Booth booth) {
    return new BoothResponse(
        booth.id(),
        booth.name(),
        booth.teamName(),
        booth.description(),
        booth.category(),
        booth.operatingHours(),
        booth.availableTables(),
        BoothLocationResponse.from(booth.location()));
  }
}
