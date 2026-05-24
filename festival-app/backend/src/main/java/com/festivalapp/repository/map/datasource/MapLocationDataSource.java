package com.festivalapp.repository.map.datasource;

import com.festivalapp.domain.map.MapLocation;
import java.util.List;

public interface MapLocationDataSource {

  List<MapLocation> findAll();
}
