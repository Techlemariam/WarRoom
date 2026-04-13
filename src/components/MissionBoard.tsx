'use client';

import { Activity, Layout, Package, ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Project {
  name: string;
  owner: string;
  active?: {
    tasks?: Array<{ id: string; name: string }>;
  };
}

export default function MissionBoard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading)
    return (
      <div className="h-full min-h-[400px] card-professional flex items-center justify-center">
        <Activity size={20} className="animate-spin text-on-surface-variant/30" />
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => (
        <div
          key={`${project.owner}/${project.name}`}
          className="card-professional flex flex-col h-[280px]"
        >
          <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Package size={14} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-wide text-on-surface">
                {project.name}
              </span>
            </div>
            <div className="text-[10px] font-mono font-bold text-on-surface-variant/40">
              {project.owner.toUpperCase()}
            </div>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest block">
                Deployment Scope
              </label>
              <div className="space-y-1.5">
                {project.active?.tasks?.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 p-2 bg-surface-container-high/50 border border-outline-variant rounded-sm"
                  >
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    <span className="text-[10px] font-medium text-on-surface truncate">
                      {task.name}
                    </span>
                  </div>
                ))}
                {(!project.active?.tasks || project.active.tasks.length === 0) && (
                  <div className="text-[10px] italic text-on-surface-variant/40">
                    No active tasks identified.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-3 mt-auto bg-surface-container-low border-t border-outline-variant flex justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-on-surface-variant/60">
              <Layout size={12} />
              STABLE
            </div>
            <ShieldAlert size={12} className="text-on-surface-variant/20" />
          </div>
        </div>
      ))}
    </div>
  );
}
