# 🌊 Fluxos de Engenharia — MENTE.AI

> **Como a água se move pelos canos da cidade cognitiva.**  
> Cada fluxo é uma jornada completa — do estímulo inicial à resposta final.

---

## 1. FLUXO DE CONVERSA DO USUÁRIO

O caminho completo de uma mensagem do usuário até a resposta do agente.

```
Usuário digita mensagem
        │
        ▼
┌──────────────────┐
│   AgentChat.tsx   │  ← Frontend: constrói payload, inicia stream
└──────┬───────────┘
       │ POST /api/chat  (SSE)
       ▼
┌──────────────────┐
│   chat/route.ts   │  ← Extrai userId do JWT, carrega perfil
└──────┬───────────┘
       │
       ├─→ Carrega memórias (Top 4, ~600 chars)
       │
       ├─→ Constrói system prompt (personalidade + memórias)
       │
       ├─→ Chama LLM (Anthropic/OpenAI) com streaming
       │
       ├─→ Envia tokens em SSE (ReadableStream)
       │
       └─→ Fire-and-forget: armazena memórias da conversa
                │
                ▼
       ┌──────────────────┐
       │  AgentChat.tsx    │  ← Acumula tokens, renderiza com cursor pulsante
       └──────────────────┘
                │
                ▼
       Usuário vê resposta fluindo em tempo real
```

---

## 2. FLUXO DE RECUPERAÇÃO DE MEMÓRIA

Como o sistema escolhe quais memórias entram no contexto do chat.

```
Requisição de chat recebida
        │
        ▼
┌─────────────────────────┐
│  getMemoryContext()      │
│  (userId, agentId, limit: 4) │
└──────┬──────────────────┘
       │
       ├─→ 1. Busca todas as memórias do par (usuário, agente)
       │      SELECT * FROM agentNotes WHERE userId=X AND agentId=Y
       │
       ├─→ 2. Filtro anti-ruído
       │      Remove: mensagens < 20 chars, saudações, repetições
       │
       ├─→ 3. Classificação (Context Priority Engine)
       │      ┌──────────────────────────────────────┐
       │      │ Score = (pesoEmocional × 1.5)        │
       │      │       + (relevância TF-IDF × 1.0)    │
       │      │       + (recência × decay_factor)     │
       │      │       + (match com intenção atual)    │
       │      └──────────────────────────────────────┘
       │
       ├─→ 4. Diversidade forçada
       │      Garante: ≥ 1 memória emocional + ≥ 1 memória factual
       │
       └─→ 5. Retorna Top 4 (máx 600 chars)
                │
                ▼
       Injetado no system prompt do agente
```

---

## 3. FLUXO DO CONTEXT PRIORITY ENGINE

Como o motor decide a relevância de cada memória para a conversa atual.

```
Mensagem do usuário: "Estou me sentindo ansioso com as provas"
        │
        ▼
┌─────────────────────────┐
│  Classificador de        │
│  Intenção (regex)        │
│                          │
│  Match: "ansioso" →      │
│  tipo: EMOTIONAL         │
│  peso base: 1.5          │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Busca de memórias       │
│  candidatas (até 200)    │
└──────┬──────────────────┘
       │
       ├─→ Memória #47: "usuário mencionou ansiedade com matemática"
       │      Score: pesoEmocional(0.9) × 1.5 + TF-IDF("ansioso","ansiedade")×0.85 + recência(3d)×0.7
       │      = 1.35 + 0.85 + 0.7 = 2.90 ✅
       │
       ├─→ Memória #12: "usuário prefere explicações visuais"
       │      Score: pesoPreferencia(0.5) × 1.0 + TF-IDF("ansioso","visual")×0.1 + recência(10d)×0.5
       │      = 0.5 + 0.1 + 0.5 = 1.10 (baixa relevância contextual)
       │
       ├─→ Memória #89: "usuário compartilhou medo de falhar"
       │      Score: pesoEmocional(0.95) × 1.5 + TF-IDF×0.8 + recência(7d)×0.6
       │      = 1.425 + 0.8 + 0.6 = 2.825 ✅
       │
       └─→ Diversidade check: temos 2 emocionais. Precisa de ≥ 1 factual.
            Memória #3: "usuário está na 3a série do ensino médio"
            Score baixo mas entra por diversidade forçada.
                │
                ▼
       Top 4 selecionadas → injetadas no system prompt
```

