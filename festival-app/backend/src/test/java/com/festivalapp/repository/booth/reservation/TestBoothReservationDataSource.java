package com.festivalapp.repository.booth.reservation;

import com.festivalapp.domain.booth.reservation.BoothReservation;
import com.festivalapp.repository.booth.reservation.datasource.BoothReservationDataSource;
import java.util.List;
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
