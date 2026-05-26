package com.festivalapp.service.ticket;

import com.festivalapp.domain.ticket.TicketReservation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class TicketQrCodeIssuer {

  private final String frontendBaseUrl;

  public TicketQrCodeIssuer(
      @Value("${app.frontend-base-url:http://localhost:3000}") String frontendBaseUrl) {
    this.frontendBaseUrl = frontendBaseUrl;
  }

  public String issue(TicketReservation reservation) {
    return frontendBaseUrl + "/performances/tickets/" + reservation.id();
  }
}
