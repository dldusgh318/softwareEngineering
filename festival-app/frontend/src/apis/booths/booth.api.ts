import { apiClient } from "@/libs/api/api-client";
import type {
  Booth,
  BoothReservationApplication,
  BoothReservationApplicationRequest,
  BoothReservationApprovalRequest,
} from "@/types/booth/booths.types";

export function getBooths(signal?: AbortSignal) {
  return apiClient.get("api/booths", { signal }).json<Booth[]>();
}

export function createBoothReservation(request: BoothReservationApplicationRequest) {
  return apiClient
    .post("api/booth-reservations", { json: request })
    .json<BoothReservationApplication>();
}

export function getBoothReservationsByApplicant(applicantId: string, signal?: AbortSignal) {
  return apiClient
    .get(`api/booth-reservations/applicants/${applicantId}`, { signal })
    .json<BoothReservationApplication[]>();
}

export function getBoothReservation(reservationId: string, signal?: AbortSignal) {
  return apiClient
    .get(`api/booth-reservations/${reservationId}`, { signal })
    .json<BoothReservationApplication>();
}

export function getPendingBoothReservations(signal?: AbortSignal) {
  return apiClient
    .get("api/admin/booth-reservations/pending", { signal })
    .json<BoothReservationApplication[]>();
}

export function approveBoothReservation(
  reservationId: string,
  request: BoothReservationApprovalRequest,
) {
  return apiClient
    .post(`api/admin/booth-reservations/${reservationId}/approve`, { json: request })
    .json<BoothReservationApplication>();
}
