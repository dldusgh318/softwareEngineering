package com.festivalapp.repository.booth.reservation;

import com.festivalapp.domain.booth.reservation.BoothReservation;
import com.festivalapp.domain.booth.reservation.BoothReservationStatus;
import com.festivalapp.repository.booth.reservation.datasource.BoothReservationDataSource;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

public class TestBoothReservationDataSource implements BoothReservationDataSource {

  private final List<BoothReservation> reservations;

  public TestBoothReservationDataSource(List<BoothReservation> reservations) {
    this.reservations = reservations;
  }

  @Override
  public List<BoothReservation> findAll() {
    return List.copyOf(reservations);
  }

  @Override
  public Optional<BoothReservation> findById(String reservationId) {
    return reservations.stream()
        .filter(reservation -> reservation.id().equals(reservationId))
        .findFirst();
  }

  @Override
  public BoothReservation save(BoothReservation reservation) {
    reservations.add(reservation);
    return reservation;
  }

  @Override
  public BoothReservation saveIfAvailable(BoothReservation reservation, int availableTables) {
    if (reservations.stream().anyMatch(savedReservation ->
        savedReservation.boothId().equals(reservation.boothId())
            && savedReservation.applicantId().equals(reservation.applicantId())
            && savedReservation.status() != BoothReservationStatus.CANCELLED)) {
      throw new DuplicateBoothReservationException();
    }

    int activeTables = reservations.stream()
        .filter(savedReservation -> savedReservation.boothId().equals(reservation.boothId()))
        .filter(savedReservation -> savedReservation.status() != BoothReservationStatus.CANCELLED)
        .mapToInt(BoothReservation::requestedTables)
        .sum();

    if (activeTables + reservation.requestedTables() > availableTables) {
      throw new BoothReservationCapacityExceededException();
    }

    reservations.add(reservation);
    return reservation;
  }

  @Override
  public BoothReservation checkInByQrCode(String qrCode, LocalDateTime checkedInAt) {
    BoothReservation reservation = reservations.stream()
        .filter(savedReservation -> Objects.equals(savedReservation.qrCode(), qrCode))
        .findFirst()
        .orElseThrow(BoothReservationInvalidQrException::new);

    if (reservation.status() == BoothReservationStatus.CHECKED_IN) {
      throw new BoothReservationAlreadyCheckedInException();
    }

    if (reservation.status() == BoothReservationStatus.CANCELLED) {
      throw new BoothReservationCancelledException();
    }

    if (reservation.status() == BoothReservationStatus.COMPLETED) {
      throw new BoothReservationQrExpiredException();
    }

    if (reservation.status() != BoothReservationStatus.RESERVED) {
      throw new BoothReservationStatusNotCheckInReadyException();
    }

    reservation.checkIn(checkedInAt);
    return reservation;
  }

  @Override
  public BoothReservation update(BoothReservation reservation) {
    for (int index = 0; index < reservations.size(); index++) {
      if (reservations.get(index).id().equals(reservation.id())) {
        reservations.set(index, reservation);
        return reservation;
      }
    }

    throw new IllegalArgumentException("예약 정보를 찾을 수 없습니다.");
  }
}
