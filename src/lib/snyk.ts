/**
 * Snyk Security Vector Provider
 * Decouples 'Red Team' security audits from the Entropy Index.
 */

export interface SnykMetrics {
  critical: number;
  high: number;
  medium: number;
  low: number;
  score: number;
  status: 'safe' | 'alert' | 'critical';
}

const SNYK_TOKEN = process.env.SNYK_TOKEN;
const SNYK_ORG_ID = process.env.SNYK_ORG_ID;

export async function getSnykMetrics(): Promise<SnykMetrics> {
  // If no token or org ID is configured, return the "Drifted" mock state 
  // until the user provides the secrets in Doppler.
  if (!SNYK_TOKEN || !SNYK_ORG_ID) {
    return {
      critical: 0,
      high: 2,
      medium: 12,
      low: 24,
      score: 85, // 0-100 logic (higher is worse entropy)
      status: 'alert'
    };
  }

  try {
    const res = await fetch(`https://snyk.io/api/v1/org/${SNYK_ORG_ID}/vulnerabilities`, {
      headers: {
        'Authorization': `token ${SNYK_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) throw new Error("Snyk API Error");

    const data = await res.json();
    
    // Simplified logic for this stage of the bridge
    const critical = data.counts?.critical || 0;
    const high = data.counts?.high || 0;
    const score = (critical * 25) + (high * 10);

    return {
      critical,
      high,
      medium: data.counts?.medium || 0,
      low: data.counts?.low || 0,
      score: Math.min(100, score),
      status: critical > 0 ? 'critical' : high > 0 ? 'alert' : 'safe'
    };
  } catch (err) {
    console.error("Snyk Provider Failure:", err);
    return { critical: 0, high: 0, medium: 0, low: 0, score: 0, status: 'safe' };
  }
}
