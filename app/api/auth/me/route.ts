import { NextRequest, NextResponse } from 'next/server';

import { getSessionFromRequest } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const sessionContext = await getSessionFromRequest(request);

    if (!sessionContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { user } = sessionContext;

    return NextResponse.json({
      id: user.id,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
