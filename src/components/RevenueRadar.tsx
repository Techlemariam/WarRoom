'use client';

import { TrendingUp } from 'lucide-react';

export default function RevenueRadar() {
  const current = 0;
  const target = 40000;
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-wider">
            Net Revenue (Monthly)
          </h3>
          <div className="text-xl font-bold text-on-surface">
            {current.toLocaleString()}{' '}
            <span className="text-[10px] font-medium opacity-40">SEK</span>
          </div>
        </div>
        <div className="text-right text-[10px] font-bold text-primary uppercase">
          Target: {target.toLocaleString()}
        </div>
      </div>

      <div className="relative h-1.5 bg-surface-container-high rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-surface-container-low border border-outline-variant p-2 rounded-sm text-center">
          <div className="text-[9px] text-on-surface-variant/50 uppercase font-bold">IronForge</div>
          <div className="text-[11px] font-bold text-on-surface">0%</div>
        </div>
        <div className="bg-surface-container-low border border-outline-variant p-2 rounded-sm text-center">
          <div className="text-[9px] text-on-surface-variant/50 uppercase font-bold">Taktpinne</div>
          <div className="text-[11px] font-bold text-on-surface">0%</div>
        </div>
      </div>
    </div>
  );
}
