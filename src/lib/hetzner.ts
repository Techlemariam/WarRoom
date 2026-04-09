const HETZNER_API_TOKEN = process.env.HETZNER_API_TOKEN;
const HETZNER_SERVER_ID = process.env.HETZNER_SERVER_ID;

export async function getHetznerServers() {
  if (!HETZNER_API_TOKEN) return [];

  try {
    const res = await fetch(`https://api.hetzner.cloud/v1/servers`, {
      headers: {
        Authorization: `Bearer ${HETZNER_API_TOKEN}`,
      },
    });
    if (!res.ok) return [];
    const { servers } = await res.json();
    return servers || [];
  } catch (error) {
    console.error("Failed to fetch Hetzner servers:", error);
    return [];
  }
}

export async function getHetznerServer(id?: string) {
  const targetId = id || HETZNER_SERVER_ID;
  if (!HETZNER_API_TOKEN || !targetId) return null;

  try {
    const res = await fetch(`https://api.hetzner.cloud/v1/servers/${targetId}`, {
      headers: {
        Authorization: `Bearer ${HETZNER_API_TOKEN}`,
      },
    });
    if (!res.ok) return null;
    const { server } = await res.json();
    return server;
  } catch (error) {
    console.error("Failed to fetch Hetzner server status:", error);
    return null;
  }
}

export async function getHetznerMetrics(id?: string) {
  const targetId = id || HETZNER_SERVER_ID;
  if (!HETZNER_API_TOKEN || !targetId) return null;

  try {
    const now = new Date().toISOString();
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const res = await fetch(
      `https://api.hetzner.cloud/v1/servers/${targetId}/metrics?type=cpu,mem,network&start=${oneHourAgo}&end=${now}`,
      {
        headers: {
          Authorization: `Bearer ${HETZNER_API_TOKEN}`,
        },
      }
    );
    if (!res.ok) return null;
    const { metrics } = await res.json();
    return metrics;
  } catch (error) {
    console.error("Failed to fetch Hetzner metrics:", error);
    return null;
  }
}

