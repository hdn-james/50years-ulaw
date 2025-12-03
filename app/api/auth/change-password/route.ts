import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from '@/constants/auth';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(MIN_PASSWORD_LENGTH, `New password must be at least ${MIN_PASSWORD_LENGTH} characters`)
    .max(MAX_PASSWORD_LENGTH, `New password must be at most ${MAX_PASSWORD_LENGTH} characters`),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const { user } = await requireSession(request);

    const json = await request.json();
    const parsed = changePasswordSchema.safeParse(json);

    if (!parsed.success) {
      const errorMessage = parsed.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { currentPassword, newPassword } = parsed.data;

    // Fetch the user with their password hash
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(currentPassword, dbUser.passwordHash);

    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

    // Hash the new password and update
    const newPasswordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    return NextResponse.json(
      { success: true, message: 'Password changed successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'An error occurred while changing password' }, { status: 500 });
  }
}
