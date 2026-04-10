"use client";

import { useState, useEffect } from "react";
import { UserPlus, Search, Globe, Mail } from "lucide-react";
import ArcGauge from "./ArcGauge";
import { getLiveUsage, AccountUsage, addAccount } from "@/lib/usage";

export default function AccountUsageGrid() {
  const [accounts, setAccounts] = useState<AccountUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 60000); // Polling every minute
    return () => clearInterval(interval);
  }, []);

  const refresh = async () => {
    const data = await getLiveUsage();
    setAccounts(data);
    setLoading(false);
  };

  const handleAdd = () => {
    const email = window.prompt("Enter Google Account Email:");
    if (email && email.includes("@")) {
      addAccount(email);
      refresh();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-on-surface-variant/40 animate-pulse">
        <Globe className="mr-2 animate-spin" size={16} />
        Initializing Usage Sensors...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-on-surface-variant/40">
          <Mail size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Managed Accounts</span>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant text-[10px] font-bold uppercase tracking-tighter transition-all rounded-sm text-primary"
        >
          <UserPlus size={12} />
          Add Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map((acc, i) => (
          <div key={acc.email} className="card-professional p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-2">
              <span className="text-[11px] font-bold text-on-surface tracking-tight truncate max-w-[200px]">
                {acc.email}
              </span>
              <div className="flex gap-1.5">
                 <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                 <span className="text-[8px] font-bold text-on-surface-variant/40 uppercase">Synced</span>
              </div>
            </div>

            <div className="flex items-start justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {acc.models.map(m => (
                <ArcGauge 
                  key={m.name}
                  percentage={m.percentage}
                  label={m.name.replace("Gemini ", "")} // Focus on model name
                  resetTime={m.resetTime}
                  color={m.name.includes("Claude") ? "var(--sys-color-secondary)" : "var(--sys-color-primary)"}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
