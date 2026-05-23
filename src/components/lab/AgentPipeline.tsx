"use client";

import { AgentNode, type AgentNodeStatus } from "./AgentNode";

interface AgentPipelineProps {
  agents: Array<{ id: string; status: AgentNodeStatus }>;
  onRetryAgent?: (agentId: string) => void;
}

export function AgentPipeline({ agents, onRetryAgent }: AgentPipelineProps) {
  return (
    <div className="flex flex-col items-center gap-3 p-3">
      <p
        className="text-[9px] font-mono uppercase tracking-[0.3em] mb-2"
        style={{ color: "var(--accent-cyan)" }}
      >
        PIPELINE
      </p>
      <div className="flex flex-col gap-3 items-center">
        {agents.map((agent, i) => (
          <div key={agent.id} className="flex items-center gap-2">
            <AgentNode
              agentId={agent.id}
              status={agent.status}
              onRetry={onRetryAgent ? () => onRetryAgent(agent.id) : undefined}
            />
            {/* Connector arrow */}
            {i < agents.length - 1 && (
              <div className="flex flex-col items-center mx-0.5">
                <div
                  className="w-px h-4"
                  style={{
                    background:
                      agent.status === "completed"
                        ? agent.id === "nexus"
                          ? "#00f5ff40"
                          : agent.id === "cipher"
                          ? "#00ff8840"
                          : agent.id === "kaos"
                          ? "#ff6b3540"
                          : "#ffffff15"
                        : "#ffffff10",
                  }}
                />
                <span className="text-[8px] text-white/10 -mt-0.5">↓</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
