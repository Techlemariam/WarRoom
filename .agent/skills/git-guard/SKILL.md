---
name: git-guard
description: Hindrar oavsiktliga commits direkt till main-branchen (portad från IronForge)
version: 1.0.0
category: guard
owner: "@infrastructure"
platforms: ["windows", "linux", "macos"]
requires: []
rules:
  - "Aldrig committa direkt till main"
  - "Staging Fast-Track uppmuntras: Pusha direkt till develop för snabba tester"
  - "Main är THE ZERO-HELL GATE (Endast Gröna PRs + Jules Review)"
  - "Review Gate: Alla projekt MÅSTE passera \`npm run agent:verify\` innan Jules/Manager släpper in det"
  - "Branch-namn för PR Previews ska vara beskrivande (t.ex feat/ombyggnad)"
---

# 🛡️ Git Guard (WarRoom)

Blockerar arbete direkt på `main`. Alltid kör detta i början av en session.

## När ska du använda den?

- Innan du börjar implementera något (för att fly från main).
- När du ska testa på Coolify Staging -> `git checkout develop && git push`
- Som pre-flight check *innan* du ropar på Jules för PR Review: kör alltid `npm run agent:verify` först!

## Kör

```bash
# Bash / Git Bash
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" = "main" ]; then
  echo "⛔ ERROR: Du är på 'main'. Arbete sker mot 'develop'. Skapa en feature-branch!"
  exit 1
fi
echo "✅ Branch: $current_branch"
```

```powershell
# PowerShell
$branch = git rev-parse --abbrev-ref HEAD
if ($branch -eq "main") {
  Write-Error "⛔ Du är på 'main'. Arbete sker mot 'develop'. Skapa en feature-branch!"
  exit 1
}
Write-Host "✅ Branch: $branch" -ForegroundColor Green
```

## Branch-namnkonventioner

| Prefix | Användning |
|:---|:---|
| `develop` | **Staging Fast-Track**: Direkta pushar (Ingen PR krävs). Bygger på Coolify. |
| `feat/` | Ny STÖRRE feature (PR Preview + Jules Review krävs) |
| `fix/` | Buggfix |
| `chore/` | Underhåll/refactoring |

## Exempel

> Läs `.agent/knowledge/agent_deploy_workflows/artifacts/readme.md` för hela flödet.

```bash
git checkout develop
git checkout -b feat/tauri-updater-endpoint
git checkout -b fix/midi-sysex-timeout
git checkout -b chore/upgrade-rust-deps
```
