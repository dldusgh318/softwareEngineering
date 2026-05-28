package com.festivalapp.repository.booth.reservation;

public class DuplicateBoothReservationException extends RuntimeException {

  public DuplicateBoothReservationException() {
    super("이미 신청한 부스 예약이 있습니다.");
  }
}
