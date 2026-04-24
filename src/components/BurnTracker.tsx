'use client';

import { Activity, User, Zap } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface BurnSummary {
  todayTotal: number;
  burnScore: number;
  status: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  perUser: Record<string, number>;
}

export default function BurnTracker() {
  const [summary, setSummary] = useState<BurnSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch('/api/token-burn');
      const data = await res.json();
      setSummary(data);
      setLoading(false);
    } catch (e) {
      console.error('Burn fetch failure', e);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, 30000);
    return () => clearInterval(interval);
  }, [fetchSummary]);

  if (loading || !summary) return null;

  return (
    <div className="card-professional shadow-sm overflow-hidden">
      <div className="p-4 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-wide text-on-surface flex items-center gap-2">
          <Zap size={12} className="text-primary" />
          AI Token Burn
        </h3>
        <span
          className={`text-[9px] px-2 py-0.5 rounded-full font-black ${
            summary.status === 'LOW'
              ? 'bg-green-100 text-green-700'
              : summary.status === 'MODERATE'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-red-100 text-red-700'
          }`}
        >
          {summary.status}
        </span>
      </div>

      <div className="p-5 space-y-6">
        {/* Total Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-medium text-on-surface-variant/60 uppercase">
              Today's Consumption
            </span>
            <span className="text-sm font-black text-on-surface">
              {summary.todayTotal.toLocaleString()} <span className="text-[10px] font-normal text-on-surface-variant/40">/ 500k</span>
            </span>
          </div>
          <div className="h-2 bg-surface-container-high w-full rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                summary.burnScore < 0.8
                  ? 'bg-primary'
                  : summary.burnScore < 1.5
                    ? 'bg-amber-500'
                    : 'bg-red-500'
              }`}
              style={{ width: `${(summary.todayTotal / 500000) * 100}%` }}
            />
          </div>
        </div>

        {/* User Breakdown */}
        <div className="space-y-3">
          <h4 className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant/40 flex items-center gap-1.5">
            <User size={10} />
            Breakdown per User
          </h4>
          <div className="space-y-2">
            {Object.entries(summary.perUser).map(([user, tokens]) => (
              <div key={user} className="flex justify-between items-center bg-surface-container/30 p-2 rounded border border-outline-variant/30">
                <div className="flex items-center gap-2 max-w-[70%]">
                  <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-primary">
                    {user.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[10px] font-bold text-on-surface truncate" title={user}>
                    {user.split('@')[0]}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-on-surface-variant">
                  {tokens.toLocaleString()}
                </span>
              </div>
            ))}
            {Object.keys(summary.perUser).length === 0 && (
              <div className="text-[10px] italic text-on-surface-variant/40 text-center py-2">
                No data logged yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
