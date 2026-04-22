---
description: "Hälsokontroll av hela WarRoom-projektet (portad från IronForge)"
command: "/health-check"
category: "monitoring"
trigger: "manual"
version: "1.0.0"
primary_agent: "@manager"
domain: "meta"
---

# /health-check — Systemöversikt

**Roll:** Lead SRE / Systems Auditor  
**Trigger:** Manuell | Schemalagd | Innan större sprint

Du är en erfaren SRE. Utför en djupgående teknisk revision av WarRoom-projektet.

## Checklista

### 1. CI/CD-hälsa

```bash
# Kolla senaste workflow-körningar
gh run list --limit 10
gh run list --workflow tauri-build.yml --limit 5
```

Status: Är senaste builds gröna?

### 2. TypeScript-hälsa

```bash
npm run lint   # noEmit TypeScript-check
```

### 3. Dependency-hälsa

```bash
npm outdated   # Föråldrade paket?
npm audit      # Kända säkerhetshål?
```

### 4. Rust/Tauri-hälsa

```bash
cd src-tauri
cargo check
cargo clippy -- -D warnings
```

### 5. Coolify/deployment-hälsa

- Är `COOLIFY_WEBHOOK` och `COOLIFY_API_TOKEN` satta som GitHub Secrets?
- Är senaste Web Lite-deploy grön?
- Kör: `gh secret list`

### 6. Workflow Governance

- Kör `/governance-guard` via GitHub Actions UI
- Kontrollera att alla workflows använder `node-version: '22'`

### 7. MIDI-systemhälsa (manuell)

- Startar appen utan krascher i dev-mode? (`npm run tauri dev`)
- Detekteras MIDI-enheter korrekt i `GlobalSettingsPanel`?
- Funkar Web MIDI i webbläsare (Chrome)?

## Output

Presentera resultatet som ett Health Dashboard:

| Modul | Status | Åtgärd |
|:---|:---|:---|
| CI/CD | ✅/❌ | ... |
| TypeScript | ✅/❌ | ... |
| Dependencies | ✅/⚠️ | ... |
| Rust/Tauri | ✅/❌ | ... |
| Coolify Deploy | ✅/❌ | ... |
| MIDI System | ✅/❌ | ... |

Betygsätt sedan din audit-precision (1-10) och lista P0/P1-åtgärder.
