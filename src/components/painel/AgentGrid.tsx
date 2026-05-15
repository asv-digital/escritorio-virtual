"use client";

import { useSimulator } from "@/lib/stores/simulator-store";
import { AgentCard } from "./AgentCard";

export function AgentGrid() {
  const agents = useSimulator((s) => s.agents);
  const state = useSimulator((s) => s.state);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {agents.map((a) => (
        <AgentCard key={a.id} agent={a} state={state[a.id]} />
      ))}
    </div>
  );
}
