"use client";

import React from "react";
import type { Agent } from "@/types/agent";
import type { Topic } from "@/types/topic";
import { useAgent } from "@/hooks/useAgent";
import { useLabMode } from "@/hooks/useLabMode";
import { useChat } from "@/hooks/useChat";
import { LabHeader } from "@/components/lab/LabHeader";
import { LabModeToggle } from "@/components/lab/LabModeToggle";
import { AgentSelector } from "@/components/lab/AgentSelector";
import { TopicGrid } from "@/components/lab/TopicGrid";
import { CuriosityInput } from "@/components/lab/CuriosityInput";
import { ChatPanel } from "@/components/lab/ChatPanel";

interface LabPageClientProps {
  agents: Agent[];
  topics: Topic[];
}

export function LabPageClient({ agents, topics }: LabPageClientProps) {
  const { activeAgent, activeAgentId, selectAgent } = useAgent();
  const { mode, toggleMode } = useLabMode();
  const { messages, isLoading, error, send } = useChat(activeAgentId);

  const agentCount = agents.length;

  const handleTopicSelect = (question: string) => {
    send(question);
  };

  const handleSend = (message: string) => {
    send(message);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #1E293B 0%, #0F172A 100%)",
      }}
    >
      {/* Background particles */}
      <ParticleBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <LabHeader agentCount={agentCount} mode={mode} />

        {/* Mode Toggle */}
        <LabModeToggle mode={mode} onToggle={toggleMode} />

        {/* Agent Tabs */}
        <div className="mb-6">
          <AgentSelector
            agents={agents}
            activeAgentId={activeAgentId}
            onSelect={selectAgent}
          />
        </div>

        {/* Active agent info */}
        {activeAgent && (
          <div className="text-center mb-6">
            <p className="text-sm text-mente-muted italic">
              &ldquo;{activeAgent.description}&rdquo;
            </p>
          </div>
        )}

        {/* Desktop: 3-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Topics */}
          <div className="lg:col-span-1">
            <TopicGrid topics={topics} onSelect={handleTopicSelect} />
          </div>

          {/* Center column: Input */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <CuriosityInput
              activeAgent={activeAgent}
              onSend={handleSend}
              isLoading={isLoading}
            />
          </div>

          {/* Right column: Chat */}
          <div className="lg:col-span-1">
            <ChatPanel
              messages={messages}
              activeAgent={activeAgent}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>

        {/* Mobile: Full-width chat */}
        <div className="mt-6 lg:hidden">
          <ChatPanel
            messages={messages}
            activeAgent={activeAgent}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Bottom info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-mente-muted">
            {agentCount} agentes especialistas ·{" "}
            {mode === "fast"
              ? "Respostas diretas com 1 agente"
              : "Análise profunda com múltiplos agentes"}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Lightweight CSS particle background — no canvas, no JS animation loop */
function ParticleBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes particle-drift {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
        .lab-particle {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: rgba(148, 163, 184, 0.4);
          animation: particle-drift linear infinite;
        }
      `}</style>
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="lab-particle"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: `-${Math.random() * 20}px`,
            animationDuration: `${15 + Math.random() * 25}s`,
            animationDelay: `${Math.random() * 15}s`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
          }}
        />
      ))}
    </div>
  );
}
