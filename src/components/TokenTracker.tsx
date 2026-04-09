"use client";

import { useEffect, useState } from "react";
import { Zap, AlertTriangle, TrendingUp } from "lucide-react";

export default function TokenTracker() {
  const [usage, setUsage] = useState(154200);
  const [burnRate, setBurnRate] = useState(12.4); // tokens/sec simulated
  
  const monthlyBudget = 1000000;
  
  useEffect(() => {
    const interval = setInterval(() => {
      setUsage(prev => prev + Math.floor(Math.random() * 5));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const percentage = (usage / monthlyBudget) * 100;
  const daysRemaining = Math.floor((monthlyBudget - usage) / (burnRate * 60 * 60 * 24) * 100);

  return (
    <div className="glass p-4 space-y-4 relative overflow-hidden group">
      {/* Warning Overlay for missing keys */}
      <div className="absolute top-2 right-2 flex items-center gap-1 text-[8px] font-bold text-warning uppercase bg-warning/10 px-1.5 py-0.5 rounded-full border border-warning/20">
        <AlertTriangle size={8} />
        Keys Missing
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-warning group-hover:animate-pulse" />
          <h3 className="text-xs font-bold uppercase">Token Consumption</h3>
        </div>
        <div className="text-[10px] font-mono text-text-secondary uppercase">
          FORECAST: ACTIVE
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-mono">
          <span className="text-text-secondary">MONTHLY QUOTA</span>
          <span className="text-white">{(usage / 1000).toFixed(1)}k / 1M</span>
        </div>
        <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden border border-border/50">
          <div 
            className="bg-warning h-full transition-all duration-1000" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-[8px] text-text-secondary uppercase">Burn Rate</div>
          <div className="flex items-center gap-1">
            <TrendingUp size={10} className="text-success" />
            <span className="text-xs font-bold font-mono">~{burnRate} t/s</span>
          </div>
        </div>
        <div className="space-y-1 text-right">
          <div className="text-[8px] text-text-secondary uppercase">Est. Exhaustion</div>
          <div className="text-xs font-bold font-mono text-warning">{daysRemaining} DAYS</div>
        </div>
      </div>

      <div className="pt-3 border-t border-border/50 flex justify-between items-center">
        <div className="text-[10px] font-mono text-text-secondary uppercase">
          EFFICIENCY: <span className="text-success">98.1%</span>
        </div>
        <button className="text-[9px] font-bold text-accent uppercase hover:underline">
          View Logs
        </button>
      </div>
    </div>
  );
}

