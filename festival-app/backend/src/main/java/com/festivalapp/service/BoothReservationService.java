package com.festivalapp.service;

import com.festivalapp.domain.booth.Booth;
import com.festivalapp.domain.booth.reservation.BoothReservation;
import com.festivalapp.domain.booth.reservation.BoothReservationStatus;
import com.festivalapp.dto.BoothReservationCreateRequest;
import com.festivalapp.dto.BoothReservationResponse;
import com.festivalapp.repository.booth.BoothRepository;
import com.festivalapp.repository.booth.reservation.BoothReservationRepository;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class BoothReservationService {

  private final BoothRepository boothRepository;
  private final BoothReservationRepository boothReservationRepository;
  private final BoothReservationAvailabilityPolicy availabilityPolicy;

  public BoothReservationResponse createReservation(BoothReservationCreateRequest request) {
    if (request == null || isBlank(request.boothId())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "예약할 부스 정보가 필요합니다.");
    }

    Booth booth = boothRepository.findById(request.boothId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "부스를 찾을 수 없습니다."));

    availabilityPolicy.validate(booth, request);

    return BoothReservationResponse.from(boothReservationRepository.save(
        createPendingApprovalReservation(booth, request)));
  }

  public List<BoothReservationResponse> getReservationsByApplicant(String applicantId) {
    return boothReservationRepository.findByApplicantId(applicantId).stream()
        .map(BoothReservationResponse::from)
        .toList();
  }

  private boolean isBlank(String value) {
    return value == null || value.isBlank();
  }

  private BoothReservation createPendingApprovalReservation(
      Booth booth,
      BoothReservationCreateRequest request) {
    LocalDateTime now = LocalDateTime.now();
    return new BoothReservation(
        UUID.randomUUID().toString(),
        booth.id(),
        request.applicantId(),
        request.applicantName(),
        request.requestedTables(),
        BoothReservationStatus.PENDING_APPROVAL,
        null,
        now,
        now);
  }
}
