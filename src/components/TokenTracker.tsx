"use client";

import { useState } from "react";
import { CreditCard, TrendingUp, BarChart3, Info } from "lucide-react";

export default function TokenTracker() {
  const [quota] = useState(1000000); // 1M tokens
  const [used] = useState(154300);   // 154.3k used
  const [burnRate] = useState(12.4); // tokens/sec

  const percent = (used / quota) * 100;

  return (
    <div className="card-professional shadow-sm overflow-hidden">
      <div className="p-4 bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard size={14} className="text-secondary" />
          <span className="text-xs font-bold uppercase tracking-wide text-on-surface">Usage Quota</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[9px] font-bold rounded-sm border border-green-200 dark:border-green-800">
          STATUS: ACTIVE
        </div>
      </div>

      <div className="p-5 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase">Current Consumption</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-on-surface">{(used / 1000).toFixed(1)}k</span>
              <span className="text-xs text-on-surface-variant/40 ml-1">/ 1M</span>
            </div>
          </div>
          <div className="h-2.5 bg-surface-container-high w-full rounded-sm overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-1000"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-outline-variant pt-5">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-on-surface-variant/40 uppercase">
              <TrendingUp size={12} />
              Throughput
            </div>
            <div className="text-sm font-bold text-on-surface">
              {burnRate} <span className="text-[10px] opacity-40 font-medium">tokens / s</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-on-surface-variant/40 uppercase">
              <BarChart3 size={12} />
              Forecast
            </div>
            <div className="text-sm font-bold text-on-surface">
              78 <span className="text-[10px] opacity-40 font-medium">days remaining</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-surface-container border-t border-outline-variant flex items-center gap-2 text-[10px] text-on-surface-variant/50">
        <Info size={12} />
        Efficiency: <span className="text-primary font-bold">98.1%</span>
        <span className="mx-auto" />
        <button className="hover:underline font-bold uppercase tracking-tighter">View logs</button>
      </div>
    </div>
  );
}
