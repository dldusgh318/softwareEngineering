import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ADMIN_ROLE_COOKIE_KEY = "festival_auth_role";
const ADMIN_RESERVATIONS_PATH = "/booths/admin/reservations";

export function proxy(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith(ADMIN_RESERVATIONS_PATH)) {
    return NextResponse.next();
  }

  const role = request.cookies.get(ADMIN_ROLE_COOKIE_KEY)?.value;

  if (role === "ADMIN") {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/booths/admin/reservations/:path*"],
};
