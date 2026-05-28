package com.festivalapp.service.qr;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.festivalapp.domain.booth.reservation.BoothReservation;
import com.festivalapp.domain.booth.reservation.BoothReservationStatus;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;

class InMemoryQrCodeIssuerTest {

  @Test
  void issueReturnsReservationVerificationUrl() {
    InMemoryQrCodeIssuer issuer = new InMemoryQrCodeIssuer("https://festival.example.com");

    String qrCode = issuer.issue(new QrCodeIssueCommand(reservation(), false));

    assertThat(qrCode)
        .isEqualTo("https://festival.example.com/booths/reservations/reservation-1");
  }

  @Test
  void issueThrowsExceptionWhenFailureIsSimulated() {
    InMemoryQrCodeIssuer issuer = new InMemoryQrCodeIssuer("https://festival.example.com");

    assertThatThrownBy(() -> issuer.issue(new QrCodeIssueCommand(reservation(), true)))
        .isInstanceOf(QrCodeIssueException.class)
        .hasMessage("QR 발급 시뮬레이션 실패");
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
