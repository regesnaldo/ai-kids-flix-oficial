# 🔗 LangChain + Tree of Thoughts — MENTE.AI

> **O cérebro de raciocínio multi-caminho.**  
> Como o MENTE.AI faz agentes "pensarem" antes de responder.

---

## 🧠 O QUE É E POR QUE EXISTE

O MENTE.AI usa **LangChain + Tree of Thoughts (ToT)** na rota de chat dos universos (`/api/universo/chat`). Isso significa que antes de responder, o agente explora múltiplos caminhos de raciocínio e escolhe o melhor.

**Analogia:** Um jogador de xadrez não move a primeira peça que vê. Ele pensa em 3 jogadas possíveis, avalia cada uma, e escolhe a melhor. O ToT faz exatamente isso — mas para conversas.

Sem ToT: agente responde com o primeiro pensamento (bom, mas raso).  
Com ToT: agente avalia 3 perspectivas e entrega a mais relevante para o perfil do usuário.

---

## 🔄 FLUXO DE ORQUESTRAÇÃO

```
Usuário envia mensagem
        │
        ▼
┌──────────────────────────┐
│  /api/universo/chat       │
│  (API Route)              │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  LangChain Integration    │
│  runTreeOfThoughts()      │
└──────────┬───────────────┘
           │
           ├─→ Ramo 1: Perspectiva LÓGICA
           │    "Como o AXIOM responderia?"
           │    • Análise racional, passo a passo
           │    • Foco em fatos e deduções
           │
           ├─→ Ramo 2: Perspectiva EMOCIONAL
           │    "Como a LYRA responderia?"
           │    • Conexão empática, validação
           │    • Foco em sentimentos e acolhimento
           │
           └─→ Ramo 3: Perspectiva CRIATIVA
                "Como a AURORA responderia?"
                • Abordagem inovadora, metáforas
                • Foco em inspiração e imaginação
                │
                ▼
┌──────────────────────────┐
│  Avaliação dos Ramos      │
│  • Relevância ao perfil   │
│  • Qualidade da resposta  │
│  • Alinhamento narrativo  │
│  • Score de confiança     │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Resposta Final           │
│  (melhor ramo escolhido)  │
│  Confiança: ~92%          │
└──────────────────────────┘
```

---

## 🎯 ONDE É USADO

| Rota | Sistema | Quando dispara |
|------|---------|---------------|
| `/api/universo/chat` | ToT completo (3 ramos) | Chat dentro dos universos dos agentes |
| `/api/chat` | Memória + CPE (sem ToT) | Chat principal (mais rápido, mais leve) |

**Por que ToT só nos universos?** O chat principal prioriza velocidade (streaming instantâneo). Os universos priorizam profundidade (o usuário está imerso naquele agente). ToT adiciona ~1-2s de latência que vale a pena no contexto narrativo.

---

## 🧪 PIPELINE DE RACIOCÍNIO

```typescript
// src/engine/langchain-integration.ts
async function runTreeOfThoughts(
  userMessage: string,
  userProfile: UserProfile,
  agentContext: AgentContext
): Promise<ThoughtResult> {
  // 1. Gera 3 perspectivas em paralelo
  const [logical, emotional, creative] = await Promise.all([
    generateThought(userMessage, 'logical', agentContext),
    generateThought(userMessage, 'emotional', agentContext),
    generateThought(userMessage, 'creative', agentContext),
  ]);

  // 2. Avalia cada ramo contra o perfil do usuário
  const evaluations = await evaluateThoughts(
    [logical, emotional, creative],
    userProfile
  );

  // 3. Retorna o melhor (maior score)
  return evaluations.sort((a, b) => b.score - a.score)[0];
}
```

---

## 📊 MÉTRICAS DE QUALIDADE

| Métrica | Sem ToT | Com ToT | Melhoria |
|---------|---------|---------|----------|
| Relevância ao perfil | ~70% | ~92% | +22% |
| Profundidade narrativa | Média | Alta | — |
| Latência adicional | 0ms | +1-2s | Tradeoff aceito |
| Custo por interação | 1 chamada LLM | 4 chamadas LLM (3 ramos + avaliação) | 4x |

---

## 🔮 EVOLUÇÃO FUTURA

- **ToT adaptativo:** Número de ramos varia com complexidade da pergunta (2-5 ramos)
- **Cache de ramos:** Perguntas similares reaproveitam ramos já calculados
- **ToT cross-agent:** Ramos gerados por agentes diferentes (não apenas perspectivas abstratas)
- **Modelo local para avaliação:** Modelo leve (não LLM) para avaliar ramos, reduzindo custo

---

## 📋 TRADEOFFS ACEITOS

| Tradeoff | Decisão |
|----------|---------|
| Custo 4x maior | Aceito para chat de universo (menor volume, maior valor) |
| Latência +1-2s | Aceito — usuário em universo espera profundidade, não velocidade |
| Complexidade de código | Contida em 1 arquivo (`langchain-integration.ts`) |
| Dependência OpenAI | ToT usa GPT-4o; fallback para resposta simples se API falhar |

---

> *"Pensar em 3 caminhos antes de falar não é indecisão — é sabedoria."*
