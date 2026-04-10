"use client";

import { useState, useEffect } from "react";
import { List, Calendar, ChevronRight, Plus } from "lucide-react";

export default function DecisionLog() {
  const [decisions, setDecisions] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("war-room-decisions");
    if (saved) {
      setDecisions(JSON.parse(saved));
    } else {
      const initial = [
        { date: new Date().toISOString(), title: "REBRANDED TO OVERSIGHT", rationale: "Shifted to corporate-standard stealth layout for office compliance." },
        { date: new Date().toISOString(), title: "MIGRATED FROM NORDIC FROST", rationale: "Decommissioned high-intensity visual system in favor of minimalist professional design." }
      ];
      setDecisions(initial);
      localStorage.setItem("war-room-decisions", JSON.stringify(initial));
    }
  }, []);

  return (
    <div className="card-professional flex flex-col h-[300px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {decisions.map((d, i) => (
          <div key={i} className="pb-4 border-b border-outline-variant last:border-0 last:pb-0">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-on-surface-variant/40 mb-1">
              <Calendar size={10} />
              {new Date(d.date).toLocaleDateString()}
              <div className="h-1 w-1 bg-outline rounded-full" />
              <span>LOG-#{i+1}</span>
            </div>
            <div className="font-bold text-[11px] text-on-surface uppercase mb-1">{d.title}</div>
            <div className="text-[11px] text-on-surface-variant/70 leading-normal">{d.rationale}</div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-outline-variant bg-surface-container-low flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
        <button className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors">
          <ChevronRight size={12} />
          Full Audit Log
        </button>
        <button className="text-primary hover:underline flex items-center gap-1">
          <Plus size={12} />
          New Entry
        </button>
      </div>
    </div>
  );
}
