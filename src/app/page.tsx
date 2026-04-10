import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import WorkflowConsole from "@/components/WorkflowConsole";
import MissionBoard from "@/components/MissionBoard";
import InfraMonitor from "@/components/InfraMonitor";
import RevenueRadar from "@/components/RevenueRadar";
import AccountUsageGrid from "@/components/AccountUsageGrid";
import FocusPanel from "@/components/FocusPanel";
import DecisionLog from "@/components/DecisionLog";
import EntropyRadar from "@/components/EntropyRadar";
import { LayoutDashboard, ShieldCheck, Zap, Activity, Briefcase, Mail, Database } from "lucide-react";

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="bg-background min-h-screen text-on-surface font-sans">
      {/* Top Navbar */}
      <nav className="border-b border-outline-variant bg-surface px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-primary" size={20} />
            <span className="font-bold text-sm tracking-tight">Oversight Dashboard</span>
          </div>
          <div className="h-4 w-[1px] bg-outline-variant mx-2" />
          <div className="flex gap-4 text-xs font-medium text-on-surface-variant/60">
            <span className="hover:text-on-surface cursor-pointer">Operations</span>
            <span className="hover:text-on-surface cursor-pointer">Compliance</span>
            <span className="hover:text-on-surface cursor-pointer">Infrastructure</span>
          </div>
        </div>
        <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">
          <div className="flex items-center gap-2">
            <span>Forecast:</span>
            <span className="text-primary">40,000 SEK</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span>Systems Stable</span>
          </div>
        </div>
      </nav>

      <main className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Workspace */}
          <div className="lg:col-span-8 space-y-8">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant/70 flex items-center gap-2">
                  <Briefcase size={14} />
                  Project Portfolio
                </h2>
              </div>
              <MissionBoard />
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant/70 flex items-center gap-2">
                <Zap size={14} />
                Operations Console
              </h2>
              <WorkflowConsole />
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant/70 flex items-center gap-2">
                <Mail size={14} />
                Strategic Quotas & Model Allocation
              </h2>
              <AccountUsageGrid />
            </section>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-4 space-y-8">
            <section className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant/70 flex items-center gap-2">
                <ShieldCheck size={14} />
                Compliance & Metrics
              </h2>
              <div className="space-y-4">
                <EntropyRadar />
                <div className="card-professional p-2">
                  <RevenueRadar />
                </div>
              </div>
            </section>

            <section>
              <FocusPanel />
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant/70 flex items-center gap-2">
                <Activity size={14} />
                Infrastructure Health
              </h2>
              <InfraMonitor />
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant/70 flex items-center gap-2">
                <Database size={14} className="text-secondary" />
                System Audit Log
              </h2>
              <DecisionLog />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
