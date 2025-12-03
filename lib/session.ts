import type { Session, User } from '@prisma/client';
import type { NextRequest, NextResponse } from 'next/server';

import { AUTH_COOKIE_NAME, SESSION_COOKIE_MAX_AGE, SESSION_COOKIE_NAME } from '@/constants/auth';
import { buildSessionPayload, hashSessionToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_COOKIE_MAX_AGE,
};

export type SessionContext = {
  session: Session;
  user: User;
};

/**
 * Creates a persistent session row and attaches the cookie pair to the response.
 */
export async function issueSession(response: NextResponse, userId: string): Promise<NextResponse> {
  const { token, tokenHash, expiresAt } = buildSessionPayload();

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  response.cookies.set(SESSION_COOKIE_NAME, token, {
    ...BASE_COOKIE_OPTIONS,
    expires: expiresAt,
  });

  response.cookies.set(AUTH_COOKIE_NAME, 'true', {
    ...BASE_COOKIE_OPTIONS,
  });

  return response;
}

/**
 * Deletes the active session (if any) derived from the request cookies
 * and clears the cookies on the provided response.
 */
export async function clearSession(request: NextRequest, response: NextResponse): Promise<NextResponse> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await prisma.session.deleteMany({
      where: {
        tokenHash: hashSessionToken(token),
      },
    });
  }

  response.cookies.delete(SESSION_COOKIE_NAME);
  response.cookies.delete(AUTH_COOKIE_NAME);

  return response;
}

/**
 * Utility to fetch the hydrated session + user from an incoming request.
 * Returns null if no valid session exists or the session is expired.
 */
export async function getSessionFromRequest(request: NextRequest): Promise<SessionContext | null> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: {
      tokenHash: hashSessionToken(token),
    },
    include: {
      user: true,
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.delete({
      where: {
        id: session.id,
      },
    });
    return null;
  }

  return { session, user: session.user };
}

/**
 * Ensures a request is authenticated. Throws an error if the session is missing.
 * Useful for API route guards.
 */
export async function requireSession(request: NextRequest): Promise<SessionContext> {
  const ctx = await getSessionFromRequest(request);
  if (!ctx) {
    throw new Error('Unauthorized');
  }
  return ctx;
}
