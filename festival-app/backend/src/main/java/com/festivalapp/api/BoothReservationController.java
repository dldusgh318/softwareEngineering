package com.festivalapp.api;

import com.festivalapp.dto.BoothReservationCreateRequest;
import com.festivalapp.dto.BoothReservationResponse;
import com.festivalapp.security.AuthenticatedUser;
import com.festivalapp.service.BoothReservationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/booth-reservations")
@RequiredArgsConstructor
public class BoothReservationController {

  private final BoothReservationService boothReservationService;

  @PostMapping
  ResponseEntity<BoothReservationResponse> createReservation(
      Authentication authentication,
      @RequestBody BoothReservationCreateRequest request) {
    validateApplicant(authentication, request.applicantId());
    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(boothReservationService.createReservation(request));
  }

  @GetMapping("/applicants/{applicantId}")
  ResponseEntity<List<BoothReservationResponse>> getReservationsByApplicant(
      Authentication authentication,
      @PathVariable String applicantId) {
    validateApplicant(authentication, applicantId);
    return ResponseEntity.ok(boothReservationService.getReservationsByApplicant(applicantId));
  }

  @GetMapping("/{reservationId}")
  ResponseEntity<BoothReservationResponse> getReservation(
      @PathVariable String reservationId) {
    return ResponseEntity.ok(boothReservationService.getReservation(reservationId));
  }

  private void validateApplicant(Authentication authentication, String applicantId) {
    if (authentication == null
        || !(authentication.getPrincipal() instanceof AuthenticatedUser user)
        || !user.id().equals(applicantId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인의 예약 정보만 처리할 수 있습니다.");
    }
  }
}
