package com.festivalapp.service.qr;

import com.festivalapp.domain.booth.reservation.BoothReservation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class InMemoryQrCodeIssuer implements QrCodeIssuer {

  private final String frontendBaseUrl;

  public InMemoryQrCodeIssuer(
      @Value("${app.frontend-base-url:http://localhost:3000}") String frontendBaseUrl) {
    this.frontendBaseUrl = frontendBaseUrl;
  }

  @Override
  public String issue(BoothReservation reservation) {
    return frontendBaseUrl + "/booths/reservations/" + reservation.id();
  }
}
