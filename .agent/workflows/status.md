---
description: "Skanna projektstatus och rekommendera commit/push/deploy-åtgärder (10/10 Edition)"
command: "/status"
category: "release"
trigger: "manual"
version: "3.0.0"
primary_agent: "@manager"
domain: "meta"
---

# /status — Release Readiness Scanner (10/10)

**Roll:** Release Manager / Quality Lead
**Trigger:** Manuell | Innan push | Innan release

Du är en erfaren Release Manager. Ditt mål är att säkerställa 100% spårbarhet från idé till release och bibehålla en "Zero Red" policy.

## Steg 1-2: Git & Branch Safety
Kontrollera att vi jobbar på rätt ställe och inte har glömt något i "arbetsbyxan".

```powershell
// turbo
git status --short
git branch --show-current
git log --oneline -5
gh pr list --limit 5
```

## Steg 3-5: CI/CD Health & Quality
Kör lokala verifieringar som matchar CI-pipelinen.

```powershell
// turbo
npm run lint
npm run test
# Kontrollera täckning om möjligt
# npx vitest run --coverage
```

## Steg 6: Security Audit (MANDATORY)
Ingen kod går i produktion med kända sårbarheter.

```powershell
// turbo
# Kör Snyk om tillgängligt via verktyg, annars npm audit
npm run security
```
> [!NOTE]
> Som Antigravity bör du också köra `snyk_code_scan` verktyget om det är tillgängligt för att få djupare insikt.

## Steg 7: Gap Analysis (Traceability)
Analysera `BACKLOG.md` och matcha mot `docs/specs/`.

- [ ] **Maturity Check**: Matcha items markerade med `[spec]` mot faktiska filer i `docs/specs/`.
- [ ] **Acceptance Check**: Läs acceptanskriterier i relevanta specs. Är de testbara och finns det täckande tester?

## Steg 8: Infrastructure & Deploy
Kontrollera "verkligheten" i staging/prod.

```powershell
// turbo
# Om coolify-deploy skill finns:
# Använd den för att inspektera senaste status
```

## Steg 9: Feedback Loop (GitHub Issues)
Hämta feedback från bug-rapporter.

```powershell
// turbo
gh issue list --label bug --limit 5
```

## Steg 10: Auto-Sync Documentation
Om du upptäcker att statusen i `BACKLOG.md` är inaktuell:

```powershell
// turbo
git add BACKLOG.md; git commit -m "docs: sync backlog status with specs"
```

## Steg 11: CI/CD Handover (NEW) 🛰️
Hämta status på de senaste körningarna direkt från GitHub för att se "verkligheten" bortom det lokala.

```powershell
// turbo
gh run list --limit 5
```

## Output: Status Dashboard (10/10)

### 📊 System Health Dashboard

| Kontroll | Status | Detaljer |
|:---|:---|:---|
| **Build/Lint** | ✅/❌ | TypeScript / Lint status |
| **QA Gate** | ✅/⚠️ | Test-resultat + täckning |
| **Security** | ✅/🚨 | Snyk / npm audit status |
| **Deploy Status** | ✅/🟡 | Senaste Coolify deploy |
| **Gap Analysis** | ✅/🟠 | Backlog vs Specs coverage |
| **Issues/PRs** | ✅/🚨 | Aktiva buggar / Öppna PRs |
| **CI/CD Pipeline** | ✅/🚨 | Status på senaste GitHub runs |

### 🛰️ Pipeline Handover (Top 3)
*Klistra in resultatet från `gh run list` här i tabellform.*

### 🚀 Release Readiness: [READY / NOT READY]

### 🎯 Rekommenderade Åtgärder
1. **[REFINE]** — Om gap finns: "Kör `/refine` för [Feature]"
2. **[QA]** — Om tester saknas: "Lägg till tester för [Fil]"
3. **[SECURITY]** — Fixa sårbarheter om de hittades.
4. **[RELEASE]** — Om allt är grönt: "Skapa PR develop → main"

### ⚠️ Blockerare
- Lista P0-buggar, build-fel eller säkerhetshål.
