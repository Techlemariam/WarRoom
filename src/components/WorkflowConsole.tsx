'use client';

import { ChevronRight, Filter, Play, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Workflow {
  repo: string;
  command: string;
  category: string;
}

interface AuditData {
  vectors?: Array<{
    name: string;
    findings?: string[];
  }>;
}

export default function WorkflowConsole() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function init() {
      try {
        const [wRes, aRes] = await Promise.all([fetch('/api/workflows'), fetch('/api/infra')]);
        const [wJson, aJson] = await Promise.all([wRes.json(), aRes.json()]);
        setWorkflows(wJson);
        setAuditData(aJson);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function handleRun(workflow: Workflow) {
    const id = `${workflow.repo}-${workflow.command}`;
    setRunning((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch('/api/dispatch', {
        method: 'POST',
        body: JSON.stringify({
          owner: 'Techlemariam',
          repo: workflow.repo,
          workflowId: workflow.command,
          ref: 'main',
        }),
      });
      if (res.ok) {
        // Success logic...
        setRunning((prev) => ({ ...prev, [id]: false }));
      }
    } catch (_e) {
      setRunning((prev) => ({ ...prev, [id]: false }));
    }
  }

  const prioritizedWorkflows = workflows
    .map((w) => {
      const hasDrift = auditData?.vectors
        ?.find((v) => v.name === 'IaC/Drift')
        ?.findings?.some((f) => f.includes(w.repo));
      return {
        ...w,
        priority: hasDrift ? 'HIGH' : 'STABLE',
      };
    })
    .sort((a, _b) => (a.priority === 'HIGH' ? -1 : 1));

  if (loading)
    return (
      <div className="h-96 card-professional flex items-center justify-center">
        <RefreshCcw size={20} className="animate-spin text-on-surface-variant/30" />
      </div>
    );

  return (
    <div className="card-professional flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Filter routines..."
            className="bg-surface border border-outline-variant text-[11px] px-3 py-1.5 rounded-sm w-48 focus:outline-none focus:border-primary transition-all"
          />
        </div>
        <button
          type="button"
          className="px-4 py-2 border border-outline-variant text-[11px] font-bold uppercase rounded-sm bg-surface hover:bg-surface-container transition-colors flex items-center gap-2"
        >
          <Filter size={12} />
          Filters
        </button>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-outline-variant">
        {prioritizedWorkflows.map((w) => {
          const id = `${w.repo}-${w.command}`;
          const isRunning = running[id];

          return (
            <div
              key={id}
              className="group p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-sm flex items-center justify-center border ${
                    w.priority === 'HIGH'
                      ? 'bg-red-50 border-red-200 text-error'
                      : 'bg-surface-container border-outline-variant text-on-surface-variant'
                  }`}
                >
                  <ChevronRight size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-bold text-on-surface uppercase tracking-tight">
                      {w.repo.replace('ironforge-', '')}: {w.command}
                    </span>
                    {w.priority === 'HIGH' && (
                      <span className="bg-error/10 text-error text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase">
                        Required
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-on-surface-variant/50 uppercase">
                    Execution Vector: GitHub Actions / {w.category}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRun(w)}
                disabled={isRunning}
                className={`p-2.5 rounded-sm border transition-all ${
                  isRunning
                    ? 'bg-surface-container-high border-outline-variant text-on-surface-variant/40'
                    : 'bg-surface border-outline-variant hover:border-primary text-primary hover:bg-primary/5 active:scale-95'
                }`}
              >
                {isRunning ? (
                  <RefreshCcw size={14} className="animate-spin" />
                ) : (
                  <Play size={14} fill="currentColor" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
