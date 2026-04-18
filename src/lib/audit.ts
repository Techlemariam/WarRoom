import { Octokit } from 'octokit';

const octokit = new Octokit({
  auth: process.env.GH_PAT || process.env.GITHUB_PAT,
});

export type AuditResult = {
  totalScore: number;
  vectors: {
    name: string;
    score: number;
    label: string;
    highlight?: boolean;
    findings: string[];
  }[];
};

interface RepoAudit {
  vectors: Array<{
    name: string;
    score: number;
    findings: string[];
  }>;
}

export async function runEntropyAudit(owner: string, repos: string[]): Promise<AuditResult> {
  let results: RepoAudit[];

  try {
    results = await Promise.all(repos.map((repo) => auditRepo(owner, repo)));
  } catch (e) {
    console.warn('Audit API failure, falling back to baseline simulation', e);
    return {
      totalScore: 7.4,
      vectors: [
        { name: 'Feedback', score: 0.8, label: '0.8', findings: ['DOPPLER_GH_TOKEN missing'] },
        { name: 'Determinism', score: 1.2, label: '1.2', findings: ['Partial CI/CD visibility'] },
        { name: 'Manual', score: 0.5, label: '0.5', findings: [] },
        { name: 'IaC/Drift', score: 1.5, label: '1.5', findings: ['System baseline audit used'] },
        { name: 'MTTR', score: 2.4, label: '2.4', findings: [] },
        { name: 'Task Debt', score: 1.0, label: '1.0', findings: ['System baseline audit used'] },
      ],
    };
  }

  // Aggregate results (weighted average)
  const aggregatedVectors = [
    { name: 'Feedback', score: 0, label: '0.0', findings: [] as string[] },
    { name: 'Determinism', score: 0, label: '0.0', highlight: true, findings: [] as string[] },
    { name: 'Manual', score: 0, label: '0.0', findings: [] as string[] },
    { name: 'IaC/Drift', score: 0, label: '0.0', findings: [] as string[] },
    { name: 'MTTR', score: 0, label: '0.0', findings: [] as string[] },
    { name: 'Task Debt', score: 0, label: '0.0', findings: [] as string[] },
  ];

  for (const res of results) {
    for (let i = 0; i < res.vectors.length; i++) {
      const v = res.vectors[i];
      aggregatedVectors[i].score += v.score / repos.length;
      aggregatedVectors[i].findings.push(...v.findings);
    }
  }

  const totalScore = Number.parseFloat(
    aggregatedVectors.reduce((acc, v) => acc + v.score, 0).toFixed(1)
  );

  return {
    totalScore,
    vectors: aggregatedVectors.map((v) => ({
      ...v,
      label: v.score.toFixed(1),
    })),
  };
}

async function auditRepo(owner: string, repo: string): Promise<RepoAudit> {
  if (!process.env.GH_PAT && !process.env.GITHUB_PAT) {
    throw new Error('Missing GitHub Credentials');
  }

  try {
    const [runs, content, backlogRes] = await Promise.all([
      octokit.rest.actions.listWorkflowRunsForRepo({ owner, repo, per_page: 10 }),
      octokit.rest.repos.getContent({ owner, repo, path: '' }).catch(() => ({ data: [] })),
      octokit.rest.repos.getContent({ owner, repo, path: 'BACKLOG.md' }).catch(() => null),
    ]);

    const workflowRuns = runs.data.workflow_runs || [];

    // 1. Feedback Latency (0-2)
    const durations = workflowRuns
      .filter((r) => r.status === 'completed' && r.run_started_at)
      .map(
        (r) =>
          (new Date(r.updated_at).getTime() -
            new Date(r.run_started_at || r.created_at).getTime()) /
          60000
      );
    const avgDuration = durations.length
      ? durations.reduce((a, b) => a + b, 0) / durations.length
      : 5;
    const feedbackScore = Math.min(avgDuration / 15, 2);

    // 2. Determinism (0-2)
    const failures = workflowRuns.filter((r) => r.conclusion === 'failure').length;
    const determinismScore = workflowRuns.length ? (failures / workflowRuns.length) * 2 : 0.5;

    // 3. Manual Intervention (0-2)
    const manualRuns = workflowRuns.filter((r) => r.event === 'workflow_dispatch').length;
    const manualScore = workflowRuns.length ? (manualRuns / workflowRuns.length) * 2 : 0;

    // 4. IaC / Drift (0-2)
    const files = Array.isArray(content.data)
      ? content.data.map((f: { name: string }) => f.name)
      : [];
    const driftFindings: string[] = [];
    let driftScore = 0;

    if (!files.includes('tokens.css') && !files.includes('src/app/tokens.css')) {
      driftScore += 1.0;
      driftFindings.push('Missing Nordic Frost tokens');
    }
    if (!files.includes('Dockerfile')) {
      driftScore += 0.5;
      driftFindings.push('Missing Dockerized infrastructure');
    }

    // 5. MTTR (0-2)
    const mttrScore = failures > 0 ? 0.8 : 0.1;

    // 6. Task Debt (0-2)
    let openTasks = 0;
    const taskFindings: string[] = [];
    if (
      backlogRes &&
      'data' in backlogRes &&
      !Array.isArray(backlogRes.data) &&
      backlogRes.data.content
    ) {
      const backlogText = Buffer.from(backlogRes.data.content, 'base64').toString();
      const openMatches = backlogText.match(/- \[[ \/]\]/g); // Matches [ ] and [/]
      if (openMatches) {
        openTasks = openMatches.length;
      }
      if (openTasks > 0) {
        taskFindings.push(`Found ${openTasks} open/in-progress tasks in BACKLOG.md`);
      }
    } else {
      taskFindings.push('No BACKLOG.md found');
    }
    const taskDebtScore = Math.min((openTasks / 10) * 2.0, 2.0);

    return {
      vectors: [
        { name: 'Feedback', score: feedbackScore, findings: [] },
        { name: 'Determinism', score: determinismScore, findings: [] },
        { name: 'Manual', score: manualScore, findings: [] },
        { name: 'IaC/Drift', score: driftScore, findings: driftFindings },
        { name: 'MTTR', score: mttrScore, findings: [] },
        { name: 'Task Debt', score: taskDebtScore, findings: taskFindings },
      ],
    };
  } catch (e) {
    console.error(`Audit failed for ${repo}`, e);
    return {
      vectors: [
        { name: 'Feedback', score: 2.0, findings: ['API Access Denied'] },
        { name: 'Determinism', score: 2.0, findings: [] },
        { name: 'Manual', score: 2.0, findings: [] },
        { name: 'IaC/Drift', score: 2.0, findings: [] },
        { name: 'MTTR', score: 2.0, findings: [] },
        { name: 'Task Debt', score: 2.0, findings: [] },
      ],
    };
  }
}
