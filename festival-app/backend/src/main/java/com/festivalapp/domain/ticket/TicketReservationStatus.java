package com.festivalapp.domain.ticket;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TicketReservationStatus {
  SEAT_HELD("좌석 선점"),
  RESERVATION_CREATED("예매 생성"),
  QR_ISSUED("QR 티켓 발급"),
  COMPLETED("예매 완료"),
  CANCELLED("예매 취소");

  private final String description;
}
