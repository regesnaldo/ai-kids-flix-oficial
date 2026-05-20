# 🗺️ Diagramas de Sistema — MENTE.AI

> **A planta baixa da civilização cognitiva.**  
> Diagramas de alto nível para orientação arquitetural.

---

## 1. ARQUITETURA COGNITIVA COMPLETA

```mermaid
graph TB
    subgraph "Frontend (Next.js + React)"
        UI[Páginas e Componentes]
        CHAT[AgentChat Streaming]
        SCENES[Three.js Scenes]
    end

    subgraph "API Layer (30+ routes)"
        AUTH[Auth API]
        CHAT_API[Chat API]
        MEMORY_API[Memory API]
        VOICE[Voice API]
        INTERACTION[Interaction API]
    end

    subgraph "Cognitive Engine"
        PROFILER[Identity Profiler]
        MEMORY[5-Layer Memory]
        CPE[Context Priority Engine]
        REL[Relationship Engine]
        META[Meta-Cognition]
        RECALL[Recall Engine]
    end

    subgraph "AI Providers"
        ANTHROPIC[Anthropic Claude]
        OPENAI[OpenAI Fallback]
        ELEVENLABS[ElevenLabs TTS]
    end

    subgraph "Data"
        TIDB[(TiDB Cloud)]
        LOCAL[localStorage Cache]
    end

    UI --> CHAT_API
    CHAT --> CHAT_API
    CHAT_API --> MEMORY
    CHAT_API --> CPE
    CHAT_API --> ANTHROPIC
    CHAT_API --> OPENAI
    MEMORY --> TIDB
    MEMORY --> LOCAL
    PROFILER --> TIDB
    PROFILER --> LOCAL
    REL --> TIDB
    META --> MEMORY
    RECALL --> MEMORY
    INTERACTION --> REL
    VOICE --> ELEVENLABS
    SCENES --> UI
```

---

## 2. CAMADAS DE MEMÓRIA

```mermaid
graph TB
    INPUT[Input do Usuário] --> PROFILER

    subgraph "Camada 1: Identity Profiler"
        PROFILER[3 Dimensões: Emocional, Intelectual, Moral]
        PROFILER --> ARCH[6 Arquétipos]
    end

    subgraph "Camada 2: Semantic Memory"
        TFIDF[TF-IDF + Similaridade Cosseno]
        ARCH --> TFIDF
        TFIDF --> STORE[(agentNotes)]
    end

    subgraph "Camada 3: Memory Consolidator"
        DECAY[Decaimento Temporal]
        COALESCE[Coalescência de Memórias]
        STORE --> DECAY
        DECAY --> COALESCE
    end

    subgraph "Camada 4: Context Priority Engine"
        CLASS[Classificador de Intenção]
        SCORE[Scoring Multi-Fator]
        DIV[Garantia de Diversidade]
        COALESCE --> CLASS
        CLASS --> SCORE
        SCORE --> DIV
    end

    subgraph "Camada 5: Recall Moments"
        TRIGGER[Gatilhos Emocionais]
        RETRIEVE[Resgate de Memórias Antigas]
        DIV --> TRIGGER
        TRIGGER --> RETRIEVE
    end

    RETRIEVE --> OUTPUT[Contexto Injetado no System Prompt]
```

---

## 3. ORQUESTRAÇÃO DE AGENTES

```mermaid
graph TB
    USER[Usuário] --> NEXUS

    NEXUS[NEXUS 'O Conector'<br/>Orquestrador Central]

    NEXUS --> VOLT[VOLT<br/>Energia]
    NEXUS --> AURORA[AURORA<br/>Criação]
    NEXUS --> KAOS[KAOS<br/>Inovação]
    NEXUS --> CIPHER[CIPHER<br/>Análise]
    NEXUS --> LYRA[LYRA<br/>Harmonia]
    NEXUS --> ETHOS[ETHOS<br/>Ética]
    NEXUS --> AXIOM[AXIOM<br/>Lógica]
    NEXUS --> STRATOS[STRATOS<br/>Estratégia]
    NEXUS --> TERRA[TERRA<br/>Dados]
    NEXUS --> PRISM[PRISM<br/>Perspectiva]
    NEXUS --> JANUS[JANUS<br/>Probabilidade]

    VOLT -.->|conflito| ETHOS
    KAOS -.->|conflito| STRATOS
    CIPHER -.->|conflito| AURORA

    NEXUS --> ENGINE[Narrative Engine]
    ENGINE --> ROUTER[Phase Router]
    ROUTER --> DECISION[Interactive Decisions]
```

---

## 4. ARQUITETURA DE STREAMING

```mermaid
sequenceDiagram
    participant U as Usuário
    participant FE as AgentChat.tsx
    participant API as /api/chat
    participant LLM as Anthropic/OpenAI
    participant MEM as Memory Engine

    U->>FE: Digita mensagem
    FE->>API: POST /api/chat (SSE)
    API->>MEM: getMemoryContext(userId, agentId, 4)
    MEM-->>API: Top 4 memórias (600 chars)
    API->>API: buildSystemPrompt(agent, memories)
    API->>LLM: Streaming request
    LLM-->>API: token 1
    API-->>FE: SSE: data: token 1
    FE->>FE: Estado: STREAMING
    LLM-->>API: token 2
    API-->>FE: SSE: data: token 2
    LLM-->>API: token N (final)
    API-->>FE: SSE: data: [DONE]
    FE->>FE: Estado: DONE
    API->>MEM: storeConversationMemories() (fire-and-forget)
    FE-->>U: Resposta completa
```

