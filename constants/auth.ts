/**
 * Shared authentication constants and helpers.
 * Centralizes cookie / header names, session durations, and
 * security-related defaults so that client and server code
 * reference a single source of truth.
 */

export const AUTH_COOKIE_NAME = 'authenticated';
export const SESSION_COOKIE_NAME = 'ulaw_session';
export const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export const SESSION_HEADER_NAME = 'x-ulaw-session';
export const CSRF_HEADER_NAME = 'x-ulaw-csrf';

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

export const BCRYPT_SALT_ROUNDS = Number.parseInt(process.env.AUTH_SALT_ROUNDS ?? '12', 10);

export const SESSION_TOKEN_BYTES = Number.parseInt(process.env.AUTH_SESSION_BYTES ?? '48', 10);

export const SESSION_TTL_MS = Number.parseInt(process.env.AUTH_SESSION_TTL_MS ?? '', 10) || 1000 * 60 * 60 * 24 * 7;
