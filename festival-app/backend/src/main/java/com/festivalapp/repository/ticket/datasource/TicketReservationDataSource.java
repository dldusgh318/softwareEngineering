package com.festivalapp.repository.ticket.datasource;

import com.festivalapp.domain.ticket.TicketReservation;
import java.util.List;
import java.util.Optional;

public interface TicketReservationDataSource {

  List<TicketReservation> findAll();

  Optional<TicketReservation> findById(String reservationId);

  TicketReservation save(TicketReservation reservation);

  TicketReservation update(TicketReservation reservation);
}
