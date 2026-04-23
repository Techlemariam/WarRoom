# CI/CD Parity Matrix

## Maturity Overview

| Project | Rating | Key Strength | Key Gap |
|:--------|:------:|:-------------|:--------|
| **IronForge** | 8/10 | Full L1/L2 CI, Jules QA, n8n, E2E | No ship.ps1 |
| **Taktpinne** | 6/10 | ship.ps1, semantic release, Docker | No Jules QA, no E2E |
| **Matlogistik** | 1/10 | Coolify deployed | No CI, no tests, no TS |
| **WarRoom** | 2/10 | Coolify deployed, Next.js | No CI, no tests |

## Detailed Capability Matrix

| Capability | IronForge 🏔️ | Taktpinne 🎵 | Matlogistik 🍽️ | WarRoom 🎯 |
|:-----------|:---:|:---:|:---:|:---:|
| `ship.ps1` / `npm run ship` | ❌ | ✅ | ✅* | ✅* |
| `agent:verify` (turbo) | ✅ `ci:l1`/`ci:l2` | ✅ | ✅* | ✅* |
| `git-guard` skill | ✅ v1.1.0 | ✅ | ✅* | ✅* |
| CI on PR (`ci.yml`) | ✅ L1/L2 Tiered | ✅ | ✅* | ✅* |
| Jules PR QA | ✅ Scope Guard | ❌ | ❌ | ❌ |
| Active Handover (n8n) | ✅ All jobs | ❌ | ❌ | ❌ |
| Coolify Deploy | ✅ `release` | ✅ `main`+`develop` | ✅ | ✅ |
| Semantic Release | ❌ | ✅ Auto | ❌ | ❌ |
| Docker Build (GHCR) | ✅ | ✅ | ❌ | ❌ |
| E2E Tests | ✅ 3-device matrix | ❌ | ❌ | ❌ |
| Self-Healing Pipeline | ❌ | ❌ | ❌ | ❌ |

> *Marked with ✅* = deployed during Wisdom Pipeline session (may need verification)

## IronForge CI Details
- L1/L2 Tiered CI with self-hosted runners (`IronForge-VPS`)
- Jules PR QA with Scope Guard (forbidden: `prisma/migrations`, `.github/workflows`, `src/lib/auth`)
- Active Handover → n8n CI Triage Router on all job failures
- E2E via Playwright (Desktop + Mobile + TV matrix)
- Predictive Failure Analysis (`scripts/predict-failures.ts`)

## Priority Actions per Project

### IronForge → 10/10
1. Create `scripts/ship.ps1` (port from Taktpinne, adapt for pnpm)
2. Add `develop` branch to Coolify deploy triggers
3. Implement Self-Healing loop in CI

### Taktpinne → 10/10
1. Port `jules-pr-qa.yml` from IronForge
2. Add n8n Active Handover
3. Upgrade ship.ps1 with staging health-ping

### Matlogistik → 5/10
1. Verify CI/CD pipeline (L1)
2. Add basic tests
3. Consider TypeScript migration

### WarRoom → 5/10
1. Verify CI/CD pipeline (L1)
2. Add tests for API routes
3. Integrate ship events into dashboard telemetry
