import { login, logout } from '@/lib/auth';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password } = body;

  const success = await login(password);

  if (success) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
}

export async function DELETE() {
  await logout();
  return NextResponse.json({ success: true });
}
