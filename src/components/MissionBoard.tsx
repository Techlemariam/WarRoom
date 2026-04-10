"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Clock, Briefcase, ChevronRight } from "lucide-react";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-48 card-professional border-dashed animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => {
        const repoAudit = auditData?.vectors?.find((v: any) => v.findings?.some((f: string) => f.includes(project.name)));
        const isHealthy = !repoAudit || repoAudit.score < 1.0;

        return (
          <div key={project.name} className="card-professional flex flex-col hover:shadow-md transition-shadow">
            <div className="p-4 border-b border-outline-variant flex justify-between items-start bg-surface-container-low">
              <div className="overflow-hidden">
                <h3 className="text-sm font-bold text-on-surface truncate">
                  {project.name}
                </h3>
                <p className="text-[10px] text-on-surface-variant/60 truncate uppercase font-medium mt-0.5">
                  {project.owner}
                </p>
              </div>
              <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-sm border ${
                project.active?.status === 'ACTIVE' 
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : 'bg-zinc-100 text-zinc-500 border-zinc-200'
              }`}>
                {project.active?.status || 'IDLE'}
              </span>
            </div>

            <div className="p-4 flex-1 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant/40 uppercase">Environment</label>
                <div className="text-[11px] font-medium text-on-surface bg-background p-2 border border-outline-variant rounded-sm flex items-center justify-between">
                   <span className="truncate">{project.active?.sprintId || 'Production'}</span>
                   <ChevronRight size={12} className="text-on-surface-variant/30" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant/40 uppercase">Key Milestones</label>
                <div className="space-y-1.5">
                  {project.active?.tasks?.slice(0, 3).map((task: any) => (
                    <div key={task.id} className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                      {task.status === 'COMPLETED' ? (
                        <CheckCircle2 size={12} className="text-green-600" />
                      ) : task.status === 'BLOCKED' ? (
                        <AlertCircle size={12} className="text-red-500" />
                      ) : (
                        <Clock size={12} className="text-zinc-400" />
                      )}
                      <span className="truncate">{task.title}</span>
                    </div>
                  ))}
                  {(!project.active?.tasks || project.active?.tasks.length === 0) && (
                    <div className="text-[10px] text-on-surface-variant/30 italic">No scheduled tasks.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low border-t border-outline-variant flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isHealthy ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-[10px] font-semibold text-on-surface-variant/60 uppercase">
                  {isHealthy ? 'Sync OK' : 'Issues Detected'}
                </span>
              </div>
              <div className="text-on-surface font-bold text-[11px]">
                {project.revenue || '0'} <span className="text-[9px] font-medium opacity-40">SEK</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
