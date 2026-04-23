# 🛰️ WarRoom: Brotherhood Observability Hub

WarRoom is the central nervous system for the Gemini Brotherhood ecosystem, providing real-time observability, security auditing, and autonomous remediation.

## 📊 EntropyRadar
The dashboard features an 8-vector EntropyRadar (Compliance Index) that monitors:
- **Feedback Latency**: GitHub Actions velocity.
- **Determinism**: CI/CD failure rates.
- **Manual Intervention**: Workflow dispatch frequency.
- **IaC / Drift**: Configuration parity.
- **MTTR**: Mean Time To Recovery.
- **Task Debt**: Open items in `BACKLOG.md`.
- **Security**: Snyk vulnerability health (normalized).
- **Token Burn**: Daily AI consumption vs 500K budget.

## 📉 Token Burn API
Log token usage from automated sessions or external triggers.

### Log an Event
`POST /api/token-burn`
```json
{
  "project": "IronForge",
  "estimatedTokens": 45000,
  "source": "antigravity",
  "sessionId": "6a45764f-..."
}
```

## 🛠️ Autonomy Engine
The remediation engine (`src/lib/autonom.ts`) generates proactive prescriptions based on vector thresholds.

- **Status HIGH (> 1.5)**: Triggers `monitor-agents`.
- **Status CRITICAL (> 1.8)**: Triggers `throttle-agents`.

## Getting Started
```bash
npm run dev
```
Accessible at `http://localhost:3000` or `https://warroom.tailafb692.ts.net`.
