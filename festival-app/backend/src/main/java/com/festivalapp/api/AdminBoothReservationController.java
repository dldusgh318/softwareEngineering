package com.festivalapp.api;

import com.festivalapp.dto.BoothReservationApprovalRequest;
import com.festivalapp.dto.BoothReservationCheckInRequest;
import com.festivalapp.dto.BoothReservationResponse;
import com.festivalapp.service.BoothReservationApprovalService;
import com.festivalapp.service.BoothReservationCheckInService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/booth-reservations")
@RequiredArgsConstructor
public class AdminBoothReservationController {

  private final BoothReservationApprovalService boothReservationApprovalService;
  private final BoothReservationCheckInService boothReservationCheckInService;

  @GetMapping("/pending")
  ResponseEntity<List<BoothReservationResponse>> getPendingReservations() {
    return ResponseEntity.ok(boothReservationApprovalService.getPendingReservations());
  }

  @GetMapping("/approved")
  ResponseEntity<List<BoothReservationResponse>> getApprovedReservations() {
    return ResponseEntity.ok(boothReservationApprovalService.getApprovedReservations());
  }

  @PostMapping("/{reservationId}/approve")
  ResponseEntity<BoothReservationResponse> approveReservation(
      @PathVariable String reservationId,
      @RequestBody BoothReservationApprovalRequest request) {
    return ResponseEntity.ok(
        boothReservationApprovalService.approveReservation(reservationId, request));
  }

  @PostMapping("/check-in")
  ResponseEntity<BoothReservationResponse> checkInReservation(
      @RequestBody BoothReservationCheckInRequest request) {
    return ResponseEntity.ok(boothReservationCheckInService.checkIn(request));
  }
}
