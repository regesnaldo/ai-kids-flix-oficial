/**
 * event-bus — Testes de Contrato
 *
 * Verifica:
 *   - Singleton (mesma instância)
 *   - Subscribe + emit com filtro de tipo
 *   - Wildcard subscriber
 *   - Unsubscribe
 *   - Isolamento de erro (um crash não quebra outros)
 *   - Reset
 *   - Tipos de evento (todos os 10 tipos)
 */

import { universeBus, type UniverseEvent } from "../event-bus";
import type { PlanetId } from "../planet-registry";

// ═══════════════════════════════════════════════════════════════════════════════
// 1. SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

describe("Event Bus — Singleton", () => {
  test("universeBus é sempre a mesma instância", () => {
    // Re-import para verificar que é singleton (module cache)
    const bus1 = universeBus;
    const bus2 = universeBus;
    expect(bus1).toBe(bus2);
  });

  test("subscriberCount começa em 0 após reset", () => {
    universeBus.reset();
    expect(universeBus.subscriberCount).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 2. SUBSCRIBE + EMIT
// ═══════════════════════════════════════════════════════════════════════════════

describe("Event Bus — Subscribe & Emit", () => {
  beforeEach(() => {
    universeBus.reset();
  });

  test("subscriber recebe evento do tipo correto", () => {
    const fn = jest.fn();
    universeBus.subscribe("PLANET_UNLOCKED", fn);

    universeBus.emit({
      type: "PLANET_UNLOCKED",
      planetId: "kaos",
      source: "nexus",
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith({
      type: "PLANET_UNLOCKED",
      planetId: "kaos",
      source: "nexus",
    });
  });

  test("subscriber NÃO recebe evento de tipo diferente", () => {
    const fn = jest.fn();
    universeBus.subscribe("PLANET_UNLOCKED", fn);

    universeBus.emit({ type: "PLANET_COMPLETED", planetId: "nexus" });

    expect(fn).not.toHaveBeenCalled();
  });

  test("múltiplos subscribers do mesmo tipo recebem o evento", () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    universeBus.subscribe("PLANET_ACTIVATED", fn1);
    universeBus.subscribe("PLANET_ACTIVATED", fn2);

    universeBus.emit({ type: "PLANET_ACTIVATED", planetId: "nexus" });

    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);
  });

  test("subscriberCount reflete número de inscritos", () => {
    expect(universeBus.subscriberCount).toBe(0);

    const unsub1 = universeBus.subscribe("PLANET_UNLOCKED", jest.fn());
    expect(universeBus.subscriberCount).toBe(1);

    const unsub2 = universeBus.subscribe("SIGNAL_DETECTED", jest.fn());
    expect(universeBus.subscriberCount).toBe(2);

    unsub1();
    expect(universeBus.subscriberCount).toBe(1);

    unsub2();
    expect(universeBus.subscriberCount).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 3. WILDCARD
// ═══════════════════════════════════════════════════════════════════════════════

describe("Event Bus — Wildcard (*)", () => {
  beforeEach(() => {
    universeBus.reset();
  });

  test("wildcard subscriber recebe TODOS os tipos de evento", () => {
    const fn = jest.fn();
    universeBus.subscribe("*", fn);

    universeBus.emit({ type: "PLANET_UNLOCKED", planetId: "kaos", source: "nexus" });
    universeBus.emit({ type: "PLANET_COMPLETED", planetId: "nexus" });
    universeBus.emit({ type: "SIGNAL_DETECTED", planetId: "lyra", strength: 0.5 });

    expect(fn).toHaveBeenCalledTimes(3);
  });

  test("wildcard recebe evento mesmo sem subscriber específico", () => {
    const wildcard = jest.fn();
    universeBus.subscribe("*", wildcard);

    universeBus.emit({ type: "MISSION_FAILED", planetId: "nexus", reason: "teste" });

    expect(wildcard).toHaveBeenCalledTimes(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 4. UNSUBSCRIBE
// ═══════════════════════════════════════════════════════════════════════════════

describe("Event Bus — Unsubscribe", () => {
  beforeEach(() => {
    universeBus.reset();
  });

  test("unsubscribe remove o subscriber", () => {
    const fn = jest.fn();
    const unsub = universeBus.subscribe("PLANET_UNLOCKED", fn);

    unsub();

    universeBus.emit({ type: "PLANET_UNLOCKED", planetId: "kaos", source: "nexus" });
    expect(fn).not.toHaveBeenCalled();
  });

  test("unsubscribe de um não afeta outros", () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const unsub1 = universeBus.subscribe("PLANET_UNLOCKED", fn1);
    universeBus.subscribe("PLANET_UNLOCKED", fn2);

    unsub1();

    universeBus.emit({ type: "PLANET_UNLOCKED", planetId: "kaos", source: "nexus" });
    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledTimes(1);
  });

  test("chamar unsubscribe duas vezes não quebra", () => {
    const unsub = universeBus.subscribe("PLANET_UNLOCKED", jest.fn());
    unsub();
    expect(() => unsub()).not.toThrow();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 5. ISOLAMENTO DE ERRO
// ═══════════════════════════════════════════════════════════════════════════════

describe("Event Bus — Isolamento de Erro", () => {
  beforeEach(() => {
    universeBus.reset();
  });

  test("erro em um subscriber não impede outros de receber", () => {
    const crashFn = jest.fn(() => {
      throw new Error("subscriber crash");
    });
    const okFn = jest.fn();

    universeBus.subscribe("PLANET_UNLOCKED", crashFn);
    universeBus.subscribe("PLANET_UNLOCKED", okFn);

    universeBus.emit({ type: "PLANET_UNLOCKED", planetId: "kaos", source: "nexus" });

    expect(crashFn).toHaveBeenCalledTimes(1);
    expect(okFn).toHaveBeenCalledTimes(1);
  });

  test("erro em um subscriber não impede eventos futuros", () => {
    universeBus.subscribe("PLANET_UNLOCKED", () => {
      throw new Error("crash");
    });
    const fn = jest.fn();
    universeBus.subscribe("PLANET_UNLOCKED", fn);

    // Primeiro evento — crashFn explode, okFn recebe
    universeBus.emit({ type: "PLANET_UNLOCKED", planetId: "kaos", source: "nexus" });
    expect(fn).toHaveBeenCalledTimes(1);

    // Segundo evento — tudo funciona normalmente
    universeBus.emit({ type: "PLANET_UNLOCKED", planetId: "lyra", source: "nexus" });
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 6. RESET
// ═══════════════════════════════════════════════════════════════════════════════

describe("Event Bus — Reset", () => {
  test("reset remove todos os subscribers", () => {
    universeBus.subscribe("PLANET_UNLOCKED", jest.fn());
    universeBus.subscribe("SIGNAL_DETECTED", jest.fn());
    universeBus.subscribe("*", jest.fn());

    expect(universeBus.subscriberCount).toBeGreaterThan(0);

    universeBus.reset();

    expect(universeBus.subscriberCount).toBe(0);
  });

  test("após reset, emit não chama ninguém", () => {
    const fn = jest.fn();
    universeBus.subscribe("PLANET_UNLOCKED", fn);
    universeBus.reset();

    universeBus.emit({ type: "PLANET_UNLOCKED", planetId: "kaos", source: "nexus" });

    expect(fn).not.toHaveBeenCalled();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 7. TODOS OS TIPOS DE EVENTO
// ═══════════════════════════════════════════════════════════════════════════════

describe("Event Bus — Cobertura de Tipos", () => {
  beforeEach(() => {
    universeBus.reset();
  });

  const allEventTypes: UniverseEvent["type"][] = [
    "PLANET_UNLOCKED",
    "PLANET_ACTIVATED",
    "PLANET_COMPLETED",
    "SIGNAL_DETECTED",
    "MISSION_COMPLETED",
    "MISSION_FAILED",
    "HINT_GENERATED",
    "PROGRESSION_STATE_CHANGED",
    "AUDIO_STATE_CHANGED",
    "CONTEXT_COMPRESSED",
  ];

  test("10 tipos de evento definidos", () => {
    expect(allEventTypes).toHaveLength(10);
  });

  test("cada tipo de evento é entregue ao subscriber correto", () => {
    const nexus: PlanetId = "nexus";

    const events: UniverseEvent[] = [
      { type: "PLANET_UNLOCKED", planetId: "kaos", source: "nexus" },
      { type: "PLANET_ACTIVATED", planetId: nexus },
      { type: "PLANET_COMPLETED", planetId: nexus },
      { type: "SIGNAL_DETECTED", planetId: nexus, strength: 0.5 },
      { type: "MISSION_COMPLETED", planetId: nexus },
      { type: "MISSION_FAILED", planetId: nexus, reason: "timeout" },
      { type: "HINT_GENERATED", planetId: nexus, hint: "teste" },
      { type: "PROGRESSION_STATE_CHANGED", planetId: nexus, from: "available", to: "active" },
      { type: "AUDIO_STATE_CHANGED", planetId: nexus, signature: "low-hum", active: true },
      { type: "CONTEXT_COMPRESSED", planetId: nexus, tokenCount: 150 },
    ];

    for (const event of events) {
      const fn = jest.fn();
      universeBus.subscribe(event.type, fn);
      universeBus.emit(event);
      expect(fn).toHaveBeenCalledWith(event);
      universeBus.reset();
    }
  });
});
