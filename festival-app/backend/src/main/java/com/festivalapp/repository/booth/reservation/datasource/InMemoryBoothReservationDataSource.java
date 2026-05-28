package com.festivalapp.repository.booth.reservation.datasource;

import com.festivalapp.domain.booth.reservation.BoothReservation;
import com.festivalapp.domain.booth.reservation.BoothReservationStatus;
import com.festivalapp.repository.booth.reservation.BoothReservationAlreadyCheckedInException;
import com.festivalapp.repository.booth.reservation.BoothReservationCapacityExceededException;
import com.festivalapp.repository.booth.reservation.BoothReservationCancelledException;
import com.festivalapp.repository.booth.reservation.BoothReservationInvalidQrException;
import com.festivalapp.repository.booth.reservation.BoothReservationQrExpiredException;
import com.festivalapp.repository.booth.reservation.BoothReservationStatusNotCheckInReadyException;
import com.festivalapp.repository.booth.reservation.DuplicateBoothReservationException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class InMemoryBoothReservationDataSource implements BoothReservationDataSource {

  private final List<BoothReservation> reservations = new ArrayList<>();

  @Override
  public synchronized List<BoothReservation> findAll() {
    return List.copyOf(reservations);
  }

  @Override
  public synchronized Optional<BoothReservation> findById(String reservationId) {
    return reservations.stream()
        .filter(reservation -> reservation.id().equals(reservationId))
        .findFirst();
  }

  @Override
  public synchronized BoothReservation save(BoothReservation reservation) {
    reservations.add(reservation);
    return reservation;
  }

  @Override
  public synchronized BoothReservation saveIfAvailable(
      BoothReservation reservation,
      int availableTables) {
    if (hasActiveReservationBySameApplicant(reservation)) {
      throw new DuplicateBoothReservationException();
    }

    if (sumActiveRequestedTablesByBoothId(reservation.boothId()) + reservation.requestedTables()
        > availableTables) {
      throw new BoothReservationCapacityExceededException();
    }

    reservations.add(reservation);
    return reservation;
  }

  @Override
  public synchronized BoothReservation checkInByQrCode(String qrCode, LocalDateTime checkedInAt) {
    BoothReservation reservation = reservations.stream()
        .filter(savedReservation -> Objects.equals(savedReservation.qrCode(), qrCode))
        .findFirst()
        .orElseThrow(BoothReservationInvalidQrException::new);

    validateCheckInReady(reservation);
    reservation.checkIn(checkedInAt);
    return reservation;
  }

  @Override
  public synchronized BoothReservation update(BoothReservation reservation) {
    for (int index = 0; index < reservations.size(); index++) {
      if (reservations.get(index).id().equals(reservation.id())) {
        reservations.set(index, reservation);
        return reservation;
      }
    }

    throw new IllegalArgumentException("예약 정보를 찾을 수 없습니다.");
  }

  private boolean hasActiveReservationBySameApplicant(BoothReservation reservation) {
    return reservations.stream()
        .anyMatch(savedReservation ->
            savedReservation.boothId().equals(reservation.boothId())
                && savedReservation.applicantId().equals(reservation.applicantId())
                && isActive(savedReservation));
  }

  private int sumActiveRequestedTablesByBoothId(String boothId) {
    return reservations.stream()
        .filter(reservation -> reservation.boothId().equals(boothId))
        .filter(this::isActive)
        .mapToInt(BoothReservation::requestedTables)
        .sum();
  }

  private boolean isActive(BoothReservation reservation) {
    return reservation.status() != BoothReservationStatus.CANCELLED;
  }

  private void validateCheckInReady(BoothReservation reservation) {
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
  }
}
