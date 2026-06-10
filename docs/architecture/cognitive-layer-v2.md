# Cognitive Layer v2 — MENTE.AI

> **Status:** Projeto  
> **Data:** 2026-06-06  
> **ARQ-007** — Substitui ARQ-004 (Cognitive Architecture v1)

---

## 1. Arquitetura Atual

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENTE                               │
└──────┬──────────────────────────────────┬───────────────────┘
       │                                  │
       ▼                                  ▼
┌──────────────┐                 ┌──────────────────┐
│   /api/chat  │                 │  /api/agents/chat │  ... 6 outras
│  (751 linhas)│                 │  (214 linhas)     │       rotas
└──────┬───────┘                 └───────┬──────────┘
       │                                 │
       ├─────────────────────────────────┤
       ▼                                  ▼
┌──────────────────────────────────────────────────────────────┐
│                    ENGINE LAYER (dispersa)                    │
│  router.ts  adaptive-router.ts  narrative-engine.ts          │
│  profiler.ts  phase-router.ts  narrative-transitions.ts      │
│  agent-conflicts.ts  backtrack.ts  archetype-narratives.ts  │
└──────┬───────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│                  LEGACY ENGINE (duplicado)                    │
│  src/lib/engine/profiler.ts  router.ts  backtrack.ts         │
│  conflicts.ts  transition-context.tsx                        │
└──────┬───────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│                  MEMORY SYSTEMS (fragmentados)                │
│  agent-memory.ts → memory-orchestrator.ts → semantic-memory  │
│  → memory-consolidator.ts → memory-recall.ts                 │
│  → agents/memory-keeper.ts                                   │
└──────┬───────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│              CONTENT ENGINE (consolidado ✅)                  │
│  content-engine.ts → provider.ts (circuit breaker)           │
│  → DeepSeek / Groq / OpenAI / Anthropic                      │
└──────────────────────────────────────────────────────────────┘
```

### Problemas identificados

| Problema | Local | Impacto |
|----------|-------|---------|
| Duplicação de engine | `src/engine/` vs `src/lib/engine/` | 2 profilers, 2 routers, 2 backtracks |
| Sem camada de orquestração | Cada rota chama engines diretamente | Lógica de decisão espalhada |
| Memória fragmentada | 6 arquivos, sem facade unificada | Dificuldade de manutenção |
| Sem governança de agentes | Nenhum controle centralizado | Sem priorização, custo, ou fallback |
| Sem observabilidade | Nenhum logging estruturado de decisões | Impossível auditar escolhas |

---

## 2. Arquitetura Proposta

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENTE                               │
└──────┬──────────────────────────────────┬───────────────────┘
       │                                  │
       ▼                                  ▼
┌──────────────────────────────────────────────────────────────┐
│                    API GATEWAY (thin)                        │
│  Cada rota APENAS: parse request → call CognitiveLayer       │
│  → format response → return                                  │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                  COGNITIVE LAYER (NOVO)                      │
│                                                              │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  ┌────────────┐  │
│  │Percepção│→ │ Memória  │→ │Planejamento│→ │Orquestrador│  │
│  └─────────┘  └──────────┘  └───────────┘  └──────┬──────┘  │
│                                                    │         │
└────────────────────────────────────────────────────┼─────────┘
                                                     │
         ┌───────────────────────────────────────────┼────────┐
         │              DOMAIN LAYER                 │        │
         │                                           ▼        │
         │  ┌──────────────┐  ┌────────────────────────────┐  │
         │  │ AgentGovernor│  │   MemoryManager (facade)   │  │
         │  │ (seleção,    │  │   agent-memory.ts          │  │
         │  │  prioridade, │  │   semantic-memory.ts       │  │
         │  │  custo)      │  │   memory-orchestrator.ts   │  │
         │  └──────────────┘  │   memory-consolidator.ts   │  │
         │                    │   memory-recall.ts         │  │
         │  ┌──────────────┐  │   memory-keeper.ts         │  │
         │  │ EngineRouter │  └────────────────────────────┘  │
         │  │ router.ts    │                                  │
         │  │ phase-router │  ┌────────────────────────────┐  │
         │  │ profiler     │  │      Observability         │  │
         │  └──────────────┘  │  (decisões, custo, erros)  │  │
         │                    └────────────────────────────┘  │
         │  ┌──────────────┐                                  │
         │  │  Content     │                                  │
         │  │  Engine      │  ← ÚNICA camada de geração      │
         │  └──────────────┘                                  │
         └────────────────────────────────────────────────────┘
```

