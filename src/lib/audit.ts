import { Octokit } from "octokit";

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

export async function runEntropyAudit(owner: string, repos: string[]): Promise<AuditResult> {
  const results = await Promise.all(repos.map(repo => auditRepo(owner, repo)));
  
  // Aggregate results (weighted average)
  const aggregatedVectors = [
    { name: "Feedback", score: 0, label: "0.0", findings: [] as string[] },
    { name: "Determinism", score: 0, label: "0.0", highlight: true, findings: [] as string[] },
    { name: "Manual", score: 0, label: "0.0", findings: [] as string[] },
    { name: "IaC/Drift", score: 0, label: "0.0", findings: [] as string[] },
    { name: "MTTR", score: 0, label: "0.0", findings: [] as string[] },
  ];

  results.forEach(res => {
    res.vectors.forEach((v, i) => {
      aggregatedVectors[i].score += v.score / repos.length;
      aggregatedVectors[i].findings.push(...v.findings);
    });
  });

  const totalScore = parseFloat(aggregatedVectors.reduce((acc, v) => acc + v.score, 0).toFixed(1));

  return {
    totalScore,
    vectors: aggregatedVectors.map(v => ({
      ...v,
      label: v.score.toFixed(1)
    }))
  };
}

async function auditRepo(owner: string, repo: string) {
  try {
    const [runs, content] = await Promise.all([
      octokit.rest.actions.listWorkflowRunsForRepo({ owner, repo, per_page: 10 }),
      octokit.rest.repos.getContent({ owner, repo, path: "" }).catch(() => ({ data: [] }))
    ]);

    const workflowRuns = (runs.data.workflow_runs || []);
    
    // 1. Feedback Latency (0-2)
    // Avg duration in minutes. >30min = 2, <10min = 0.
    const durations = workflowRuns
      .filter(r => r.status === 'completed' && r.run_started_at)
      .map(r => (new Date(r.updated_at).getTime() - new Date(r.run_started_at!).getTime()) / 60000);
    const avgDuration = durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : 5;
    const feedbackScore = Math.min(avgDuration / 15, 2);

    // 2. Determinism (0-2) - Weighted 2.5x in UI logic but here we keep 0-2 scale
    // Failures / Total. 100% success = 0, 50% success = 1, 0% success = 2.
    const failures = workflowRuns.filter(r => r.conclusion === 'failure').length;
    const determinismScore = workflowRuns.length ? (failures / workflowRuns.length) * 2 : 0.5;

    // 3. Manual Intervention (0-2)
    // % of runs triggered by workflow_dispatch.
    const manualRuns = workflowRuns.filter(r => r.event === 'workflow_dispatch').length;
    const manualScore = workflowRuns.length ? (manualRuns / workflowRuns.length) * 2 : 0;

    // 4. IaC / Drift (0-2)
    // Check for Nordic Frost / Node 22 markers
    const files = Array.isArray(content.data) ? content.data.map(f => f.name) : [];
    let driftFindings: string[] = [];
    let driftScore = 0;
    
    if (!files.includes('tokens.css') && !files.includes('src/app/tokens.css')) {
      driftScore += 1.0;
      driftFindings.push("Missing Nordic Frost tokens");
    }
    if (!files.includes('Dockerfile')) {
      driftScore += 0.5;
      driftFindings.push("Missing Dockerized infrastructure");
    }

    // 5. MTTR (0-2)
    // Avg time to fix a failure (mocked for now based on recent history)
    const mttrScore = failures > 0 ? 0.8 : 0.1;

    return {
      vectors: [
        { name: "Feedback", score: feedbackScore, findings: [] },
        { name: "Determinism", score: determinismScore, findings: [] },
        { name: "Manual", score: manualScore, findings: [] },
        { name: "IaC/Drift", score: driftScore, findings: driftFindings },
        { name: "MTTR", score: mttrScore, findings: [] },
      ]
    };
  } catch (e) {
    console.error(`Audit failed for ${repo}`, e);
    return {
      vectors: Array(5).fill({ name: "Error", score: 2.0, findings: ["API Access Denied"] })
    };
  }
}
