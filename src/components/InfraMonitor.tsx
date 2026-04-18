'use client';

import { Activity, AlertCircle, Database, Server } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MetricValue {
  values?: Array<[number, string]>;
}

interface InfraData {
  hetzner?: {
    server?: {
      name: string;
      status: string;
      memory: number;
      public_net?: {
        ipv4?: {
          ip: string;
        };
      };
    };
    metrics?: {
      time_series: {
        cpu: MetricValue;
        mem: MetricValue;
      };
    };
  };
  coolify?: {
    healthy: boolean;
    apps: Array<{
      uuid: string;
      name: string;
      status: string;
    }>;
  };
}

export default function InfraMonitor() {
  const [data, setData] = useState<InfraData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/infra');
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error('Failed to fetch infra data', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <div className="h-48 card-professional flex items-center justify-center">
        <div className="text-xs font-medium text-on-surface-variant/50 flex items-center gap-2">
          <Activity size={14} className="animate-spin" />
          Synchronizing Node Infrastructure...
        </div>
      </div>
    );

  const hetzner = data?.hetzner?.server;
  const metrics = data?.hetzner?.metrics?.time_series;
  const coolify = data?.coolify;

  const getLatest = (metric?: MetricValue) => {
    if (!metric?.values) return 0;
    const latest = metric.values[metric.values.length - 1];
    return latest ? Number.parseFloat(latest[1]) : 0;
  };

  const cpuUsage = getLatest(metrics?.cpu);
  const memUsageRaw = getLatest(metrics?.mem);
  const memTotal = 4 * 1024 * 1024 * 1024;
  const memUsagePercent = Math.min(
    (memUsageRaw / (hetzner?.memory * 1024 * 1024 * 1024 || memTotal)) * 100,
    100
  );

  const handleRemedy = async (app: { uuid: string; name: string }) => {
    if (!confirm(`Trigger automated remediation (REDEPLOY) for ${app.name}?`)) return;

    try {
      const res = await fetch('/api/remedy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `remedy-${app.uuid}`,
          type: 'REDEPLOY',
          target: app.name,
          severity: 'HIGH',
          mode: 'ACTIVE',
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert(result.message || 'Remediation dispatched successfully.');

        // Log to DecisionLog via localStorage sync
        const saved = localStorage.getItem('war-room-decisions');
        const decisions = saved ? JSON.parse(saved) : [];
        const newDecision = {
          date: new Date().toISOString(),
          title: `AUTO-HEAL: ${app.name.toUpperCase()}`,
          rationale: 'Remediation Engine detected downtime and triggered an automated redeploy.',
        };
        localStorage.setItem('war-room-decisions', JSON.stringify([newDecision, ...decisions]));
        window.dispatchEvent(new Event('storage')); // Trigger update in other components
      } else {
        alert(`Failed: ${result.error}`);
      }
    } catch (_e) {
      alert('Remediation system communication error.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="card-professional p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <Server size={14} className="text-secondary" />
            <span className="text-sm font-semibold text-on-surface">
              {hetzner?.name || 'Production Node'}
            </span>
          </div>
          <div
            className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase ${
              hetzner?.status === 'running'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {hetzner?.status || 'Offline'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-on-surface-variant font-medium">CPU Usage</span>
              <span className="text-on-surface font-bold font-mono">{cpuUsage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-surface-container h-1.5 rounded-sm">
              <div
                className="bg-primary h-full transition-all duration-1000 rounded-sm"
                style={{ width: `${cpuUsage}%` }}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-on-surface-variant font-medium">RAM Utilization</span>
              <span className="text-on-surface font-bold font-mono">
                {(memUsageRaw / 1024 ** 3).toFixed(1)} GB
              </span>
            </div>
            <div className="w-full bg-surface-container h-1.5 rounded-sm">
              <div
                className="bg-secondary h-full transition-all duration-1000 rounded-sm"
                style={{ width: `${memUsagePercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card-professional overflow-hidden">
        <div className="p-3 bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database size={13} className="text-secondary" />
            <span className="text-[11px] font-bold uppercase tracking-wide text-on-surface-variant">
              Active Services
            </span>
          </div>
          {!coolify?.healthy && <AlertCircle size={14} className="text-error" />}
        </div>
        <div className="max-h-[250px] overflow-y-auto">
          <div className="divide-y divide-outline-variant">
            {coolify?.apps?.map((app) => (
              <div
                key={app.uuid}
                className="p-3 flex items-center justify-between hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      app.status?.includes('running') ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-medium text-on-surface truncate">{app.name}</span>
                    <span className="text-[9px] text-on-surface-variant/50 font-mono uppercase tracking-tighter">
                      {app.status?.split('(')[0] || 'unknown'}
                    </span>
                  </div>
                </div>
                {!app.status?.includes('running') && (
                  <button
                    type="button"
                    onClick={() => handleRemedy(app)}
                    className="px-2 py-1 rounded bg-error/10 text-error text-[10px] font-bold uppercase hover:bg-error hover:text-error-container transition-all"
                  >
                    Remedy
                  </button>
                )}
              </div>
            ))}
            {(!coolify?.apps || coolify.apps.length === 0) && (
              <div className="p-6 text-[11px] text-on-surface-variant/40 italic text-center">
                No active deployments detected.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-center text-on-surface-variant/40 py-1">
        Node Identifier: {hetzner?.public_net?.ipv4?.ip || '0.0.0.0'}
      </div>
    </div>
  );
}
