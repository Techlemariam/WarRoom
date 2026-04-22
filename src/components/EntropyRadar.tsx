'use client';

import { RARITY_COLORS } from '@/lib/rarity';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface AuditVector {
  name: string;
  score: number;
}

interface InfraData {
  totalScore: number;
  vectors: AuditVector[];
  infraScore?: number;
  entropy?: {
    index: number;
    securityScore: number;
  };
}

export default function EntropyRadar() {
  const [data, setData] = useState<InfraData | null>(null);
  const [loading, setLoading] = useState(true);

  const updateMetrics = useCallback(async () => {
    try {
      const res = await fetch('/api/infra');
      const json = await res.json();
      setData(json);
      setLoading(false);
    } catch (e) {
      console.error('Entropy sync failure', e);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    updateMetrics();
    const interval = setInterval(updateMetrics, 30000);
    return () => clearInterval(interval);
  }, [updateMetrics]);

  if (loading)
    return (
      <div className="h-64 card-professional flex flex-col items-center justify-center gap-3">
        <RefreshCcw size={20} className="animate-spin text-on-surface-variant/30" />
        <div className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/40">
          Aggregating Audit Vectors...
        </div>
      </div>
    );

  const totalScore = data?.totalScore || 0;
  const vectors = data?.vectors || [];
  const target = 1.5;
  const isHealthy = totalScore <= target;

  return (
    <div className="card-professional shadow-sm overflow-hidden">
      <div className="p-4 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-wide text-on-surface">
          Compliance Metrics
        </h3>
        <button
          type="button"
          onClick={updateMetrics}
          className="p-1.5 hover:bg-surface-container rounded-sm transition-colors text-on-surface-variant/40 hover:text-primary"
        >
          <RefreshCcw size={14} />
        </button>
      </div>

      <div className="p-5 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-[10px] font-bold text-on-surface-variant/50 uppercase mb-1">
              Confidence Score
            </div>
            <div className="flex items-baseline gap-1.5">
              <span
                className="text-3xl font-bold"
                style={{
                  color: isHealthy ? 'var(--sys-color-on-surface)' : RARITY_COLORS.LEGENDARY,
                }}
              >
                {totalScore.toFixed(1)}
              </span>
              <span className="text-xs text-on-surface-variant/40 font-medium">/ 14.0</span>
            </div>
          </div>
          <div
            className="px-2.5 py-1 text-[10px] font-bold uppercase rounded border transition-colors"
            style={{
              backgroundColor: isHealthy
                ? 'rgba(var(--color-rarity-uncommon-rgb), 0.1)'
                : 'rgba(var(--color-rarity-legendary-rgb), 0.1)',
              color: isHealthy ? RARITY_COLORS.UNCOMMON : RARITY_COLORS.LEGENDARY,
              borderColor: isHealthy
                ? 'rgba(var(--color-rarity-uncommon-rgb), 0.2)'
                : 'rgba(var(--color-rarity-legendary-rgb), 0.2)',
            }}
          >
            {isHealthy ? 'Compliant' : 'Action Required'}
          </div>
        </div>

        <div className="space-y-4">
          {vectors.map((v) => (
            <div key={v.name} className="space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <div className="flex items-center gap-2 font-semibold text-on-surface-variant">
                  {v.name.toUpperCase()}
                  {v.score > 1.2 && (
                    <AlertCircle size={12} style={{ color: RARITY_COLORS.LEGENDARY }} />
                  )}
                </div>
                <div className="font-mono font-bold text-on-surface">{v.score.toFixed(1)}</div>
              </div>

              <div className="h-2 bg-surface-container-high w-full rounded-sm overflow-hidden">
                <div
                  className="h-full transition-all duration-1000"
                  style={{
                    width: `${Math.min((v.score / 2) * 100, 100)}%`,
                    backgroundColor:
                      v.score > 1.5
                        ? RARITY_COLORS.LEGENDARY
                        : v.score > 1.0
                          ? RARITY_COLORS.GOLD
                          : RARITY_COLORS.UNCOMMON,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
