import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidSessionToken } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /coordinator routes (except the login page)
  if (pathname.startsWith("/coordinator") && pathname !== "/coordinator/login") {
    const sessionCookie = request.cookies.get("survey-app-session");

    if (!isValidSessionToken(sessionCookie?.value)) {
      const loginUrl = new URL("/coordinator/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/coordinator/:path*"],
};
