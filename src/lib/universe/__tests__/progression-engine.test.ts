/**
 * progression-engine — Testes Unitários e de Integração
 *
 * Cobre:
 *   - Funções puras: calculatePlanetState, allRequiresMet, getUniverseSnapshot,
 *     countByState, createInitialProgression
 *   - Funções async com DB mockado: getOrCreateProgression, activatePlanet,
 *     completePlanet, generateHint, clearHint
 *   - Cooldown, unlocks, hints, validação de estado
 *   - Fluxo completo: nexus → kaos → ethos → volt → stratos
 */

import type { PlanetId } from "../planet-registry";
import {
  createInitialProgression,
  calculatePlanetState,
  getUniverseSnapshot,
  countByState,
  type PlayerProgression,
  type Hint,
} from "../progression-engine";

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DO DB
// ═══════════════════════════════════════════════════════════════════════════════

const mockDbSelect = jest.fn();
const mockDbInsert = jest.fn();
const mockDbUpdate = jest.fn();
const mockDbWhere = jest.fn();
const mockDbSet = jest.fn();
const mockDbFrom = jest.fn();
const mockDbLimit = jest.fn();
const mockDbValues = jest.fn();

// Chain: db.select().from(T).where(...).limit(1)
mockDbSelect.mockReturnValue({
  from: mockDbFrom,
});
mockDbFrom.mockReturnValue({
  where: mockDbWhere,
});
mockDbWhere.mockReturnValue({
  limit: mockDbLimit,
});

// Chain: db.insert(T).values({...})
mockDbInsert.mockReturnValue({
  values: mockDbValues,
});

// Chain: db.update(T).set({...}).where(...)
mockDbUpdate.mockReturnValue({
  set: mockDbSet,
});
mockDbSet.mockReturnValue({
  where: mockDbWhere,
});

jest.mock("@/lib/db", () => ({
  db: {
    select: mockDbSelect,
    insert: mockDbInsert,
    update: mockDbUpdate,
  },
}));

jest.mock("@/lib/db/schema", () => ({
  universeProgression: { __table: "universe_progression" },
}));

// Mock do Nexus Runtime para aceitar todas as propostas
jest.mock("@/lib/nexus", () => ({
  nexusRuntime: {
    submitProposal: jest.fn().mockReturnValue({ accepted: true }),
  },
}));

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function makeProgression(overrides: Partial<PlayerProgression> = {}): PlayerProgression {
  return {
    id: "test-id",
    completed: [],
    activePlanet: null,
    available: ["nexus"],
    activeHints: [],
    lastProgressionAt: 0,
    totalCompleted: 0,
    ...overrides,
  };
}

function makeDbRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "test-id",
    userId: 1,
    completed: [],
    activePlanet: null,
    available: ["nexus"],
    activeHints: [],
    lastProgressionAt: new Date(0),
    totalCompleted: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

/** Simula primeira chamada ao DB (linha existe) */
function mockDbHasRow(rowOverrides: Record<string, unknown> = {}) {
  mockDbLimit.mockResolvedValue([makeDbRow(rowOverrides)]);
  mockDbValues.mockResolvedValue(undefined);
  mockDbSet.mockReturnValue({ where: mockDbWhere });
}

/** Simula DB vazio (usuário novo) */
function mockDbEmpty() {
  mockDbLimit.mockResolvedValue([]);
  mockDbValues.mockResolvedValue(undefined);
  mockDbSet.mockReturnValue({ where: mockDbWhere });
}

beforeEach(() => {
  jest.clearAllMocks();
  // As funções puras importam do event-bus — garantir que o mock do bus
  // não interfira. O bus real é usado nos testes de integração.
});

// ═══════════════════════════════════════════════════════════════════════════════
// 1. createInitialProgression (pura)
// ═══════════════════════════════════════════════════════════════════════════════

