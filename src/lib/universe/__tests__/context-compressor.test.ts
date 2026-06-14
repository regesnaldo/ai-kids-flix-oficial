/**
 * context-compressor — Testes Unitários
 *
 * Cobre:
 *   - compressMemory com mensagens vazias
 *   - Extração de conceitos-chave
 *   - Extração de insights
 *   - Detecção de nível do usuário
 *   - Inferência de intenção
 *   - Estimativa de tokens
 *   - buildInferencePayload
 *   - Corte quando excede maxContextTokens
 *   - Texto em português
 */

import type { PlanetId } from "../planet-registry";
import {
  compressMemory,
  buildInferencePayload,
  type MessageStub,
  type CompressedContext,
} from "../context-compressor";

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

const PLANET: PlanetId = "nexus"; // maxContextTokens = 4000

function userMsg(content: string): MessageStub {
  return { role: "user", content };
}

function assistantMsg(content: string): MessageStub {
  return { role: "assistant", content };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. MEMÓRIA VAZIA
// ═══════════════════════════════════════════════════════════════════════════════

describe("Context Compressor — Memória Vazia", () => {
  test("compressMemory com array vazio retorna defaults", () => {
    const result = compressMemory([], PLANET);

    expect(result.keyConcepts).toEqual([]);
    expect(result.unlockedInsights).toEqual([]);
    expect(result.userLevel).toBe("beginner");
    expect(result.lastIntent).toBe("exploração inicial");
    expect(result.planetId).toBe(PLANET);
    expect(result.estimatedTokens).toBeGreaterThan(0);
  });

  test("estimatedTokens > 0 mesmo com input vazio (metadata)", () => {
    const result = compressMemory([], PLANET);
    expect(result.estimatedTokens).toBeGreaterThan(0);
  });

  test("compressedAt é timestamp válido", () => {
    const before = Date.now();
    const result = compressMemory([], PLANET);
    const after = Date.now();

    expect(result.compressedAt).toBeGreaterThanOrEqual(before);
    expect(result.compressedAt).toBeLessThanOrEqual(after);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 2. EXTRAÇÃO DE CONCEITOS-CHAVE
// ═══════════════════════════════════════════════════════════════════════════════

describe("Context Compressor — keyConcepts", () => {
  test("extrai conceito de aprendizado", () => {
    const result = compressMemory(
      [userMsg("Quero aprender a programar em Python")],
      PLANET
    );
    expect(result.keyConcepts).toContain("aprender");
    expect(result.keyConcepts).toContain("programar");
  });

  test("extrai conceito de erro/bug", () => {
    const result = compressMemory(
      [userMsg("Meu código tem um bug, como consertar esse erro?")],
      PLANET
    );
    expect(result.keyConcepts).toContain("bug");
    expect(result.keyConcepts).toContain("consertar");
  });

  test("extrai conceito de criação", () => {
    const result = compressMemory(
      [userMsg("Quero criar um site do zero, como desenvolver?")],
      PLANET
    );
    expect(result.keyConcepts).toContain("criar");
    expect(result.keyConcepts).toContain("desenvolver");
  });

  test("extrai conceito de segurança", () => {
    const result = compressMemory(
      [userMsg("Como proteger meus dados com cripto?")],
      PLANET
    );
    expect(result.keyConcepts).toContain("cripto");
  });

  test("extrai conceito de emoção", () => {
    const result = compressMemory(
      [userMsg("Estou com medo dessa decisão sobre meu futuro")],
      PLANET
    );
    expect(result.keyConcepts).toContain("medo");
    expect(result.keyConcepts).toContain("decisão");
  });

  test("extrai conceitos de múltiplas mensagens", () => {
    const result = compressMemory(
      [
        userMsg("Quero aprender React"),
        assistantMsg("React é uma biblioteca para criar interfaces"),
        userMsg("Entendi, agora quero criar um componente"),
      ],
      PLANET
    );
    expect(result.keyConcepts.length).toBeGreaterThan(0);
  });

  test("máximo 8 conceitos", () => {
    const result = compressMemory(
      [
        userMsg(
          "Quero aprender programar ensinar explicar entender criar construir desenvolver " +
            "consertar erro bug falha problema otimizar melhorar performance segurança " +
            "proteger privacidade cripto dados informação conhecimento emoção sentir " +
            "decisão escolha conectar rede sistema"
        ),
      ],
      PLANET
    );
    expect(result.keyConcepts.length).toBeLessThanOrEqual(8);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 3. EXTRAÇÃO DE INSIGHTS
// ═══════════════════════════════════════════════════════════════════════════════

describe("Context Compressor — unlockedInsights", () => {
  test("extrai insight com marcador 'descobri'", () => {
    const result = compressMemory(
      [userMsg("Eu descobri que o problema era a ordem das operações no loop.")],
      PLANET
    );
    expect(result.unlockedInsights.length).toBeGreaterThan(0);
  });

  test("extrai insight com marcador 'percebi'", () => {
    const result = compressMemory(
      [userMsg("Percebi que o segredo está na simplicidade da arquitetura.")],
      PLANET
    );
    expect(result.unlockedInsights.length).toBeGreaterThan(0);
  });

  test("extrai insight com marcador 'entendi'", () => {
    const result = compressMemory(
      [userMsg("Agora eu entendi como funciona o event loop do JavaScript.")],
      PLANET
    );
    expect(result.unlockedInsights.length).toBeGreaterThan(0);
  });

  test("sem insights, usa fallback das últimas mensagens", () => {
    const result = compressMemory(
      [userMsg("Qual é a capital do Brasil?")],
      PLANET
    );
    // Fallback: "Usuário perguntou: ..."
    expect(result.unlockedInsights.length).toBeGreaterThan(0);
    expect(result.unlockedInsights[0]).toContain("Usuário perguntou");
  });

  test("máximo 5 insights", () => {
    const msgs: MessageStub[] = [];
    for (let i = 0; i < 10; i++) {
      msgs.push(
        userMsg(
          `Descobri algo incrível ${i}: o importante é a persistência e a prática constante.`
        )
      );
    }
    const result = compressMemory(msgs, PLANET);
    expect(result.unlockedInsights.length).toBeLessThanOrEqual(5);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 4. DETECÇÃO DE NÍVEL
// ═══════════════════════════════════════════════════════════════════════════════

describe("Context Compressor — userLevel", () => {
  test("mensagem curta e simples → beginner", () => {
    const result = compressMemory([userMsg("Oi")], PLANET);
    expect(result.userLevel).toBe("beginner");
  });

  test("mensagem com termos técnicos → intermediate", () => {
    const result = compressMemory(
      [userMsg("Preciso criar um hook customizado no React para gerenciar estado do componente. A chamada da API retorna dados que preciso mapear no state do servidor. Como evitar re-render desnecessário na mutation do banco? Preciso de uma query eficiente.")],
      PLANET
    );
    expect(result.userLevel).toBe("intermediate");
  });

  test("mensagem longa com muitos termos técnicos e abstratos → advanced", () => {
    const result = compressMemory(
      [
        userMsg(
          "Estou projetando uma arquitetura com inversão de dependência usando padrão " +
            "de composição. Preciso de injeção de dependências para o pipeline declarativo " +
            "que implementa polimorfismo via abstração de interface genérica."
        ),
      ],
      PLANET
    );
    expect(result.userLevel).toBe("advanced");
  });

  test("mensagens do assistant não afetam nível", () => {
    const result = compressMemory(
      [
        assistantMsg(
          "A arquitetura de microsserviços usa padrões como CQRS, event sourcing, " +
            "saga pattern, circuit breaker, bulkhead, e service mesh com Kubernetes."
        ),
        userMsg("ok"),
      ],
      PLANET
    );
    // Só "ok" do user → beginner
    expect(result.userLevel).toBe("beginner");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 5. INFERÊNCIA DE INTENÇÃO
// ═══════════════════════════════════════════════════════════════════════════════

describe("Context Compressor — lastIntent", () => {
  test("intenção de aprendizado", () => {
    const result = compressMemory(
      [userMsg("Me explica como funciona o algoritmo de Dijkstra")],
      PLANET
    );
    expect(result.lastIntent).toBe("aprendizado");
  });

  test("intenção de criação", () => {
    const result = compressMemory(
      [userMsg("Quero construir uma API REST com autenticação")],
      PLANET
    );
    expect(result.lastIntent).toBe("criação");
  });

  test("intenção de correção", () => {
    const result = compressMemory(
      [userMsg("Meu código está quebrando na linha 42, ajuda a consertar")],
      PLANET
    );
    expect(result.lastIntent).toBe("correção");
  });

  test("intenção de análise", () => {
    const result = compressMemory(
      [userMsg("O que você acha dessa abordagem de design? Avalia pra mim")],
      PLANET
    );
    expect(result.lastIntent).toBe("análise");
  });

  test("intenção de exploração", () => {
    const result = compressMemory(
      [userMsg("Me mostra o que tem de novo pra explorar por aqui")],
      PLANET
    );
    expect(result.lastIntent).toBe("exploração");
  });

  test("intenção de suporte", () => {
    const result = compressMemory(
      [userMsg("Socorro, tô completamente perdido nesse assunto difícil")],
      PLANET
    );
    expect(result.lastIntent).toBe("suporte");
  });

  test("default: conversa", () => {
    const result = compressMemory(
      [userMsg("Tudo bem?")],
      PLANET
    );
    expect(result.lastIntent).toBe("conversa");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 6. PORTUGUÊS
// ═══════════════════════════════════════════════════════════════════════════════

describe("Context Compressor — Português", () => {
  test("extrai conceitos em português", () => {
    const result = compressMemory(
      [
        userMsg(
          "Quero aprender a programar e criar sistemas. Me ensina a desenvolver " +
            "do zero? Preciso entender como consertar erros."
        ),
      ],
      PLANET
    );
    // Deve detectar conceitos em PT
    expect(result.keyConcepts.length).toBeGreaterThan(0);
  });

  test("detecta intenção em português", () => {
    const result = compressMemory(
      [userMsg("Me explica como funciona inteligência artificial")],
      PLANET
    );
    expect(result.lastIntent).toBe("aprendizado");
  });

  test("nível detectado com vocabulário PT", () => {
    const result = compressMemory(
      [
        userMsg(
          "A arquitetura de microsserviços implementa padrão de composição com " +
            "injeção de dependências e abstração de camadas. É fundamental " +
            "entender o polimorfismo por herança e a inversão de controle " +
            "no paradigma funcional reativo para projetar sistemas declarativos."
        ),
      ],
      PLANET
    );
    expect(result.userLevel).toBe("advanced");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 7. TOKEN ESTIMATION
// ═══════════════════════════════════════════════════════════════════════════════

describe("Context Compressor — Token Estimation", () => {
  test("estimatedTokens é sempre positivo", () => {
    const result = compressMemory([], PLANET);
    expect(result.estimatedTokens).toBeGreaterThan(0);
  });

  test("mensagens maiores → mais tokens estimados", () => {
    const short = compressMemory([userMsg("Oi")], PLANET);
    const long = compressMemory(
      [userMsg("A".repeat(1000))],
      PLANET
    );
    expect(long.estimatedTokens).toBeGreaterThan(short.estimatedTokens);
  });

  test("não excede 40% do maxContextTokens do planeta", () => {
    const result = compressMemory(
      [
        userMsg("Uma mensagem muito muito longa ".repeat(100)),
        userMsg("Outra mensagem gigante ".repeat(100)),
        userMsg("Mais uma enorme ".repeat(100)),
      ],
      "nexus" // max 4000 tokens
    );
    // 40% de 4000 = 1600
    expect(result.estimatedTokens).toBeLessThanOrEqual(1700); // ~40% + margem
  });

  test("planetas com menos tokens forçam compressão maior", () => {
    const big = compressMemory(
      [userMsg("mensagem " + "extra ".repeat(50))],
      "lyra" // 5000 tokens → 40% = 2000 limite
    );
    const small = compressMemory(
      [userMsg("mensagem " + "extra ".repeat(50))],
      "janus" // 2500 tokens → 40% = 1000 limite
    );
    // janus deve ter <= tokens que lyra (ou ter cortado insights)
    expect(small.estimatedTokens).toBeLessThanOrEqual(big.estimatedTokens);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 8. buildInferencePayload
// ═══════════════════════════════════════════════════════════════════════════════

describe("Context Compressor — buildInferencePayload", () => {
  test("retorna system + messages", () => {
    const context: CompressedContext = {
      keyConcepts: ["aprender"],
      unlockedInsights: ["Usuário perguntou: como funciona?"],
      userLevel: "beginner",
      lastIntent: "aprendizado",
      compressedAt: Date.now(),
      planetId: PLANET,
      estimatedTokens: 50,
    };

    const payload = buildInferencePayload(
      context,
      [userMsg("como funciona?"), assistantMsg("explicação...")],
      "Você é um assistente."
    );

    expect(payload.system).toContain("Você é um assistente.");
    expect(payload.system).toContain("[CONTEXTO COMPRIMIDO");
    expect(payload.system).toContain("NEXUS");
    expect(payload.system).toContain("beginner");
    expect(payload.system).toContain("aprendizado");
    expect(payload.messages).toHaveLength(2); // últimos 3, mas só tem 2
  });

  test("limita a 3 mensagens recentes", () => {
    const context: CompressedContext = {
      keyConcepts: [],
      unlockedInsights: [],
      userLevel: "beginner",
      lastIntent: "conversa",
      compressedAt: Date.now(),
      planetId: PLANET,
      estimatedTokens: 30,
    };

    const messages: MessageStub[] = [
      userMsg("msg1"),
      assistantMsg("resp1"),
      userMsg("msg2"),
      assistantMsg("resp2"),
      userMsg("msg3"),
      assistantMsg("resp3"),
      userMsg("msg4"),
      assistantMsg("resp4"),
    ];

    const payload = buildInferencePayload(context, messages, "system");
    expect(payload.messages).toHaveLength(3);
    expect(payload.messages[0].content).toBe("resp3");
  });

  test("insights aparecem no system prompt", () => {
    const context: CompressedContext = {
      keyConcepts: ["rede", "sistema"],
      unlockedInsights: ["O importante é a persistência"],
      userLevel: "intermediate",
      lastIntent: "aprendizado",
      compressedAt: Date.now(),
      planetId: PLANET,
      estimatedTokens: 80,
    };

    const payload = buildInferencePayload(context, [], "SYS");

    expect(payload.system).toContain("rede, sistema");
    expect(payload.system).toContain("O importante é a persistência");
  });

  test("sem insights, bloco de insights não aparece", () => {
    const context: CompressedContext = {
      keyConcepts: [],
      unlockedInsights: [],
      userLevel: "beginner",
      lastIntent: "conversa",
      compressedAt: Date.now(),
      planetId: PLANET,
      estimatedTokens: 30,
    };

    const payload = buildInferencePayload(context, [], "SYS");
    expect(payload.system).not.toContain("Insights desbloqueados");
  });
});
