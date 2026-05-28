package com.festivalapp.repository.booth.reservation;

public class BoothReservationStatusNotCheckInReadyException extends RuntimeException {

  public BoothReservationStatusNotCheckInReadyException() {
    super("예약 완료 상태의 예약만 체크인할 수 있습니다.");
  }
}
