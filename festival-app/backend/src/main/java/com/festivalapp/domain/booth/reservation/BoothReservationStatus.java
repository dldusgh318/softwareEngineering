package com.festivalapp.domain.booth.reservation;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum BoothReservationStatus {
  PENDING_APPROVAL("관리자 승인 대기"),
  APPROVED("관리자 승인 완료"),
  RESERVED("QR 발급 완료"),
  CHECKED_IN("현장 체크인 완료"),
  COMPLETED("예약 이용 완료"),
  CANCELLED("예약 취소");

  private final String description;
}
