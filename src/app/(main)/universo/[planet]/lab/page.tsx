"use client";

/**
 * Contextualized Planet Lab — Runtime-driven cognitive laboratory.
 *
 * Route: /universo/[planet]/lab
 *
 * Every planet lab is the SAME component. Behavior comes from the registry:
 *   - Load planet from planetRegistry[params.planet]
 *   - Load prompt dynamically via prompt-loader
 *   - Compress memory before inference via context-compressor
 *   - Emit events through event bus (never direct component coupling)
 *
 * NO hardcoded planet behavior. NO if/switch on planet name.
 */

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { planetRegistry, type PlanetId } from "@/lib/universe/planet-registry";
import { calculatePlanetState } from "@/lib/universe/progression-engine";
import type { PlayerProgression } from "@/lib/universe/progression-engine";
import { compressMemory, buildInferencePayload, type MessageStub } from "@/lib/universe/context-compressor";
import { getPlanetPromptSync } from "@/lib/universe/prompt-loader";
import { universeBus } from "@/lib/universe/event-bus";
import { ScannerRing } from "@/components/hud/ScannerRing";
import { SignalBars } from "@/components/hud/SignalBars";
import { GridOverlay } from "@/components/hud/GridOverlay";
import { ClassificationTag } from "@/components/hud/ClassificationTag";
import { ActionNode } from "@/components/hud/ActionNode";
import { tokens } from "@/design-system/tokens";
import { typography, toStyle } from "@/design-system/typography";

// ─── TEMPORARY PROGRESSION STUB ───────────────────────────────────────────────

/**
 * Foundation Freeze uses an in-memory progression state.
 * Phase 2 will replace this with a database-backed store.
 */
