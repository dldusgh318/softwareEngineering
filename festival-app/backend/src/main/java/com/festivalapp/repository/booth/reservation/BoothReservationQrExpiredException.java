package com.festivalapp.repository.booth.reservation;

public class BoothReservationQrExpiredException extends RuntimeException {

  public BoothReservationQrExpiredException() {
    super("만료된 QR입니다.");
  }
}