### Fluxo de decisão

```
CognitiveLayer.process(request)
│
├─ 1. Percepção
│    ├─ classificar intenção (chat, generate, route, query)
│    ├─ extrair contexto (userId, agentId, mensagem, histórico)
│    └─ detectar modo (texto, voz, laboratório, narrativa)
│
├─ 2. Memória
│    ├─ working memory → session (últimas N mensagens)
│    ├─ episodic memory → recall moments relevantes
│    ├─ semantic memory → TF-IDF matches
│    └─ cognitive profile → estado emocional/intelectual/moral
│
├─ 3. Planejamento
│    ├─ rotear (routeAdaptiveNarrative se narrativa)
│    ├─ selecionar agente (AgentGovernor)
│    ├─ detectar conflitos (agent-conflicts)
│    └─ verificar transições (narrative-transitions)
│
├─ 4. Orquestração
│    ├─ escolher provedor (Content Engine)
│    ├─ montar prompt (memória + perfil + conflitos)
│    ├─ executar com fallback
│    └─ medir custo/tempo
│
├─ 5. Validação
│    ├─ verificar saída (JSON malformed? vazio?)
│    ├─ sanitizar
│    └─ loggar decisão
│
└─ 6. Resposta
     ├─ salvar na memória episódica
     ├─ atualizar perfil cognitivo
     └─ retornar resposta padronizada
```

---

## 3. Sistema de Memória

```
┌──────────────────────────────────────────────────────────────┐
│                    MEMORY MANAGER (facade)                   │
│                                                              │
│  Acesso unificado: getContext(userId, agentId, options)      │
│                   store(userId, interaction)                 │
│                   consolidate(userId)                        │
│                                                              │
│  Delegates para subsistemas existentes sem duplicar lógica. │
└──────────────────────────────────────────────────────────────┘

Working Memory    → session cache (variáveis em memória)
                   TTL: duração da sessão (até 1h inatividade)
                   Dados: última interação, agente atual, estado UI

Session Memory    → store de sessão (cookies + localStorage)
                   TTL: 24h
                   Dados: perfil de sessão, histórico imediato

Long-Term Memory  → agent-memory.ts (TiDB)
                   TTL: configurável (default 90 dias)
                   Dados: interações completas com metadados

Semantic Memory   → semantic-memory.ts (TF-IDF local)
                   Sem TTL (consultas sob demanda)
                   Dados: índices de相似idade semântica

Episodic Memory   → memory-recall.ts + memory-consolidator.ts
                   TTL: 30 dias consolidado, 7 dias cru
                   Dados: experiências, decisões, transições

Cognitive Profile → agents/memory-keeper.ts (NexusRuntime)
                   TTL: permanente
                   Dados: perfil emocional/intelectual/moral do usuário
```

### Regras de comunicação entre memórias

1. **Working → Session**: quando sessão completa >5 interações, promove para Session
2. **Session → Long-Term**: quando sessão encerra (timeout/logout), persiste em TiDB
3. **Long-Term → Semantic**: reindexação TF-IDF a cada consolidação
4. **Long-Term → Episodic**: memory-consolidator.ts clusteriza → comprime → archiva
5. **Episodic → Cognitive Profile**: decisões consolidadas atualizam o perfil do usuário

---

## 4. Governança de Agentes

