---
description: "Systematisk felsökning av build/test/runtime-fel i WarRoom (portad från IronForge)"
command: "/debug"
category: "utility"
trigger: "manual"
version: "1.0.0"
primary_agent: "@debug"
domain: "core"
---

# /debug — Systematisk Felsökning

**Roll:** Error Analyst & Fixer  
**Trigger:** Build-fel | Test-fel | Runtime-fel | Tauri IPC-fel | MIDI-fel

## Fas 0: Branch Guard

```bash
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" = "main" ]; then
  echo "⛔ Felsök på en feature-branch, inte main!"
  exit 1
fi
echo "✅ Branch: $current_branch"
```

---

## Steg 1: Klassificera felet

| Typ | Indikatorer | Nästa steg |
|:---|:---|:---|
| **Build (Frontend)** | `npm run build` misslyckas, TypeScript-fel | Steg 2A |
| **Build (Rust/Tauri)** | `cargo build` misslyckas | Steg 2B |
| **Test** | `npm test` / vitest misslyckas | Steg 2C |
| **Runtime MIDI** | MIDI-enheter hittas inte, IPC-timeout | Steg 2D |
| **Tauri IPC** | `invoke()` returnerar fel | Steg 2D |

---

## Steg 2A: Frontend Build-fel

```bash
npm run build 2>&1 | head -80
npm run lint # TypeScript check
```

---

## Steg 2B: Rust/Tauri Build-fel

```bash
cd src-tauri
cargo check 2>&1 | head -60
cargo build 2>&1 | tail -40
```

---

## Steg 2C: Test-fel

```bash
npm test -- --reporter=verbose 2>&1 | tail -50
```

---

## Steg 2D: MIDI / Tauri IPC-fel

1. Kontrollera att rätt Tauri-backend-kommandon är registrerade i `src-tauri/src/lib.rs`
2. Kolla `platformCapabilities.ts` — används rätt backend (Tauri vs Web MIDI)?
3. Kolla `midiDeviceManager.ts` för async-hantering
4. Kör i Tauri dev-mode och granska console + Rust-output:

```bash
npm run tauri dev
```

---

## Steg 3: Root Cause

```bash
git diff HEAD~3 --name-only  # Vad ändrades nyligen?
git log --oneline -5 -- <fil>
```

---

## Steg 4: Fix & Verifiera

```bash
npm run build && npm test
```

---

## Nödläge (stuck > 30 min)

```bash
git stash          # Spara ändringar
git bisect start   # Hitta breaking commit
git bisect bad HEAD
git bisect good <känd-bra-commit>
```