---

## 5. LIMITES DE SEGURANÇA

```mermaid
graph TB
    subgraph "Internet Pública"
        USERS[Usuários]
        ATTACKERS[Atacantes]
    end

    subgraph "Fronteira 1: Vercel Edge"
        TLS[Terminação TLS]
        HEADERS[Security Headers]
        CDN[Rate Limiting CDN]
    end

    subgraph "Fronteira 2: Middleware"
        JWT[Validação JWT Criptográfica]
        REDIRECT[Redirecionamento Não-Auth]
    end

    subgraph "Fronteira 3: API Routes"
        VALIDATE[Validação de Input]
        RATE[Rate Limiting por Rota]
        SANITIZE[Sanitização Prompt Injection]
    end

    subgraph "Fronteira 4: Serviços Externos"
        ANTHROPIC[Anthropic API]
        TIDB[(TiDB Cloud)]
        ELEVENLABS[ElevenLabs API]
        STRIPE[Stripe API]
    end

    USERS --> TLS
    ATTACKERS --> TLS
    TLS --> HEADERS
    HEADERS --> JWT
    JWT --> REDIRECT
    REDIRECT --> VALIDATE
    VALIDATE --> RATE
    RATE --> SANITIZE
    SANITIZE --> ANTHROPIC
    SANITIZE --> TIDB
    SANITIZE --> ELEVENLABS
    SANITIZE --> STRIPE
```

---

## 6. RELAÇÃO FRONTEND ↔ BACKEND

```mermaid
graph LR
    subgraph "Frontend (Browser)"
        PAGES[56+ Páginas]
        COMPONENTS[Componentes React]
        STORES[5 Zustand Stores]
        SCENES[12 Three.js Scenes]
    end

    subgraph "Next.js Server"
        SSR[Server-Side Rendering]
        API[30+ API Routes]
        MIDDLEWARE[Middleware JWT]
    end

    subgraph "Externo"
        LLM[LLM APIs]
        DB[(TiDB)]
        TTS[ElevenLabs]
        PAY[Stripe]
    end

    PAGES --> SSR
    COMPONENTS --> SSR
    STORES --> API
    SCENES --> SSR
    SSR --> API
    API --> MIDDLEWARE
    MIDDLEWARE --> DB
    API --> LLM
    API --> TTS
    API --> PAY
    API --> DB
```

---

## 7. ARQUITETURA DE BANCO DE DADOS

```mermaid
graph TB
    subgraph "Aplicação"
        VERCEL[Vercel Serverless]
        POOL[Lazy DB Pool<br/>Proxy Singleton]
    end

    subgraph "Schema"
        AUTH_T[users<br/>profiles]
        CONTENT_T[series<br/>episodes<br/>explorers]
        MEMORY_T[chatHistory<br/>agentNotes<br/>userPreferences]
        GAMIFY_T[userXp<br/>favorites<br/>watchProgress]
        NARRATIVE_T[interactiveDecisions<br/>explorerDecisions<br/>userAgentProgress]
        SYSTEM_T[agentMetadata<br/>agentCombinations<br/>userCombinations]
    end

    subgraph "TiDB Cloud"
        TIDB_SERVERLESS[TiDB Serverless<br/>gru1 - São Paulo]
        AUTO_SCALE[Auto-Scaling Horizontal]
        BACKUP[Automated Backups]
    end

    VERCEL --> POOL
    POOL --> AUTH_T
    POOL --> CONTENT_T
    POOL --> MEMORY_T
    POOL --> GAMIFY_T
    POOL --> NARRATIVE_T
    POOL --> SYSTEM_T
    AUTH_T --> TIDB_SERVERLESS
    CONTENT_T --> TIDB_SERVERLESS
    MEMORY_T --> TIDB_SERVERLESS
    GAMIFY_T --> TIDB_SERVERLESS
    NARRATIVE_T --> TIDB_SERVERLESS
    SYSTEM_T --> TIDB_SERVERLESS
    TIDB_SERVERLESS --> AUTO_SCALE
    TIDB_SERVERLESS --> BACKUP
```

---

## 8. ORQUESTRAÇÃO DE CONTEXTO

```mermaid
graph TB
    REQ[Nova Requisição de Chat] --> EXTRACT[Extrai userId + agentId]

    EXTRACT --> PARALLEL

    subgraph PARALLEL[Paralelo]
        MEM[Carrega Memórias<br/>Top 4, 600 chars]
        PROF[Carrega Perfil<br/>3 dimensões]
        REL[Carrega Relacionamento<br/>5 níveis]
    end

    PARALLEL --> ASSEMBLY[Montagem do Contexto]

    subgraph ASSEMBLY
        SYS[System Prompt Base]
        MEM_CTX[Memórias Relevantes]
        PROF_CTX[Perfil do Usuário]
        REL_CTX[Tom do Relacionamento]
    end

    ASSEMBLY --> FINAL[Contexto Final Montado]
    FINAL --> LLM[Enviado ao LLM]

    style FINAL fill:#0a0a1a,stroke:#00f0ff,color:#00f0ff
```

---

> *"Um bom diagrama é como um mapa de metrô — não mostra cada árvore, mas mostra exatamente como chegar onde você precisa."*
