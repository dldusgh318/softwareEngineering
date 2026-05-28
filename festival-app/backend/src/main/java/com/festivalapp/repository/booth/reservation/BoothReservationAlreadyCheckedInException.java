package com.festivalapp.repository.booth.reservation;

public class BoothReservationAlreadyCheckedInException extends RuntimeException {

  public BoothReservationAlreadyCheckedInException() {
    super("이미 체크인된 예약입니다.");
  }
}