| Agente | Responsabilidade | Entradas | Saídas | Ferramentas | Consumidores |
|--------|-----------------|----------|--------|-------------|--------------|
| **Nexus** | Arquiteto do Conhecimento | user query, profile | conhecimento, perguntas | content-engine | /api/chat, /api/agents/chat, lab |
| **Cipher** | Decodificador | problemas complexos | padrões, insights | content-engine | /api/chat, /api/lab/agent |
| **Kaos** | Caos Criativo | desafios de inovação | ideias disruptivas | content-engine | /api/chat, /api/lab/agent |
| **Aurora** | Pioneira | horizontes desconhecidos | novas perspectivas | content-engine | /api/chat, /api/lab/agent |
| **Volt** | Energia | estagnação, inércia | motivação, ação | content-engine | /api/chat |
| **Ethos** | Filósofo | dilemas éticos | reflexão moral | content-engine | /api/chat |
| **Lyra** | Artista | conceitos abstratos | metáforas visuais | content-engine | /api/chat |
| **Axiom** | Cientista | problemas lógicos | provas, deduções | content-engine | /api/chat |
| **Stratos** | Estrategista | planejamento | estratégias | content-engine | /api/chat |
| **Terra** | Guardiã | aplicação prática | conexão humana | content-engine | /api/chat |
| **Prism** | Revelador | complexidade | múltiplas perspectivas | content-engine | /api/chat |
| **Janus** | Humorista | tensão | humor, paradoxos | content-engine | /api/chat |

**Sobreposições identificadas:** Nenhuma. Cada agente tem domínio único.

**Sobreposições de ferramentas:** Todos usam `content-engine` — **intencional**. A Content Engine é a única camada de geração.

---

## 5. Orquestrador Central

```
┌──────────────────────────────────────────────────────────────┐
│                    AgentGovernor                             │
│                                                              │
│  Responsabilidades:                                          │
│  ├─ Selecionar agente baseado em perfil + contexto          │
│  ├─ Definir prioridade (narrativa > default > fallback)     │
│  ├─ Evitar loops (track de últimas N chamadas por agente)   │
│  ├─ Evitar chamadas duplicadas (cache de requests iguais)   │
│  ├─ Controlar fallback (se agente primário falha)           │
│  ├─ Controlar custos (limitar chamadas por sessão)          │
│  └─ Controlar contexto (limitar tokens do prompt)           │
│                                                              │
│  Integrações:                                                │
│  ├─ routeAdaptiveNarrative() para decisão narrativa         │
│  ├─ analyzeNarrative() para Tree-of-Thoughts                │
│  ├─ generateContent() para execução LLM                     │
│  ├─ MemoryManager para contexto                             │
│  └─ ObservabilityLogger para auditoria                      │
└──────────────────────────────────────────────────────────────┘
```

### Anti-loop mechanism

```
AgentGovernor.selectAgent(userId, context)
  history = getRecentAgentHistory(userId, 5)
  if history.allSame(agent) AND history.count >= 3:
    return nextBestAlternative(agent, profile)  # força alternância
```

### Duplicate call prevention

```
AgentGovernor.execute(request)
  cacheKey = hash(request.userId + request.prompt + request.agent)
  if cache.has(cacheKey) AND cache.age(cacheKey) < 60s:
    return cache.get(cacheKey)        # mesma chamada nos últimos 60s
  result = await generateContent(...)
  cache.set(cacheKey, result)
```

---

## 6. Knowledge Graph

**Decisão: NÃO implementar agora.**

### Justificativa

1. O schema TiDB já tem `knowledge_unit`, `knowledge_asset`, `knowledge_graph_edge` — a infraestrutura de tabelas existe
2. Porém, não há consumidores ativos para um grafo cognitivo
3. A `knowledge_graph_edge` está vazia — sem dados relacionais
4. Implementar agora seria speculative architecture

### Quando implementar

- Após Fase 5 (Orquestração Inteligente), quando houver dados suficientes
- Quando existirem >50 knowledge_units publicadas
- Quando houver um caso de uso real (ex.: recomendação baseada em grafo)

### Arquitetura proposta (futura)

```
knowledge_unit ──→ knowledge_graph_edge ──→ knowledge_unit
     │                                             │
     │  (conceito: "redes neurais")                │  (conceito: "aprendizado profundo")
     └──────────── relates_to ──────────────────────┘
     
     knowledge_unit
     │  (conceito: "Python")
     └──────────── requires ───────────────────────→ prerequisite skill
```

---

## 7. Observabilidade

