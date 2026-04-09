"use client";

import { useEffect, useState } from "react";
import { Play, Search, Filter, Loader2, CheckCircle, XCircle, Zap, ShieldAlert } from "lucide-react";

export default function WorkflowConsole() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [auditData, setAuditData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [wfRes, auditRes] = await Promise.all([
          fetch("/api/workflows"),
          fetch("/api/audit")
        ]);
        const wfData = await wfRes.json();
        const aData = await auditRes.json();
        
        setWorkflows(wfData);
        setAuditData(aData);
      } catch (e) {
        console.error("Failed to fetch workflows", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleRun(workflow: any) {
    const id = `${workflow.repo}-${workflow.command}`;
    setRunning(prev => ({ ...prev, [id]: true }));
    
    try {
      const owner = workflow.repo === 'IronForge' ? 'Techlemariam' : 'Techlemariam';
      const res = await fetch("/api/dispatch", {
        method: "POST",
        body: JSON.stringify({
          owner,
          repo: workflow.repo,
          command: workflow.command
        })
      });
      
      if (res.ok) {
        setTimeout(() => setRunning(prev => ({ ...prev, [id]: false })), 2000);
      } else {
        setRunning(prev => ({ ...prev, [id]: false }));
      }
    } catch (e) {
      setRunning(prev => ({ ...prev, [id]: false }));
    }
  }

  // Pre-process recommendations
  const enrichedWorkflows = workflows.map(w => {
    const hasDrift = auditData?.vectors?.find((v: any) => v.name === 'IaC/Drift')?.findings?.some((f: string) => f.includes(w.repo));
    const isRecommended = hasDrift && (w.command.toLowerCase().includes('infra') || w.command.toLowerCase().includes('docker') || w.command.toLowerCase().includes('tokens'));
    return { ...w, isRecommended };
  }).sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0));

  const filtered = enrichedWorkflows.filter(w => 
    w.command.toLowerCase().includes(search.toLowerCase()) || 
    w.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="h-64 glass rounded-3xl flex items-center justify-center">
      <div className="font-display text-xs font-bold tracking-widest uppercase text-on-surface/30 animate-pulse">Initializing Oracle Console</div>
    </div>
  );

  return (
    <div className="glass rounded-[2rem] overflow-hidden flex flex-col h-[520px]">
      <div className="p-6 bg-surface-container-low/40 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={14} />
          <input 
            type="text" 
            placeholder="Search workflows..."
            className="w-full bg-surface-container-low text-on-surface px-10 py-3 text-xs font-medium rounded-full ring-1 ring-outline/5 focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/30"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="px-6 py-2 bg-surface-container-high text-on-surface-variant text-xs font-bold uppercase rounded-full hover:bg-surface-container-highest transition-colors">
          Filters
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-2">
          {filtered.map((w) => {
            const id = `${w.repo}-${w.command}`;
            const isRunning = running[id];

            return (
              <div key={id} className={`p-4 rounded-3xl transition-all flex items-center justify-between group ${
                w.isRecommended ? 'bg-primary/5 shadow-sm shadow-primary/5' : 'hover:bg-surface-container-low/50'
              }`}>
                <div className="space-y-1.5 pl-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold tracking-tight ${w.isRecommended ? 'text-primary' : 'text-on-surface'}`}>{w.command}</span>
                    <span className="text-[9px] uppercase px-2 py-0.5 bg-surface-container-highest text-on-surface-variant/60 font-bold rounded-md">
                      {w.repo}
                    </span>
                    {w.isRecommended && (
                      <span className="flex items-center gap-1.5 text-[9px] uppercase text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full ring-1 ring-primary/20">
                        <Zap size={10} fill="currentColor" />
                        Prescribed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant/60 max-w-xl font-medium">{w.description}</p>
                </div>

                <button 
                  onClick={() => handleRun(w)}
                  disabled={isRunning}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-[10px] uppercase transition-all ${
                    isRunning 
                      ? 'bg-primary/20 text-primary cursor-wait' 
                      : w.isRecommended 
                        ? 'bg-primary text-on-primary hover:scale-105 shadow-lg shadow-primary/20'
                        : 'bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      Dispatching
                    </>
                  ) : (
                    <>
                      <Play size={10} fill="currentColor" />
                      {w.isRecommended ? 'Resolve Drift' : 'Execute'}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 bg-surface-container-lowest/80 flex justify-between items-center text-[10px] font-mono font-bold text-on-surface-variant/30 uppercase tracking-[0.2em]">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${auditData?.totalScore <= 1.5 ? 'bg-primary' : 'bg-error animate-pulse'}`} />
          ORACLE: {auditData?.totalScore <= 1.5 ? 'STABLE' : 'DRIFT DETECTED'}
        </div>
        <div>SESSION: ACTIVE</div>
      </div>
    </div>
  );
}

