---
description: Brotherhood Brain Audit workflow for scanning and compiling ongoing tasks across all Antigravity conversations.
command: "/brain-audit"
category: "persona"
trigger: "manual"
version: "2.0.0"
primary_agent: "@librarian"
domain: "meta"
skills: ["knowledge-distillation", "task-aggregation"]
---

# 🧠 Brotherhood Brain Audit (Memory Aggregation)

The Brain Audit workflow is designed to scan the local AI memory (Antigravity's Brain) to identify, extract, and compile all ongoing, blocked, or uncompleted tasks across the entire Brotherhood ecosystem (IronForge, Taktpinne, Matlogistik, Panopticon).

## 🧭 Core Responsibilities

1. **Memory Retrieval**: Rapidly query recent conversation tasks via `scripts/brain-scanner.ps1`.
2. **Context Enrichment**: Map identified tasks to their respective Brotherhood projects.
3. **Cross-Project Aggregation**: Structure the findings into a cohesive, global backlog.

## 🛠️ Operational Protocol

### 1. Run Brain Scanner
Execute the PowerShell script to retrieve a JSON payload of all open tasks from the last 14 days (or customized timeframe).
```powershell
# Default scan (last 14 days)
.\scripts\brain-scanner.ps1

# Extended scan (if needed)
.\scripts\brain-scanner.ps1 -Days 30
```

### 2. Analyze Output
Review the JSON output. The data contains Uncompleted `[ ]` and In-Progress `[/]` tasks.
- If context is missing, briefly inspect the relevant `uuid/.../overview.txt` or `uuid/implementation_plan.md` to map the tasks to a specific project (e.g., Taktpinne, IronForge).
- **IMPORTANT**: Cross-reference tasks with any applicable Knowledge Items (KIs) to see if a task has already been resolved elsewhere before flagging it.

### 3. Generate Audit Report
Compile a comprehensive artifact inside the current conversation's root named `brain_backlog_audit.md`.
The structure must be:
- **Date & Scanner Parameters** (e.g., "Scanning last 14 days")
- **Categorized Open Tasks** by Project.
- **Blocked/Stagnant Operations** (if any context suggests the AI stopped due to an error or missing review).
- **Recommended Next Steps** for the user.

### 4. Sync to Local Backlog (Hybrid Model)
After generating the report, you MUST synchronize the findings to the respective project's `BACKLOG.md` file.
- Format the findings as actionable items (e.g., `- [ ] Fix webhook integration`).
- Append them under a `## 🧠 Brain Audit Findings` section in the target project's `BACKLOG.md`.
- This ensures WarRoom can accurately calculate the "Task Debt" vector across the ecosystem.

---
// Brain Audit Dispatch
1. Run `.\scripts\brain-scanner.ps1`
2. Analyze the aggregate output and group the tasks by Project (IronForge, Taktpinne, etc).
3. Format and output the final `brain_backlog_audit.md` artifact.
4. Synchronize the open tasks `[ ]` to the `BACKLOG.md` files of the affected projects.
