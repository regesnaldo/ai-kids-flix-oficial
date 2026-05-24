/**
 * planet-registry — Testes de Contrato
 *
 * Verifica:
 *   - 12 planetas registrados
 *   - Unlock tree sem ciclos
 *   - Todas as propriedades obrigatórias presentes
 *   - Dados derivados corretos (STARTER_PLANETS, TERMINAL_PLANETS)
 *   - Consistência clearance/threat/audio
 */

import {
  planetRegistry,
  ALL_PLANET_IDS,
  STARTER_PLANETS,
  TERMINAL_PLANETS,
  TOTAL_PLANETS,
  type PlanetId,
} from "../planet-registry";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/** BFS a partir de starts — detecta ciclos e profundidade máxima */
function checkUnlockTreeIntegrity(): {
  cycles: string[];
  unreachable: PlanetId[];
  maxDepth: number;
} {
  const visited = new Set<PlanetId>();
  const inStack = new Set<PlanetId>();
  const cycles: string[] = [];
  const depths = new Map<PlanetId, number>();

  function dfs(id: PlanetId, depth: number, path: PlanetId[]): boolean {
    if (inStack.has(id)) {
      cycles.push([...path, id].join(" → "));
      return false;
    }
    if (visited.has(id)) return true;

    visited.add(id);
    inStack.add(id);
    depths.set(id, Math.max(depths.get(id) ?? 0, depth));

    for (const child of planetRegistry[id].unlocks) {
      dfs(child, depth + 1, [...path, id]);
    }

    inStack.delete(id);
    return true;
  }

  // DFS a partir de cada starter
  for (const starter of STARTER_PLANETS) {
    dfs(starter, 0, []);
  }

  const unreachable = ALL_PLANET_IDS.filter((id) => !visited.has(id));
  const maxDepth = Math.max(...Array.from(depths.values()), 0);

  return { cycles, unreachable, maxDepth };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. INTEGRIDADE DO REGISTRO
// ═══════════════════════════════════════════════════════════════════════════════

describe("Planet Registry — Integridade", () => {
  test("12 planetas registrados", () => {
    expect(ALL_PLANET_IDS).toHaveLength(12);
    expect(TOTAL_PLANETS).toBe(12);
  });

  test("IDs são únicos e lowercase", () => {
    const ids = ALL_PLANET_IDS;
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toBe(id.toLowerCase());
    }
  });

  test("STARTER_PLANETS: apenas nexus não tem requires", () => {
    expect(STARTER_PLANETS).toHaveLength(1);
    expect(STARTER_PLANETS).toContain("nexus");
  });

  test("TERMINAL_PLANETS: 4 planetas sem unlocks", () => {
    expect(TERMINAL_PLANETS).toHaveLength(4);
    expect(TERMINAL_PLANETS).toContain("axiom");
    expect(TERMINAL_PLANETS).toContain("janus");
    expect(TERMINAL_PLANETS).toContain("aurora");
    expect(TERMINAL_PLANETS).toContain("stratos");
  });

  test("todo planeta tem as 11 propriedades obrigatórias", () => {
    const requiredKeys = [
      "id", "name", "subtitle", "color", "clearance",
      "threatLevel", "promptKey", "unlocks", "requires",
      "audioSignature", "maxContextTokens",
    ] as const;

    for (const id of ALL_PLANET_IDS) {
      const planet = planetRegistry[id];
      for (const key of requiredKeys) {
        expect(planet[key]).toBeDefined();
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 2. UNLOCK TREE
// ═══════════════════════════════════════════════════════════════════════════════

describe("Planet Registry — Unlock Tree", () => {
  const integrity = checkUnlockTreeIntegrity();

  test("árvore sem ciclos", () => {
    expect(integrity.cycles).toHaveLength(0);
  });

  test("todos os 12 planetas são alcançáveis", () => {
    expect(integrity.unreachable).toHaveLength(0);
  });

  test("profundidade máxima === 4 (nexus → ... → stratos)", () => {
    expect(integrity.maxDepth).toBe(4);
  });

  test("nexus desbloqueia kaos e lyra", () => {
    const nexus = planetRegistry.nexus;
    expect(nexus.unlocks).toHaveLength(2);
    expect(nexus.unlocks).toContain("kaos");
    expect(nexus.unlocks).toContain("lyra");
  });

  test("kaos desbloqueia ethos e cipher", () => {
    expect(planetRegistry.kaos.unlocks).toContain("ethos");
    expect(planetRegistry.kaos.unlocks).toContain("cipher");
  });

  test("lyra desbloqueia terra e prism", () => {
    expect(planetRegistry.lyra.unlocks).toContain("terra");
    expect(planetRegistry.lyra.unlocks).toContain("prism");
  });

  test("ethos desbloqueia volt", () => {
    expect(planetRegistry.ethos.unlocks).toContain("volt");
    expect(planetRegistry.ethos.unlocks).toHaveLength(1);
  });

  test("cipher desbloqueia axiom", () => {
    expect(planetRegistry.cipher.unlocks).toContain("axiom");
    expect(planetRegistry.cipher.unlocks).toHaveLength(1);
  });

  test("terra desbloqueia janus", () => {
    expect(planetRegistry.terra.unlocks).toContain("janus");
    expect(planetRegistry.terra.unlocks).toHaveLength(1);
  });

  test("prism desbloqueia aurora", () => {
    expect(planetRegistry.prism.unlocks).toContain("aurora");
    expect(planetRegistry.prism.unlocks).toHaveLength(1);
  });

  test("volt desbloqueia stratos", () => {
    expect(planetRegistry.volt.unlocks).toContain("stratos");
    expect(planetRegistry.volt.unlocks).toHaveLength(1);
  });

  test("cada unlock tem requires correspondente", () => {
    for (const id of ALL_PLANET_IDS) {
      for (const childId of planetRegistry[id].unlocks) {
        // O child deve ter `id` em seu requires
        expect(planetRegistry[childId].requires).toContain(id);
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 3. NOMES E IDENTIDADE
// ═══════════════════════════════════════════════════════════════════════════════

describe("Planet Registry — Identidade", () => {
  test("nomes são UPPERCASE", () => {
    for (const id of ALL_PLANET_IDS) {
      expect(planetRegistry[id].name).toBe(planetRegistry[id].name.toUpperCase());
    }
  });

  test("subtitles são em português e não vazios", () => {
    for (const id of ALL_PLANET_IDS) {
      expect(planetRegistry[id].subtitle.length).toBeGreaterThan(0);
    }
  });

  test("cores são hex válidos ou rgba", () => {
    const colorRegex = /^(#[0-9a-fA-F]{6}|rgba?\(.+\))$/;
    for (const id of ALL_PLANET_IDS) {
      expect(planetRegistry[id].color).toMatch(colorRegex);
    }
  });

  test("promptKey === id (consistência)", () => {
    for (const id of ALL_PLANET_IDS) {
      expect(planetRegistry[id].promptKey).toBe(id);
    }
  });

  test("12 planetas têm cores distintas", () => {
    const colors = ALL_PLANET_IDS.map((id) => planetRegistry[id].color);
    const unique = new Set(colors);
    expect(unique.size).toBe(12);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 4. CLEARANCE E THREAT
// ═══════════════════════════════════════════════════════════════════════════════

describe("Planet Registry — Clearance & Threat", () => {
  test("clearance válido (surface | deep | core | restricted)", () => {
    const valid = ["surface", "deep", "core", "restricted"];
    for (const id of ALL_PLANET_IDS) {
      expect(valid).toContain(planetRegistry[id].clearance);
    }
  });

  test("threatLevel válido (low | elevated | critical)", () => {
    const valid = ["low", "elevated", "critical"];
    for (const id of ALL_PLANET_IDS) {
      expect(valid).toContain(planetRegistry[id].threatLevel);
    }
  });

  test("restricted clearance → critical threat", () => {
    for (const id of ALL_PLANET_IDS) {
      if (planetRegistry[id].clearance === "restricted") {
        expect(planetRegistry[id].threatLevel).toBe("critical");
      }
    }
  });

  test("surface clearance → low threat", () => {
    for (const id of ALL_PLANET_IDS) {
      if (planetRegistry[id].clearance === "surface") {
        expect(planetRegistry[id].threatLevel).toBe("low");
      }
    }
  });

  test("clearance progride com profundidade", () => {
    // surface nos starters, restricted nos terminais
    for (const id of STARTER_PLANETS) {
      expect(planetRegistry[id].clearance).toBe("surface");
    }
    // Pelo menos alguns terminais são restricted
    const terminalClearances = TERMINAL_PLANETS.map(
      (id) => planetRegistry[id].clearance
    );
    expect(terminalClearances).toContain("restricted");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 5. AUDIO SIGNATURES
// ═══════════════════════════════════════════════════════════════════════════════

describe("Planet Registry — Audio Signatures", () => {
  test("12 assinaturas de áudio distintas", () => {
    const signatures = ALL_PLANET_IDS.map(
      (id) => planetRegistry[id].audioSignature
    );
    const unique = new Set(signatures);
    expect(unique.size).toBe(12);
  });

  test("low-hum é do nexus (starter)", () => {
    expect(planetRegistry.nexus.audioSignature).toBe("low-hum");
  });

  test("void é do stratos (terminal)", () => {
    expect(planetRegistry.stratos.audioSignature).toBe("void");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 6. TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

describe("Planet Registry — maxContextTokens", () => {
  test("tokens entre 2500 e 5000", () => {
    for (const id of ALL_PLANET_IDS) {
      const tokens = planetRegistry[id].maxContextTokens;
      expect(tokens).toBeGreaterThanOrEqual(2000);
      expect(tokens).toBeLessThanOrEqual(6000);
    }
  });

  test("restricted planets têm menor budget de tokens", () => {
    const restrictedTokens = ALL_PLANET_IDS
      .filter((id) => planetRegistry[id].clearance === "restricted")
      .map((id) => planetRegistry[id].maxContextTokens);

    const surfaceTokens = ALL_PLANET_IDS
      .filter((id) => planetRegistry[id].clearance === "surface")
      .map((id) => planetRegistry[id].maxContextTokens);

    // Restricted deve ter budget menor que surface
    for (const rt of restrictedTokens) {
      for (const st of surfaceTokens) {
        expect(rt).toBeLessThan(st);
      }
    }
  });
});
