package com.festivalapp.service;

import com.festivalapp.domain.booth.Booth;
import com.festivalapp.dto.BoothReservationCreateRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class BoothReservationAvailabilityPolicy {

  public void validate(Booth booth, BoothReservationCreateRequest request) {
    validateApplicant(request);
    validateRequestedTables(request);
    if (request.requestedTables() > booth.availableTables()) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "신청 가능한 테이블 수를 초과했습니다.");
    }
  }

  private void validateApplicant(BoothReservationCreateRequest request) {
    if (isBlank(request.applicantId()) || isBlank(request.applicantName())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "신청자 정보가 필요합니다.");
    }
  }

  private void validateRequestedTables(BoothReservationCreateRequest request) {
    if (request.requestedTables() <= 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "예약 테이블 수는 1개 이상이어야 합니다.");
    }
  }

  private boolean isBlank(String value) {
    return value == null || value.isBlank();
  }
}
