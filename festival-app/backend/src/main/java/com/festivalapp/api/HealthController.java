package com.festivalapp.api;

import com.festivalapp.dto.HealthResponse;
import java.time.Instant;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

  @GetMapping
  HealthResponse health() {
    return new HealthResponse("UP", "festival-backend", Instant.now());
  }
}
