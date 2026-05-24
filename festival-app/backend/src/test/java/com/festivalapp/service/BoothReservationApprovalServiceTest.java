package com.festivalapp.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.festivalapp.domain.booth.reservation.BoothReservation;
import com.festivalapp.domain.booth.reservation.BoothReservationStatus;
import com.festivalapp.dto.BoothReservationApprovalRequest;
import com.festivalapp.dto.BoothReservationResponse;
import com.festivalapp.dto.BoothReservationSagaLogResponse;
import com.festivalapp.repository.booth.reservation.BoothReservationRepository;
import com.festivalapp.repository.booth.reservation.TestBoothReservationDataSource;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

class BoothReservationApprovalServiceTest {

  @Test
  void getPendingReservationsReturnsOnlyPendingApprovalReservations() {
    BoothReservationApprovalService service = serviceWith(new ArrayList<>(List.of(
        reservation("reservation-1", BoothReservationStatus.PENDING_APPROVAL),
        reservation("reservation-2", BoothReservationStatus.RESERVED))));

    List<BoothReservationResponse> responses = service.getPendingReservations();

    assertThat(responses).hasSize(1);
    assertThat(responses.get(0).id()).isEqualTo("reservation-1");
  }

  @Test
  void approveReservationIssuesQrAndChangesStatusToReserved() {
    List<BoothReservation> reservations = new ArrayList<>(List.of(
        reservation("reservation-1", BoothReservationStatus.PENDING_APPROVAL)));
    BoothReservationApprovalService service = serviceWith(reservations);

    BoothReservationResponse response = service.approveReservation(
        "reservation-1",
        new BoothReservationApprovalRequest("admin-1", "관리자"));

    assertThat(response.status()).isEqualTo("RESERVED");
    assertThat(response.statusDescription()).isEqualTo("QR 발급 완료");
    assertThat(response.qrCode())
        .isEqualTo("http://localhost:3000/booths/reservations/reservation-1");
    assertThat(response.sagaLogs())
        .extracting(BoothReservationSagaLogResponse::step)
        .containsExactly("APPROVED", "QR_ISSUED");
    assertThat(reservations.get(0).status()).isEqualTo(BoothReservationStatus.RESERVED);
  }

  @Test
  void approveReservationRejectsReservationThatIsNotPendingApproval() {
    BoothReservationApprovalService service = serviceWith(new ArrayList<>(List.of(
        reservation("reservation-1", BoothReservationStatus.RESERVED))));

    assertThatThrownBy(() -> service.approveReservation(
        "reservation-1",
        new BoothReservationApprovalRequest("admin-1", "관리자")))
        .isInstanceOf(ResponseStatusException.class)
        .extracting("statusCode")
        .isEqualTo(HttpStatus.CONFLICT);
  }

  @Test
  void approveReservationRejectsMissingReservation() {
    BoothReservationApprovalService service = serviceWith(new ArrayList<>());

    assertThatThrownBy(() -> service.approveReservation(
        "missing-reservation",
        new BoothReservationApprovalRequest("admin-1", "관리자")))
        .isInstanceOf(ResponseStatusException.class)
        .extracting("statusCode")
        .isEqualTo(HttpStatus.NOT_FOUND);
  }

  private BoothReservationApprovalService serviceWith(List<BoothReservation> reservations) {
    BoothReservationRepository repository =
        new BoothReservationRepository(new TestBoothReservationDataSource(reservations));
    return new BoothReservationApprovalService(
        repository,
        reservation -> "http://localhost:3000/booths/reservations/" + reservation.id());
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
        null,
        now,
        now);
  }
}
