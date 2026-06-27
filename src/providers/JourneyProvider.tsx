"use client";

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { useSession } from "@/providers/SessionProvider";
import { useOasis } from "@/providers/OasisProvider";

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface JourneyState {
  /** Archetype real do usuário (null se não tiver perfil) */
  archetype: string | null;
  /** Próximo agente/universo recomendado */
  recommended: string;
  /** Se o usuário precisa passar pelo onboarding */
  needsOnboarding: boolean;
  /** Quantos episódios completou */
  completed: number;
  /** Dimensões do perfil cognitivo */
  dimensions: {
    emotional: number;
    intellectual: number;
    moral: number;
  };
  /** Se os dados estão carregando */
  loading: boolean;
  /** Erro na requisição (null se OK) */
  error: string | null;
}

export interface JourneyContextValue {
  journey: JourneyState;
  /** Força recarregamento dos dados */
  refresh: () => void;
}

const DEFAULT_JOURNEY: JourneyState = {
  archetype: null,
  recommended: "NEXUS",
  needsOnboarding: false,
  completed: 0,
  dimensions: { emotional: 0, intellectual: 0, moral: 0 },
  loading: true,
  error: null,
};

const JourneyContext = createContext<JourneyContextValue>({
  journey: DEFAULT_JOURNEY,
  refresh: () => {},
});

export function useJourney() {
  return useContext(JourneyContext);
}

// ═══════════════════════════════════════════════════════════════════
// HELPER: map de destino por archetype (mesmo do route da API)
// ═══════════════════════════════════════════════════════════════════

const ARCHETYPE_DESTINATIONS: Record<string, string[]> = {
  analytical: ["NEXUS", "AXIOM"],
  rebel: ["KAOS", "ETHOS"],
  paralyzed: ["VOLT"],
  empathetic: ["TERRA", "LYRA"],
  strategic: ["STRATOS"],
  creative: ["PRISM", "AURORA"],
};

const AGENT_FACTION: Record<string, string> = {
  NEXUS: "INTELIGÊNCIA",
  VOLT: "ENERGIA",
  AURORA: "INOVAÇÃO",
  ETHOS: "ÉTICA",
  KAOS: "CAOS",
  CIPHER: "CRIPTOGRAFIA",
  LYRA: "CRIATIVIDADE",
  AXIOM: "ANÁLISE",
  STRATOS: "ESTRATÉGIA",
  TERRA: "EMPATIA",
  PRISM: "FILOSOFIA",
  JANUS: "CONEXÃO",
};

const AGENT_COLORS: Record<string, string> = {
  NEXUS: "#00FFFF",
  VOLT: "#FFD700",
  AURORA: "#FF69B4",
  ETHOS: "#00FF88",
  KAOS: "#FF4500",
  CIPHER: "#9400D3",
  LYRA: "#FF1493",
  AXIOM: "#00BFFF",
  STRATOS: "#7CFC00",
  TERRA: "#8B4513",
  PRISM: "#EE82EE",
  JANUS: "#FFA500",
};

/**
 * Retorna uma justificativa textual para a recomendação de próximo agente
 * baseada no archetype do usuário e na progressão atual.
 */
export function getRecommendationReason(archetype: string | null, recommended: string): string {
  if (!archetype) {
    return "Complete a calibração inicial para receber recomendações personalizadas.";
  }

  const destinations = ARCHETYPE_DESTINATIONS[archetype];
  if (!destinations) {
    return `Explore o universo ${recommended} baseado no seu perfil.`;
  }

  if (destinations[0] === recommended) {
    switch (archetype) {
      case "analytical":
        return "Seu perfil analítico encontra ressonância no universo da lógica pura.";
      case "rebel":
        return "Mentes rebeldes encontram seu campo de provas no caos estruturado.";
      case "paralyzed":
        return "Hora de encontrar sua faísca — o universo da energia aguarda.";
      case "empathetic":
        return "Sua sensibilidade encontra propósito na conexão com o mundo.";
      case "strategic":
        return "Estrategistas encontram desafios à altura no tabuleiro cósmico.";
      case "creative":
        return "Criatividade é a chave para os portais da inovação e da filosofia.";
      default:
        return `Baseado no seu perfil, ${recommended} é o próximo passo ideal.`;
    }
  }

  return `Após dominar ${destinations[0]}, ${recommended} expandirá seus horizontes.`;
}

/**
 * Retorna o nome amigável do archetype em português.
 */
export function getArchetypeLabel(archetype: string | null): string {
  const labels: Record<string, string> = {
    analytical: "Analítico",
    rebel: "Rebelde",
    paralyzed: "Paralisado",
    empathetic: "Empático",
    strategic: "Estrategista",
    creative: "Criativo",
    explorer: "Explorador",
  };
  return archetype ? (labels[archetype] ?? archetype) : "Em formação";
}

// ═══════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: sessionLoading } = useSession();
  const { cognitiveProfile, progressionSnapshot } = useOasis();

  const [journey, setJourney] = useState<JourneyState>(DEFAULT_JOURNEY);

  const fetchJourney = useCallback(async () => {
    try {
      setJourney((prev) => ({ ...prev, loading: true, error: null }));

      const res = await fetch("/api/home/journey");
      if (!res.ok) {
        if (res.status === 401) {
          setJourney((prev) => ({
            ...prev,
            loading: false,
            error: "Usuário não autenticado",
          }));
          return;
        }
        setJourney((prev) => ({
          ...prev,
          loading: false,
          error: `Erro ${res.status}`,
        }));
        return;
      }

      const data = await res.json();

      setJourney({
        archetype: data.archetype,
        recommended: data.recommended ?? "NEXUS",
        needsOnboarding: data.needsOnboarding ?? false,
        completed: data.completed ?? 0,
        dimensions: data.dimensions ?? { emotional: 0, intellectual: 0, moral: 0 },
        loading: false,
        error: null,
      });
    } catch (err) {
      setJourney((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Erro ao buscar jornada",
      }));
    }
  }, []);

  // Fetch on mount + when session loads
  useEffect(() => {
    if (!sessionLoading) {
      fetchJourney();
    }
  }, [sessionLoading, fetchJourney]);

  const contextValue = useMemo(() => ({ journey, refresh: fetchJourney }), [journey, fetchJourney]);

  return (
    <JourneyContext.Provider value={contextValue}>
      {children}
    </JourneyContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════
// EXPORTS (for components)
// ═══════════════════════════════════════════════════════════════════

export { ARCHETYPE_DESTINATIONS, AGENT_FACTION, AGENT_COLORS };
