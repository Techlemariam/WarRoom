# 🏛️ WarRoom Architecture: The Oracle Engine

## Vision
WarRoom is a **Predictive Orchestration Engine** designed to monitor, audit, and governor the Gemini Brotherhood ecosystem (IronForge, Taktpinne, etc.). It acts as "The Oracle" — detecting architectural drift and CI/CD entropy before they impact production.

## 🧱 Core Layers

### 1. The Sensor Layer (`/api/infra`, `/api/audit`)
- **Infrastructure Sensor**: Real-time discovery of Hetzner server nodes and Coolify application health.
- **Oracle Audit Engine**: Analyzes GitHub repository state (Actions flakiness, standard compliance).

### 2. The Intelligence Layer (`lib/audit.ts`)
Calculates the **Entropy Index** (0-10) based on 5 vectors:
- **Feedback**: CI build latency.
- **Determinism**: Failure rate and flakiness.
- **Manual**: Detection of manual intervention vs. automation.
- **IaC/Drift**: Divergence from repository standards (Missing Docker/Tokens).
- **MTTR**: Recovery speed.

### 3. The UI Layer (Nordic Frost)
Built with **Nordic Frost** design tokens (`tokens.css`) and glassmorphism.
- **Entropy Radar**: Visual representation of system health.
- **Infra Monitor**: Real-time CPU/RAM/Service status.
- **Workflow Console**: Prescriptive action dispatcher.

## 🎨 Design Standards (Nordic Frost)
- **Typography**: Inter (UI), JetBrains Mono (Meta/Mono).
- **Color Palette**: 
  - `Background`: #0A0F14 (Deep Void)
  - `Accent`: #00E5FF (Arctic Pulse)
  - `Success`: #00FF9D (Emerald Frost)
  - `Error`: #FF3D71 (Heat Flare)
- **Rules**:
  - **No-Line Rule**: No borders for decorative elements; use depth and hue shifts.
  - **Glow/Blur**: Subtle arctic glow only for critical status changes.

## 📚 Governance (Librarian)
- Daily audits via `.github/workflows/librarian.yml`.
- Standards enforcement via `/librarian` agent persona.
- Centralized secrets via Doppler.

---
**Version:** 1.0.1 (Oracle Phase Completion)
**Owner:** @librarian
