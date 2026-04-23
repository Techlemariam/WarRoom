# Brotherhood Environments & Infrastructure

## Project URL Matrix

| Project | Local | Staging (Tailscale) | Production (Tailscale) |
|:--------|:------|:--------------------|:-----------------------|
| **Panopticon (WarRoom)** | `http://localhost:3000` | `https://warroom-staging.tailafb692.ts.net` | `https://warroom.tailafb692.ts.net` |
| **IronForge** | `http://localhost:3001` | `https://ironforge-staging.tailafb692.ts.net` | `https://ironforge.tailafb692.ts.net` |
| **Matlogistik** | `http://localhost:3000` (Vite) + `:3001` (server) | `https://matlogistik-staging.tailafb692.ts.net` | `https://matlogistik.tailafb692.ts.net` |
| **Taktpinne** | `http://localhost:1420` (Tauri) | N/A (Desktop app) | N/A (Desktop app) |

## Infrastructure & Automation

| Service | URL |
|:--------|:----|
| **Coolify Dashboard** | `http://ironforge-coolify.tailafb692.ts.net:8000` |
| **n8n Workflows** | `https://ironforge-coolify.tailafb692.ts.net/home/workflows` |
| **Doppler Secrets** | `https://dashboard.doppler.com/workspaces/panopticon` |

## GitHub Repositories

| Project | Repository |
|:--------|:-----------|
| Panopticon | `https://github.com/Techlemariam/WarRoom` |
| IronForge | `https://github.com/Techlemariam/IronForge` |
| Matlogistik | `https://github.com/Techlemariam/Matlogistik` |
| Taktpinne | `https://github.com/Techlemariam/Taktpinne` |

## Developer Portals

| Portal | URL |
|:-------|:----|
| Discord Bot (Main) | `https://discord.com/developers/applications/1493508595424165979/bot` |
| Discord OAuth | `https://discord.com/developers/applications/1493235518647832606/oauth2` |

## Environment Tiers

| Aspect | Local | Staging | Production |
|:-------|:------|:--------|:-----------|
| Network | localhost | Tailscale mesh | Tailscale mesh |
| Data | SQLite / Mock | Seeded DB | Live DB |
| Secrets | Doppler `dev` | Doppler `stg` | Doppler `prd` |
| Auth | Demo/bypass | Full | Full |

## Key Rules
- `.env` files are **forbidden**. All secrets via Doppler.
- The naming "Panopticon" is the internal name; the repo/URL remains "WarRoom".
- Hetzner CX23 hosts Coolify, n8n, and the VPS runners.
- Tailscale domain: `tailafb692.ts.net`
