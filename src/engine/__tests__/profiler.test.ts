import { describe, expect, it } from "@jest/globals";
import { profileInteraction } from "@/engine/profiler";

describe("engine/profiler", () => {
  it("eleva dimensão intelectual com sinais lógicos e dados", () => {
    const result = profileInteraction({
      texto: "Quero analisar dados e evidencias com método",
      dimensoesAtuais: { emocional: 20, intelectual: 15, moral: 30 },
    });

    expect(result.dimensoes.intelectual).toBeGreaterThan(15);
    expect(result.archetypeHint).toBe("analitico");
  });

  it("detecta paralisia por medo/conformismo e reduz emocional", () => {
    const result = profileInteraction({
      texto: "Nao sei, talvez seja melhor evitar. Estou com medo.",
      dimensoesAtuais: { emocional: 40, intelectual: 40, moral: 40 },
    });

    expect(result.dimensoes.emocional).toBeLessThan(40);
    expect(result.archetypeHint).toBe("paralisado");
  });
});

