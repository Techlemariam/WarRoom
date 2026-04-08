"use client";

import { motion } from "framer-motion";

export default function RevenueRadar() {
  const current = 0;
  const target = 40000;
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className="glass p-4 space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-xs font-bold text-text-secondary uppercase">Monthly Revenue</h3>
          <div className="text-2xl font-bold tracking-tighter">
            {current.toLocaleString()} <span className="text-xs text-text-secondary">SEK</span>
          </div>
        </div>
        <div className="text-right text-[10px] font-mono text-accent uppercase">
          Target: {target.toLocaleString()}
        </div>
      </div>

      <div className="relative h-2 bg-surface overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className="absolute top-0 left-0 h-full bg-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="glass bg-surface/30 p-2 text-center">
          <div className="text-[9px] text-text-secondary uppercase">IronForge</div>
          <div className="text-xs font-bold">0%</div>
        </div>
        <div className="glass bg-surface/30 p-2 text-center">
          <div className="text-[9px] text-text-secondary uppercase">Taktpinne</div>
          <div className="text-xs font-bold">0%</div>
        </div>
      </div>
    </div>
  );
}
