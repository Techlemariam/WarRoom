# WarRoom Observability Architecture

## System Overview

WarRoom (Panopticon) serves as the **central Command Center** for the Brotherhood ecosystem. It monitors security, infrastructure drift, and secret lifecycle across all projects.

## EntropyRadar (6-Vector Compliance Visualization)

The radar displays infrastructure health across 6 vectors, each scored 0–2.0:

| Vector | Source | Score Range |
|:-------|:-------|:-----------|
| CI/CD Health | GitHub Actions API | 0–2.0 |
| Dependency Freshness | Package audit | 0–2.0 |
| IaC/Drift | Coolify status checks | 0–2.0 |
| Secrets Hygiene | Doppler API | 0–2.0 |
| Code Quality | Biome/lint results | 0–2.0 |
| **Security** | **Snyk API** (injected) | 0–2.0 |

**Total Score** = Sum of all 6 vectors (max 12.0). Higher = more drift.

### Snyk Score Normalization
- Snyk returns 0–100 (0 = safe, 100 = critical)
- Conversion: `securityScore = snykScore / 50` → maps to 0–2.0 range
- Status thresholds: `safe | warning | critical`

## TokenTracker (Doppler Secret Monitoring)

Monitors secret rotation health via the Doppler API:
- Polls `/api/tokens` endpoint
- Returns metadata only (names + timestamps, **never values**)
- Health statuses: `FRESH` (100%), `AGING` (40-70%), `STALE` (<40%)
- Tracked secrets: `GH_PAT`, `SNYK_TOKEN`, `COOLIFY_WEBHOOK`, `STRIPE_SECRET`, `DO_TOKEN`

### Required Environment Variables
- `SNYK_TOKEN` + `SNYK_ORG_ID` — for security metrics
- `DOPPLER_API_KEY` — for TokenTracker (mock fallback without it)
- `GH_PAT` / `GITHUB_PAT` — for infrastructure audit logs

## Remediation Engine (`autonom.ts`)

The `generatePrescriptions()` function maps diagnostics to actionable routines:

| Diagnostic | Condition | Remediation | Severity |
|:-----------|:----------|:------------|:---------|
| Snyk critical > 0 | Critical vulns detected | `PATCH` → `security-maint` routine | CRITICAL |
| Snyk high > 0 | High vulns detected | `PATCH` → `nightly-maint` routine | HIGH |
| IaC/Drift score > 1.2 | Significant infrastructure drift | `SYNC` → `iac-sync` routine | HIGH |
| Token health < 40% | Stale secret detected | `ROTATE` → `secret-refresh` routine | MEDIUM |
| Coolify app down | `exited`/`restarting`/`error` | `REDEPLOY` → `coolify-redeploy` routine | HIGH |

All actions operate in **DRY-RUN** mode (suggest only, no auto-execution).

## API Contract (`/api/infra`)

```typescript
{
  totalScore: number,        // Sum of all vector scores
  vectors: Vector[],         // 6 vectors including injected Security
  timestamp: string,
  remediations: RemediationAction[],  // From generatePrescriptions
  security: SnykMetrics,     // Raw Snyk context
  tokens: TokenMetadata[]    // Doppler secret health
}
```

## Key Files
- `src/lib/autonom.ts` — Remediation Engine
- `src/lib/snyk.ts` — Snyk API integration
- `src/lib/tokens.ts` — Doppler metadata fetcher
- `src/lib/audit.ts` — Infrastructure entropy audit
- `src/components/EntropyRadar.tsx` — Radar visualization
- `src/components/TokenTracker.tsx` — Secret health UI
- `src/app/api/infra/route.ts` — Unified diagnostics API
