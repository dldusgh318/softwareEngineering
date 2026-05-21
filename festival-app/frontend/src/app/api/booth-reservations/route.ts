import { NextResponse } from "next/server";

import { getBoothReservations } from "@/lib/booth-reservations";

export function GET() {
  return NextResponse.json({ reservations: getBoothReservations() });
}
