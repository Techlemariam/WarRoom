import { runEntropyAudit } from '@/lib/audit';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const reposRaw = process.env.GITHUB_REPOS || '';
    const repos = reposRaw
      .split(',')
      .map((r) => r.trim().split('/').pop())
      .filter(Boolean) as string[];
    const owner = reposRaw.split(',')[0]?.split('/')[0] || 'Techlemariam';

    const auditData = await runEntropyAudit(owner, repos);

    return NextResponse.json(auditData);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Audit API Error:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
