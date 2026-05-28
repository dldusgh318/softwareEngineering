package com.festivalapp.repository.booth.reservation;

public class BoothReservationCancelledException extends RuntimeException {

  public BoothReservationCancelledException() {
    super("취소된 예약은 체크인할 수 없습니다.");
  }
}
