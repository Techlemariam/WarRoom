# Ship.ps1 Architecture & Self-Healing Pipeline

## Current Rating: 6/10 → Target: 10/10

## Architecture Overview

```
npm run ship
  │
  ├── 0. Pre-flight ─── @git-guard + @lint-and-validate
  │     ├── Dirty-check (uncommitted/untracked)
  │     └── Branch guard (blocks ship from main)
  │
  ├── 1. Verify ─────── turbo run lint test build security
  │     └── On failure → Self-Healing Loop
  │
  ├── 2. Merge ──────── feature → develop (auto-abort on conflict)
  │
  ├── 3. Push staging ── develop → Coolify auto-deploy
  │     └── Health-ping via Coolify API
  │
  ├── 4. Create PR ──── gh pr create (develop → main)
  │
  ├── 5. CI + QA ────── Jules PR QA + Scope Guard
  │
  └── 6. Post-deploy ── n8n notification → Discord
```

## Self-Healing Loop (Auto-Fix)

```
agent:verify FAILS
  │
  ├── 1. PARSE: Identify failure type
  │     ├── Lint error    → biome check --write → auto-commit → retry
  │     ├── Security vuln → npm audit fix → auto-commit → retry
  │     ├── Type error    → Log file + line → suggest fix
  │     └── Test failure  → Extract failing test → analyze
  │
  ├── 2. AUTO-FIX (max 2 retries)
  │     → Run fix command → git add + commit "fix: auto-remediate [type]"
  │     → Re-run agent:verify
  │
  ├── 3. ESCALATION (if auto-fix fails)
  │     → Dispatch to n8n CI Triage Router
  │     → Jules creates fix-PR automatically
  │     → Discord notification
  │
  └── 4. AUDIT
        → Log to ship-log.json
        → WarRoom dashboard updated
```

## Hybrid Runner Strategy

| Runner | Role | Specs | Availability |
|:-------|:-----|:------|:-------------|
| 🖥️ **Local Desktop** (PRIMARY) | All 3 projects simultaneously | i7-9750H, 32GB, NVMe, Docker v29 | Daytime only |
| ☁️ **Hetzner CX23** (FALLBACK) | IronForge night jobs, Coolify, n8n | 2 vCPU, 4GB, 40GB SSD | 24/7 |
| 🆓 **GitHub Hosted** (LAST RESORT) | When no self-hosted online | 4 vCPU, 7GB | On-demand |

## Flags

| Flag | Effect |
|:-----|:-------|
| `--dry-run` / `-DryRun` | Simulate without pushing |
| `--force` | Skip verify for hotfixes |

## Key Distinction: Ship vs Factory

| Dimension | ship.ps1 | Factory Lite |
|:----------|:---------|:-------------|
| **Scope** | Release pipeline (push → PR) | Full lifecycle (idea → deploy) |
| **Input** | Code that already exists | Spec that must be written first |
| **Design review** | ❌ | ✅ Multi-agent sign-off |
| **Debt management** | ❌ | ✅ Automatic DEBT.md logging |

## Package Manager Notes
- IronForge: `pnpm`
- Taktpinne: `pnpm`
- Matlogistik: `pnpm` (migrated from npm)
- WarRoom: `pnpm` (migrated from npm)
- Linting standardized to **Biome** across all projects
