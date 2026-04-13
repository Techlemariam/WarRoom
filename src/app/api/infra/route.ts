import { runEntropyAudit } from '@/lib/audit';
import { getSnykProjects } from '@/lib/snyk';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const reposRaw = process.env.GITHUB_REPOS || '';
    const repos = reposRaw
      .split(',')
      .map((r) => r.trim().split('/').pop())
      .filter(Boolean) as string[];
    const owner = reposRaw.split(',')[0]?.split('/')[0] || 'Techlemariam';

    // 1. Snyk Security Filter
    const snykData = await getSnykProjects();
    const vulnerabilities = snykData.map((p: any) => ({
      name: p.attributes.name,
      critical: p.attributes.issue_counts_by_severity.critical,
      high: p.attributes.issue_counts_by_severity.high,
    }));

    // 2. Entropy Sensor (Drift)
    const auditData = await runEntropyAudit(owner, repos);

    // 3. Automated Prescriptions
    const remediations = auditData
      .filter((a) => a.entropy > 0.3)
      .map((a) => ({
        target: a.project,
        action: 'Run Standard Parity Sync',
        priority: a.entropy > 0.7 ? 'CRITICAL' : 'HIGH',
      }));

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      security: {
        totalVulnerabilities: vulnerabilities.length,
        critical: vulnerabilities.reduce((acc: number, v: any) => acc + v.critical, 0),
      },
      drift: {
        avgEntropy: auditData.reduce((acc, a) => acc + a.entropy, 0) / auditData.length,
        projectsAffected: auditData.filter((a) => a.entropy > 0.1).length,
      },
      remediations,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Audit sensor error:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
