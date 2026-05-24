package com.festivalapp.service.qr;

import static org.assertj.core.api.Assertions.assertThat;

import com.festivalapp.domain.booth.reservation.BoothReservation;
import com.festivalapp.domain.booth.reservation.BoothReservationStatus;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;

class InMemoryQrCodeIssuerTest {

  @Test
  void issueReturnsReservationVerificationUrl() {
    InMemoryQrCodeIssuer issuer = new InMemoryQrCodeIssuer("https://festival.example.com");

    String qrCode = issuer.issue(reservation());

    assertThat(qrCode)
        .isEqualTo("https://festival.example.com/booths/reservations/reservation-1");
  }

  private BoothReservation reservation() {
    LocalDateTime now = LocalDateTime.of(2026, 5, 24, 10, 0);
    return new BoothReservation(
        "reservation-1",
        "booth-1",
        "user-1",
        "홍길동",
        2,
        BoothReservationStatus.APPROVED,
        null,
        now,
        now);
  }
}
