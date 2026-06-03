"use client";

import React from "react";

interface LabHeaderProps {
  agentCount: number;
  mode: string;
}

export function LabHeader({ agentCount, mode }: LabHeaderProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-mente-text">
        Laboratório de Descoberta
      </h1>
      <p className="mt-2 text-mente-muted text-sm md:text-base max-w-xl mx-auto">
        {agentCount} agentes especialistas prontos para responder suas perguntas sobre inteligência artificial
      </p>
      <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mente-success/10 border border-mente-success/20 text-mente-success text-xs font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-mente-success animate-pulse" />
        Modo {mode === "fast" ? "Rápido" : "Completo"} —{" "}
        {mode === "fast" ? "respostas diretas com 1 agente" : "análise profunda com múltiplos agentes"}
      </div>
    </div>
  );
}
