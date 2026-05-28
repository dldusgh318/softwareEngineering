package com.festivalapp.repository.booth.reservation;

public class BoothReservationCapacityExceededException extends RuntimeException {

  public BoothReservationCapacityExceededException() {
    super("신청 가능한 테이블 수를 초과했습니다.");
  }
}
