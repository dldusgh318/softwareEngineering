import { apiClient } from "@/libs/api/api-client";
import type {
  Booth,
  BoothReservationApplication,
  BoothReservationApplicationRequest,
} from "@/types/booths.types";

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
