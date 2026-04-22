import { runEntropyAudit } from '@/lib/audit';
import { generatePrescriptions } from '@/lib/autonom';
import { getCoolifyApplications, getCoolifyHealth } from '@/lib/coolify';
import { getHetznerMetrics, getHetznerServer, getHetznerServers } from '@/lib/hetzner';
import { getSnykMetrics } from '@/lib/snyk';
import { getTokenBurnSummary } from '@/lib/token-burn';
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

    let hetznerId = process.env.HETZNER_SERVER_ID;
    if (!hetznerId) {
      const servers = await getHetznerServers();
      if (servers && servers.length > 0) {
        hetznerId = servers[0].id.toString();
      }
    }

    // 1. Fetch Parallel Diagnostics across all vectors and infra
    const [
      snykMetrics,
      auditData,
      tokenMetrics,
      coolifyHealth,
      coolifyApps,
      hetznerServer,
      hetznerMetrics,
      tokenBurnSummary,
    ] = await Promise.all([
      getSnykMetrics(),
      runEntropyAudit(owner, repos),
      getTokenMetrics(),
      getCoolifyHealth(),
      getCoolifyApplications(),
      hetznerId ? getHetznerServer(hetznerId) : Promise.resolve(null),
      hetznerId ? getHetznerMetrics(hetznerId) : Promise.resolve(null),
      getTokenBurnSummary(),
    ]);

    // 2. Normalize Snyk Score (0-100 to 0-2.0)
    const securityScore = Number((snykMetrics.score / 50).toFixed(1));

    // 3. Inject Security + Token Burn Vectors into Entropy Audit results
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
      {
        name: 'Token Burn',
        score: tokenBurnSummary.burnScore,
        label: tokenBurnSummary.burnScore.toFixed(1),
        highlight: tokenBurnSummary.status === 'CRITICAL',
        findings: [
          `Today: ~${tokenBurnSummary.todayTotal.toLocaleString()} tokens (${tokenBurnSummary.sessionCount} sessions)`,
          `Status: ${tokenBurnSummary.status}`,
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
      tokenBurn: tokenBurnSummary,
      coolify: {
        healthy: coolifyHealth,
        apps: coolifyApps,
      },
      hetzner: {
        server: hetznerServer,
        metrics: hetznerMetrics,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Audit sensor error:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
