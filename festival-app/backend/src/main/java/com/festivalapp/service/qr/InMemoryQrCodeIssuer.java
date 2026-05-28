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
  public String issue(QrCodeIssueCommand command) {
    if (command.simulateFailure()) {
      throw new QrCodeIssueException("QR 발급 시뮬레이션 실패");
    }

    BoothReservation reservation = command.reservation();
    return frontendBaseUrl + "/booths/reservations/" + reservation.id();
  }
}