```
┌──────────────────────────────────────────────────────────────┐
│                  ObservabilityLogger                         │
│                                                              │
│  A cada decisão, registrar:                                  │
│                                                              │
│  {                                                            │
│    timestamp: ISO,                                            │
│    userId: string,                                            │
│    sessionId: string,                                         │
│    agentSelected: string,                                     │
│    providerUsed: "deepseek" | "groq",                        │
│    executionTimeMs: number,                                   │
│    estimatedCost: number,        // tokens * rate             │
│    fallbackTriggered: boolean,                                │
│    circuitBreakerOpen: boolean,                               │
│    memoryUsed: { working, session, longTerm, semantic },     │
│    memorySize: number,             // chars recuperados       │
│    tokensIn: number,                                          │
│    tokensOut: number,                                         │
│    error: string | null,                                      │
│    route: "chat" | "agent" | "universe" | "series" | "lab",  │
│  }                                                            │
└──────────────────────────────────────────────────────────────┘

Storage: TiDB (tabela cognitive_decisions)
TTL: 90 dias (com rotação para cold storage)
```

---

## 8. Escalabilidade

### Gargalos identificados

| Gargalo | Impacto | Mitigação |
|---------|---------|-----------|
| DeepSeek latência (~40s screenplay) | UX lento para episódios novos | 1. Cache-first (já implementado) 2. Gerar em background |
| In-memory circuit breaker | Reseta em cold start Vercel | Migrar para Upstash Redis quando necessário |
| TF-IDF em memória (semantic-memory) | Não escala com >10k entradas | Substituir por embeddings (futuro) |
| Provedor único (DeepSeek primário) | SPOF | Circuit breaker + Groq fallback já implementados |

### Para suportar 500 módulos + milhares de episódios

1. **Cache-first** ✅ — já implementado no /api/series/content
2. **Content Engine** ✅ — única camada de geração
3. **Database indexado** — knowledge_asset tem índices em (agentId, season, episode, type, status)
4. **Semantic memory local** — TF-IDF O(n) por consulta — substituir por pgvector/embeddings quando >5k entradas
5. **Parallel fallback** — ping DeepSeek e Groq em paralelo em vez de sequencial (reduz latência de fallback)

---

## 9. Roadmap Arquitetural

### Fase 1 — Infraestrutura (atual) ✅

- Content Engine consolidada ✅
- Provider com circuit breaker ✅
- Cache persistence ✅
- Narração adaptativa ✅
- Agentes canônicos definidos ✅
- Memória TiDB + TF-IDF ✅
- **Pendente:** `src/lib/engine/` legado precisa ser removido

### Fase 2 — Camada Cognitiva (⬅️ PRÓXIMA)

- Criar `src/lib/cognitive/` com:
  - `cognitive-layer.ts` — entry point unificado
  - `agent-governor.ts` — seleção + prioridade + anti-loop
  - `memory-manager.ts` — facade sobre memórias existentes
  - `observability-logger.ts` — logging estruturado
- Remover `src/lib/engine/` (legado)
-Remover `src/lib/agent-runner.ts` (inlining nos 2 consumidores)
- Migrar `/api/chat` (751 linhas) para usar CognitiveLayer

### Fase 3 — Governança

- `src/lib/cognitive/governance.ts`
  - Rate limiting por agente
  - Custo máximo por sessão
  - Priorização de provedor por carga
  - Auditoria de decisões

### Fase 4 — Memória Persistente

- `memory-manager.ts` com suporte a Redis (Upstash)
  - Circuit breaker compartilhado entre instâncias
  - Cache de decisões entre requisições
  - Rate limiting distribuído

### Fase 5 — Orquestração Inteligente

- `agent-governor.ts` com:
  - Roteamento narrativo automático (já existe em router.ts)
  - Detecção de padrões de comportamento
  - Sugestão proativa de agente
  - Alternância inteligente para evitar monotonia

### Fase 6 — Percepção AAA

- Multi-modalidade (texto + voz + imagem)
- Classificação de intenção com LLM
- Detecção de frustração/engajamento
- Contexto temporal (hora do dia, frequência de uso)

### Fase 7 — Autoevolução

- Feedback loop: respostas do usuário → ajuste de perfil → melhoria de seleção
- A/B testing de prompts
- Auto-ajuste de temperatura/modelo por tipo de request
- Knowledge Graph populado automaticamente

---

## 10. RESTRIÇÕES VERIFICADAS

- ✅ `generateContent()` é a única camada de geração — **preservado**
- ✅ Nenhum novo provider será criado — provider.ts + circuit breaker suficientes
- ✅ `narrative-engine.ts` renomeado (ex-langchain-integration) — sem LangChain
- ✅ `agent-runner.ts` é deprecated e será removido na Fase 2
- ⚠️ `src/lib/engine/` contém 6 arquivos legados — **remover na Fase 2**

