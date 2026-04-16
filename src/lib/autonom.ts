import type { AuditResult } from './audit';
import { getCoolifyApplications } from './coolify';
import type { SnykMetrics } from './snyk';

/**
 * Autonomy & Self-Healing Engine (Phase 5 - Prescriptive)
 * Identifies drift and suggests/simulates remediation.
 */

export interface RemediationAction {
  id: string;
  type: 'REDEPLOY' | 'PATCH' | 'SYNC' | 'ROTATE' | 'SCALE' | 'REBOOT' | 'ROLLBACK';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  target: string;
  routine?: string;
  mode: 'DRY-RUN' | 'ACTIVE';
}

/**
 * Maps diagnostics from multiple vectors into actionable prescriptions.
 */
export async function generatePrescriptions(
  audit: AuditResult,
  snyk: SnykMetrics,
  tokens: Array<{ name: string; health: number; status: string }>
): Promise<RemediationAction[]> {
  const actions: RemediationAction[] = [];

  // 1. Security Vector (Snyk)
  if (snyk.critical > 0) {
    actions.push({
      id: `sec-${Date.now()}-crit`,
      type: 'PATCH',
      severity: 'CRITICAL',
      target: 'Ecosystem Dependencies',
      description: `Immediate patching required for ${snyk.critical} critical vulnerabilities.`,
      routine: 'security-maint',
      mode: 'DRY-RUN',
    });
  } else if (snyk.high > 0) {
    actions.push({
      id: `sec-${Date.now()}-high`,
      type: 'PATCH',
      severity: 'HIGH',
      target: 'Ecosystem Dependencies',
      description: `${snyk.high} high-severity vulnerabilities detected in monitored repos.`,
      routine: 'nightly-maint',
      mode: 'DRY-RUN',
    });
  }

  // 2. Drift Vector (GitHub Iac)
  const driftVector = audit.vectors.find((v) => v.name === 'IaC/Drift');
  if (driftVector && driftVector.score > 1.2) {
    actions.push({
      id: `drift-${Date.now()}`,
      type: 'SYNC',
      severity: 'HIGH',
      target: 'Infrastructure Baseline',
      description: 'Significant IaC drift detected. Automated parity sync recommended.',
      routine: 'iac-sync',
      mode: 'DRY-RUN',
    });
  }

  // 3. Token/Secret Vector (Doppler)
  const staleTokens = tokens.filter((t) => t.status === 'STALE' || t.health < 40);
  for (const token of staleTokens) {
    actions.push({
      id: `token-${token.name}-${Date.now()}`,
      type: 'ROTATE',
      severity: 'MEDIUM',
      target: `Secret: ${token.name}`,
      description: `Token health for ${token.name} is critical (${token.health}%). Rotation required.`,
      routine: 'secret-refresh',
      mode: 'DRY-RUN',
    });
  }

  // 4. Infrastructure Downtime (Legacy Coolify logic)
  try {
    const apps = (await getCoolifyApplications()) as Array<{
      status: string;
      uuid: string;
      name: string;
    }>;
    const unstable = apps.filter(
      (a) => a.status === 'exited' || a.status === 'restarting' || a.status === 'error'
    );

    for (const app of unstable) {
      actions.push({
        id: `remedy-${app.uuid}`,
        type: 'REDEPLOY',
        severity: 'HIGH',
        target: app.name,
        description: `Detected downtime for ${app.name}. Source: Proactive Health Check.`,
        routine: 'coolify-redeploy',
        mode: 'DRY-RUN',
      });
    }
  } catch (e) {
    console.warn('[Remediation] Coolify check skipped or failed', e);
  }

  return actions;
}
