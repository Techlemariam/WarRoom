'use client';

import { AlertCircle, Database, Filter, Loader2, Play, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function WorkflowConsole() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [auditData, setAuditData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [wfRes, auditRes] = await Promise.all([fetch('/api/workflows'), fetch('/api/audit')]);
        const wfData = await wfRes.json();
        const aData = await auditRes.json();

        setWorkflows(wfData);
        setAuditData(aData);
      } catch (e) {
        console.error('Failed to fetch workflows', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleRun(workflow: any) {
    const id = `${workflow.repo}-${workflow.command}`;
    setRunning((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await fetch('/api/dispatch', {
        method: 'POST',
        body: JSON.stringify({
          owner: 'Techlemariam',
          repo: workflow.repo,
          command: workflow.command,
        }),
      });

      if (res.ok) {
        setTimeout(() => setRunning((prev) => ({ ...prev, [id]: false })), 2000);
      } else {
        setRunning((prev) => ({ ...prev, [id]: false }));
      }
    } catch (e) {
      setRunning((prev) => ({ ...prev, [id]: false }));
    }
  }

  const enrichedWorkflows = workflows
    .map((w) => {
      const hasDrift = auditData?.vectors
        ?.find((v: any) => v.name === 'IaC/Drift')
        ?.findings?.some((f: string) => f.includes(w.repo));
      return {
        ...w,
        isRecommended:
          hasDrift &&
          (w.command.toLowerCase().includes('infra') || w.command.toLowerCase().includes('docker')),
      };
    })
    .sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0));

  const filtered = enrichedWorkflows.filter(
    (w) =>
      w.command.toLowerCase().includes(search.toLowerCase()) ||
      w.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="h-64 card-professional flex items-center justify-center">
        <div className="text-xs font-medium text-on-surface-variant/50 flex items-center gap-2">
          <Loader2 size={14} className="animate-spin" />
          Loading Operations Console...
        </div>
      </div>
    );

  return (
    <div className="card-professional flex flex-col h-[520px] shadow-sm">
      <div className="p-4 bg-surface-container-low border-b border-outline-variant flex gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40"
            size={14}
          />
          <input
            type="text"
            placeholder="Search operations..."
            className="w-full pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="px-4 py-2 border border-outline-variant text-[11px] font-bold uppercase rounded-sm bg-surface hover:bg-surface-container transition-colors flex items-center gap-2">
          <Filter size={12} />
          Filters
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-outline-variant">
          {filtered.map((w) => {
            const id = `${w.repo}-${w.command}`;
            const isRunning = running[id];

            return (
              <div
                key={id}
                className={`p-4 transition-all flex items-center justify-between ${
                  w.isRecommended
                    ? 'bg-blue-50/50 dark:bg-blue-900/10'
                    : 'hover:bg-surface-container-low'
                }`}
              >
                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-on-surface">{w.command}</span>
                    <span className="text-[10px] uppercase px-1.5 py-0.5 border border-outline-variant text-on-surface-variant/60 font-medium rounded">
                      {w.repo}
                    </span>
                    {w.isRecommended && (
                      <span className="text-[10px] text-primary font-bold bg-primary-container/30 px-2 py-0.5 rounded">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant/70 leading-relaxed">
                    {w.description}
                  </p>
                </div>

                <button
                  onClick={() => handleRun(w)}
                  disabled={isRunning}
                  className={`btn-standard flex items-center gap-2 min-w-[120px] justify-center ${
                    isRunning ? 'opacity-50 cursor-not-allowed' : ''
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
                      {w.isRecommended ? 'Execute Fix' : 'Execute'}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-3 bg-surface-container border-t border-outline-variant flex justify-between items-center text-[10px] font-mono font-semibold text-on-surface-variant/40 uppercase">
        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full ${auditData?.totalScore <= 1.5 ? 'bg-green-500' : 'bg-red-500'}`}
          />
          System Status: {auditData?.totalScore <= 1.5 ? 'Operational' : 'Attention Required'}
        </div>
        <div>Instance ID: #7742</div>
      </div>
    </div>
  );
}
