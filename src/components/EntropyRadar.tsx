"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AlertCircle, Zap, ShieldAlert, Info, Activity } from "lucide-react";


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

    // Add handle to window for global pulse
    (window as any).triggerPulse = fetchData;

    return () => clearInterval(interval);
  }, []);

  const handlePulse = () => {
    setLoading(true);
    fetchData();
  };


  if (loading) return <div className="h-48 glass flex items-center justify-center font-mono animate-pulse uppercase">Auditing System Entropy...</div>;

  const totalScore = data?.totalScore || 0;
  const vectors = data?.vectors || [];
  const target = 1.5;
  const status = totalScore <= target ? "Equilibrium" : "Entropy Warning";

  return (
    <div className="glass p-4 space-y-6 relative overflow-hidden">
      {/* Decorative background pulse */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl transition-colors duration-1000 ${
        totalScore <= target ? "bg-success/5" : "bg-error/10 animate-pulse"
      }`} />

      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">CI/CD Entropy Index</h3>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold tracking-tighter transition-colors ${
              totalScore <= target ? "text-white" : "text-error"
            }`}>{totalScore.toFixed(1)}</span>
            <span className="text-[10px] text-text-secondary uppercase font-mono">/ 10.0</span>
          </div>
        </div>
        <div className={`px-2 py-1 text-[9px] font-bold uppercase rounded-sm border ${
          totalScore <= target ? "border-success/30 text-success bg-success/5" : "border-error/30 text-error bg-error/5"
        }`}>
          {status}
        </div>
      </div>

      <div className="space-y-4">
        {vectors.map((v: any) => (
          <div key={v.name} className="group relative">
            <div className="flex justify-between text-[9px] font-mono font-bold mb-1">
              <span className={v.highlight ? "text-accent flex items-center gap-1" : "text-text-secondary flex items-center gap-1"}>
                {v.highlight && <Zap size={10} />}
                {v.name.toUpperCase()}
                {v.findings?.length > 0 && <Info size={10} className="text-warning cursor-help" />}
              </span>
              <span className={v.score > 1.0 ? "text-error" : ""}>{v.score.toFixed(1)}</span>
            </div>
            
            <div className="h-1 bg-surface/50 w-full rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(v.score / 2) * 100}%` }}
                className={`h-full transition-colors ${
                  v.score > 1.2 ? "bg-error" : v.highlight ? "bg-accent" : "bg-text-secondary/40"
                }`}
              />
            </div>

            {/* Tooltip for findings */}
            {v.findings?.length > 0 && (
              <div className="absolute left-0 -top-8 bg-surface border border-border p-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-sm shadow-xl">
                {v.findings.map((f: string, i: number) => (
                  <div key={i} className="text-[8px] text-warning whitespace-nowrap uppercase font-mono">• {f}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-border flex justify-between items-center bg-surface/20 -mx-4 -mb-4 p-4 mt-2">
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-[8px] text-text-secondary uppercase">Target</div>
            <div className="text-xs font-mono font-bold">{target}</div>
          </div>
          <div className="text-center">
            <div className="text-[8px] text-text-secondary uppercase">Variance</div>
            <div className={`text-xs font-mono font-bold ${totalScore <= target ? "text-success" : "text-error"}`}>
              {totalScore <= target ? `-${(target - totalScore).toFixed(1)}` : `+${(totalScore - target).toFixed(1)}`}
            </div>
          </div>
        </div>
        <button 
          onClick={handlePulse}
          className="text-[10px] font-bold text-accent uppercase hover:underline decoration-2 underline-offset-4 flex items-center gap-1 group/btn"
        >
          <Activity size={10} className="group-hover/btn:animate-spin" />
          Pulse Scan
        </button>
      </div>
    </div>
  );
}

