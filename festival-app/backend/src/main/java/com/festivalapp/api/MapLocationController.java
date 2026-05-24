package com.festivalapp.api;

import com.festivalapp.dto.MapLocationResponse;
import com.festivalapp.service.MapLocationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/map-locations")
@RequiredArgsConstructor
public class MapLocationController {

  private final MapLocationService mapLocationService;

  @GetMapping
  ResponseEntity<List<MapLocationResponse>> getMapLocations() {
    return ResponseEntity.ok(mapLocationService.getMapLocations());
  }
}
