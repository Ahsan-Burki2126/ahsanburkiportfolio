import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Throws at call time if the env var is missing — never silently falls back
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET environment variable is not set. " +
        "Set it in your .env file and in Vercel project settings."
    );
  }
  return secret;
}

// ── Rate limiting ─────────────────────────────────────────────────────────────
// In-memory per-IP counters. On Vercel each serverless instance is independent,
// so this stops single-instance brute-force rather than a fully distributed
// attack — but it's a meaningful barrier for a personal admin panel.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Returns true if the request should be blocked.
 * @param key      Unique key — typically "login:<ip>" or "2fa:<ip>"
 * @param limit    Maximum attempts in the window
 * @param windowMs Window duration in milliseconds
 */
export function isRateLimited(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count += 1;
  if (entry.count > limit) return true;

  return false;
}

// ── TOTP replay protection ────────────────────────────────────────────────────
// Each used code is stored with its userId for 90 seconds (the maximum a TOTP
// window: 1 code is valid). Prevents the same code being accepted twice.

interface UsedCode {
  expiresAt: number;
}

const usedTotpCodes = new Map<string, UsedCode>();

export function isTotpCodeUsed(userId: string, code: string): boolean {
  purgeExpiredCodes();
  return usedTotpCodes.has(`${userId}:${code}`);
}

export function markTotpCodeUsed(userId: string, code: string): void {
  usedTotpCodes.set(`${userId}:${code}`, { expiresAt: Date.now() + 90_000 });
}

function purgeExpiredCodes(): void {
  const now = Date.now();
  for (const [key, val] of usedTotpCodes) {
    if (now > val.expiresAt) usedTotpCodes.delete(key);
  }
}

// ── Shared request auth helper ────────────────────────────────────────────────

export async function verifyAuth(req: NextRequest): Promise<boolean> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  try {
    jwt.verify(authHeader.split(" ")[1], getJwtSecret());
    return true;
  } catch {
    return false;
  }
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}
