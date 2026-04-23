'use client';

import { Lock, RefreshCcw, ShieldCheck } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface TokenMetadata {
  name: string;
  status: 'FRESH' | 'AGING' | 'STALE';
  health: number;
  last_updated_at: string;
}

export default function TokenTracker() {
  const [tokens, setTokens] = useState<TokenMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTokens = useCallback(async () => {
    try {
      const res = await fetch('/api/tokens');
      const data = await res.json();
      if (data.tokens) {
        setTokens(data.tokens);
      }
      setLoading(false);
    } catch (e) {
      console.error('Token sync failure', e);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTokens();
    const interval = setInterval(fetchTokens, 60000);
    return () => clearInterval(interval);
  }, [fetchTokens]);

  if (loading) return null;

  return (
    <div className="card-professional shadow-sm overflow-hidden">
      <div className="p-4 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-wide text-on-surface flex items-center gap-2">
          <Lock size={12} className="text-secondary" />
          Rotation Health
        </h3>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[9px] font-bold text-on-surface-variant/40 uppercase">
            Live monitoring
          </span>
        </span>
      </div>

      <div className="p-5 space-y-5">
        <div className="space-y-4">
          {tokens.map((token) => (
            <div key={token.name} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <div className="text-[11px] font-bold text-on-surface flex items-center gap-2">
                  {token.name}
                  <span
                    className={`text-[8px] px-1.5 py-0.5 rounded-full font-black ${
                      token.status === 'FRESH'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : token.status === 'AGING'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {token.status}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-on-surface-variant/50">
                  {new Date(token.last_updated_at).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>

              <div className="h-1.5 bg-surface-container-high w-full rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    token.health > 80
                      ? 'bg-green-500'
                      : token.health > 40
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${token.health}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={fetchTokens}
          className="w-full py-2.5 border border-outline-variant rounded-md text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60 hover:bg-surface-container hover:text-on-surface transition-all flex items-center justify-center gap-2"
        >
          <RefreshCcw size={12} />
          Force Sync Doppler
        </button>
      </div>
    </div>
  );
}
