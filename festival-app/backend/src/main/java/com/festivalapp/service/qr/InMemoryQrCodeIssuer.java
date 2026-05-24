package com.festivalapp.service.qr;

import com.festivalapp.domain.booth.reservation.BoothReservation;
import org.springframework.stereotype.Component;

@Component
public class InMemoryQrCodeIssuer implements QrCodeIssuer {

  @Override
  public String issue(BoothReservation reservation) {
    return "QR-" + reservation.id();
  }
}
