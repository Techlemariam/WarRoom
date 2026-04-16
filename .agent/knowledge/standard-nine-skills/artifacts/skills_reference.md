# Standard Nine Skills & Agent Mapping

## The Standard Nine (Baseline for ALL projects)

These 9 skills are deployed to `.agent/skills/` in every Brotherhood project:

| # | Skill | Primary Agent | Purpose |
|:--|:------|:-------------|:--------|
| 1 | `lint-and-validate` | `/coder` | Auto-fix lint + formatting after every change |
| 2 | `security-auditor` | `/security` | DevSecOps audit, compliance frameworks |
| 3 | `deployment-procedures` | `/infrastructure` | Safe deploy workflows, rollback strategies |
| 4 | `create-pr` | `/manager` | Standardized PR writing (alias for `sentry-skills:pr-writer`) |
| 5 | `systematic-debugging` | `/debug` | Bug/test/runtime failure investigation |
| 6 | `test-driven-development` | `/qa` | TDD methodology before writing implementation |
| 7 | `docker-expert` | `/infrastructure` | Container optimization, multi-stage builds |
| 8 | `observability-engineer` | `/infrastructure` | Monitoring, logging, tracing, SLI/SLO |
| 9 | `bdistill-knowledge-extraction` | `/librarian` | Extract domain knowledge in-session or via Ollama |

## Agent ↔ Skill Mapping

| Agent | Relevant Skills | Fit |
|:------|:----------------|:----|
| `/security` | security-auditor | ✅✅✅ |
| `/qa` | test-driven-development | ✅✅ |
| `/infrastructure` | docker-expert, deployment-procedures, observability-engineer | ✅✅ |
| `/architect` | (architecture-patterns if needed) | ✅✅ |
| `/coder` | lint-and-validate | ✅✅ |
| `/manager` | create-pr | ✅ |
| `/debug` | systematic-debugging | ✅ |
| `/ui-ux` | NONE (Nordic Frost conflict) | ⚠️ |
| `/maestro` | NONE (no MIDI skills exist) | ❌ |

## Explicitly REJECTED Skills (Do NOT install)

| Skill | Reason |
|:------|:-------|
| `@nextjs-best-practices` | Conflicts with `AGENTS.md` rule: "Read `node_modules/next/dist/docs/` first" |
| `@frontend-design` | Conflicts with Nordic Frost design system |
| `@ui-ux-pro-max` | Conflicts with Nordic Frost design system |
| `@git-pushing` | Duplicates ship.ps1 logic |
| Azure/AWS/GCP skills | We use Hetzner/Coolify |
| Odoo/Shopify/HubSpot | Irrelevant to our stack |
| Marketing/SEO/Growth | Irrelevant |
| Go/Rust/Python Django skills | Wrong language stack |
| "Persona" skills | We have our own Brotherhood agents |

> **~1,390 of 1,401 community skills = 99% irrelevant for our ecosystem.**

## Per-Project Deployment Status

| Skill | IronForge | Taktpinne | Matlogistik | WarRoom |
|:------|:---------:|:---------:|:-----------:|:-------:|
| lint-and-validate | ✅ | ✅ | ✅ | ✅ |
| security-auditor | ✅ | ✅ | ✅ | ✅ |
| deployment-procedures | ✅ | ✅ | ✅ | ✅ |
| create-pr | ✅ | ✅ | ✅ | ✅ |
| systematic-debugging | ✅ | ✅ | ✅ | ✅ |
| test-driven-development | ✅ | ✅ | ✅ | ✅ |
| docker-expert | ✅ | ✅ | ✅ | ✅ |
| observability-engineer | ✅ | ✅ | ✅ | ✅ |
| bdistill-knowledge-extraction | ✅ | ✅ | ✅ | ✅ |

## Additional Project-Specific Skills

- **IronForge**: 56 custom skills + 74 workflows, `git-guard` v1.1.0
- **Taktpinne**: `doppler`, `coolify-deploy`, `git-guard`
- **Matlogistik**: `doppler`, `coolify-deploy`
- **WarRoom**: `doppler`, `coolify-deploy`

## Standardization Decisions
- **Package manager**: `pnpm` (all projects)
- **Linter**: `Biome` (all projects, migrated from ESLint)
- **Branch strategy**: `develop → main` (all projects)
