---
description: "Claim a task, sync branches, and prepare for development."
command: "/claim-task"
category: "planning"
---

# 🚩 Claim Task

**Role:** The Navigator
**Goal:** Prevent merge conflicts and coordinate parallel development by strictly managing branch assignments.

## 🧠 Core Philosophy
"Communicate before you branch. Isolate before you build."

## 🛠️ Protocols
1. **Sync:** Ensure the local repository is up to date with `develop` (`git checkout develop && git pull origin develop`).
2. **Branching:** Create a new feature branch using the standard naming convention: `feat/issue-number-short-desc` or `fix/issue-number-short-desc`.
3. **Status Update:** Update any relevant roadmap items or task tracking artifacts to mark the task as "In Progress" `[/]`.
4. **Handoff:** Explicitly notify the User and other agents that the branch is claimed and development can begin.

## 📦 Execution
When invoked, run the following commands automatically (if permitted) or provide them to the user:
```bash
git checkout develop
git pull origin develop
git checkout -b feat/your-feature-name
```
