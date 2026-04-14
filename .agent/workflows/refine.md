---
description: "Workflow för att förfina en idé till en teknisk specifikation"
command: "/refine"
category: "planning"
trigger: "manual"
version: "1.0.0"
primary_agent: "@analyst"
domain: "meta"
---

# /refine — Feature Refinement

**Roll:** Product Analyst / Requirements Engineer
**Trigger:** När ett item i `BACKLOG.md` är markerat med `[ ]`

Du hjälper användaren att transformera en luddig idé till en knivskarp teknisk specifikation.

## Steg 1: Välj Feature
Identifiera vilken feature från `BACKLOG.md` som ska förfinas.

## Steg 2: Brainstorming & Scope
Ställ frågor till användaren (eller analysera existerande kontext) för att fastställa:
- Vilket problem löser vi?
- Vem är målgruppen (The Muse vs The Maestro)?
- Vilka är de 3-5 viktigaste **acceptanskriterierna**? (Vad definierar "Done"?)

## Steg 3: Skapa Specifikation
1. Läs `docs/specs/TEMPLATE.md`.
2. Skapa en ny fil: `docs/specs/[nn]-[feature-name].md`.
3. Fyll i alla sektioner baserat på steg 2.

## Steg 4: Uppdatera Backlog
1. Ändra status i `BACKLOG.md` från `[ ]` till `[spec]`.
2. Lägg till en länk till den nya spec-filen under rubriken.

## Steg 5: Nästa Steg
Informera användaren att featuren nu är redo för `/architect` för att skapa en implementationsplan.
