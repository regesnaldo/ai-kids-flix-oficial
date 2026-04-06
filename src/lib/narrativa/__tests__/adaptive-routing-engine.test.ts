import { describe, expect, it } from "@jest/globals";
import type { UserProfileAgentHistoryEntry } from "@/lib/db/schema";
import { computeAdaptiveRoute } from "@/lib/narrativa/adaptive-routing-engine";

function historyEntry(
  agentId: string,
  dimensaoEmocional: number,
  overrides?: Partial<UserProfileAgentHistoryEntry>,
): UserProfileAgentHistoryEntry {
  return {
    agentId,
    archetype: "analitico-protetor",
    dimensao: "D1_EMOCIONAL",
    choiceId: `choice-${agentId}`,
    choiceLabel: `label-${agentId}`,
    dimensaoEmocional,
    dimensaoIntelectual: 20,
    dimensaoMoral: 20,
    backtrackingApplied: false,
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

describe("adaptive-routing-engine backtracking", () => {
  it("nao aplica backtracking quando nao ha estagnacao", () => {
    const result = computeAdaptiveRoute({
      mensagem: "Quero agir agora e testar uma abordagem nova",
      historico: ["vamos tentar algo diferente", "quero experimentar"],
      fase: 1,
      agenteAtual: "nexus",
      perfilAtual: null,
      dimensaoEmocionalAtual: 22,
      dimensaoIntelectualAtual: 18,
      dimensaoMoralAtual: 14,
      decisionsRecentes: [
        { choiceId: "c1", choiceLabel: "Explorar opcoes" },
        { choiceId: "c2", choiceLabel: "Comparar caminhos" },
        { choiceId: "c3", choiceLabel: "Executar experimento" },
      ],
      agentHistory: [
        historyEntry("janus", 15),
        historyEntry("stratos", 24),
        historyEntry("volt", 31),
      ],
    });

    expect(result.backtrackingAplicado).toBe(false);
    expect(result.agentePrimario).toBe("volt");
    expect(result.justificativa).toContain("NEXUS");
  });

  it("aplica backtracking automatico quando detecta estagnacao", () => {
    const result = computeAdaptiveRoute({
      mensagem: "Estou com medo e triste, nao sei o que fazer",
      historico: ["talvez, estou ansioso", "quero evitar conflito"],
      fase: 1,
      agenteAtual: "nexus",
      perfilAtual: "pacifico-conformista",
      dimensaoEmocionalAtual: 26,
      dimensaoIntelectualAtual: 24,
      dimensaoMoralAtual: 23,
      decisionsRecentes: [
        { choiceId: "c1", choiceLabel: "deixa assim" },
        { choiceId: "c2", choiceLabel: "deixa assim" },
        { choiceId: "c3", choiceLabel: "deixa assim" },
        { choiceId: "c4", choiceLabel: "deixa assim" },
      ],
      agentHistory: [
        historyEntry("janus", 24, { choiceId: "h1" }),
        historyEntry("volt", 24, { choiceId: "h2" }),
        historyEntry("volt", 24, { choiceId: "h3" }),
        historyEntry("volt", 24, { choiceId: "h4" }),
        historyEntry("volt", 24, { choiceId: "h5" }),
      ],
    });

    expect(result.backtrackingAplicado).toBe(true);
    expect(result.agentePrimario).toBe("janus");
    expect(result.justificativa).toContain("Retorno narrativo");
  });
});
