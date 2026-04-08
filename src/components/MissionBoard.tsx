"use client";

import { useEffect, useState } from "react";
import { Activity, CheckCircle2, AlertCircle, Clock } from "lucide-react";

export default function MissionBoard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
      } catch (e) {
        console.error("Failed to fetch projects", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="h-48 glass flex items-center justify-center font-mono animate-pulse">Scanning Repositories...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => (
        <div key={project.name} className="glass p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight">{project.name}</h3>
              <p className="text-xs text-text-secondary font-mono">{project.owner}/{project.name}</p>
            </div>
            <span className={`px-2 py-1 text-[10px] font-bold uppercase ${
              project.active?.status === 'ACTIVE' ? 'bg-success/20 text-success' : 'bg-surface text-text-secondary'
            }`}>
              {project.active?.status || 'IDLE'}
            </span>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-mono">
              <span className="text-text-secondary">SPRINT:</span> {project.active?.sprintId || project.current_state?.currentSprint || 'N/A'}
            </div>
            
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-text-secondary uppercase">Active Tasks</div>
              {project.active?.tasks?.slice(0, 3).map((task: any) => (
                <div key={task.id} className="flex items-center gap-2 text-xs">
                  {task.status === 'COMPLETED' ? (
                    <CheckCircle2 size={12} className="text-success" />
                  ) : task.status === 'BLOCKED' ? (
                    <AlertCircle size={12} className="text-error" />
                  ) : (
                    <Clock size={12} className="text-warning" />
                  )}
                  <span className="truncate">{task.title}</span>
                </div>
              ))}
              {!project.active?.tasks && <div className="text-xs text-text-secondary italic">No active tasks logged</div>}
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-between items-center text-[10px] font-mono">
            <div className="flex items-center gap-1">
              <Activity size={10} className="text-accent" />
              <span>CI HEALTH: OPTIMAL</span>
            </div>
            <div className="text-text-secondary">
              REV: 0 SEK
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
