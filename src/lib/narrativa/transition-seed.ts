import type { UniversoId } from "@/data/universos";

const SEED_LINES: Partial<Record<UniversoId, string>> = {
  nexus: "Antes de avançarmos, observe o padrão que você acabou de revelar.",
  volt: "Agora transforme intenção em movimento e leve essa energia adiante.",
  janus: "Leve consigo os dois lados da questão e escolha com consciência.",
  stratos: "A próxima etapa pede estratégia clara e execução com precisão.",
  kaos: "Você já viu o óbvio; agora teste o inesperado com coragem.",
  ethos: "A decisão seguinte vai mostrar quais valores realmente guiam você.",
  lyra: "Converta esse insight em expressão e deixe o significado emergir.",
  axim: "Vamos validar a hipótese seguinte com evidência e método.",
  aurora: "Hora de abrir horizonte e experimentar uma direção nova.",
  cipher: "Há uma camada oculta nessa escolha, e ela será revelada agora.",
  terra: "A próxima escolha amplia seu impacto no coletivo.",
  prism: "Você está pronto para integrar as peças em uma visão mais ampla.",
};

export function buildTransitionSeed(fromAgent: UniversoId, toAgent: UniversoId): string {
  const fromSeed = SEED_LINES[fromAgent] ?? "A jornada continua com uma nova perspectiva.";
  const toSeed = SEED_LINES[toAgent] ?? "O próximo universo já está preparado para você.";
  return `${fromSeed} ${toSeed}`;
}

