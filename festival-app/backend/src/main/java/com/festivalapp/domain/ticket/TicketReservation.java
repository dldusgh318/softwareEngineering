package com.festivalapp.domain.ticket;

import java.time.LocalDateTime;

public class TicketReservation {

  private final String id;
  private final Long performanceId;
  private final String userId;
  private TicketReservationStatus status;
  private String qrCode;
  private final LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  public TicketReservation(
      String id,
      Long performanceId,
      String userId,
      TicketReservationStatus status,
      String qrCode,
      LocalDateTime createdAt,
      LocalDateTime updatedAt) {
    this.id = id;
    this.performanceId = performanceId;
    this.userId = userId;
    this.status = status;
    this.qrCode = qrCode;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public void markReservationCreated(LocalDateTime now) {
    status = TicketReservationStatus.RESERVATION_CREATED;
    updatedAt = now;
  }

  public void issueQr(String issuedQrCode, LocalDateTime now) {
    status = TicketReservationStatus.QR_ISSUED;
    qrCode = issuedQrCode;
    updatedAt = now;
  }

  public void complete(LocalDateTime now) {
    status = TicketReservationStatus.COMPLETED;
    updatedAt = now;
  }

  public void fail(LocalDateTime now) {
    status = TicketReservationStatus.FAILED;
    updatedAt = now;
  }

  public boolean isSeatOccupying() {
    return status != TicketReservationStatus.CANCELLED
        && status != TicketReservationStatus.FAILED;
  }

  public String id() {
    return id;
  }

  public Long performanceId() {
    return performanceId;
  }

  public String userId() {
    return userId;
  }

  public TicketReservationStatus status() {
    return status;
  }

  public String qrCode() {
    return qrCode;
  }

  public LocalDateTime createdAt() {
    return createdAt;
  }

  public LocalDateTime updatedAt() {
    return updatedAt;
  }
}