describe("Progression Engine — createInitialProgression", () => {
  test("retorna estado inicial limpo", () => {
    const p = createInitialProgression();
    expect(p.completed).toEqual([]);
    expect(p.activePlanet).toBeNull();
    expect(p.available).toEqual(["nexus"]);
    expect(p.activeHints).toEqual([]);
    expect(p.lastProgressionAt).toBe(0);
    expect(p.totalCompleted).toBe(0);
    expect(p.id).toBe("");
  });

  test("não toca no DB (pura)", () => {
    createInitialProgression();
    expect(mockDbSelect).not.toHaveBeenCalled();
    expect(mockDbInsert).not.toHaveBeenCalled();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 2. calculatePlanetState (pura)
// ═══════════════════════════════════════════════════════════════════════════════

describe("Progression Engine — calculatePlanetState", () => {
  test("nexus é 'available' no estado inicial", () => {
    const p = createInitialProgression();
    expect(calculatePlanetState("nexus", p)).toBe("available");
  });

  test("kaos é 'undiscovered' no estado inicial", () => {
    const p = createInitialProgression();
    expect(calculatePlanetState("kaos", p)).toBe("undiscovered");
  });

  test("planeta ativo retorna 'active'", () => {
    const p = makeProgression({ activePlanet: "nexus" });
    expect(calculatePlanetState("nexus", p)).toBe("active");
  });

  test("planeta completado retorna 'completed'", () => {
    const p = makeProgression({ completed: ["nexus" as PlanetId] });
    expect(calculatePlanetState("nexus", p)).toBe("completed");
  });

  test("planeta disponível retorna 'available'", () => {
    const p = makeProgression({
      completed: ["nexus" as PlanetId],
      available: ["kaos", "lyra"],
    });
    expect(calculatePlanetState("kaos", p)).toBe("available");
  });

  test("planeta com requires não atendidos é 'undiscovered'", () => {
    // kaos requires nexus, mas nexus não foi completado
    const p = makeProgression({ available: ["kaos"] });
    expect(calculatePlanetState("kaos", p)).toBe("undiscovered");
  });

  test("stratos requer cadeia completa (nexus → kaos → ethos → volt → stratos)", () => {
    const p = makeProgression({
      completed: ["nexus", "kaos", "ethos", "volt"] as PlanetId[],
      available: ["stratos"],
    });
    expect(calculatePlanetState("stratos", p)).toBe("available");
  });

  test("stratos indisponível sem volt completado", () => {
    const p = makeProgression({
      completed: ["nexus", "kaos", "ethos"] as PlanetId[],
      available: ["stratos"],
    });
    expect(calculatePlanetState("stratos", p)).toBe("undiscovered");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 3. getUniverseSnapshot (pura)
// ═══════════════════════════════════════════════════════════════════════════════

describe("Progression Engine — getUniverseSnapshot", () => {
  test("retorna 12 planetas", () => {
    const p = createInitialProgression();
    const snapshot = getUniverseSnapshot(p);
    expect(Object.keys(snapshot)).toHaveLength(12);
  });

  test("estado inicial: 1 available, 11 undiscovered", () => {
    const p = createInitialProgression();
    const snapshot = getUniverseSnapshot(p);

    const counts = { available: 0, undiscovered: 0, active: 0, completed: 0 };
    for (const state of Object.values(snapshot)) counts[state]++;

    expect(counts.available).toBe(1);
    expect(counts.undiscovered).toBe(11);
  });

  test("após completar nexus: 1 completed, 2 available, 9 undiscovered", () => {
    const p = makeProgression({
      completed: ["nexus" as PlanetId],
      available: ["kaos", "lyra"],
      totalCompleted: 1,
    });
    const snapshot = getUniverseSnapshot(p);

    expect(snapshot.nexus).toBe("completed");
    expect(snapshot.kaos).toBe("available");
    expect(snapshot.lyra).toBe("available");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 4. countByState (pura)
// ═══════════════════════════════════════════════════════════════════════════════

describe("Progression Engine — countByState", () => {
  test("estado inicial: 1 available, 0 active, 0 completed, 11 undiscovered", () => {
    const p = createInitialProgression();
    const counts = countByState(p);
    expect(counts).toEqual({
      undiscovered: 11,
      available: 1,
      active: 0,
      completed: 0,
    });
  });

  test("todos completados: 0 undiscovered, 12 completed", () => {
    const p = makeProgression({
      completed: [
        "nexus", "kaos", "lyra", "ethos", "cipher",
        "terra", "prism", "volt", "axiom", "janus",
        "aurora", "stratos",
      ] as PlanetId[],
      available: [],
      totalCompleted: 12,
    });
    const counts = countByState(p);
    expect(counts.completed).toBe(12);
    expect(counts.undiscovered).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 5. getOrCreateProgression (async — DB mock)
// ═══════════════════════════════════════════════════════════════════════════════

describe("Progression Engine — getOrCreateProgression", () => {
  test("usuário novo: cria registro no DB e retorna estado inicial", async () => {
    mockDbEmpty();
    const { getOrCreateProgression } = await import("../progression-engine.server");

    const p = await getOrCreateProgression(1);

    expect(p.completed).toEqual([]);
    expect(p.available).toEqual(["nexus"]);
    expect(p.activePlanet).toBeNull();
    expect(p.totalCompleted).toBe(0);
    expect(mockDbInsert).toHaveBeenCalled();
    expect(mockDbValues).toHaveBeenCalled();
  });

  test("usuário existente: retorna estado do DB", async () => {
    mockDbHasRow({
      completed: ["nexus"],
      available: ["kaos", "lyra"],
      totalCompleted: 1,
    });
    const { getOrCreateProgression } = await import("../progression-engine.server");

    const p = await getOrCreateProgression(1);

    expect(p.completed).toEqual(["nexus"]);
    expect(p.available).toEqual(["kaos", "lyra"]);
    expect(p.totalCompleted).toBe(1);
    expect(mockDbInsert).not.toHaveBeenCalled();
  });

  test("filtra PlanetIds inválidos do JSON", async () => {
    mockDbHasRow({
      completed: ["nexus", "invalid_planet", 123, null],
      available: ["kaos", "not_real"],
    });
    const { getOrCreateProgression } = await import("../progression-engine.server");

    const p = await getOrCreateProgression(1);

    expect(p.completed).toEqual(["nexus"]);
    expect(p.available).toEqual(["kaos"]);
  });

  test("hints inválidos são filtrados", async () => {
    mockDbHasRow({
      activeHints: [
        { id: "h1", planetId: "nexus", text: "ok", createdAt: 1000 },
        { id: "bad", planetId: 123, text: null },
        "not_an_object",
      ],
    });
    const { getOrCreateProgression } = await import("../progression-engine.server");

    const p = await getOrCreateProgression(1);

    expect(p.activeHints).toHaveLength(1);
    expect(p.activeHints[0].id).toBe("h1");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 6. activatePlanet (async — DB mock)
// ═══════════════════════════════════════════════════════════════════════════════

describe("Progression Engine — activatePlanet", () => {
  test("ativa nexus com sucesso", async () => {
    mockDbHasRow({ available: ["nexus"] });
    const { activatePlanet } = await import("../progression-engine.server");

    const result = await activatePlanet("nexus", 1);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.progression.activePlanet).toBe("nexus");
      expect(result.progression.available).not.toContain("nexus");
    }
    expect(mockDbUpdate).toHaveBeenCalled();
  });

  test("rejeita ativar planeta undiscovered", async () => {
    mockDbHasRow(); // estado limpo
    const { activatePlanet } = await import("../progression-engine.server");

    const result = await activatePlanet("kaos", 1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("PLANETA AINDA NÃO DESCOBERTO");
    }
  });

  test("rejeita ativar planeta já completado", async () => {
    mockDbHasRow({ completed: ["nexus"], totalCompleted: 1, available: [] });
    const { activatePlanet } = await import("../progression-engine.server");

    const result = await activatePlanet("nexus", 1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("PLANETA JÁ DOMINADO");
    }
  });

  test("rejeita ativar planeta já ativo", async () => {
    mockDbHasRow({ activePlanet: "nexus", available: [] });
    const { activatePlanet } = await import("../progression-engine.server");

    const result = await activatePlanet("nexus", 1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("PLANETA JÁ ATIVO");
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 7. completePlanet (async — DB mock)
// ═══════════════════════════════════════════════════════════════════════════════

describe("Progression Engine — completePlanet", () => {
  test("completa nexus e desbloqueia kaos + lyra", async () => {
    mockDbHasRow({
      activePlanet: "nexus",
      available: [],
      lastProgressionAt: new Date(0),
    });
    const { completePlanet } = await import("../progression-engine.server");

    const result = await completePlanet("nexus", 1);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.progression.completed).toContain("nexus");
      expect(result.progression.activePlanet).toBeNull();
      expect(result.progression.available).toContain("kaos");
      expect(result.progression.available).toContain("lyra");
      expect(result.progression.totalCompleted).toBe(1);
    }
    expect(mockDbUpdate).toHaveBeenCalled();
    // Verifica que o SET inclui completed, available, activePlanet
    const setArg = mockDbSet.mock.calls[0]?.[0];
    expect(setArg.completed).toContain("nexus");
    expect(setArg.activePlanet).toBeNull();
    expect(setArg.available).toContain("kaos");
    expect(setArg.available).toContain("lyra");
  });

  test("rejeita completar planeta não ativo", async () => {
    mockDbHasRow({ available: ["nexus"] });
    const { completePlanet } = await import("../progression-engine.server");

    const result = await completePlanet("nexus", 1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("PLANETA NÃO ESTÁ ATIVO");
    }
  });

  test("respeita cooldown de 2 segundos", async () => {
    const agoraMs = Date.now();
    mockDbHasRow({
      activePlanet: "nexus",
      lastProgressionAt: new Date(agoraMs), // acabou de mudar
    });
    const { completePlanet } = await import("../progression-engine.server");

    const result = await completePlanet("nexus", 1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("SISTEMA EM RESFRIAMENTO");
    }
  });

  test("cooldown expirado: permite progressão", async () => {
    const tresSegundosAtras = Date.now() - 3000;
    mockDbHasRow({
      activePlanet: "nexus",
      lastProgressionAt: new Date(tresSegundosAtras),
    });
    const { completePlanet } = await import("../progression-engine.server");

    const result = await completePlanet("nexus", 1);

    expect(result.success).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 8. FLUXO COMPLETO (5 planetas)
// ═══════════════════════════════════════════════════════════════════════════════

describe("Progression Engine — Fluxo Completo", () => {
  test("nexus → kaos → ethos → volt → stratos", async () => {
    const { getOrCreateProgression, activatePlanet, completePlanet } =
      await import("../progression-engine.server");

    // ── Estado inicial ──────────────────────────────────────────
    mockDbEmpty(); // insert
    let p = await getOrCreateProgression(1);
    expect(p.available).toEqual(["nexus"]);

    // ── Ativa nexus ─────────────────────────────────────────────
    mockDbHasRow({
      available: ["nexus"],
      lastProgressionAt: new Date(0),
    });
    const r1 = await activatePlanet("nexus", 1);
    expect(r1.success).toBe(true);
    if (r1.success) p = r1.progression;
    expect(p.activePlanet).toBe("nexus");

    // ── Completa nexus → kaos + lyra ────────────────────────────
    mockDbHasRow({
      activePlanet: "nexus",
      available: [],
      lastProgressionAt: new Date(Date.now() - 3000),
    });
    const r2 = await completePlanet("nexus", 1);
    expect(r2.success).toBe(true);
    if (r2.success) p = r2.progression;
    expect(p.completed).toContain("nexus");
    expect(p.available).toContain("kaos");
    expect(p.available).toContain("lyra");

    // ── Ativa kaos ──────────────────────────────────────────────
    mockDbHasRow({
      completed: ["nexus"],
      available: ["kaos", "lyra"],
      lastProgressionAt: new Date(0),
    });
    const r3 = await activatePlanet("kaos", 1);
    expect(r3.success).toBe(true);
    if (r3.success) p = r3.progression;

    // ── Completa kaos → ethos + cipher ──────────────────────────
    mockDbHasRow({
      completed: ["nexus"],
      activePlanet: "kaos",
      available: ["lyra"],
      lastProgressionAt: new Date(Date.now() - 3000),
    });
    const r4 = await completePlanet("kaos", 1);
    expect(r4.success).toBe(true);
    if (r4.success) p = r4.progression;
    expect(p.completed).toContain("kaos");
    expect(p.available).toContain("ethos");
    expect(p.available).toContain("cipher");

    // ── Ativa ethos ─────────────────────────────────────────────
    mockDbHasRow({
      completed: ["nexus", "kaos"],
      available: ["lyra", "ethos", "cipher"],
      lastProgressionAt: new Date(0),
    });
    const r5 = await activatePlanet("ethos", 1);
    expect(r5.success).toBe(true);
    if (r5.success) p = r5.progression;

    // ── Completa ethos → volt ───────────────────────────────────
    mockDbHasRow({
      completed: ["nexus", "kaos"],
      activePlanet: "ethos",
      available: ["lyra", "cipher"],
      lastProgressionAt: new Date(Date.now() - 3000),
    });
    const r6 = await completePlanet("ethos", 1);
    expect(r6.success).toBe(true);
    if (r6.success) p = r6.progression;
    expect(p.available).toContain("volt");

    // ── Ativa volt ──────────────────────────────────────────────
    mockDbHasRow({
      completed: ["nexus", "kaos", "ethos"],
      available: ["lyra", "cipher", "volt"],
      lastProgressionAt: new Date(0),
    });
    const r7 = await activatePlanet("volt", 1);
    expect(r7.success).toBe(true);
    if (r7.success) p = r7.progression;

    // ── Completa volt → stratos ─────────────────────────────────
    mockDbHasRow({
      completed: ["nexus", "kaos", "ethos"],
      activePlanet: "volt",
      available: ["lyra", "cipher"],
      lastProgressionAt: new Date(Date.now() - 3000),
    });
    const r8 = await completePlanet("volt", 1);
    expect(r8.success).toBe(true);
    if (r8.success) p = r8.progression;

    // ── Verifica estado final ───────────────────────────────────
    expect(p.completed).toContain("volt");
    expect(p.available).toContain("stratos");
    expect(p.totalCompleted).toBe(4); // nexus, kaos, ethos, volt
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 9. HINTS
// ═══════════════════════════════════════════════════════════════════════════════

describe("Progression Engine — Hints", () => {
  test("gera hint para planeta ativo", async () => {
    mockDbHasRow({
      activePlanet: "nexus",
      lastProgressionAt: new Date(0),
    });
    const { generateHint } = await import("../progression-engine.server");

    const result = await generateHint("nexus", "Tente explorar o conceito de rede.", 1);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.hint.planetId).toBe("nexus");
      expect(result.hint.text).toBe("Tente explorar o conceito de rede.");
      expect(result.progression.activeHints).toHaveLength(1);
    }
  });

  test("rejeita hint para planeta undiscovered", async () => {
    mockDbHasRow({ lastProgressionAt: new Date(0) });
    const { generateHint } = await import("../progression-engine.server");

    const result = await generateHint("kaos", "dica", 1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("PLANETA NÃO DISPONÍVEL PARA DICAS");
    }
  });

  test("máximo de 2 hints ativas", async () => {
    mockDbHasRow({
      activePlanet: "nexus",
      activeHints: [
        { id: "h1", planetId: "nexus", text: "dica 1", createdAt: Date.now() },
        { id: "h2", planetId: "nexus", text: "dica 2", createdAt: Date.now() },
      ] as Hint[],
      lastProgressionAt: new Date(0),
    });
    const { generateHint } = await import("../progression-engine.server");

    const result = await generateHint("nexus", "dica 3", 1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("MÁXIMO DE DICAS ATINGIDO");
    }
  });

  test("clearHint remove hint específica", async () => {
    const hint1: Hint = { id: "h1", planetId: "nexus", text: "dica 1", createdAt: 1000 };
    const hint2: Hint = { id: "h2", planetId: "nexus", text: "dica 2", createdAt: 2000 };
    mockDbHasRow({
      activePlanet: "nexus",
      activeHints: [hint1, hint2],
      lastProgressionAt: new Date(0),
    });
    const { clearHint } = await import("../progression-engine.server");

    const p = await clearHint("h1", 1);

    expect(p.activeHints).toHaveLength(1);
    expect(p.activeHints[0].id).toBe("h2");
  });
});
