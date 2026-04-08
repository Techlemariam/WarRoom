const HETZNER_API_TOKEN = process.env.HETZNER_API_TOKEN;
const HETZNER_SERVER_ID = process.env.HETZNER_SERVER_ID;

export async function getHetznerServer() {
  if (!HETZNER_API_TOKEN || !HETZNER_SERVER_ID) return null;

  try {
    const res = await fetch(`https://api.hetzner.cloud/v1/servers/${HETZNER_SERVER_ID}`, {
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

export async function getHetznerMetrics() {
  if (!HETZNER_API_TOKEN || !HETZNER_SERVER_ID) return null;

  try {
    // Note: Hetzner Cloud API provides metrics through the /metrics endpoint
    // Requires specialized parsing or using the 'type' parameter
    const now = new Date().toISOString();
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const res = await fetch(
      `https://api.hetzner.cloud/v1/servers/${HETZNER_SERVER_ID}/metrics?type=cpu,mem,network&start=${oneHourAgo}&end=${now}`,
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
