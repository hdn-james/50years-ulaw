import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { issueSession } from '@/lib/session';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = loginSchema.safeParse(json);

    if (!parsed.success) {
      const errorMessage = parsed.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { username, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { username },
    });

    const passwordValid = user && (await verifyPassword(password, user.passwordHash));

    if (!user || !passwordValid) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      },
      { status: 200 },
    );

    await issueSession(response, user.id);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 });
  }
}
