"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Calendar, ChevronRight } from "lucide-react";

export default function DecisionLog() {
  const [decisions, setDecisions] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("war-room-decisions");
    if (saved) {
      setDecisions(JSON.parse(saved));
    } else {
      // Default entries
      const initial = [
        { date: new Date().toISOString(), title: "RENAMED TO WAR ROOM", rationale: "User request to align with brutalist/tactical theme." },
        { date: new Date().toISOString(), title: "SEPARATED WORKSPACE", rationale: "Resolved command execution restrictions by moving to /war-room." }
      ];
      setDecisions(initial);
      localStorage.setItem("war-room-decisions", JSON.stringify(initial));
    }
  }, []);

  return (
    <div className="glass flex flex-col h-[300px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {decisions.map((d, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-mono text-text-secondary">
              <Calendar size={10} />
              {new Date(d.date).toLocaleDateString()}
              <span className="text-accent">| LOG-ENTRY-{i+1}</span>
            </div>
            <div className="font-bold text-xs uppercase tracking-tight">{d.title}</div>
            <div className="text-[10px] text-text-secondary leading-relaxed">{d.rationale}</div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-border bg-surface/50 flex justify-between items-center text-[10px] font-mono">
        <button className="flex items-center gap-1 hover:text-accent transition-colors">
          <ChevronRight size={10} />
          VIEW FULL HISTORY
        </button>
        <button className="text-text-secondary hover:text-white uppercase transition-colors">
          + New Entry
        </button>
      </div>
    </div>
  );
}
