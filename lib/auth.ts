import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';

/**
 * Central place for all authentication related helpers:
 * - Password hashing and verification
 * - Session token generation and hashing
 * - Expiration helpers
 */

const PASSWORD_SALT_ROUNDS = Math.max(10, Number.parseInt(process.env.AUTH_SALT_ROUNDS ?? '12', 10));

const SESSION_TOKEN_BYTES = Math.max(32, Number.parseInt(process.env.AUTH_SESSION_BYTES ?? '48', 10));

const SESSION_TTL_MS = Number.parseInt(process.env.AUTH_SESSION_TTL_MS ?? `${1000 * 60 * 60 * 24 * 7}`, 10);

export interface SessionPayload {
  token: string;
  tokenHash: string;
  expiresAt: Date;
}

/**
 * Hash a plaintext password with bcrypt using the configured salt rounds.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
}

/**
 * Compare a candidate password with a stored hash.
 */
export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  if (!password || !passwordHash) {
    return false;
  }

  try {
    return await bcrypt.compare(password, passwordHash);
  } catch {
    return false;
  }
}

/**
 * Create a cryptographically secure random session token encoded in base64url.
 */
export function createSessionToken(): string {
  const raw = randomBytes(SESSION_TOKEN_BYTES);
  return base64UrlEncode(raw);
}

/**
 * Hash an issued session token so only the hash is stored server-side.
 */
export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Convenience helper that returns a ready-to-store session payload.
 */
export function buildSessionPayload(now = new Date()): SessionPayload {
  const token = createSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);

  return { token, tokenHash, expiresAt };
}

/**
 * Encode a Buffer into base64url (URL safe) format.
 */
function base64UrlEncode(buffer: Buffer): string {
  return buffer.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