---

## 4. FLUXO DE EVOLUÇÃO DE RELACIONAMENTO

Como o relacionamento usuário-agente evolui ao longo do tempo.

```
Nova interação concluída
        │
        ▼
┌─────────────────────────┐
│  Avaliação pós-chat      │
│  - Duração da conversa   │
│  - Profundidade emocional│
│  - Decisões narrativas   │
│  - Frequência recente    │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Gatilhos de transição   │
│                          │
│  Stranger → Acquaintance │
│    Requer: 3 interações  │
│    profundidade > 50char │
│                          │
│  Acquaintance → Companion│
│    Requer: 5 interações  │
│    + 1 memória emocional │
│                          │
│  Companion → Confidant   │
│    Requer: 15 interações │
│    + preferência pessoal │
│                          │
│  Confidant → Mentor      │
│    Requer: 30 interações │
│    + decisão narrativa   │
└──────┬──────────────────┘
       │
       ├─→ Transição? SIM → Atualiza nível em userAgentProgress
       │                    → Ajusta tom do agente (formal → íntimo)
       │
       └─→ Transição? NÃO → Acumula progresso para próxima interação
```

---

## 5. FLUXO DE RECALL MOMENT

Como o agente "lembra" espontaneamente de algo do passado do usuário.

```
Usuário menciona gatilho emocional: "Lembra quando eu falei sobre..."
        │
        ▼
┌─────────────────────────┐
│  Detecção de gatilho     │
│  - Palavra emocional?    │
│  - Referência temporal?  │
│    ("semana passada",    │
│     "da última vez")     │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Busca em recall cache   │
│  (memórias antigas com   │
│   alto peso emocional,   │
│   fora da janela normal) │
└──────┬──────────────────┘
       │
       ├─→ Encontrou? → Recupera memória antiga
       │                → Gera resposta com tom nostálgico:
       │                "Sim, há 3 semanas você mencionou isso
       │                 quando estávamos falando sobre..."
       │
       └─→ Não encontrou? → Responde normalmente
                            → Armazena este momento como potencial
                              recall futuro
```

---

## 6. FLUXO DE META-COGNIÇÃO

Como o agente "pensa sobre como respondeu" para melhorar.

```
Resposta enviada ao usuário
        │
        ▼
┌─────────────────────────┐
│  Análise pós-resposta    │
│  (assíncrono, fire-and-  │
│   forget — não bloqueia) │
└──────┬──────────────────┘
       │
       ├─→ Dimensão 1: Qualidade
       │    A resposta foi útil?
       │    • Usuário fez follow-up? (+)
       │    • Usuário mudou de assunto abruptamente? (-)
       │    • Resposta continha perguntas não respondidas? (-)
       │
       ├─→ Dimensão 2: Consistência
       │    A resposta contradiz algo dito antes?
       │    • Verifica contra memórias factuais
       │    • Detecta contradições com preferências conhecidas
       │
       ├─→ Dimensão 3: Afinidade
       │    O tom combinou com o perfil?
       │    • Formal demais para um Confidant? (-)
       │    • Íntimo demais para um Stranger? (-)
       │
       └─→ Gera "meta-memória":
            "Última resposta foi muito técnica para este usuário.
             Da próxima vez, usar mais analogias."
                │
                ▼
       Meta-memória armazenada → ajusta tom na próxima interação
```

---

## 7. FLUXO DE STREAMING

Como a resposta do agente chega token por token ao frontend.

