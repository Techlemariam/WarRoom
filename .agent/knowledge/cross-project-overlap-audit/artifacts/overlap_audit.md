# Cross-Project Overlap Audit & Factory Governance

## Key Finding

> **ship.ps1 handles *release*. Factory handles *the full lifecycle*. They are complementary, not duplicates.**

## What's Already Done (Do NOT redo)

| Capability | Status | Where |
|:-----------|:------:|:------|
| Standard Nine skills distributed | ✅ | All 4 projects |
| Unified ship.ps1 v3 with self-healing | ✅ | All 4 projects |
| Unified branch strategy (develop→main) | ✅ | All 4 projects |
| Discord triage webhooks per project | ✅ | n8n |
| n8n Triage Router 2.0 | ✅ | IronForge |
| Repository parity (Standard Nine) | ✅ | All 4 projects |
| WarRoom gap analysis | ✅ | Conv 0579457e |
| Nordic Frost UI refactor | ✅ | Taktpinne + WarRoom |

## What's Genuinely New (Factory contributions)

| Item | Status | Value |
|:-----|:------:|:------|
| Factory Lite 3-station orchestration | ✅ Ported to WarRoom | 🔴 High |
| `claim-task.md` workflow | ✅ Ported to WarRoom + Taktpinne | 🔴 High |
| `/spec` generator workflow | ✅ Ported to Taktpinne | 🔴 High |
| `factory-manager-lite.ps1` | Concept exists | 🟡 Medium |
| `GRAPH.md` + `INDEX.md` | ⬜ Not ported to WarRoom | 🟡 Medium |
| Night Shift (stripped) | ⬜ Not ported | 🟡 Medium |
| Jules Handoff integration | ⬜ Not ported | ⚪ Low |

## What to Skip

- ~~Gatekeeper Triple Gate~~ → ship.ps1 `agent:verify` covers this
- ~~Pre-PR workflow~~ → ship.ps1 PR creation covers this
- ~~Distribute Standard Nine~~ → Already done
- ~~Standardize branch strategy~~ → Already done
- ~~Gap analysis WarRoom~~ → Already done

## Factory Tiers (from existing KI)

| Tier | Stations | When to Use |
|:-----|:---------|:------------|
| **Micro** | 1 (Build only) | Hotfixes, tiny changes |
| **Lite** | 3 (Spec→Build→Ship) | Features, most work |
| **Full** | 5 (Spec→Design→Build→QA→Ship) | Major features, architecture changes |

## Assessment Criteria (/manager assess)
1. Velocity (commits/week)
2. Complexity (files changed)
3. Integrations (external APIs)
4. Deploy steps (manual vs auto)
5. Quality (test coverage, lint score)
6. Coordination needs (multi-agent)
