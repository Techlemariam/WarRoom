# 🛰️ Gemini Brotherhood: Ecosystem Environments

> [!NOTE]
> This is the Technical Ground Truth (TGT) for all environment URLs and internal tools within the Brotherhood hierarchy. Standardized on **Tailscale (TS)** networking.

## 🏛️ Project Matrix

| Project | Status | Local Development | Staging (Tailscale) | Production (Tailscale) |
| :--- | :--- | :--- | :--- | :--- |
| **Panopticon** | 🟢 Active | `http://localhost:3000` | `https://warroom-staging.tailafb692.ts.net` | `https://warroom.tailafb692.ts.net` |
| **IronForge** | 🟢 Active | `http://localhost:3001` | `https://ironforge-staging.tailafb692.ts.net` | `https://ironforge.tailafb692.ts.net` |
| **Matlogistik**| 🟢 Active | `http://localhost:3000` | `https://matlogistik-staging.tailafb692.ts.net`| `https://matlogistik.tailafb692.ts.net` |
| **Taktpinne** | 🟡 Rehab | `http://localhost:1420` | `N/A (Tauri Desktop)` | `N/A (GitHub Releases)` |

---

## 🛠️ Infrastructure & Automation

Centralized management tools for orchestration, secrets, and automated workflows.

| Tool | URL | Focus |
| :--- | :--- | :--- |
| **Coolify** | [Dashboard](http://ironforge-coolify.tailafb692.ts.net:8000) | Infrastructure & App Management |
| **n8n** | [Workflows](https://ironforge-coolify.tailafb692.ts.net/home/workflows) | Cross-Project Automation |
| **Doppler** | [Secret Ops](https://dashboard.doppler.com/workspaces/panopticon) | Universal Secret Management |
| **Hetzner** | [Console](https://console.hetzner.cloud) | Bare Metal & Cloud Nodes |

---

## 📚 Technical Resource Center

### GitHub Repositories
Access to the original source code and issue trackers.

- [Panopticon (Oracle)](https://github.com/Techlemariam/WarRoom)
- [IronForge (RPG)](https://github.com/Techlemariam/IronForge)
- [Matlogistik (Food)](https://github.com/Techlemariam/Matlogistik)
- [Taktpinne (Music)](https://github.com/Techlemariam/Taktpinne)

### Developer Portals
Configuration and API management for third-party integrations.

- **Discord Application (Main)**: [Bot/Portal](https://discord.com/developers/applications/1493508595424165979/bot)
- **Discord OAuth (Legacy)**: [OAuth2 Portal](https://discord.com/developers/applications/1493235518647832606/oauth2)

---

## 🛡️ Environment Characteristics

| Layer | Network | Data Persistence | Auth Mode |
| :--- | :--- | :--- | :--- |
| **Local** | Localhost | SQLite / Local Mock | Dev/Mock |
| **Staging** | Tailscale | Production Clone (Snapshot) | Production Auth |
| **Production**| Tailscale | Live Production DB | Full RBAC |

---
**Version:** 1.1.0 
**Last Audit:** 2026-04-14 (by @librarian)
