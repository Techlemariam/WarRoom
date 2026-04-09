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

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen p-6 lg:p-10 space-y-8">
      {/* Header */}
      <header className="flex justify-between items-end border-b border-border pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase">War Room</h1>
          <p className="text-text-secondary">Remote Agent Orchestrator & Command Center</p>
        </div>
        <div className="text-right font-mono text-sm space-y-1">
          <div className="text-accent">EST. REVENUE: 40,000 SEK/MO</div>
          <div className="text-text-secondary uppercase">Status: Operating</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Main View */}
        <div className="lg:col-span-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent inline-block"></span>
              Mission Board
            </h2>
            <MissionBoard />
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent inline-block"></span>
              Workflow Console
            </h2>
            <WorkflowConsole />
          </section>
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <section>
            <FocusPanel />
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent inline-block"></span>
              Infrastructure
            </h2>
            <InfraMonitor />
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent inline-block"></span>
              Project Entropy
            </h2>
            <div className="space-y-4">
              <EntropyRadar />
              <RevenueRadar />
              <TokenTracker />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent inline-block"></span>
              Decision Log
            </h2>
            <DecisionLog />
          </section>
        </div>
      </div>
    </main>
  );
}
