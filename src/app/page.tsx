import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import WorkflowConsole from "@/components/WorkflowConsole";
import MissionBoard from "@/components/MissionBoard";
import InfraMonitor from "@/components/InfraMonitor";
import RevenueRadar from "@/components/RevenueRadar";
import TokenTracker from "@/components/TokenTracker";
import FocusPanel from "@/components/FocusPanel";
import DecisionLog from "@/components/DecisionLog";
import EntropyRadar from "@/components/EntropyRadar";
import { LayoutDashboard, ShieldCheck, Zap, Activity } from "lucide-react";

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen p-6 lg:p-12 relative z-10 max-w-[1600px] mx-auto space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-primary rounded-2xl shadow-lg shadow-primary/20">
                <LayoutDashboard className="text-on-primary" size={24} />
             </div>
             <h1 className="text-4xl font-display font-bold tracking-tight text-on-surface">War Room</h1>
          </div>
          <p className="text-on-surface-variant/60 font-medium pl-1">Remote Agent Orchestration // Strategic Intelligence</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 font-mono text-xs font-bold uppercase tracking-[0.2em]">
           <div className="flex items-center gap-2 group cursor-help">
              <span className="text-on-surface-variant/40">EST. REVENUE</span>
              <span className="text-primary bg-primary/10 px-3 py-1 rounded-full group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">40,000 SEK/MO</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="text-on-surface-variant/40">STATUS</span>
              <span className="flex items-center gap-1.5 text-on-surface/80">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Operating
              </span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column - Tactical Operations */}
        <div className="lg:col-span-8 space-y-12">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display font-bold tracking-tight flex items-center gap-3 text-on-surface">
                <div className="p-1.5 bg-surface-container-high rounded-lg">
                  <Activity size={18} className="text-primary" />
                </div>
                Mission Board
              </h2>
            </div>
            <MissionBoard />
          </section>

          <section className="space-y-6">
             <h2 className="text-lg font-display font-bold tracking-tight flex items-center gap-3 text-on-surface">
                <div className="p-1.5 bg-surface-container-high rounded-lg">
                  <Zap size={18} className="text-secondary" />
                </div>
                Control Center
              </h2>
            <WorkflowConsole />
          </section>
        </div>

        {/* Right Column - Oracle & Infrastructure */}
        <div className="lg:col-span-4 space-y-12">
          <section className="space-y-6">
            <h2 className="text-lg font-display font-bold tracking-tight flex items-center gap-3 text-on-surface">
                <div className="p-1.5 bg-surface-container-high rounded-lg">
                  <ShieldCheck size={18} className="text-primary" />
                </div>
                Oracle Intelligence
              </h2>
            <div className="space-y-6">
              <EntropyRadar />
              <div className="grid grid-cols-2 gap-4">
                <div className="glass p-4 rounded-3xl">
                   <RevenueRadar />
                </div>
                <div className="glass p-4 rounded-3xl">
                   <TokenTracker />
                </div>
              </div>
            </div>
          </section>

          <section>
            <FocusPanel />
          </section>

          <section className="space-y-6">
             <h2 className="text-lg font-display font-bold tracking-tight flex items-center gap-3 text-on-surface">
                <div className="p-1.5 bg-surface-container-high rounded-lg text-primary">
                  <Activity size={18} />
                </div>
                Infrastructure
              </h2>
            <InfraMonitor />
          </section>

          <section className="space-y-6">
             <h2 className="text-lg font-display font-bold tracking-tight flex items-center gap-3 text-on-surface">
                <div className="p-1.5 bg-surface-container-high rounded-lg text-secondary">
                  <Activity size={18} />
                </div>
                Decision Log
              </h2>
            <DecisionLog />
          </section>
        </div>
      </div>
    </main>
  );
}
