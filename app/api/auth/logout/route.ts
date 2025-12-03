import { NextRequest, NextResponse } from 'next/server';

import { clearSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logout successful',
      },
      { status: 200 },
    );

    await clearSession(request, response);

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'An error occurred during logout' }, { status: 500 });
  }
}
