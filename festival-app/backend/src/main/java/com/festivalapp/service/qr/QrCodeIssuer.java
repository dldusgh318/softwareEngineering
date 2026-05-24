package com.festivalapp.service.qr;

import com.festivalapp.domain.booth.reservation.BoothReservation;

public interface QrCodeIssuer {

  String issue(BoothReservation reservation);
}
