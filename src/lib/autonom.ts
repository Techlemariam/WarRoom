import { getCoolifyApplications } from "./coolify";

/**
 * Autonomy & Self-Healing Engine (Phase 5 - Prescriptive)
 * Identifies drift and suggests/simulates remediation.
 */

export interface RemediationAction {
  id: string;
  type: 'REDPLOY' | 'SCALE' | 'REBOOT' | 'ROLLBACK';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  command: string;
}

export async function remediateDrift(driftScore: number): Promise<RemediationAction[]> {
  const actions: RemediationAction[] = [];

  // Logic: If drift score is high (e.g. > 1.5), identify candidates for remediation
  if (driftScore > 1.5) {
     const apps = await getCoolifyApplications();
     const unstable = apps.filter((a: any) => a.status === 'exited' || a.status === 'restarting' || a.status === 'error');

     for (const app of unstable) {
       actions.push({
         id: `remedy-${app.uuid}`,
         type: 'REDPLOY',
         severity: 'HIGH',
         description: `Detected downtime for ${app.name}. Source: Infrastructure Drift.`,
         command: `curl -X POST /api/deploy/${app.uuid}`
       });
     }
  }

  return actions;
}
