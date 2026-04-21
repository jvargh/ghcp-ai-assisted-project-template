import { NextResponse } from "next/server";
import { validateCredentials, getSessionCookieConfig } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    username?: string;
    password?: string;
  };

  if (!body.username || !body.password) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Username and password are required",
        },
      },
      { status: 400 }
    );
  }

  if (!validateCredentials(body.username, body.password)) {
    return NextResponse.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        },
      },
      { status: 401 }
    );
  }

  const { name, value, options } = getSessionCookieConfig();
  const response = NextResponse.json({ success: true });
  response.cookies.set(name, value, options);
  return response;
}
