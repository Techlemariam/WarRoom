export interface TokenMetadata {
  name: string;
  status: 'FRESH' | 'AGING' | 'STALE';
  health: number;
  last_updated_at: string;
}

export async function getTokenMetrics(): Promise<TokenMetadata[]> {
  const DOPPLER_API_KEY = process.env.DOPPLER_API_KEY;

  if (!DOPPLER_API_KEY) {
    // Fallback mock data for development
    return [
      { name: 'GH_PAT', status: 'FRESH', health: 100, last_updated_at: new Date().toISOString() },
      {
        name: 'SNYK_TOKEN',
        status: 'AGING',
        health: 65,
        last_updated_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        name: 'COOLIFY_WEBHOOK',
        status: 'FRESH',
        health: 95,
        last_updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }

  try {
    const res = await fetch(
      'https://api.doppler.com/v3/configs/config/secrets?project=WarRoom&config=prd',
      {
        headers: {
          Authorization: `Bearer ${DOPPLER_API_KEY}`,
          Accept: 'application/json',
        },
      }
    );

    if (!res.ok) throw new Error('Doppler API Failure');

    const data = await res.json();
    const secrets = data.secrets || {};

    const trackedNames = ['GH_PAT', 'SNYK_TOKEN', 'COOLIFY_WEBHOOK', 'STRIPE_SECRET', 'DO_TOKEN'];

    return Object.keys(secrets)
      .filter((name) => trackedNames.includes(name))
      .map((name) => ({
        name,
        status: 'FRESH',
        health: 100,
        last_updated_at: new Date().toISOString(),
      }));
  } catch (error) {
    console.error('Doppler Sync Failure:', error);
    return [];
  }
}
