import { getCoolifyHealth, getCoolifyApplications } from "@/lib/coolify";
import { getHetznerServer, getHetznerMetrics, getHetznerServers } from "@/lib/hetzner";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    let hetznerId = process.env.HETZNER_SERVER_ID;
    
    // If no ID is provided, try to discover one
    if (!hetznerId) {
      const servers = await getHetznerServers();
      if (servers && servers.length > 0) {
        hetznerId = servers[0].id.toString();
      }
    }

    const [coolifyHealth, coolifyApps, hetznerServer, hetznerMetrics] = await Promise.all([
      getCoolifyHealth(),
      getCoolifyApplications(),
      hetznerId ? getHetznerServer(hetznerId) : Promise.resolve(null),
      hetznerId ? getHetznerMetrics(hetznerId) : Promise.resolve(null),
    ]);

    return NextResponse.json({
      coolify: {
        healthy: coolifyHealth,
        apps: coolifyApps,
      },
      hetzner: {
        server: hetznerServer,
        metrics: hetznerMetrics,
      },
    });
  } catch (error: any) {
    console.error("Audit sensor error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

