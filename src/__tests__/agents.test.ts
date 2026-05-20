import { ALL_AGENTS } from "@/canon/agents/all-agents";

const CANONICAL_IDS = [
  "nexus",
  "kaos",
  "cipher",
  "lyra",
  "axiom",
  "stratos",
  "terra",
  "prism",
  "janus",
  "volt",
  "aurora",
  "ethos",
] as const;

describe("ALL_AGENTS smoke test", () => {
  test("contém exatamente 12 agentes", () => {
    expect(ALL_AGENTS).toHaveLength(12);
  });

  test.each(CANONICAL_IDS)("agente canônico %s existe em ALL_AGENTS", (id) => {
    const found = ALL_AGENTS.find((agent) => agent.id === id);
    expect(found).toBeDefined();
  });

  test.each(CANONICAL_IDS)("agente %s possui campos id, name e personality", (id) => {
    const agent = ALL_AGENTS.find((a) => a.id === id);
    expect(agent).toBeDefined();
    expect(typeof agent!.id).toBe("string");
    expect(agent!.id.length).toBeGreaterThan(0);
    expect(typeof agent!.name).toBe("string");
    expect(agent!.name.length).toBeGreaterThan(0);
    expect(agent!.personality).toBeDefined();
  });
});
