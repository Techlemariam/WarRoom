# Brotherhood Factory Standard — 3 Tiers + Assessment Framework

Standardized three tiers of the factory workflow for the Brotherhood ecosystem.

## Assessment Framework: `/manager assess`
6-criteria scoring matrix evaluated by the `/manager`:

| Criterion | 1pt (Low) | 2pt (Medium) | 3pt (High) |
|:---|:---|:---|:---|
| **Feature Velocity** | <1 feature/mo | 1-3 features/mo | >3 features/mo |
| **Code Complexity** | <5k LOC, JS only | 5-20k LOC, TS | >20k LOC, TS+DB+Auth |
| **Integrations** | 0-1 external API | 2-4 external APIs | >4 (DB, Auth, Payment, etc) |
| **Deploy Complexity**| Simple (1 env) | Docker + Staging | Multi-env + CI matrix |
| **Quality Reqs** | Lint only | Lint + Unit tests | Lint + Unit + E2E + Security |
| **Coordination** | Solo, sequential| Solo, parallel | Multi-agent or team |

## Tier Guidelines
- **6–9 (Tier 1: Factory Micro):** `ship.ps1` only. Best for simple apps (e.g. Matlogistik).
- **10–14 (Tier 2: Factory Lite):** `ship.ps1` + `spec.md` + `claim-task.md` + `factory-lite.md`. Best for structured, medium-velocity projects (e.g. WarRoom, Taktpinne).
- **15–18 (Tier 3: Factory Full):** Full 5-station assembly line with `factory-manager.ps1`. Best for complex, multi-agent platforms (e.g. IronForge).
