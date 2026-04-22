import { getTokenBurnSummary, logTokenBurn } from '@/lib/token-burn';
import { NextResponse } from 'next/server';

/**
 * GET /api/token-burn — Returns the token burn summary for dashboard display.
 * POST /api/token-burn — Logs a new token burn event (from n8n webhooks or manual).
 */

export async function GET() {
  try {
    const summary = await getTokenBurnSummary();
    return NextResponse.json(summary);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Token burn fetch error:', error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { project, estimatedTokens, source, sessionId } = body;

    if (!project || !estimatedTokens || !source) {
      return NextResponse.json(
        { error: 'Missing required fields: project, estimatedTokens, source' },
        { status: 400 }
      );
    }

    await logTokenBurn({
      project,
      estimatedTokens: Number(estimatedTokens),
      source,
      sessionId,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Token burn log error:', error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
