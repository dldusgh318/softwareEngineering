package com.festivalapp.repository.map;

import com.festivalapp.domain.map.MapLocation;
import com.festivalapp.repository.map.datasource.MapLocationDataSource;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class MapLocationRepository {

  private final MapLocationDataSource mapLocationDataSource;

  public List<MapLocation> findAll() {
    return mapLocationDataSource.findAll();
  }
}
