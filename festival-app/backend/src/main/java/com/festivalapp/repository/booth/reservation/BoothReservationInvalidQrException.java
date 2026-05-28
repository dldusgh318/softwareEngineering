package com.festivalapp.repository.booth.reservation;

public class BoothReservationInvalidQrException extends RuntimeException {

  public BoothReservationInvalidQrException() {
    super("유효하지 않은 QR입니다.");
  }
}
