// ─── src/app/(main)/lab/LabPageClient.tsx ──────────────────────────────────
//
// Refactored UX: single-column flow
//   Hero → AgentSelector → TopicCarousel → ConversationArea
// No more 3-column grid. Attention flows top-to-bottom.

"use client";

import React, { useState, useEffect } from "react";
import type { Agent } from "@/types/agent";
import type { Topic } from "@/types/topic";
import { useAgent } from "@/hooks/useAgent";
import { useLabMode } from "@/hooks/useLabMode";
import { useChat } from "@/hooks/useChat";
import { LabHero } from "@/components/lab/LabHero";
import { LabModeToggle } from "@/components/lab/LabModeToggle";
import { AgentSelector } from "@/components/lab/AgentSelector";
import { TopicCarousel } from "@/components/lab/TopicCarousel";
import { ConversationArea } from "@/components/lab/ConversationArea";
import { CognitivePipeline } from "@/components/CognitiveHero";
import type { OrchestrationState } from "@/components/CognitiveHero";

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface LabPageClientProps {
  agents: Agent[];
  topics: Topic[];
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export function LabPageClient({ agents, topics }: LabPageClientProps) {
  const { activeAgent, activeAgentId, selectAgent } = useAgent();
  const { mode, toggleMode } = useLabMode();
  const { messages, isLoading, error, send, clearMessages } = useChat(activeAgentId);

  const [hasStarted, setHasStarted] = useState(false);

  const handleSend = (question: string) => {
    setHasStarted(true);
    send(question);
  };

  const handleClear = () => {
    clearMessages();
    setHasStarted(false);
  };

  // Generate particles only on client to avoid hydration mismatch
  const [particles, setParticles] = useState<{ left: string; bottom: string; duration: string; delay: string; width: string; height: string }[]>([]);
  useEffect(() => {
    setParticles(Array.from({ length: 30 }).map(() => ({
      left: `${Math.random() * 100}%`,
      bottom: `-${Math.random() * 20}px`,
      duration: `${15 + Math.random() * 25}s`,
      delay: `${Math.random() * 15}s`,
      width: `${1 + Math.random() * 2}px`,
      height: `${1 + Math.random() * 2}px`,
    })));
  }, []);

  const agentColor = activeAgent?.color ?? "#7C3AED";

  // ── Pipeline state mapping (simple: 3 of 7 nodes wired) ──────────
  const pipelineState: OrchestrationState = error
    ? "error"
    : isLoading
    ? "generating"
    : messages.length > 0
    ? "approved"
    : "idle";

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #1E293B 0%, #0F172A 100%)" }}
    >
      {/* Particle background */}
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
            border-radius: 50%;
            background: rgba(148,163,184,0.4);
            animation: particle-drift linear infinite;
          }
        `}</style>
        {particles.map((p, i) => (
          <div
            key={i}
            className="lab-particle"
            style={{
              left: p.left,
              bottom: p.bottom,
              animationDuration: p.duration,
              animationDelay: p.delay,
              width: p.width,
              height: p.height,
            }}
          />
        ))}
      </div>

      {/* Main content — single column */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* 1. Especialistas */}
        <section id="especialistas" className="mb-8 scroll-mt-24 rounded-3xl border border-cyan-300/20 bg-slate-950/55 p-4 shadow-[0_0_34px_rgba(14,165,233,0.06)] md:p-6">
          <AgentSelector
            agents={agents}
            activeAgentId={activeAgentId}
            onSelect={selectAgent}
          />
        </section>

        {/* 2. Painel de consulta */}
        <section id="consulta" className="scroll-mt-24">
          <LabHero
            activeAgent={activeAgent}
            agentCount={agents.length}
            mode={mode}
            onSend={handleSend}
            isLoading={isLoading}
          />

          <div className="mb-8 flex justify-center">
            <LabModeToggle mode={mode} onToggle={toggleMode} />
          </div>
        </section>
        {/* 4. Topic Carousel — collapses to compact row when conversation active */}
        {!hasStarted ? (
          <TopicCarousel
            topics={topics}
            onSelect={handleSend}
            agentColor={agentColor}
          />
        ) : (
          <div className="mb-4">
            <TopicCarousel
              topics={topics}
              onSelect={handleSend}
              agentColor={agentColor}
              compact
            />
          </div>
        )}

        {/* 4.5 — Cognitive Pipeline (3/7 nodes wired today) */}
        {hasStarted && (
          <div className="mb-8">
            <CognitivePipeline
              state={pipelineState}
              iteration={1}
              cost={0}
              maxIterations={1}
              maxCost={0}
              episodeTitle={activeAgent ? `${activeAgent.name} — ${messages[messages.length - 1]?.content?.slice(0, 40) ?? "..."}` : undefined}
            />
          </div>
        )}

        {/* 5. Conversation Area */}
        <div className="mt-6">
          <ConversationArea
            messages={messages}
            activeAgent={activeAgent}
            isLoading={isLoading}
            error={error}
            onSend={handleSend}
            onClear={handleClear}
            mode={mode}
          />
        </div>
      </div>
    </div>
  );
}
