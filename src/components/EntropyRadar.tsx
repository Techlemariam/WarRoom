"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Zap, Activity } from "lucide-react";

export default function EntropyRadar() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/audit");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error("Failed to fetch audit data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // 1min refresh
    (window as any).triggerPulse = fetchData;
    return () => clearInterval(interval);
  }, []);

  const handlePulse = () => {
    setLoading(true);
    fetchData();
  };

  if (loading) return (
    <div className="h-64 glass rounded-[2rem] flex flex-col items-center justify-center gap-4">
      <div className="flex gap-1.5">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
      </div>
      <div className="font-display text-[10px] font-bold tracking-[0.3em] uppercase text-on-surface/30 animate-pulse">Syncing Oracle Sensors</div>
    </div>
  );

  const totalScore = data?.totalScore || 0;
  const vectors = data?.vectors || [];
  const target = 1.5;
  const status = totalScore <= target ? "Stable" : "Drift Alert";

  return (
    <div className="glass p-6 rounded-[2rem] space-y-8 relative overflow-hidden">
      {/* Decorative background pulse */}
      <div className={`absolute -right-16 -top-16 w-48 h-48 rounded-full blur-[100px] transition-colors duration-1000 ${
        totalScore <= target ? "bg-primary/10" : "bg-error/20 animate-pulse"
      }`} />

      <div className="flex justify-between items-start relative z-10">
        <div>
          <h3 className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.2em] mb-2">Confidence Index</h3>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-display font-bold tracking-tighter transition-colors ${
              totalScore <= target ? "text-on-surface" : "text-error"
            }`}>{totalScore.toFixed(1)}</span>
            <span className="text-[10px] text-on-surface-variant/30 uppercase font-bold tracking-widest">/ 10</span>
          </div>
        </div>
        <div className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full shadow-sm ${
          totalScore <= target ? "bg-primary/10 text-primary shadow-primary/5" : "bg-error/10 text-error shadow-error/5"
        }`}>
          {status}
        </div>
      </div>

      <div className="space-y-5 relative z-10">
        {vectors.map((v: any) => (
          <div key={v.name} className="group relative">
            <div className="flex justify-between text-[10px] font-bold tracking-tight mb-2">
              <span className={v.highlight ? "text-primary flex items-center gap-2" : "text-on-surface-variant/60 flex items-center gap-2"}>
                {v.highlight && <Zap size={12} fill="currentColor" className="text-secondary" />}
                {v.name.toUpperCase()}
              </span>
              <span className={`font-mono ${v.score > 1.0 ? "text-error" : "text-on-surface-variant/40"}`}>{v.score.toFixed(1)}</span>
            </div>
            
            <div className="h-2 bg-surface-container-low/40 w-full rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((v.score / 2) * 100, 100)}%` }}
                className={`h-full transition-colors duration-700 ${
                  v.score > 1.2 ? "bg-error" : v.highlight ? "bg-primary shadow-[0_0_12px_rgba(48,100,129,0.3)]" : "bg-on-surface-variant/20"
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-outline/10 flex justify-between items-center relative z-10">
        <div className="flex gap-6">
          <div className="space-y-0.5">
            <div className="text-[9px] font-bold text-on-surface-variant/20 uppercase tracking-widest">Target</div>
            <div className="text-xs font-mono font-bold text-on-surface-variant/40">{target}</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[9px] font-bold text-on-surface-variant/20 uppercase tracking-widest">Variance</div>
            <div className={`text-xs font-mono font-bold ${totalScore <= target ? "text-primary" : "text-error"}`}>
              {totalScore <= target ? `-${(target - totalScore).toFixed(1)}` : `+${(totalScore - target).toFixed(1)}`}
            </div>
          </div>
        </div>
        <button 
          onClick={handlePulse}
          className="p-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant rounded-full transition-all hover:scale-110 active:scale-90 group/btn"
        >
          <Activity size={14} className="group-hover/btn:scale-125 transition-transform" />
        </button>
      </div>
    </div>
  );
}
