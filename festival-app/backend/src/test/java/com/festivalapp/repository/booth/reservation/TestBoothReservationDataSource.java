package com.festivalapp.repository.booth.reservation;

import com.festivalapp.domain.booth.reservation.BoothReservation;
import com.festivalapp.repository.booth.reservation.datasource.BoothReservationDataSource;
import java.util.List;

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
  public BoothReservation save(BoothReservation reservation) {
    reservations.add(reservation);
    return reservation;
  }
}
