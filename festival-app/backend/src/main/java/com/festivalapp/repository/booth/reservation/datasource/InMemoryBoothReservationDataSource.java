package com.festivalapp.repository.booth.reservation.datasource;

import com.festivalapp.domain.booth.reservation.BoothReservation;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class InMemoryBoothReservationDataSource implements BoothReservationDataSource {

  private final List<BoothReservation> reservations = new ArrayList<>();

  @Override
  public synchronized List<BoothReservation> findAll() {
    return List.copyOf(reservations);
  }

  @Override
  public synchronized BoothReservation save(BoothReservation reservation) {
    reservations.add(reservation);
    return reservation;
  }
}
