import { getTokenMetrics } from '@/lib/tokens';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tokens = await getTokenMetrics();
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      tokens,
    });
  } catch (error) {
    console.error('Token API Failure:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
