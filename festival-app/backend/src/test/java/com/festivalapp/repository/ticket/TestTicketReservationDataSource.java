package com.festivalapp.repository.ticket;

import com.festivalapp.domain.ticket.TicketReservation;
import com.festivalapp.repository.ticket.datasource.TicketReservationDataSource;
import java.util.List;
import java.util.Optional;

public class TestTicketReservationDataSource implements TicketReservationDataSource {

  private final List<TicketReservation> reservations;

  public TestTicketReservationDataSource(List<TicketReservation> reservations) {
    this.reservations = reservations;
  }

  @Override
  public List<TicketReservation> findAll() {
    return reservations;
  }

  @Override
  public Optional<TicketReservation> findById(String reservationId) {
    return reservations.stream()
        .filter(reservation -> reservation.id().equals(reservationId))
        .findFirst();
  }

  @Override
  public TicketReservation save(TicketReservation reservation) {
    reservations.add(reservation);
    return reservation;
  }

  @Override
  public TicketReservation update(TicketReservation reservation) {
    return reservation;
  }
}
