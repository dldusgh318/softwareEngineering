import { apiClient } from "@/libs/api/api-client";
import type {
  TicketReservation,
  TicketReservationCreateRequest,
} from "@/types/ticket/ticket.types";

export function createTicketReservation(request: TicketReservationCreateRequest) {
  return apiClient.post("api/ticket-reservations", { json: request }).json<TicketReservation>();
}

export function getTicketReservation(reservationId: string, signal?: AbortSignal) {
  return apiClient
    .get(`api/ticket-reservations/${reservationId}`, { signal })
    .json<TicketReservation>();
}

export function cancelTicketReservation(reservationId: string) {
  return apiClient
    .post(`api/ticket-reservations/${reservationId}/cancel`)
    .json<TicketReservation>();
}
