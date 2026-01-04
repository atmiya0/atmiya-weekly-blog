/**
 * Simple password-based authentication for admin routes
 * Uses HTTP-only cookies for session management
 */

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Verify the admin password
 */
export async function verifyPassword(password: string): Promise<boolean> {
  const storedHash = process.env.ADMIN_PASSWORD_HASH;

  if (!storedHash) {
    // Fallback to plain text comparison (for initial setup)
    const plainPassword = process.env.ADMIN_PASSWORD;
    if (!plainPassword) {
      console.error("No ADMIN_PASSWORD or ADMIN_PASSWORD_HASH set");
      return false;
    }
    return password === plainPassword;
  }

  return bcrypt.compare(password, storedHash);
}

/**
 * Generate a password hash (utility for setting up)
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Create a session token
 */
function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Create a new session and set the cookie
 */
export async function createSession(): Promise<string> {
  const token = generateSessionToken();
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return token;
}

/**
 * Check if the current request has a valid session
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  // Simple check: if the cookie exists and is a valid hex string, the user is authenticated
  // In a production app with multiple users, you'd validate against a database
  if (!sessionCookie?.value) return false;

  // Validate it's a proper session token (64 hex chars)
  return /^[a-f0-9]{64}$/.test(sessionCookie.value);
}

/**
 * Destroy the current session
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
