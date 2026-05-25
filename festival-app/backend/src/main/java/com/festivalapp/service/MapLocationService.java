package com.festivalapp.service;

import com.festivalapp.domain.map.MapLocationCategory;
import com.festivalapp.dto.MapLocationResponse;
import com.festivalapp.repository.map.MapLocationRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MapLocationService {

  private final MapLocationRepository mapLocationRepository;

  public List<MapLocationResponse> getMapLocations(MapLocationCategory category) {
    return mapLocationRepository.findByCategory(category).stream()
        .map(MapLocationResponse::from)
        .toList();
  }
}
