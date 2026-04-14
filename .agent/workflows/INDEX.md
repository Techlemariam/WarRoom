# 🧭 WarRoom Workflow Index

Welcome to the WarRoom operative workflows! This repository follows the **Factory Lite** (Tier 2) protocol.

## 🏭 Factory Lite Pipeline
Use these workflows chronologically for feature development:

1. **[/spec](spec.md)** - Generate a technical specification before starting any code. *(Station 1)*
2. **[/claim-task](claim-task.md)** - Claim a task and coordinate branch checkout to avoid conflicts. *(Station 1/2)*
3. **[/factory-lite](factory-lite.md)** - General entry point to track state in the 3-station assembly line.
4. **[/coder](coder.md)** - Implement the feature. *(Station 2)*
5. **[/deploy](deploy.md)** - Execute the release sequence via `ship.ps1`. *(Station 3)*

## 🛠️ Specialized Personas

- **[/manager](manager.md)** - Project Lead, Orchestrator, handles conflict resolution and tier assessments (`/manager assess`).
- **[/architect](architect.md)** - System Design and architecture planning.
- **[/infrastructure](infrastructure.md)** - DevOps, CI/CD, deployment tasks.
- **[/debug](debug.md)** - Systematic error analysis and recovery.
- **[/health-check](health-check.md)** - Run ecosystem-wide health validations.
- **[/librarian](librarian.md)** - Knowledge governance and KI generation.
- **[/qa](qa.md)** - Quality Assurance execution.
- **[/status](status.md)** - Scan project status and perform release readiness checks.

---
> **Note:** WarRoom operates on a strict *Spec-First* paradigm. Do not implement features without a verified specification.
