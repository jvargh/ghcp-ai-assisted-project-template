import { cookies } from "next/headers";

const SESSION_COOKIE = "survey-app-session";
const SESSION_TOKEN = "coordinator-session-token";

// Simple hardcoded coordinator credentials for demo purposes.
// In production, use a proper auth provider with hashed passwords.
const COORDINATOR_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

export function validateCredentials(
  username: string,
  password: string
): boolean {
  return (
    username === COORDINATOR_CREDENTIALS.username &&
    password === COORDINATOR_CREDENTIALS.password
  );
}

export function getSessionCookieConfig() {
  return {
    name: SESSION_COOKIE,
    value: SESSION_TOKEN,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24,
    },
  };
}

export async function createSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, SESSION_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return session?.value === SESSION_TOKEN;
}

export function isValidSessionToken(token: string | undefined): boolean {
  return token === SESSION_TOKEN;
}