const MOCK_PROGRESSION: PlayerProgression = {
  completed: [],
  activePlanet: null,
  available: ["nexus"],
  activeHints: [],
  lastProgressionAt: 0,
  totalCompleted: 0,
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function PlanetLabPage() {
  const params = useParams<{ planet: string }>();
  const router = useRouter();

  // Resolve planet from registry
  const planetId = params.planet.toLowerCase() as PlanetId;
  const planet = planetRegistry[planetId];

  // If planet doesn't exist in registry, show error
  if (!planet) {
    return (
      <LabShell>
        <NotFound planetKey={params.planet} />
      </LabShell>
    );
  }

  return <PlanetLab planetId={planetId} router={router} />;
}

// ─── PLANET LAB ───────────────────────────────────────────────────────────────

function PlanetLab({
  planetId,
  router,
}: {
  planetId: PlanetId;
  router: ReturnType<typeof useRouter>;
}) {
  const planet = planetRegistry[planetId];
  const prompt = getPlanetPromptSync(planetId);

  const [messages, setMessages] = useState<MessageStub[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [progression] = useState<PlayerProgression>(() => ({
    ...MOCK_PROGRESSION,
    activePlanet: planetId,
  }));

  const state = calculatePlanetState(planetId, progression);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Emit planet activation event on mount
  useEffect(() => {
    universeBus.emit({ type: "PLANET_ACTIVATED", planetId });
    return () => {
      // Cleanup — signal departure
      universeBus.emit({
        type: "AUDIO_STATE_CHANGED",
        planetId,
        signature: planet.audioSignature,
        active: false,
      });
    };
  }, [planetId, planet.audioSignature]);

  // Handle message submission
  const handleSubmit = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: MessageStub = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      // Compress memory before inference
      const compressed = compressMemory(updatedMessages, planetId);
      const payload = buildInferencePayload(
        compressed,
        updatedMessages,
        prompt
      );

      // Call the chat API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: payload.system },
            ...payload.messages,
          ],
          agentId: planetId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantContent =
        data.content || data.message || "Resposta não disponível.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantContent },
      ]);

      // Emit signal on response
      universeBus.emit({
        type: "SIGNAL_DETECTED",
        planetId,
        strength: 0.7,
      });
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `[ERRO] Falha na comunicação com ${planet.name}. Tente novamente.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, planetId, planet.name, prompt]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <LabShell>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: tokens.spacing.md,
          padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
          borderBottom: tokens.border.subtle,
        }}
      >
        <ScannerRing
          state={loading ? "scanning" : "idle"}
          size={24}
        />

        <div style={{ flex: 1 }}>
          <h1
            style={{
              ...toStyle(typography.classified),
              color: planet.color,
              margin: 0,
            }}
          >
            {planet.name}
          </h1>
          <p
            style={{
              ...toStyle(typography.micro),
              color: tokens.color.text.tertiary,
              margin: 0,
            }}
          >
            {planet.subtitle} — Clearance: {planet.clearance.toUpperCase()}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.sm }}>
          <SignalBars state="moderate" />
          <ClassificationTag
            state="highlighted"
            clearance={planet.clearance}
            label={planet.name}
          />
        </div>

        <ActionNode
          state="unlocked"
          label="MAPA"
          onClick={() => router.push("/universo")}
        />
      </div>

      {/* ── Messages ────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: tokens.spacing.lg,
          display: "flex",
          flexDirection: "column",
          gap: tokens.spacing.md,
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: tokens.spacing.md,
            }}
          >
            <ScannerRing state="idle" size={48} />
            <p
              style={{
                ...toStyle(typography.signal),
                color: tokens.color.text.tertiary,
                textAlign: "center",
                maxWidth: "320px",
              }}
            >
              {planet.name} aguarda sua primeira transmissão.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "75%",
              padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
              background:
                msg.role === "user"
                  ? tokens.color.surface.panelElevated
                  : tokens.color.surface.panel,
              border:
                msg.role === "assistant"
                  ? `1px solid ${planet.color}22`
                  : tokens.border.subtle,
              clipPath:
                "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)",
            }}
          >
            <p
              style={{
                ...toStyle(typography.operational),
                color:
                  msg.role === "assistant"
                    ? tokens.color.text.primary
                    : tokens.color.text.secondary,
                margin: 0,
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.content}
            </p>
          </div>
        ))}

        {loading && (
          <div style={{ alignSelf: "flex-start", padding: tokens.spacing.sm }}>
            <ScannerRing state="scanning" size={20} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ────────────────────────────────────────────────── */}
      <div
        style={{
          padding: tokens.spacing.md,
          borderTop: tokens.border.subtle,
          display: "flex",
          gap: tokens.spacing.sm,
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Transmitir para ${planet.name}...`}
          disabled={loading}
          rows={2}
          style={{
            flex: 1,
            ...toStyle(typography.operational),
            background: "transparent",
            border: tokens.border.subtle,
            color: tokens.color.text.primary,
            padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
            resize: "none",
            outline: "none",
            fontFamily: typography.fontFamily.body,
          }}
        />

        <ActionNode
          state={loading ? "locked" : "unlocked"}
          label="ENVIAR"
          onClick={handleSubmit}
        />
      </div>
    </LabShell>
  );
}

// ─── LAB SHELL ────────────────────────────────────────────────────────────────

function LabShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: tokens.color.surface.background,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <GridOverlay state="idle" />
      <div
        style={{
          position: "relative",
          zIndex: tokens.zIndex.content,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── NOT FOUND ────────────────────────────────────────────────────────────────

function NotFound({ planetKey }: { planetKey: string }) {
  const router = useRouter();

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: tokens.spacing.lg,
      }}
    >
      <ScannerRing state="error" size={64} />
      <p
        style={{
          ...toStyle(typography.signal),
          color: tokens.color.text.danger,
          textAlign: "center",
        }}
      >
        COORDENADAS NÃO ENCONTRADAS
      </p>
      <p
        style={{
          ...toStyle(typography.operational),
          color: tokens.color.text.tertiary,
          textAlign: "center",
          maxWidth: "320px",
        }}
      >
        Planeta &quot;{planetKey}&quot; não existe no registro do sistema.
      </p>
      <ActionNode
        state="unlocked"
        label="RETORNAR AO MAPA"
        onClick={() => router.push("/universo")}
      />
    </div>
  );
}
