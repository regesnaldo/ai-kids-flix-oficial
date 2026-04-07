"use client";

import { useCallback } from "react";

type TranslationKeys = {
  dimensions: Record<string, string>;
  levels: Record<string, string>;
  factions: Record<string, string>;
  ui: Record<string, string>;
  badges: Record<string, string>;
  seasons: Record<string, string>;
  episodes: Record<string, string>;
  agents: Record<string, string>;
  navigation: Record<string, string>;
  actions: Record<string, string>;
  messages: Record<string, string>;
};

const translations: Record<string, TranslationKeys> = {
  "pt-BR": {
    dimensions: {
      philosophical: "Filosófica",
      emotional: "Emocional",
      creative: "Criativa",
      ethical: "Ética",
      social: "Social",
      spiritual: "Espiritual",
      intellectual: "Intelectual",
      practical: "Prática",
      aesthetic: "Estética",
      political: "Política",
      scientific: "Científica",
      mystical: "Mística",
    },
    levels: {
      primordial: "Primordial",
      mythic: "Mítico",
      archetypal: "Arquetípico",
      human: "Humano",
    },
    factions: {
      order: "Ordem",
      chaos: "Caos",
      balance: "Equilíbrio",
    },
    ui: {
      home: "Início",
      agents: "Agentes",
      laboratory: "Laboratório",
      explore: "Explorar",
      search: "Buscar agente por nome ou abordagem...",
      allDimensions: "Todas Dimensões",
      allLevels: "Todos Níveis",
      allFactions: "Todas Facções",
      showing: "Mostrando",
      of: "de",
      agentsCountLabel: "agentes",
    },
    badges: {
      "Mente Analítica": "Mente Analítica",
      "Coração Aberto": "Coração Aberto",
    },
    seasons: {
      title: "Temporadas",
      episode: "Episódio",
      season: "Temporada",
      watchNow: "Assistir Agora",
      continue: "Continuar",
      completed: "Concluído",
      locked: "Bloqueado",
      progress: "Progresso",
    },
    episodes: {
      title: "Episódios",
      duration: "Duração",
      minutes: "min",
      xpReward: "Recompensa XP",
      difficulty: "Dificuldade",
      easy: "Fácil",
      medium: "Médio",
      hard: "Difícil",
      expert: "Especialista",
      master: "Mestre",
    },
    agents: {
      nexus: "NEXUS - O Guia",
      axiom: "AXIOM - Analisador de Padrões",
      volt: "VOLT - Catalisador de Ação",
      ethos: "ETHOS - Guardião da Ética",
      kaos: "KAOS - Agente do Caos",
      cipher: "CIPHER - Mestre de Dados",
      aurora: "AURORA - Visão Criativa",
      stratos: "STRATOS - Arquiteto de Estratégia",
    },
    navigation: {
      home: "Início",
      library: "Biblioteca",
      ranking: "Ranking",
      profile: "Perfil",
      settings: "Configurações",
    },
    actions: {
      start: "Iniciar",
      continue: "Continuar",
      retry: "Tentar Novamente",
      back: "Voltar",
      next: "Próximo",
      submit: "Enviar",
      cancel: "Cancelar",
      save: "Salvar",
      delete: "Excluir",
      edit: "Editar",
    },
    messages: {
      loading: "Carregando...",
      error: "Ocorreu um erro",
      success: "Sucesso",
      noResults: "Nenhum resultado encontrado",
      welcome: "Bem-vindo ao MENTE.AI",
      selectChoice: "Faça sua escolha",
    },
  },
  en: {
    dimensions: {
      philosophical: "Philosophical",
      emotional: "Emotional",
      creative: "Creative",
      ethical: "Ethical",
      social: "Social",
      spiritual: "Spiritual",
      intellectual: "Intellectual",
      practical: "Practical",
      aesthetic: "Aesthetic",
      political: "Political",
      scientific: "Scientific",
      mystical: "Mystical",
    },
    levels: {
      primordial: "Primordial",
      mythic: "Mythic",
      archetypal: "Archetypal",
      human: "Human",
    },
    factions: {
      order: "Order",
      chaos: "Chaos",
      balance: "Balance",
    },
    ui: {
      home: "Home",
      agents: "Agents",
      laboratory: "Laboratory",
      explore: "Explore",
      search: "Search agent by name or approach...",
      allDimensions: "All Dimensions",
      allLevels: "All Levels",
      allFactions: "All Factions",
      showing: "Showing",
      of: "of",
      agentsCountLabel: "agents",
    },
    badges: {
      "Mente Analítica": "Analytical Mind",
      "Coração Aberto": "Open Heart",
    },
    seasons: {
      title: "Seasons",
      episode: "Episode",
      season: "Season",
      watchNow: "Watch Now",
      continue: "Continue",
      completed: "Completed",
      locked: "Locked",
      progress: "Progress",
    },
    episodes: {
      title: "Episodes",
      duration: "Duration",
      minutes: "min",
      xpReward: "XP Reward",
      difficulty: "Difficulty",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      expert: "Expert",
      master: "Master",
    },
    agents: {
      nexus: "NEXUS - The Guide",
      axiom: "AXIOM - Pattern Analyzer",
      volt: "VOLT - Action Catalyst",
      ethos: "ETHOS - Ethics Guardian",
      kaos: "KAOS - Chaos Agent",
      cipher: "CIPHER - Data Master",
      aurora: "AURORA - Creative Vision",
      stratos: "STRATOS - Strategy Architect",
    },
    navigation: {
      home: "Home",
      library: "Library",
      ranking: "Ranking",
      profile: "Profile",
      settings: "Settings",
    },
    actions: {
      start: "Start",
      continue: "Continue",
      retry: "Retry",
      back: "Back",
      next: "Next",
      submit: "Submit",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
    },
    messages: {
      loading: "Loading...",
      error: "An error occurred",
      success: "Success",
      noResults: "No results found",
      welcome: "Welcome to MENTE.AI",
      selectChoice: "Make your choice",
    },
  },
};

export function useTranslations(locale: string = "pt-BR") {
  const t = useCallback(
    (key: string, fallback?: string): string => {
      const keys = key.split(".");
      let value: any = translations[locale] || translations["pt-BR"];

      for (const k of keys) {
        value = value?.[k];
        if (value === undefined || value === null) {
          return fallback || key;
        }
      }

      return String(value);
    },
    [locale]
  );

  const getAll = useCallback(
    (section: keyof TranslationKeys): Record<string, string> => {
      return translations[locale]?.[section] || translations["pt-BR"]?.[section] || {};
    },
    [locale]
  );

  return { t, getAll };
}

export function getTranslation(
  locale: string,
  key: string,
  fallback?: string
): string {
  const keys = key.split(".");
  let value: any = translations[locale] || translations["pt-BR"];

  for (const k of keys) {
    value = value?.[k];
    if (value === undefined || value === null) {
      return fallback || key;
    }
  }

  return String(value);
}

export { translations };
export type { TranslationKeys };