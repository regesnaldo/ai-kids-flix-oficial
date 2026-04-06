import { describe, expect, it } from "@jest/globals";
import { routeAgent } from "@/engine/router";

describe("engine/router", () => {
  it("rota analitico para AXIOM/NEXUS", () => {
    const result = routeAgent({
      dimensoes: { emocional: 20, intelectual: 92, moral: 70 },
      escolhasRecentes: ["preciso de dados", "quero evidencias"],
    });

    expect(result.archetype).toBe("analitico");
    expect(["axiom", "nexus"]).toContain(result.agentId);
  });

  it("rota rebelde para KAOS/ETHOS", () => {
    const result = routeAgent({
      dimensoes: { emocional: 95, intelectual: 35, moral: 40 },
      escolhasRecentes: ["quero quebrar as regras", "e se fosse o oposto?"],
    });

    expect(result.archetype).toBe("rebelde");
    expect(["kaos", "ethos"]).toContain(result.agentId);
  });

  it("rota paralisado para VOLT", () => {
    const result = routeAgent({
      dimensoes: { emocional: 5, intelectual: 8, moral: 7 },
      escolhasRecentes: ["nao sei", "talvez depois", "estou travado"],
    });

    expect(result.archetype).toBe("paralisado");
    expect(result.agentId).toBe("volt");
  });

  it("rota empatico para TERRA/LYRA", () => {
    const result = routeAgent({
      dimensoes: { emocional: 76, intelectual: 32, moral: 92 },
      escolhasRecentes: ["quero cuidar das pessoas", "qual o impacto coletivo?"],
    });

    expect(result.archetype).toBe("empatico");
    expect(["terra", "lyra"]).toContain(result.agentId);
  });

  it("rota estrategico para STRATOS", () => {
    const result = routeAgent({
      dimensoes: { emocional: 44, intelectual: 91, moral: 78 },
      escolhasRecentes: ["vamos montar um plano", "priorizar e executar"],
    });

    expect(result.archetype).toBe("estrategico");
    expect(result.agentId).toBe("stratos");
  });

  it("rota criativo para PRISM/AURORA", () => {
    const result = routeAgent({
      dimensoes: { emocional: 85, intelectual: 62, moral: 28 },
      escolhasRecentes: ["vamos criar algo novo", "imaginar e experimentar"],
    });

    expect(result.archetype).toBe("criativo");
    expect(["prism", "aurora"]).toContain(result.agentId);
  });

  it("evita sequencia direta STRATOS -> KAOS", () => {
    const result = routeAgent({
      dimensoes: { emocional: 95, intelectual: 30, moral: 20 },
      escolhasRecentes: ["quero quebrar as regras agora"],
      lastAgentId: "stratos",
    });

    expect(result.archetype).toBe("rebelde");
    expect(result.agentId).toBe("ethos");
  });

  it("evita sequencia direta KAOS -> STRATOS", () => {
    const result = routeAgent({
      dimensoes: { emocional: 10, intelectual: 95, moral: 70 },
      escolhasRecentes: ["plano de longo prazo com dados"],
      lastAgentId: "kaos",
    });

    expect(result.archetype).toBe("estrategico");
    expect(result.agentId).toBe("nexus");
  });
});
