package com.festivalapp.api;

import com.festivalapp.dto.TicketReservationCreateRequest;
import com.festivalapp.dto.TicketReservationResponse;
import com.festivalapp.security.AuthenticatedUser;
import com.festivalapp.service.TicketReservationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/ticket-reservations")
@RequiredArgsConstructor
public class TicketReservationController {

  private final TicketReservationService ticketReservationService;

  @PostMapping
  ResponseEntity<TicketReservationResponse> reserveTicket(
      Authentication authentication,
      @RequestBody TicketReservationCreateRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ticketReservationService.reserveTicket(authenticatedUserId(authentication), request));
  }

  @GetMapping("/me")
  ResponseEntity<List<TicketReservationResponse>> getMyReservations(Authentication authentication) {
    return ResponseEntity.ok(
        ticketReservationService.getMyReservations(authenticatedUserId(authentication)));
  }

  @GetMapping("/{reservationId}")
  ResponseEntity<TicketReservationResponse> getMyReservation(
      Authentication authentication,
      @PathVariable String reservationId) {
    return ResponseEntity.ok(
        ticketReservationService.getMyReservation(authenticatedUserId(authentication), reservationId));
  }

  @PostMapping("/{reservationId}/cancel")
  ResponseEntity<TicketReservationResponse> cancelMyReservation(
      Authentication authentication,
      @PathVariable String reservationId) {
    return ResponseEntity.ok(
        ticketReservationService.cancelMyReservation(authenticatedUserId(authentication), reservationId));
  }

  private String authenticatedUserId(Authentication authentication) {
    if (authentication == null
        || !(authentication.getPrincipal() instanceof AuthenticatedUser user)) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
    }

    return user.id();
  }
}
