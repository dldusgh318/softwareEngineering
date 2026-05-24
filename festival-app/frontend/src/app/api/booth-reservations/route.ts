import { NextResponse } from "next/server";

import { getBoothReservations } from "@/app/api/booth-reservations/booth-reservation-store";

export function GET() {
  return NextResponse.json({ reservations: getBoothReservations() });
}
