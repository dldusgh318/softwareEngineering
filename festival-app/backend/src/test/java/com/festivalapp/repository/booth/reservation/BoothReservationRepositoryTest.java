package com.festivalapp.repository.booth.reservation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.festivalapp.domain.booth.reservation.BoothReservation;
import com.festivalapp.domain.booth.reservation.BoothReservationStatus;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;

class BoothReservationRepositoryTest {

  @Test
  void saveStoresReservationAndFindsByApplicant() {
    List<BoothReservation> reservations = new ArrayList<>();
    BoothReservationRepository repository = repositoryWith(reservations);
    BoothReservation reservation = reservation("reservation-1", "booth-1", "user-1", 2,
        BoothReservationStatus.PENDING_APPROVAL);

    repository.save(reservation);

    assertThat(repository.findAll()).containsExactly(reservation);
    assertThat(repository.findByApplicantId("user-1")).containsExactly(reservation);
  }

  @Test
  void existsActiveByBoothIdAndApplicantIdIgnoresCancelledReservations() {
    BoothReservationRepository repository = repositoryWith(List.of(
        reservation("reservation-1", "booth-1", "user-1", 1, BoothReservationStatus.CANCELLED)));

    assertThat(repository.existsActiveByBoothIdAndApplicantId("booth-1", "user-1")).isFalse();
  }

  @Test
  void sumActiveRequestedTablesByBoothIdExcludesCancelledReservations() {
    BoothReservationRepository repository = repositoryWith(List.of(
        reservation("reservation-1", "booth-1", "user-1", 2, BoothReservationStatus.PENDING_APPROVAL),
        reservation("reservation-2", "booth-1", "user-2", 1, BoothReservationStatus.CANCELLED),
        reservation("reservation-3", "booth-2", "user-3", 4, BoothReservationStatus.PENDING_APPROVAL)));

    assertThat(repository.sumActiveRequestedTablesByBoothId("booth-1")).isEqualTo(2);
  }

  @Test
  void saveIfAvailableRejectsDuplicateActiveReservationForSameApplicant() {
    BoothReservationRepository repository = repositoryWith(List.of(
        reservation("reservation-1", "booth-1", "user-1", 1, BoothReservationStatus.PENDING_APPROVAL)));

    assertThatThrownBy(() -> repository.saveIfAvailable(
        reservation("reservation-2", "booth-1", "user-1", 1, BoothReservationStatus.PENDING_APPROVAL),
        4))
        .isInstanceOf(DuplicateBoothReservationException.class)
        .hasMessage("이미 신청한 부스 예약이 있습니다.");
  }

  @Test
  void saveIfAvailableRejectsReservationWhenActiveTablesExceedCapacity() {
    BoothReservationRepository repository = repositoryWith(List.of(
        reservation("reservation-1", "booth-1", "user-1", 3, BoothReservationStatus.PENDING_APPROVAL)));

    assertThatThrownBy(() -> repository.saveIfAvailable(
        reservation("reservation-2", "booth-1", "user-2", 2, BoothReservationStatus.PENDING_APPROVAL),
        4))
        .isInstanceOf(BoothReservationCapacityExceededException.class)
        .hasMessage("신청 가능한 테이블 수를 초과했습니다.");
  }

  @Test
  void saveIfAvailableStoresReservationWhenCancelledReservationsFreeCapacity() {
    BoothReservationRepository repository = repositoryWith(List.of(
        reservation("reservation-1", "booth-1", "user-1", 4, BoothReservationStatus.CANCELLED)));
    BoothReservation reservation =
        reservation("reservation-2", "booth-1", "user-1", 4, BoothReservationStatus.PENDING_APPROVAL);

    BoothReservation savedReservation = repository.saveIfAvailable(reservation, 4);

    assertThat(savedReservation).isEqualTo(reservation);
    assertThat(repository.findAll()).hasSize(2);
  }

  @Test
  void checkInByQrCodeChangesReservedReservationToCheckedIn() {
    BoothReservation reservation =
        reservation("reservation-1", "booth-1", "user-1", 2, BoothReservationStatus.RESERVED);
    reservation.reserve("http://localhost:3000/booths/reservations/reservation-1", fixedNow());
    BoothReservationRepository repository = repositoryWith(List.of(reservation));

    BoothReservation checkedInReservation = repository.checkInByQrCode(
        "http://localhost:3000/booths/reservations/reservation-1",
        LocalDateTime.of(2026, 5, 24, 12, 0));

    assertThat(checkedInReservation.status()).isEqualTo(BoothReservationStatus.CHECKED_IN);
  }

  @Test
  void checkInByQrCodeRejectsInvalidQr() {
    BoothReservationRepository repository = repositoryWith(List.of());

    assertThatThrownBy(() -> repository.checkInByQrCode("invalid-qr", fixedNow()))
        .isInstanceOf(BoothReservationInvalidQrException.class)
        .hasMessage("유효하지 않은 QR입니다.");
  }

  @Test
  void checkInByQrCodeRejectsAlreadyCheckedInReservation() {
    BoothReservation reservation =
        reservation("reservation-1", "booth-1", "user-1", 2, BoothReservationStatus.RESERVED);
    reservation.reserve("http://localhost:3000/booths/reservations/reservation-1", fixedNow());
    reservation.checkIn(fixedNow());
    BoothReservationRepository repository = repositoryWith(List.of(reservation));

    assertThatThrownBy(() -> repository.checkInByQrCode(
        "http://localhost:3000/booths/reservations/reservation-1",
        fixedNow()))
        .isInstanceOf(BoothReservationAlreadyCheckedInException.class)
        .hasMessage("이미 체크인된 예약입니다.");
  }

  @Test
  void findByStatusReturnsMatchingReservations() {
    BoothReservationRepository repository = repositoryWith(List.of(
        reservation("reservation-1", "booth-1", "user-1", 2, BoothReservationStatus.PENDING_APPROVAL),
        reservation("reservation-2", "booth-1", "user-2", 1, BoothReservationStatus.RESERVED)));

    assertThat(repository.findByStatus(BoothReservationStatus.PENDING_APPROVAL))
        .extracting(BoothReservation::id)
        .containsExactly("reservation-1");
  }

  @Test
  void updateReplacesExistingReservation() {
    BoothReservation original =
        reservation("reservation-1", "booth-1", "user-1", 2, BoothReservationStatus.PENDING_APPROVAL);
    BoothReservationRepository repository = repositoryWith(List.of(original));
    original.approve(LocalDateTime.of(2026, 5, 24, 11, 0));

    repository.update(original);

    assertThat(repository.findById("reservation-1")).contains(original);
    assertThat(original.status()).isEqualTo(BoothReservationStatus.APPROVED);
  }

  private BoothReservationRepository repositoryWith(List<BoothReservation> reservations) {
    List<BoothReservation> storage = new ArrayList<>(reservations);
    return new BoothReservationRepository(new TestBoothReservationDataSource(storage));
  }

  private BoothReservation reservation(
      String id,
      String boothId,
      String applicantId,
      int requestedTables,
      BoothReservationStatus status) {
    LocalDateTime now = fixedNow();
    return new BoothReservation(
        id, boothId, applicantId, "홍길동", requestedTables, status, null, now, now);
  }

  private LocalDateTime fixedNow() {
    return LocalDateTime.of(2026, 5, 24, 10, 0);
  }
}
