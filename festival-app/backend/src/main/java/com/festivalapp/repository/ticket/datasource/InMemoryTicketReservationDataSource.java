package com.festivalapp.repository.ticket.datasource;

import com.festivalapp.domain.ticket.TicketReservation;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class InMemoryTicketReservationDataSource implements TicketReservationDataSource {

  private final List<TicketReservation> reservations = new ArrayList<>();

  @Override
  public synchronized List<TicketReservation> findAll() {
    return List.copyOf(reservations);
  }

  @Override
  public synchronized Optional<TicketReservation> findById(String reservationId) {
    return reservations.stream()
        .filter(reservation -> reservation.id().equals(reservationId))
        .findFirst();
  }

  @Override
  public synchronized TicketReservation save(TicketReservation reservation) {
    reservations.add(reservation);
    return reservation;
  }

  @Override
  public synchronized TicketReservation update(TicketReservation reservation) {
    return reservation;
  }
}
