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

  if (loading) return (
    <div className="h-64 glass rounded-3xl flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <div className="font-display text-sm font-bold tracking-widest uppercase text-on-surface/40 animate-pulse">Syncing Mission Intelligence</div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project) => {
        const repoAudit = auditData?.vectors?.find((v: any) => v.findings?.some((f: string) => f.includes(project.name)));
        const isHealthy = !repoAudit || repoAudit.score < 1.0;

        return (
          <div key={project.name} className="glass group p-6 rounded-[2rem] space-y-6 transition-all duration-500 hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-primary/5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-display font-bold tracking-tight text-on-surface group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <p className="text-[10px] font-mono font-bold text-on-surface-variant/40 tracking-wider uppercase mt-1">
                  {project.owner} // {project.name}
                </p>
              </div>
              <span className={`px-3 py-1 text-[9px] font-bold tracking-widest uppercase rounded-full ${
                project.active?.status === 'ACTIVE' 
                  ? 'bg-primary-container text-on-primary-container shadow-sm shadow-primary/20' 
                  : 'bg-surface-container-high text-on-surface-variant/60'
              }`}>
                {project.active?.status || 'IDLE'}
              </span>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-[0.2em]">Active Sprint</div>
                <div className="text-xs font-medium bg-surface-container-low/50 px-4 py-3 rounded-2xl text-on-surface relative overflow-hidden group-hover:bg-surface-container/60 transition-colors">
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/40" />
                   {project.active?.sprintId || project.current_state?.currentSprint || 'NO ACTIVE SPRINT'}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-[0.2em]">Top Objectives</div>
                <div className="space-y-2">
                  {project.active?.tasks?.slice(0, 3).map((task: any) => (
                    <div key={task.id} className="flex items-center gap-3 text-xs p-2 rounded-xl hover:bg-surface-container-low/30 transition-colors">
                      {task.status === 'COMPLETED' ? (
                        <CheckCircle2 size={14} className="text-primary" />
                      ) : task.status === 'BLOCKED' ? (
                        <ShieldAlert size={14} className="text-error animate-pulse" />
                      ) : (
                        <Clock size={14} className="text-secondary/60" />
                      )}
                      <span className="truncate text-on-surface/80 group-hover:text-on-surface transition-colors font-medium">{task.title}</span>
                    </div>
                  ))}
                  {(!project.active?.tasks || project.active?.tasks.length === 0) && (
                    <div className="text-[10px] text-on-surface-variant/40 italic px-2">Awaiting new mission directives...</div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-5 flex justify-between items-center text-[10px] font-mono border-t border-outline/5">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                isHealthy ? "bg-primary/5 text-primary" : "bg-error/5 text-error"
              }`}>
                <Activity size={12} className={isHealthy ? "" : "animate-pulse"} />
                <span className="font-bold tracking-tighter uppercase">
                  CI: {isHealthy ? 'OPTIMAL' : 'DRIFT DETECTED'}
                </span>
              </div>
              <div className="text-on-surface font-bold font-display text-xs">
                {project.revenue || '0'} <span className="text-[9px] opacity-40">SEK</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

