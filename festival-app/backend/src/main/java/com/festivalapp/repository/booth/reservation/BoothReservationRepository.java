package com.festivalapp.repository.booth.reservation;

import com.festivalapp.domain.booth.reservation.BoothReservation;
import com.festivalapp.domain.booth.reservation.BoothReservationStatus;
import com.festivalapp.repository.booth.reservation.datasource.BoothReservationDataSource;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class BoothReservationRepository {

  private final BoothReservationDataSource boothReservationDataSource;

  public List<BoothReservation> findAll() {
    return boothReservationDataSource.findAll();
  }

  public List<BoothReservation> findByApplicantId(String applicantId) {
    return findAll().stream()
        .filter(reservation -> reservation.applicantId().equals(applicantId))
        .toList();
  }

  public boolean existsActiveByBoothIdAndApplicantId(String boothId, String applicantId) {
    return findAll().stream()
        .anyMatch(reservation ->
            reservation.boothId().equals(boothId)
                && reservation.applicantId().equals(applicantId)
                && reservation.status() != BoothReservationStatus.CANCELLED);
  }

  public int sumActiveRequestedTablesByBoothId(String boothId) {
    return findAll().stream()
        .filter(reservation -> reservation.boothId().equals(boothId))
        .filter(reservation -> reservation.status() != BoothReservationStatus.CANCELLED)
        .mapToInt(BoothReservation::requestedTables)
        .sum();
  }

  public BoothReservation save(BoothReservation reservation) {
    return boothReservationDataSource.save(reservation);
  }
}
