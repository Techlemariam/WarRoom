"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

export default function TokenTracker() {
  const [data, setData] = useState<any>(null);
  
  // Static state for now
  const monthlyBudget = 1000000;
  const currentUsage = 154200;
  const percentage = (currentUsage / monthlyBudget) * 100;

  return (
    <div className="glass p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-warning" />
          <h3 className="text-xs font-bold uppercase">Token Consumption</h3>
        </div>
        <div className="text-[10px] font-mono text-text-secondary uppercase">
          Month/April
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-mono">
          <span className="text-text-secondary">USAGE</span>
          <span>{currentUsage.toLocaleString()} / 1M</span>
        </div>
        <div className="w-full bg-surface h-1.5 overflow-hidden">
          <div className="bg-warning h-full" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>

      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          <div className="text-[9px] text-text-secondary uppercase mb-1">Efficiency</div>
          <div className="text-sm font-bold font-mono text-success">94.2%</div>
        </div>
        <div className="flex-1 text-right">
          <div className="text-[9px] text-text-secondary uppercase mb-1">Est. Cost</div>
          <div className="text-sm font-bold font-mono">$1.54</div>
        </div>
      </div>
    </div>
  );
}
