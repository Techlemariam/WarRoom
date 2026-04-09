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

  if (loading) return <div className="h-48 glass flex items-center justify-center font-mono animate-pulse uppercase">Syncing Infrastructure...</div>;

  const hetzner = data?.hetzner?.server;
  const metrics = data?.hetzner?.metrics?.time_series;
  const coolify = data?.coolify;

  // Helper to get latest metric value
  const getLatest = (metric: any) => {
    if (!metric?.values) return 0;
    const latest = metric.values[metric.values.length - 1];
    return latest ? parseFloat(latest[1]) : 0;
  };

  const cpuUsage = getLatest(metrics?.cpu);
  const memUsageRaw = getLatest(metrics?.mem); // In bytes
  const memTotal = 4 * 1024 * 1024 * 1024; // Assuming 4GB for CX23 or similar
  const memUsagePercent = Math.min((memUsageRaw / (hetzner?.memory * 1024 * 1024 * 1024 || memTotal)) * 100, 100);

  return (
    <div className="space-y-4">
      {/* Hetzner Card */}
      <div className="glass p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Server size={14} className="text-accent" />
            <span className="text-xs font-bold uppercase">{hetzner?.name || 'Hetzner Node'}</span>
          </div>
          <span className={`text-[10px] font-mono uppercase ${hetzner?.status === 'running' ? 'text-success' : 'text-error'}`}>
            ● {hetzner?.status || 'Offline'}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-text-secondary">CPU</span>
              <span>{cpuUsage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-surface h-1 rounded-full overflow-hidden">
              <div className="bg-accent h-full transition-all duration-500" style={{ width: `${cpuUsage}%` }}></div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-text-secondary">RAM</span>
              <span>{(memUsageRaw / (1024**3)).toFixed(1)} GB</span>
            </div>
            <div className="w-full bg-surface h-1 rounded-full overflow-hidden">
              <div className="bg-accent h-full transition-all duration-500" style={{ width: `${memUsagePercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="glass overflow-hidden">
        <div className="p-3 bg-surface/50 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database size={12} className="text-accent" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Coolify Services</span>
          </div>
          {!coolify?.healthy && <AlertTriangle size={12} className="text-error animate-pulse" />}
        </div>
        <div className="divide-y divide-border max-h-[200px] overflow-y-auto">
          {coolify?.apps?.map((app: any) => (
            <div key={app.uuid} className="p-3 flex items-center justify-between hover:bg-surface/30 transition-colors">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className={`w-1.5 h-1.5 rounded-full ${app.status?.includes('running') ? 'bg-success' : 'bg-warning shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}></div>
                <span className="text-xs font-mono truncate">{app.name}</span>
              </div>
              <span className="text-[9px] text-text-secondary font-mono uppercase">{app.status || 'unknown'}</span>
            </div>
          ))}
          {(!coolify?.apps || coolify.apps.length === 0) && (
            <div className="p-4 text-[10px] text-text-secondary italic text-center">No active services detected</div>
          )}
        </div>
      </div>

      <div className="text-[10px] font-mono text-center text-text-secondary uppercase">
        Node: {hetzner?.public_net?.ipv4?.ip || '0.0.0.0'}
      </div>
    </div>
  );
}

