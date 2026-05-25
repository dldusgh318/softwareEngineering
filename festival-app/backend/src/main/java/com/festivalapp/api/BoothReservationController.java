package com.festivalapp.api;

import com.festivalapp.dto.BoothReservationCreateRequest;
import com.festivalapp.dto.BoothReservationResponse;
import com.festivalapp.service.BoothReservationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/booth-reservations")
@RequiredArgsConstructor
public class BoothReservationController {

  private final BoothReservationService boothReservationService;

  @PostMapping
  ResponseEntity<BoothReservationResponse> createReservation(
      @RequestBody BoothReservationCreateRequest request) {
    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(boothReservationService.createReservation(request));
  }

  @GetMapping("/applicants/{applicantId}")
  ResponseEntity<List<BoothReservationResponse>> getReservationsByApplicant(
      @PathVariable String applicantId) {
    return ResponseEntity.ok(boothReservationService.getReservationsByApplicant(applicantId));
  }
}
