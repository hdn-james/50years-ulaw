import { UserRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from '@/constants/auth';
import { hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';

// Schema for changing another user's password (admin only)
const changeUserPasswordSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  newPassword: z
    .string()
    .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
    .max(MAX_PASSWORD_LENGTH, `Password must be at most ${MAX_PASSWORD_LENGTH} characters`),
});

// GET - List all admin users (for admin only to see who they can manage)
export async function GET(request: NextRequest) {
  try {
    const { user } = await requireSession(request);

    // Only 'admin' user can see other users
    if (user.username !== 'admin') {
      return NextResponse.json({ error: 'Only admin can view users' }, { status: 403 });
    }

    // Get all admin users except the current user
    const users = await prisma.user.findMany({
      where: {
        role: UserRole.ADMIN,
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        username: 'asc',
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Get users error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

// PUT - Change another user's password (admin only can change ulaw-admin's password)
export async function PUT(request: NextRequest) {
  try {
    const { user } = await requireSession(request);

    // Only 'admin' user can change other users' passwords
    if (user.username !== 'admin') {
      return NextResponse.json(
        { error: 'Only admin can change other users\' passwords' },
        { status: 403 }
      );
    }

    const json = await request.json();
    const parsed = changeUserPasswordSchema.safeParse(json);

    if (!parsed.success) {
      const errorMessage = parsed.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { userId, newPassword } = parsed.data;

    // Get the target user
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Admin can only change ulaw-admin's password, not their own via this endpoint
    if (targetUser.username === 'admin') {
      return NextResponse.json(
        { error: 'Cannot change admin password via this endpoint. Use change password instead.' },
        { status: 400 }
      );
    }

    // Only allow changing password for ulaw-admin
    if (targetUser.username !== 'ulaw-admin') {
      return NextResponse.json(
        { error: 'Can only change password for ulaw-admin user' },
        { status: 400 }
      );
    }

    // Hash and update the password
    const newPasswordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    return NextResponse.json(
      { success: true, message: `Password for ${targetUser.username} changed successfully` },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Change user password error:', error);
    return NextResponse.json({ error: 'An error occurred while changing password' }, { status: 500 });
  }
}