---

## Relatório Final

### Arquitetura atual

Engines e memórias fragmentadas em ~52 arquivos, 2 camadas de engine (moderna + legado), 6 subsistemas de memória sem facade unificada, 8 rotas de API com lógica de decisão duplicada.

### Arquitetura proposta

Cognitive Layer única (`src/lib/cognitive/`) como entry point, MemoryManager como facade, AgentGovernor como orquestrador, ObservabilityLogger para auditoria. Componentes existentes são **reutilizados**, não substituídos.

### Componentes reutilizados

- `content-engine.ts` + `provider.ts` — geração LLM
- `agent-memory.ts`, `semantic-memory.ts`, `memory-orchestrator.ts`, `memory-consolidator.ts`, `memory-recall.ts` — memória
- `router.ts`, `narrative-engine.ts`, `phase-router.ts` — roteamento
- `agent-conflicts.ts`, `narrative-transitions.ts` — conflitos
- `agents/memory-keeper.ts` — perfil cognitivo
- `canon/agents/canon.ts` — definição de agentes

### Componentes novos

- `src/lib/cognitive/cognitive-layer.ts` — orquestrador central (~200 linhas)
- `src/lib/cognitive/agent-governor.ts` — seleção + governança (~150 linhas)
- `src/lib/cognitive/memory-manager.ts` — facade de memória (~100 linhas)
- `src/lib/cognitive/observability-logger.ts` — logging estruturado (~80 linhas)

### Componentes redundantes encontrados

- `src/lib/engine/profiler.ts` → duplica `src/engine/profiler.ts` (remover)
- `src/lib/engine/router.ts` → duplica `src/engine/router.ts` (remover)
- `src/lib/engine/backtrack.ts` → duplica `src/engine/backtrack.ts` (remover)
- `src/lib/engine/conflicts.ts` → duplica `src/engine/agent-conflicts.ts` (remover)
- `src/lib/agent-runner.ts` → wrapper thin, substituível por `generateContent()` direto

### Riscos arquiteturais

1. **In-memory circuit breaker reinicia em cold start** — baixo impacto (1 chamada lenta a cada cold start)
2. **TF-IDF não escala horizontalmente** — médio impacto (>5k entradas), substituir por embeddings no futuro
3. **Profiler duplicado** — baixo impacto (src/lib/engine/profiler.ts tem consumidores conhecidos)
4. **DeepSeek latência alta** — médio impacto (screenplay ~40s), mitigado por cache

### Ordem recomendada de implementação

1. Criar `src/lib/cognitive/` com 4 arquivos (Fase 2)
2. Migrar `/api/chat` (maior rota, 751 linhas) para CognitiveLayer
3. Remover `src/lib/engine/` (legado)
4. Remover `src/lib/agent-runner.ts`
5. Migrar demais rotas incrementalmente
6. Adicionar governança (Fase 3)

### Impacto em escalabilidade

Positivo. A Cognitive Layer desacopla as rotas da lógica de decisão, permitindo:
- Trocar provedores sem alterar rotas
- Adicionar cache distribuído sem alterar rotas
- Adicionar rate limiting sem alterar rotas
- 500 módulos → mesma Cognitive Layer, apenas novos canais

### Impacto em custo operacional

**Neutro a positivo.** Nenhum novo serviço externo. Apenas reorganização de código existente. O cache já implementado reduz chamadas LLM.

### Nota da arquitetura cognitiva

**7/10**

Justificativa: A arquitetura atual tem boa base (Content Engine consolidada, agentes canônicos, memória funcional), mas sofre de fragmentação (duas engines, memória sem facade, decisão espalhada em 8 rotas). A proposta resolve a fragmentação mantendo o que funciona.

---

## Pode iniciar a implementação?

**✅ SIM**

Justificativa: A Fase 2 não introduz novas dependências externas, não altera contratos de API existentes, e reutiliza ~90% do código existente via facades. Os 4 novos arquivos (`~530 linhas totais`) são coordenação, não implementação duplicada. A remoção do legado `src/lib/engine/` é segura (todos os consumidores conhecidos). Riscos identificados são baixos e mitigáveis.
