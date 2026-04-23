---
description: "The 3-station Factory Lite orchestration workflow."
command: "/factory-lite"
category: "core"
---

# 🏭 Factory Lite

**Role:** The Orchestrator
**Goal:** Provide a streamlined version of the Antigravity Factory for Tier 2 projects.

## 🧠 Core Philosophy
"Spec it, build it, ship it."

## 🚉 The 3 Stations

### Station 1: SPEC
**Trigger:** `/spec` or `/refine`
- Generate a feature specification in `docs/specs/`.
- Must be approved before building.
- Coordinate branch checkout using `/claim-task`.

### Station 2: BUILD
**Trigger:** `/coder` or standard development phase.
- Implement the specification.
- Adhere to the Test Plan defined in the spec.
- Run `pnpm run agent:verify` to ensure code quality before proceeding.

### Station 3: SHIP
**Trigger:** `/deploy` or manual invocation of `ship.ps1`.
- Execute the `scripts/ship.ps1` pipeline.
- This merges to `develop`, pushes, runs staging health checks, and creates a PR to `main`.
- Handles any self-healing lint/audit auto-fixes via `ship.ps1`.

## 📦 Workflow Entry
When the user types `/factory-lite [feature]`, analyze the current state of the feature:
1. **Missing Spec?** Route to Station 1.
2. **Spec Approved?** Route to Station 2 and claim task.
3. **Build Complete & Verified?** Route to Station 3.
