"use client";

import { useEffect, useState } from "react";
import { Server, Activity, HardDrive, Cpu, Database, AlertTriangle } from "lucide-react";

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

  if (loading) return (
    <div className="h-48 glass rounded-3xl flex items-center justify-center">
      <div className="font-display text-xs font-bold tracking-widest uppercase text-on-surface/30 animate-pulse">Syncing Infrastructure</div>
    </div>
  );

  const hetzner = data?.hetzner?.server;
  const metrics = data?.hetzner?.metrics?.time_series;
  const coolify = data?.coolify;

  const getLatest = (metric: any) => {
    if (!metric?.values) return 0;
    const latest = metric.values[metric.values.length - 1];
    return latest ? parseFloat(latest[1]) : 0;
  };

  const cpuUsage = getLatest(metrics?.cpu);
  const memUsageRaw = getLatest(metrics?.mem);
  const memTotal = 4 * 1024 * 1024 * 1024;
  const memUsagePercent = Math.min((memUsageRaw / (hetzner?.memory * 1024 * 1024 * 1024 || memTotal)) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Node Card */}
      <div className="glass p-5 rounded-3xl space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 rounded-full">
              <Server size={14} className="text-primary" />
            </div>
            <span className="text-xs font-bold tracking-tight text-on-surface">{hetzner?.name || 'Hetzner Node'}</span>
          </div>
          <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
            hetzner?.status === 'running' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'
          }`}>
            {hetzner?.status || 'Offline'}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6 text-[10px] font-mono">
          <div className="space-y-2">
            <div className="flex justify-between px-1">
              <span className="text-on-surface-variant/40 font-bold">CPU</span>
              <span className="text-on-surface">{cpuUsage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${cpuUsage}%` }}></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between px-1">
              <span className="text-on-surface-variant/40 font-bold">RAM</span>
              <span className="text-on-surface">{(memUsageRaw / (1024**3)).toFixed(1)} GB</span>
            </div>
            <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full transition-all duration-1000" style={{ width: `${memUsagePercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="glass rounded-[2rem] overflow-hidden">
        <div className="p-4 bg-surface-container-low/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-secondary/10 rounded-full">
              <Database size={12} className="text-secondary" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface">Active Services</span>
          </div>
          {!coolify?.healthy && <AlertTriangle size={12} className="text-error animate-pulse" />}
        </div>
        <div className="max-h-[220px] overflow-y-auto px-2 pb-2">
          <div className="space-y-1">
            {coolify?.apps?.map((app: any) => (
              <div key={app.uuid} className="p-3.5 flex items-center justify-between hover:bg-surface-container-high/40 rounded-2xl transition-all group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`w-2 h-2 rounded-full ${
                    app.status?.includes('running') 
                      ? 'bg-primary shadow-[0_0_8px_rgba(48,100,129,0.3)]' 
                      : 'bg-on-surface-variant/40'
                  }`} />
                  <span className="text-xs font-medium text-on-surface/80 group-hover:text-on-surface truncate">{app.name}</span>
                </div>
                <span className="text-[9px] text-on-surface-variant/30 font-bold uppercase tracking-tighter">{app.status || 'unknown'}</span>
              </div>
            ))}
            {(!coolify?.apps || coolify.apps.length === 0) && (
              <div className="p-8 text-[11px] text-on-surface-variant/40 italic text-center">No active directives detected.</div>
            )}
          </div>
        </div>
      </div>

      <div className="text-[9px] font-mono font-bold text-center text-on-surface-variant/20 uppercase tracking-[0.3em]">
        IPV4: {hetzner?.public_net?.ipv4?.ip || '0.0.0.0'}
      </div>
    </div>
  );
}

