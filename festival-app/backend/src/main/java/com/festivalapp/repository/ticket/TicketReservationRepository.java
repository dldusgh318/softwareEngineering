package com.festivalapp.repository.ticket;

import com.festivalapp.domain.ticket.TicketReservation;
import com.festivalapp.repository.ticket.datasource.TicketReservationDataSource;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class TicketReservationRepository {

  private final TicketReservationDataSource ticketReservationDataSource;

  public List<TicketReservation> findAll() {
    return ticketReservationDataSource.findAll();
  }

  public Optional<TicketReservation> findById(String reservationId) {
    return ticketReservationDataSource.findById(reservationId);
  }

  public List<TicketReservation> findByUserId(String userId) {
    return findAll().stream()
        .filter(reservation -> reservation.userId().equals(userId))
        .toList();
  }

  public int countReservedSeatsByPerformanceId(Long performanceId) {
    return (int) findAll().stream()
        .filter(reservation -> reservation.performanceId().equals(performanceId))
        .filter(TicketReservation::isSeatOccupying)
        .count();
  }

  public boolean existsActiveByPerformanceIdAndUserId(Long performanceId, String userId) {
    return findAll().stream()
        .anyMatch(reservation ->
            reservation.performanceId().equals(performanceId)
                && reservation.userId().equals(userId)
                && reservation.isSeatOccupying());
  }

  public TicketReservation save(TicketReservation reservation) {
    return ticketReservationDataSource.save(reservation);
  }

  public TicketReservation update(TicketReservation reservation) {
    return ticketReservationDataSource.update(reservation);
  }
}
