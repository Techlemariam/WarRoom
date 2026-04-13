const COOLIFY_API_URL = process.env.COOLIFY_API_URL;
const COOLIFY_API_TOKEN = process.env.COOLIFY_API_TOKEN;

export async function getCoolifyHealth() {
  try {
    const res = await fetch(`${COOLIFY_API_URL}/api/health`, {
      headers: {
        Authorization: `Bearer ${COOLIFY_API_TOKEN}`,
      },
    });
    return res.ok;
  } catch (error) {
    console.error('Coolify health check failed:', error);
    return false;
  }
}

export async function getCoolifyApplications() {
  try {
    const res = await fetch(`${COOLIFY_API_URL}/api/v1/applications`, {
      headers: {
        Authorization: `Bearer ${COOLIFY_API_TOKEN}`,
      },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch Coolify applications:', error);
    return [];
  }
}

export async function getCoolifyServices() {
  try {
    const res = await fetch(`${COOLIFY_API_URL}/api/v1/services`, {
      headers: {
        Authorization: `Bearer ${COOLIFY_API_TOKEN}`,
      },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch Coolify services:', error);
    return [];
  }
}
