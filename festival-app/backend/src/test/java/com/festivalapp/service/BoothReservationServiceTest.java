package com.festivalapp.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.festivalapp.domain.booth.Booth;
import com.festivalapp.domain.booth.BoothLocation;
import com.festivalapp.domain.booth.reservation.BoothReservation;
import com.festivalapp.domain.booth.reservation.BoothReservationStatus;
import com.festivalapp.dto.BoothReservationCreateRequest;
import com.festivalapp.dto.BoothReservationResponse;
import com.festivalapp.repository.booth.BoothRepository;
import com.festivalapp.repository.booth.reservation.BoothReservationRepository;
import com.festivalapp.repository.booth.reservation.TestBoothReservationDataSource;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

class BoothReservationServiceTest {

  private final Booth booth =
      new Booth(
          "booth-1",
          "타코야끼 라운지",
          "일식조리 동아리 오코노미",
          "즉석 타코야끼 부스",
          "FOOD",
          "12:00 - 21:00",
          4,
          new BoothLocation("A", "학생회관 앞", "A-03", 26, 34));

  @Test
  void createReservationStoresPendingApprovalReservation() {
    List<BoothReservation> reservations = new ArrayList<>();
    BoothReservationService service = serviceWith(List.of(booth), reservations);

    BoothReservationResponse response = service.createReservation(
        new BoothReservationCreateRequest("booth-1", "user-1", "홍길동", 2));

    assertThat(response.status()).isEqualTo("PENDING_APPROVAL");
    assertThat(response.statusDescription()).isEqualTo("관리자 승인 대기");
    assertThat(response.requestedTables()).isEqualTo(2);
    assertThat(reservations).hasSize(1);
    assertThat(reservations.get(0).status()).isEqualTo(BoothReservationStatus.PENDING_APPROVAL);
  }

  @Test
  void createReservationRejectsDuplicateActiveReservationForSameUserAndBooth() {
    List<BoothReservation> reservations = new ArrayList<>(List.of(
        reservation("reservation-1", "booth-1", "user-1", 1, BoothReservationStatus.PENDING_APPROVAL)));
    BoothReservationService service = serviceWith(List.of(booth), reservations);

    assertThatThrownBy(() -> service.createReservation(
        new BoothReservationCreateRequest("booth-1", "user-1", "홍길동", 1)))
        .isInstanceOf(ResponseStatusException.class)
        .extracting("statusCode")
        .isEqualTo(HttpStatus.CONFLICT);
  }

  @Test
  void createReservationRejectsRequestWhenTablesAreNotAvailable() {
    List<BoothReservation> reservations = new ArrayList<>(List.of(
        reservation("reservation-1", "booth-1", "user-1", 3, BoothReservationStatus.PENDING_APPROVAL)));
    BoothReservationService service = serviceWith(List.of(booth), reservations);

    assertThatThrownBy(() -> service.createReservation(
        new BoothReservationCreateRequest("booth-1", "user-2", "김민지", 2)))
        .isInstanceOf(ResponseStatusException.class)
        .extracting("statusCode")
        .isEqualTo(HttpStatus.CONFLICT);
  }

  @Test
  void createReservationRejectsMissingBooth() {
    BoothReservationService service = serviceWith(List.of(), new ArrayList<>());

    assertThatThrownBy(() -> service.createReservation(
        new BoothReservationCreateRequest("missing-booth", "user-1", "홍길동", 1)))
        .isInstanceOf(ResponseStatusException.class)
        .extracting("statusCode")
        .isEqualTo(HttpStatus.NOT_FOUND);
  }

  @Test
  void getReservationsByApplicantReturnsOnlyRequestedUsersReservations() {
    List<BoothReservation> reservations = new ArrayList<>(List.of(
        reservation("reservation-1", "booth-1", "user-1", 1, BoothReservationStatus.PENDING_APPROVAL),
        reservation("reservation-2", "booth-1", "user-2", 1, BoothReservationStatus.PENDING_APPROVAL)));
    BoothReservationService service = serviceWith(List.of(booth), reservations);

    List<BoothReservationResponse> responses = service.getReservationsByApplicant("user-1");

    assertThat(responses).hasSize(1);
    assertThat(responses.get(0).id()).isEqualTo("reservation-1");
  }

  private BoothReservationService serviceWith(
      List<Booth> booths,
      List<BoothReservation> reservations) {
    BoothRepository boothRepository = new BoothRepository(() -> booths);
    BoothReservationRepository reservationRepository =
        new BoothReservationRepository(new TestBoothReservationDataSource(reservations));
    BoothReservationAvailabilityPolicy availabilityPolicy =
        new BoothReservationAvailabilityPolicy(reservationRepository);

    return new BoothReservationService(boothRepository, reservationRepository, availabilityPolicy);
  }

  private BoothReservation reservation(
      String id,
      String boothId,
      String applicantId,
      int requestedTables,
      BoothReservationStatus status) {
    LocalDateTime now = LocalDateTime.of(2026, 5, 24, 10, 0);
    return new BoothReservation(
        id, boothId, applicantId, "홍길동", requestedTables, status, now, now);
  }
}
