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
export async function deployApplication(uuid: string) {
  try {
    const res = await fetch(`${COOLIFY_API_URL}/api/v1/applications/${uuid}/deploy`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${COOLIFY_API_TOKEN}`,
      },
    });
    if (!res.ok) {
      const error = await res.text();
      console.error(`Coolify deploy failed for ${uuid}:`, error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Failed to trigger Coolify deployment:', error);
    return false;
  }
}
