"use client";

import { useEffect, useState } from "react";
import { Activity, CheckCircle2, AlertCircle, Clock, ShieldAlert } from "lucide-react";

export default function MissionBoard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [auditData, setAuditData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, auditRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/audit")
        ]);
        const projData = await projRes.json();
        const auditData = await auditRes.json();
        
        setProjects(projData);
        setAuditData(auditData);
      } catch (e) {
        console.error("Failed to fetch dashboard data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="h-48 glass flex items-center justify-center font-mono animate-pulse uppercase">Syncing Mission Data...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => {
        // Find repo-specific health if available
        const repoAudit = auditData?.vectors?.find((v: any) => v.findings?.some((f: string) => f.includes(project.name)));
        const isHealthy = !repoAudit || repoAudit.score < 1.0;

        return (
          <div key={project.name} className="glass p-5 space-y-4 hover:border-accent/40 transition-colors group">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold uppercase tracking-tight group-hover:text-accent transition-colors">
                  {project.name}
                </h3>
                <p className="text-[10px] text-text-secondary font-mono tracking-wider">{project.owner}/{project.name}</p>
              </div>
              <span className={`px-2 py-1 text-[9px] font-bold uppercase ${
                project.active?.status === 'ACTIVE' ? 'bg-success/10 text-success border border-success/20' : 'bg-surface text-text-secondary border border-border'
              }`}>
                {project.active?.status || 'IDLE'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Active Sprint</div>
                <div className="text-xs font-mono bg-surface/30 px-2 py-1 border-l-2 border-accent">
                   {project.active?.sprintId || project.current_state?.currentSprint || 'NO ACTIVE SPRINT'}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Top Objectives</div>
                {project.active?.tasks?.slice(0, 3).map((task: any) => (
                  <div key={task.id} className="flex items-center gap-2 text-xs">
                    {task.status === 'COMPLETED' ? (
                      <CheckCircle2 size={12} className="text-success" />
                    ) : task.status === 'BLOCKED' ? (
                      <AlertCircle size={12} className="text-error animate-pulse" />
                    ) : (
                      <Clock size={12} className="text-warning" />
                    )}
                    <span className="truncate group-hover:text-white transition-colors">{task.title}</span>
                  </div>
                ))}
                {!project.active?.tasks && <div className="text-[10px] text-text-secondary italic">No active tasks logged</div>}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-between items-center text-[9px] font-mono">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface/50 border border-border">
                <Activity size={10} className={isHealthy ? "text-success" : "text-warning animate-pulse"} />
                <span className={isHealthy ? "text-success" : "text-warning"}>
                  CI: {isHealthy ? 'OPTIMAL' : 'DRIFT DETECTED'}
                </span>
              </div>
              <div className="text-text-secondary font-bold">
                {project.revenue || '0'} SEK
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

