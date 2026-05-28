package com.festivalapp.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.festivalapp.domain.booth.reservation.BoothReservation;
import com.festivalapp.domain.booth.reservation.BoothReservationStatus;
import com.festivalapp.dto.BoothReservationCheckInRequest;
import com.festivalapp.dto.BoothReservationResponse;
import com.festivalapp.repository.booth.reservation.BoothReservationRepository;
import com.festivalapp.repository.booth.reservation.TestBoothReservationDataSource;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

class BoothReservationCheckInServiceTest {

  @Test
  void checkInChangesReservedReservationToCheckedIn() {
    List<BoothReservation> reservations = new ArrayList<>(List.of(
        reservation("reservation-1", BoothReservationStatus.RESERVED)));
    BoothReservationCheckInService service = serviceWith(reservations);

    BoothReservationResponse response = service.checkIn(new BoothReservationCheckInRequest(
        "http://localhost:3000/booths/reservations/reservation-1"));

    assertThat(response.status()).isEqualTo("CHECKED_IN");
    assertThat(response.statusDescription()).isEqualTo("현장 체크인 완료");
    assertThat(reservations.get(0).status()).isEqualTo(BoothReservationStatus.CHECKED_IN);
  }

  @Test
  void checkInRejectsInvalidQr() {
    BoothReservationCheckInService service = serviceWith(new ArrayList<>());

    assertThatThrownBy(() -> service.checkIn(new BoothReservationCheckInRequest("invalid-qr")))
        .isInstanceOf(ResponseStatusException.class)
        .extracting("statusCode")
        .isEqualTo(HttpStatus.BAD_REQUEST);
  }

  @Test
  void checkInRejectsAlreadyCheckedInReservation() {
    List<BoothReservation> reservations = new ArrayList<>(List.of(
        reservation("reservation-1", BoothReservationStatus.CHECKED_IN)));
    BoothReservationCheckInService service = serviceWith(reservations);

    assertThatThrownBy(() -> service.checkIn(new BoothReservationCheckInRequest(
        "http://localhost:3000/booths/reservations/reservation-1")))
        .isInstanceOf(ResponseStatusException.class)
        .extracting("statusCode")
        .isEqualTo(HttpStatus.CONFLICT);
  }

  @Test
  void checkInRejectsCancelledReservation() {
    List<BoothReservation> reservations = new ArrayList<>(List.of(
        reservation("reservation-1", BoothReservationStatus.CANCELLED)));
    BoothReservationCheckInService service = serviceWith(reservations);

    assertThatThrownBy(() -> service.checkIn(new BoothReservationCheckInRequest(
        "http://localhost:3000/booths/reservations/reservation-1")))
        .isInstanceOf(ResponseStatusException.class)
        .extracting("statusCode")
        .isEqualTo(HttpStatus.CONFLICT);
  }

  @Test
  void checkInRejectsExpiredQr() {
    List<BoothReservation> reservations = new ArrayList<>(List.of(
        reservation("reservation-1", BoothReservationStatus.COMPLETED)));
    BoothReservationCheckInService service = serviceWith(reservations);

    assertThatThrownBy(() -> service.checkIn(new BoothReservationCheckInRequest(
        "http://localhost:3000/booths/reservations/reservation-1")))
        .isInstanceOf(ResponseStatusException.class)
        .extracting("statusCode")
        .isEqualTo(HttpStatus.CONFLICT);
  }

  @Test
  void checkInRejectsReservationThatIsNotReserved() {
    List<BoothReservation> reservations = new ArrayList<>(List.of(
        reservation("reservation-1", BoothReservationStatus.PENDING_APPROVAL)));
    BoothReservationCheckInService service = serviceWith(reservations);

    assertThatThrownBy(() -> service.checkIn(new BoothReservationCheckInRequest(
        "http://localhost:3000/booths/reservations/reservation-1")))
        .isInstanceOf(ResponseStatusException.class)
        .extracting("statusCode")
        .isEqualTo(HttpStatus.CONFLICT);
  }

  private BoothReservationCheckInService serviceWith(List<BoothReservation> reservations) {
    return new BoothReservationCheckInService(
        new BoothReservationRepository(new TestBoothReservationDataSource(reservations)));
  }

  private BoothReservation reservation(String id, BoothReservationStatus status) {
    LocalDateTime now = LocalDateTime.of(2026, 5, 24, 10, 0);
    return new BoothReservation(
        id,
        "booth-1",
        "user-1",
        "홍길동",
        2,
        status,
        "http://localhost:3000/booths/reservations/" + id,
        now,
        now);
  }
}
