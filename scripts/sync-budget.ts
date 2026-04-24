import { readFile, writeFile } from 'node:fs/promises';
import { getTokenBurnSummary } from '../src/lib/token-burn';

const ROUTER_PATH = 'c:/Users/alexa/.gemini/antigravity/router-config.json';

async function syncBudget() {
  const summary = await getTokenBurnSummary();
  const routerRaw = await readFile(ROUTER_PATH, 'utf-8');
  const router = JSON.parse(routerRaw);
  
  const usageRatio = summary.todayTotal / router.budget_constraints.daily_token_limit;
  
  console.log(`Current Budget Usage: ${(usageRatio * 100).toFixed(1)}%`);
  
  let policyChanged = false;
  
  if (usageRatio >= router.budget_constraints.hard_stop_threshold) {
    console.warn('CRITICAL BUDGET REACHED: Forcing local models only.');
    if (router.escalation_policy.thresholds.critical.model !== 'deepseek-coder-v2:lite') {
      router.escalation_policy.thresholds.critical.model = 'deepseek-coder-v2:lite';
      router.escalation_policy.thresholds.critical.action = 'FORCE-LOCAL-FAILOVER';
      policyChanged = true;
    }
  } else if (usageRatio < 0.7) {
    // Reset to cloud if budget is healthy
    if (router.escalation_policy.thresholds.critical.model !== 'Antigravity Tokens') {
      router.escalation_policy.thresholds.critical.model = 'Antigravity Tokens';
      router.escalation_policy.thresholds.critical.action = 'ESCALATE-CLOUD';
      policyChanged = true;
    }
  }
  
  if (policyChanged) {
    await writeFile(ROUTER_PATH, JSON.stringify(router, null, 2));
    console.log('Router configuration updated to protect budget.');
  } else {
    console.log('Router policy stable.');
  }
}

syncBudget().catch(console.error);
