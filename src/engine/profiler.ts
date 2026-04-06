import type { ArchetypeId } from "@/engine/router";

export interface ProfileDimensions {
  emocional: number;
  intelectual: number;
  moral: number;
}

export interface ProfilerInput {
  texto: string;
  escolha?: string;
  historico?: string[];
  escolhasRecentes?: string[];
  dimensoesAtuais: ProfileDimensions;
}

export interface ProfilerSignals {
  curiosidade: number;
  medo: number;
  rebeldia: number;
  conformismo: number;
  logico: number;
  intuitivo: number;
  dados: number;
  metafora: number;
  protegeHumanidade: number;
  expandePoderIA: number;
}

export interface ProfilerResult {
  dimensoes: ProfileDimensions;
  sinais: ProfilerSignals;
  archetypeHint: ArchetypeId;
}

const SIGNAL_PATTERNS: Record<keyof ProfilerSignals, string[]> = {
  curiosidade: ["curioso", "quero entender", "como funciona", "explorar", "descobrir", "investigar"],
  medo: ["medo", "receio", "ansioso", "inseguro", "evitar", "travar"],
  rebeldia: ["quebrar", "desafiar", "oposto", "sem regras", "provocar", "discordo"],
  conformismo: ["tudo bem", "pode ser", "deixa assim", "tanto faz", "talvez", "nao sei"],
  logico: ["logica", "analise", "metodo", "criterio", "sistematico", "hipotese"],
  intuitivo: ["intuicao", "sinto", "instinto", "pressinto", "vibe", "coração"],
  dados: ["dados", "evidencia", "prova", "medir", "metrica", "estatistica"],
  metafora: ["metafora", "imagina", "como se", "poetico", "simbolo", "analogia"],
  protegeHumanidade: ["humanidade", "proteger pessoas", "seguranca", "etica", "impacto coletivo", "responsabilidade"],
  expandePoderIA: ["acelerar ia", "dominar", "otimizar sem limite", "mais poder", "escala total", "autonomia da ia"],
};

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function countMatches(text: string, patterns: string[]): number {
  const normalized = normalize(text);
  return patterns.filter((pattern) => normalized.includes(pattern)).length;
}

function extractSignals(textChunks: string[]): ProfilerSignals {
  const total = Math.max(1, textChunks.length);
  const signals: ProfilerSignals = {
    curiosidade: 0,
    medo: 0,
    rebeldia: 0,
    conformismo: 0,
    logico: 0,
    intuitivo: 0,
    dados: 0,
    metafora: 0,
    protegeHumanidade: 0,
    expandePoderIA: 0,
  };

  textChunks.forEach((chunk, index) => {
    const recencyWeight = (index + 1) / total;
    (Object.keys(SIGNAL_PATTERNS) as (keyof ProfilerSignals)[]).forEach((key) => {
      const matches = countMatches(chunk, SIGNAL_PATTERNS[key]);
      if (matches > 0) {
        signals[key] += matches * recencyWeight;
      }
    });
  });

  return signals;
}

function updateDimensions(base: ProfileDimensions, signals: ProfilerSignals): ProfileDimensions {
  const emotionalDelta =
    signals.curiosidade * 2 +
    signals.rebeldia * 1.5 -
    signals.medo * 2 -
    signals.conformismo * 1.4;

  const intellectualDelta =
    signals.logico * 2.2 +
    signals.dados * 2 -
    signals.intuitivo * 1.1 -
    signals.metafora * 0.8;

  const moralDelta =
    signals.protegeHumanidade * 2.5 -
    signals.expandePoderIA * 2;

  return {
    emocional: clamp(base.emocional + emotionalDelta),
    intelectual: clamp(base.intelectual + intellectualDelta),
    moral: clamp(base.moral + moralDelta),
  };
}

function classifyArchetype(signals: ProfilerSignals, dims: ProfileDimensions): ArchetypeId {
  if (signals.medo + signals.conformismo >= 2.2) {
    return "paralisado";
  }

  if (signals.logico + signals.dados >= 1.8) {
    return "analitico";
  }

  if (signals.rebeldia >= 1.4) {
    return "rebelde";
  }

  if (signals.protegeHumanidade >= 1.2) {
    return "empatico";
  }

  const scoreMap: Record<ArchetypeId, number> = {
    analitico: dims.intelectual * 0.8 + signals.logico * 4 + signals.dados * 4,
    rebelde: dims.emocional + signals.rebeldia * 5,
    paralisado: signals.conformismo * 5 + signals.medo * 6,
    empatico: dims.moral + signals.protegeHumanidade * 5,
    estrategico: dims.intelectual * 0.55 + dims.moral * 0.45 + signals.logico * 1.5,
    criativo: signals.metafora * 4 + signals.curiosidade * 2 + dims.emocional * 0.5,
  };

  return (Object.entries(scoreMap) as [ArchetypeId, number][])
    .sort((a, b) => b[1] - a[1])[0][0];
}

export function profileInteraction(input: ProfilerInput): ProfilerResult {
  const chunks = [
    ...(input.historico ?? []),
    ...(input.escolhasRecentes ?? []),
    input.escolha ?? "",
    input.texto,
  ].filter(Boolean);

  const sinais = extractSignals(chunks);
  const dimensoes = updateDimensions(input.dimensoesAtuais, sinais);
  const archetypeHint = classifyArchetype(sinais, dimensoes);

  return {
    dimensoes,
    sinais,
    archetypeHint,
  };
}
