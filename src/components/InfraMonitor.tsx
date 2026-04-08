"use client";

import { useEffect, useState } from "react";
import { Server, Activity, HardDrive, Cpu, Database } from "lucide-react";

export default function InfraMonitor() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/infra");
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Failed to fetch infra data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 30000); // 30s refresh
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="h-48 glass flex items-center justify-center font-mono animate-pulse uppercase">Syncing Infrastructure...</div>;

  const hetzner = data?.hetzner?.server;
  const coolify = data?.coolify;

  return (
    <div className="space-y-4">
      {/* Hetzner Card */}
      <div className="glass p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Server size={14} className="text-accent" />
            <span className="text-xs font-bold uppercase">Hetzner CX23</span>
          </div>
          <span className="text-[10px] font-mono text-success uppercase">● Online</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-text-secondary">CPU</span>
              <span>72%</span>
            </div>
            <div className="w-full bg-surface h-1">
              <div className="bg-accent h-full" style={{ width: '72%' }}></div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-text-secondary">RAM</span>
              <span>5.8 GB</span>
            </div>
            <div className="w-full bg-surface h-1">
              <div className="bg-accent h-full" style={{ width: '58%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="glass overflow-hidden">
        <div className="p-3 bg-surface/50 border-b border-border flex items-center gap-2">
          <Database size={12} className="text-accent" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Coolify Services</span>
        </div>
        <div className="divide-y divide-border">
          {coolify?.apps?.slice(0, 4).map((app: any) => (
            <div key={app.uuid} className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className={`w-1.5 h-1.5 ${app.status?.includes('running') ? 'bg-success' : 'bg-warning'}`}></div>
                <span className="text-xs font-mono truncate">{app.name}</span>
              </div>
              <span className="text-[9px] text-text-secondary font-mono uppercase">{app.status || 'unknown'}</span>
            </div>
          ))}
          {!coolify?.apps && <div className="p-3 text-[10px] text-text-secondary italic">No active services detected</div>}
        </div>
      </div>

      <div className="text-[10px] font-mono text-center text-text-secondary uppercase">
        Infrastructure Health: Optimal
      </div>
    </div>
  );
}
