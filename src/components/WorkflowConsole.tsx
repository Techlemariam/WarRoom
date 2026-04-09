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

  if (loading) return <div className="h-48 glass flex items-center justify-center font-mono animate-pulse uppercase">Initializing Oracle Console...</div>;

  return (
    <div className="glass overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 border-b border-border bg-surface/50 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={14} />
          <input 
            type="text" 
            placeholder="Search workflows..."
            className="w-full bg-background border border-border px-9 py-2 text-xs font-mono focus:outline-none focus:border-accent transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="px-4 py-2 border border-border text-xs font-mono uppercase hover:bg-surface transition-colors">
          Filters
        </button>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {filtered.map((w) => {
          const id = `${w.repo}-${w.command}`;
          const isRunning = running[id];

          return (
            <div key={id} className={`p-4 hover:bg-surface/30 transition-colors flex items-center justify-between group ${w.isRecommended ? 'bg-accent/5' : ''}`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-sm font-bold ${w.isRecommended ? 'text-warning' : 'text-accent'}`}>{w.command}</span>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 bg-border text-text-secondary font-bold">
                    {w.repo}
                  </span>
                  {w.isRecommended && (
                    <span className="flex items-center gap-1 text-[9px] uppercase text-warning font-bold bg-warning/10 px-1.5 py-0.5 border border-warning/20">
                      <ShieldAlert size={10} />
                      Prescribed
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-secondary max-w-xl">{w.description}</p>
              </div>

              <button 
                onClick={() => handleRun(w)}
                disabled={isRunning}
                className={`flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase transition-all ${
                  isRunning 
                    ? 'bg-warning/20 text-warning cursor-wait' 
                    : w.isRecommended 
                      ? 'bg-warning text-background hover:bg-white'
                      : 'bg-surface border border-border hover:bg-accent hover:text-background'
                }`}
              >
                {isRunning ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Dispatching
                  </>
                ) : (
                  <>
                    <Play size={12} fill="currentColor" />
                    {w.isRecommended ? 'Fix Issues' : 'Execute'}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="p-2 bg-accent/5 border-t border-border flex justify-between items-center text-[10px] font-mono text-text-secondary">
        <div>ORACLE: {auditData?.totalScore <= 1.5 ? 'STABLE' : 'DRIFT DETECTED'}</div>
        <div>SESSION: ACTIVE</div>
      </div>
    </div>
  );
}

