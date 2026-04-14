# 🏭 The Scrap Yard (DEBT.md)

Welcome to the Scrap Yard. This file strictly manages Technical Debt, architectural shortcuts, and temporary fixes in the WarRoom ecosystem.
The `nightly-maintenance` agent or Station 3 QC process periodically reviews and alerts on items logged here.

## 🧠 Philosophy
"Debt is a tool. Untracked debt is a liability. Track it, or the Factory halts."

## 📝 Debt Log

Format: `- [ ] [Severity] [Domain] Description <!-- source: component -->`

### Active Debt
- [ ] [Medium] [CI] Missing an automated E2E testing framework check inside of `ci.yml` (Wait until the UI stabilizes). <!-- source: Factory Lite setup -->

### Resolved Debt
- [x] [High] [Architecture] No PR-blocking CI pipeline. <!-- source: Fixed in implementation_plan_gaps -->

---
> **Instructions for Agents:** If you take a shortcut (e.g. `// TODO: fix later`), you MUST log it here before proceeding to `/factory ship`.
