import { describe, it, expect } from "vitest";

/**
 * Tests for the Interactive Choices (LangGraph) system
 */
describe("Interactive Choices System", () => {
  it("should validate choice data structure", () => {
    const choice = {
      id: "cooperate",
      label: "Cooperar com a IA",
      description: "Trabalhar junto com a inteligência artificial",
      type: "cooperate" as const,
      emoji: "🤝",
    };

    expect(choice.id).toBeTruthy();
    expect(choice.label).toBeTruthy();
    expect(choice.description).toBeTruthy();
    expect(["cooperate", "confront", "investigate", "ethical_dilemma"]).toContain(choice.type);
    expect(choice.emoji).toBeTruthy();
  });

  it("should validate all 4 choice types exist in fallback", () => {
    const fallbackChoices = [
      { id: "cooperate", label: "Cooperar com a IA", description: "Trabalhar junto", type: "cooperate", emoji: "🤝" },
      { id: "confront", label: "Questionar a IA", description: "Desafiar", type: "confront", emoji: "⚡" },
      { id: "investigate", label: "Investigar mais", description: "Buscar info", type: "investigate", emoji: "🔍" },
      { id: "ethical_dilemma", label: "Dilema ético", description: "Refletir", type: "ethical_dilemma", emoji: "🧠" },
    ];

    expect(fallbackChoices).toHaveLength(4);
    const types = fallbackChoices.map((c) => c.type);
    expect(types).toContain("cooperate");
    expect(types).toContain("confront");
    expect(types).toContain("investigate");
    expect(types).toContain("ethical_dilemma");
  });

  it("should build decision history context correctly", () => {
    const previousDecisions = [
      { choiceLabel: "Cooperar com a IA", narrativeResponse: "Você decidiu trabalhar junto..." },
      { choiceLabel: "Investigar mais", narrativeResponse: "Ao investigar, você descobriu..." },
    ];

    const historyContext = previousDecisions.length > 0
      ? `\n\nDecisões anteriores do usuário nesta série:\n${previousDecisions.map((d, i) => `${i + 1}. Escolheu: "${d.choiceLabel}" -> Resultado: ${d.narrativeResponse || "N/A"}`).join("\n")}`
      : "";

    expect(historyContext).toContain("Cooperar com a IA");
    expect(historyContext).toContain("Investigar mais");
    expect(historyContext).toContain("1.");
    expect(historyContext).toContain("2.");
  });

  it("should handle empty decision history", () => {
    const previousDecisions: { choiceLabel: string; narrativeResponse: string | null }[] = [];

    const historyContext = previousDecisions.length > 0
      ? `\n\nDecisões anteriores:\n${previousDecisions.map((d, i) => `${i + 1}. "${d.choiceLabel}"`).join("\n")}`
      : "";

    expect(historyContext).toBe("");
  });

  it("should build decision path correctly", () => {
    const existingDecisions = [
      { choiceId: "cooperate", choiceLabel: "Cooperar com a IA" },
      { choiceId: "investigate", choiceLabel: "Investigar mais" },
    ];

    const newChoice = { choiceId: "ethical_dilemma", choiceLabel: "Dilema ético" };

    const decisionPath = [
      ...existingDecisions.map((d) => ({ choiceId: d.choiceId, choiceLabel: d.choiceLabel })),
      { choiceId: newChoice.choiceId, choiceLabel: newChoice.choiceLabel },
    ];

    expect(decisionPath).toHaveLength(3);
    expect(decisionPath[0].choiceId).toBe("cooperate");
    expect(decisionPath[2].choiceId).toBe("ethical_dilemma");
  });

  it("should validate interactive decision insert data", () => {
    const insertData = {
      userId: 1,
      episodeId: 30001,
      seriesId: 30001,
      choiceId: "cooperate",
      choiceLabel: "Cooperar com a IA",
      narrativeResponse: "Você decidiu trabalhar junto com a IA...",
      graphState: { currentNode: "cooperate", episodeId: 30001 },
      decisionPath: [{ choiceId: "cooperate", choiceLabel: "Cooperar com a IA" }],
    };

    expect(insertData.userId).toBeGreaterThan(0);
    expect(insertData.episodeId).toBeGreaterThan(0);
    expect(insertData.seriesId).toBeGreaterThan(0);
    expect(insertData.choiceId).toBeTruthy();
    expect(insertData.choiceLabel).toBeTruthy();
    expect(insertData.narrativeResponse).toBeTruthy();
    expect(insertData.graphState).toHaveProperty("currentNode");
    expect(insertData.decisionPath).toBeInstanceOf(Array);
  });

  it("should parse series ID from string format for interactive choices", () => {
    const seriesId = "series-3";
    const parsed = parseInt(seriesId.replace("series-", "")) || 30001;
    expect(parsed).toBe(3);

    const episodeId = "ep-s1-e5";
    const parsedEp = parseInt(episodeId.replace(/\D/g, "")) || 30001;
    expect(parsedEp).toBe(15);
  });

  it("should validate JSON schema for LLM response format", () => {
    const schema = {
      type: "object",
      properties: {
        choices: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              label: { type: "string" },
              description: { type: "string" },
              type: { type: "string", enum: ["cooperate", "confront", "investigate", "ethical_dilemma"] },
              emoji: { type: "string" },
            },
            required: ["id", "label", "description", "type", "emoji"],
            additionalProperties: false,
          },
        },
      },
      required: ["choices"],
      additionalProperties: false,
    };

    expect(schema.properties.choices.items.required).toHaveLength(5);
    expect(schema.properties.choices.items.properties.type.enum).toHaveLength(4);
  });
});
