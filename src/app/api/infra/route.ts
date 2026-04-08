import { getCoolifyHealth, getCoolifyApplications } from "@/lib/coolify";
import { getHetznerServer, getHetznerMetrics } from "@/lib/hetzner";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [coolifyHealth, coolifyApps, hetznerServer, hetznerMetrics] = await Promise.all([
      getCoolifyHealth(),
      getCoolifyApplications(),
      getHetznerServer(),
      getHetznerMetrics(),
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
