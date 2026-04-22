import { runEntropyAudit } from '@/lib/audit';
import { generatePrescriptions } from '@/lib/autonom';
import { getSnykMetrics } from '@/lib/snyk';
import { getTokenMetrics } from '@/lib/tokens';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const reposRaw = process.env.GITHUB_REPOS || '';
    const repos = reposRaw
      .split(',')
      .map((r) => r.trim().split('/').pop())
      .filter(Boolean) as string[];
    const owner = reposRaw.split(',')[0]?.split('/')[0] || 'Techlemariam';

    // 1. Fetch Parallel Diagnostics across all vectors
    const [snykMetrics, auditData, tokenMetrics] = await Promise.all([
      getSnykMetrics(),
      runEntropyAudit(owner, repos),
      getTokenMetrics(),
    ]);

    // 2. Normalize Snyk Score (0-100 to 0-2.0)
    const securityScore = Number((snykMetrics.score / 50).toFixed(1));

    // 3. Inject Security Vector into Entropy Audit results
    const combinedVectors = [
      ...auditData.vectors,
      {
        name: 'Security',
        score: securityScore,
        label: securityScore.toFixed(1),
        highlight: snykMetrics.status === 'critical',
        findings: [
          `${snykMetrics.critical} Critical, ${snykMetrics.high} High vulnerabilities`,
          `Status: ${snykMetrics.status.toUpperCase()}`,
        ],
      },
    ];

    // 4. Recalculate Total Score (Sum of all 6 vectors)
    const totalScore = Number(combinedVectors.reduce((acc, v) => acc + v.score, 0).toFixed(1));

    // 5. Generate Dynamic Prescriptions
    const remediations = await generatePrescriptions(auditData, snykMetrics, tokenMetrics);

    return NextResponse.json({
      totalScore,
      vectors: combinedVectors,
      timestamp: new Date().toISOString(),
      remediations,
      security: snykMetrics, // Extra context for client-side detail
      tokens: tokenMetrics,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Audit sensor error:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
