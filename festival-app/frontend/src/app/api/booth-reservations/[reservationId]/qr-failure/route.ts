import { NextResponse } from "next/server";

import { rollbackApprovalAfterQrFailure } from "@/lib/booth-reservations";

type RouteContext = {
  params: Promise<{
    reservationId: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { reservationId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as {
    reason?: string;
  };
  const result = rollbackApprovalAfterQrFailure({
    reservationId,
    reason: body.reason?.trim() || "QR provider timeout",
  });

  if (!result.ok) {
    return NextResponse.json({ message: result.error }, { status: result.status });
  }

  return NextResponse.json(result);
}
