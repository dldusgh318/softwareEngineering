package com.festivalapp.repository.booth.reservation.datasource;

import com.festivalapp.domain.booth.reservation.BoothReservation;
import java.util.ArrayList;
import java.util.List;
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
  public synchronized BoothReservation update(BoothReservation reservation) {
    for (int index = 0; index < reservations.size(); index++) {
      if (reservations.get(index).id().equals(reservation.id())) {
        reservations.set(index, reservation);
        return reservation;
      }
    }

    throw new IllegalArgumentException("예약 정보를 찾을 수 없습니다.");
  }
}
