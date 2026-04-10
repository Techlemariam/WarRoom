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
    // Implementing a 5-minute buffer to account for Hetzner metrics lag.
    // If we poll "now", the pipeline often returns 0 because aggregation hasn't finished.
    const now = Date.now();
    const end = new Date(now - 5 * 60 * 1000).toISOString();
    const start = new Date(now - 35 * 60 * 1000).toISOString();
    
    const res = await fetch(
      `https://api.hetzner.cloud/v1/servers/${targetId}/metrics?type=cpu,mem,network&start=${start}&end=${end}`,
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