```
LLM começa a gerar resposta
        │
        ▼
┌─────────────────────────┐
│  ReadableStream (backend)│
│  controller.enqueue()    │
│  a cada token recebido   │
└──────┬──────────────────┘
       │ SSE (Server-Sent Events)
       ▼
┌─────────────────────────┐
│  AgentChat.tsx (frontend)│
│                          │
│  Estado 1: THINKING      │
│  ┌──────────────────┐   │
│  │ ○ ○ ○ pulsando   │   │
│  │ "NEXUS está       │   │
│  │  pensando..."     │   │
│  └──────────────────┘   │
│       │ (primeiro token)│
│       ▼                 │
│  Estado 2: STREAMING    │
│  ┌──────────────────┐   │
│  │ Texto acumulando  │   │
│  │ com cursor ▌      │   │
│  │ pulsando no final │   │
│  └──────────────────┘   │
│       │ (stream fecha)  │
│       ▼                 │
│  Estado 3: DONE         │
│  ┌──────────────────┐   │
│  │ Resposta completa │   │
│  │ sem cursor        │   │
│  └──────────────────┘   │
└──────────────────────────┘
       │
       ├─→ Usuário clica "Parar"? → AbortController.abort()
       │                            → Stream cancela
       │                            → Estado volta para input pronto
       │
       └─→ Erro na stream? → AbortError = esperado (usuário parou)
                            → Outro erro = "Erro de rede"
```

---

## 8. FLUXO DE AUTENTICAÇÃO

```
┌─────────┐     ┌──────────┐     ┌──────────┐     ┌───────────┐
│ Usuário │     │ Frontend │     │ API Auth │     │ Middleware │
└────┬────┘     └────┬─────┘     └────┬─────┘     └─────┬─────┘
     │               │               │                  │
     │  Login        │               │                  │
     │──────────────→│               │                  │
     │               │  POST /api/   │                  │
     │               │  auth/login   │                  │
     │               │──────────────→│                  │
     │               │               │ valida credenciais│
     │               │               │ gera JWT (jose)  │
     │               │  Set-Cookie:  │                  │
     │               │  mente_ai_    │                  │
     │               │  token=xxx    │                  │
     │               │←──────────────│                  │
     │               │               │                  │
     │  Navega para  │               │                  │
     │  /universo/   │               │                  │
     │  nexus        │               │                  │
     │──────────────→│               │                  │
     │               │  GET /universo/nexus              │
     │               │──────────────────────────────────→│
     │               │               │                  │
     │               │               │   verifyToken()  │
     │               │               │   (criptográfico)│
     │               │               │←─────────────────│
     │               │               │   ✅ válido      │
     │               │               │                  │
     │               │  Página renderizada               │
     │               │←──────────────────────────────────│
     │               │               │                  │
```

---

## 9. FLUXO DE RECUPERAÇÃO DE ERRO

Como o sistema lida com falhas em 4 níveis.

```
┌──────────────────────────────────────────────┐
│                 ERRO DETECTADO                │
└──────────────────┬───────────────────────────┘
                   │
      ┌────────────┼────────────┐
      ▼            ▼            ▼
  Erro de        Erro de      Erro de
  componente     API route    layout
      │            │            │
      ▼            ▼            ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ error.tsx │ │ try/catch│ │ global-  │
│ (segmento)│ │ + 400/500│ │ error.tsx│
│          │ │ response │ │ (último  │
│ reset()  │ │          │ │ recurso) │
│ ou       │ │ logger   │ │          │
│ reload() │ │ .error() │ │ html+body│
└──────────┘ └──────────┘ │ próprio  │
                          └──────────┘
      │            │            │
      └────────────┼────────────┘
                   │
                   ▼
         ┌──────────────────┐
         │  Sentry (produção)│
         │  ou console (dev) │
         └──────────────────┘
```

---

> *"Entender os fluxos não é decorar caminhos — é compreender a fisiologia da cidade cognitiva."*
