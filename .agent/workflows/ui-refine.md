---
description: "Workflow for UI/UX refinement using Stitch & Nordic Frost"
command: "/ui-refine"
category: "workflow"
---

# 🎨 UI Refinement Workflow (Nordic Frost)

**Goal:** Ensure the React codebase matches the "Nordic Frost" design system defined in Stitch.

## 🧠 Core Philosophy

"Nordic Frost is about Architectural Serenity. It relies on Extreme Whitespace, Asymmetry, and Tonal Layering. Borders are strictly forbidden for sectioning."

## 📋 The 4-Phase Process

### Phase 1: Component Audit

Välj ut en komponent eller view. Granska den mot The Nordic Frost Checklist:
- **No-Line Rule**: Inga solida 1px borders tillåts (`border`, `border-t`, etc.). All separering av sektioner sker med färg (t.ex. `bg-surface` vs `bg-surface-container-low`) eller generöst vertical padding (24-32px).
- **Ghost Borders**: Om borders MÅSTE användas för data-tabeller, måste de vara `outline-variant` eller använda opacity.
- **Glassmorphism**: Flytande element (menyer, HUDs) MÅSTE använda backdrop-blur (`backdrop-blur-md` -> `backdrop-blur-xl`) samt vara lätt genomskinliga.
- **Typografi**: Rubriker (Displays/Headlines) ska använda Space Grotesk (`font-display`). Body/Text ska använda Inter (`font-body`). Metadata ska använda Space Grotesk (`font-label`, uppercase).
- **Radii**: Card-borders är alltid `rounded-lg` (8px). Knappar är pill-shape (`rounded-full`). Inga 90-graders hörn om de inte är system-paneler.

### Phase 2: Refactoring

När du har granskat en komponent, bygg om Tailwind-klasserna för att matcha reglerna.
Använd endast variabler från `tokens.css`, till exempel:
- `bg-[var(--sys-color-surface)]`
- `text-[var(--sys-color-on-surface)]`
- `bg-[var(--sys-color-primary)]`

*OBS: Undvik att använda ad-hoc HEX koder. Allt ska komma från `--sys-color-*`.*

### Phase 3: Muse Validation

Innan komponenten är klar, ställ frågan till `/muse` (din inre musik-regissör):
"Fungerar detta live? Är det läsbart från 2 meter bort på en scen? Måste artisten ta händerna från basen?"

### Phase 4: E2E Regression

Kör Playwright eller titta visuellt för att verifiera att vi inte har krossat existerande funktionalitet.

---

## 🚀 Execution Template

When asked to run `/ui-refine` on `ComponentX.tsx`, use this exact prompt structure in your thought process:

1. "Audit av ComponentX: [Hittade fel mot No-Line Rule, Fel Font]"
2. "Planerad Refactor: [Byter från border till background shifts, applicerar sys-colors]"
3. "Muse Validation: [Är detta mörkt/kallt/läsbart nog?]"
4. Fixa filen!
