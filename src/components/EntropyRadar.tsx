'use client';

import { AlertCircle, CheckCircle2, Info, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function EntropyRadar() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const defaultLogs = [
    { label: 'Infrastructure', value: 85, full: 100 },
    { label: 'CI/CD Entropy', value: 65, full: 100 },
    { label: 'Sec-Vector', value: 45, full: 100 },
    { label: 'Financial Drift', value: 30, full: 100 },
    { label: 'Latent Tech Debt', value: 55, full: 100 },
  ];

  const [auditData, setAuditData] = useState(defaultLogs);

  const updateMetrics = async () => {
    try {
      const res = await fetch('/api/infra');
      const data = await res.json();

      if (data.entropy) {
        setAuditData([
          { label: 'Infrastructure', value: data.infraScore || 85, full: 100 },
          { label: 'CI/CD Entropy', value: data.entropy.index * 10 || 65, full: 100 },
          { label: 'Sec-Vector', value: data.entropy.securityScore || 45, full: 100 },
          { label: 'Financial Drift', value: 30, full: 100 },
          { label: 'Latent Tech Debt', value: 55, full: 100 },
        ]);
      }
      setLoading(false);
    } catch (e) {
      console.error('Entropy sync failure', e);
      setLoading(false);
    }
  };

  useEffect(() => {
    updateMetrics();
    const interval = setInterval(updateMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

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
                className={`text-3xl font-bold ${isHealthy ? 'text-on-surface' : 'text-error'}`}
              >
                {totalScore.toFixed(1)}
              </span>
              <span className="text-xs text-on-surface-variant/40 font-medium">/ 10.0</span>
            </div>
          </div>
          <div
            className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded border ${
              isHealthy
                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:border-red-800'
            }`}
          >
            {isHealthy ? 'Compliant' : 'Action Required'}
          </div>
        </div>

        <div className="space-y-4">
          {vectors.map((v: any) => (
            <div key={v.name} className="space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <div className="flex items-center gap-2 font-semibold text-on-surface-variant">
                  {v.name.toUpperCase()}
                  {v.score > 1.2 && <AlertCircle size={12} className="text-error" />}
                </div>
                <div className="font-mono font-bold text-on-surface">{v.score.toFixed(1)}</div>
              </div>

              <div className="h-2 bg-surface-container-high w-full rounded-sm overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    v.score > 1.5 ? 'bg-error' : v.score > 1.0 ? 'bg-amber-400' : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min((v.score / 2) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 bg-surface-container-low border-t border-outline-variant grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Info size={12} className="text-on-surface-variant/40" />
          <span className="text-[10px] text-on-surface-variant/60">
            Target Threshold: <strong>{target}</strong>
          </span>
        </div>
        <div className="text-right text-[10px] text-on-surface-variant/60">
          Variance:{' '}
          <strong className={isHealthy ? 'text-primary' : 'text-error'}>
            {isHealthy
              ? `-${(target - totalScore).toFixed(1)}`
              : `+${(totalScore - target).toFixed(1)}`}
          </strong>
        </div>
      </div>
    </div>
  );
}
