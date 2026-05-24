package com.festivalapp.api;

import com.festivalapp.dto.BoothResponse;
import com.festivalapp.service.BoothService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/booths")
@RequiredArgsConstructor
public class BoothController {

  private final BoothService boothService;

  @GetMapping
  ResponseEntity<List<BoothResponse>> getBooths() {
    return ResponseEntity.ok(boothService.getBooths());
  }

  @GetMapping("/{boothId}")
  ResponseEntity<BoothResponse> getBooth(@PathVariable String boothId) {
    return boothService.getBooth(boothId)
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }
}
