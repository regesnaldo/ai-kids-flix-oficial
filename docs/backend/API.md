# 📡 Catálogo de APIs — MENTE.AI

> **34 endpoints. 8 domínios. Uma cidade de dados.**  
> Toda rota documentada com propósito, contrato e exemplos.

---

## 🔑 AUTENTICAÇÃO (4 rotas)

### `POST /api/auth/login`
**Propósito:** Autenticar usuário e gerar JWT.

| Campo | Detalhe |
|-------|---------|
| Auth | Nenhuma (pública) |
| Body | `{ email: string, senha: string }` |
| Sucesso | `200` + Set-Cookie: `mente_ai_token` |
| Erros | `400` JSON inválido, `401` credenciais incorretas |
| Rate Limit | 5 tentativas/minuto |

### `POST /api/auth/register`
**Propósito:** Criar nova conta de usuário.

| Campo | Detalhe |
|-------|---------|
| Auth | Nenhuma (pública) |
| Body | `{ nome: string, email: string, senha: string }` |
| Sucesso | `201` + Set-Cookie: `mente_ai_token` |
| Erros | `400` JSON inválido / email já existe |

### `POST /api/auth/logout`
**Propósito:** Invalidar sessão atual.

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Sucesso | `200` + Cookie expirado |
| Erros | `401` não autenticado |

### `GET /api/auth/session`
**Propósito:** Verificar se há sessão ativa e retornar dados do usuário.

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Sucesso | `200` + `{ user: {...} }` |
| Erros | `401` sem sessão |

---

## 💬 CHAT (3 rotas)

### `POST /api/chat`
**Propósito:** Conversa principal com agentes. Este é o **coração do produto**.

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Body | `{ agentId: string, messages: [...], stream: true }` |
| Sucesso | `200` SSE stream (tokens em tempo real) |
| Erros | `401` não autenticado, `429` rate limit |
| Rate Limit | 30 mensagens/minuto |
| Max Duration | 30s |
| Cognição | Memory Engine, Context Priority Engine, Relationship Engine |

**Fluxo cognitivo:** Carrega perfil → busca Top 4 memórias → monta system prompt → chama LLM → stream → armazena novas memórias (fire-and-forget).

### `POST /api/agents/chat`
**Propósito:** Chat específico para um agente individual (universo do agente).

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Body | `{ agentId: string, message: string }` |
| Sucesso | `200` SSE stream |
| Cognição | Profiler, Router, Memory Engine |

### `POST /api/universo/chat`
**Propósito:** Chat dentro das páginas de universo (NEXUS, VOLT, etc.) com Tree of Thoughts.

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Body | `{ message: string, agentId: string }` |
| Sucesso | `200` + resposta com ToT |
| Cognição | Tree of Thoughts (OpenAI), Profiler, Phase Router |
| Max Duration | 30s |

---

## 🧠 MEMÓRIA (2 rotas)

### `GET /api/notes`
**Propósito:** Listar notas/memórias do usuário com um agente específico.

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Query | `?agentId=nexus&limit=20` |
| Sucesso | `200` + array de notas |
| Cognição | Semantic Memory (TF-IDF indexado) |

### `GET /api/notes/[id]`
**Propósito:** Detalhe de uma nota/memória específica.

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Sucesso | `200` + nota completa |
| Erros | `404` nota não encontrada |

---

## 👤 PERFIS (1 rota)

### `GET /api/profiles`
**Propósito:** Carregar perfil completo do usuário (avatar, preferências, progresso).

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Sucesso | `200` + `{ profile, avatar, archetype, progress }` |
| Cognição | Identity Profiler (3 dimensões → 6 arquétipos) |

---

## 🎭 AGENTES (3 rotas)

### `GET /api/agentes`
**Propósito:** Listar todos os agentes disponíveis (12 canônicos + 108 gerados).

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Query | `?dimension=emotional&level=archetypal` (filtros opcionais) |
| Sucesso | `200` + array de agentes |

### `POST /api/agent-combination`
**Propósito:** Registrar combinação de agentes feita pelo usuário.

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Body | `{ agent1Id: string, agent2Id: string }` |
| Sucesso | `201` + `{ synergy, conflict }` |
| Cognição | Conflict System (verifica se há conflito pré-definido) |

### `GET /api/agent-combination/available`
**Propósito:** Verificar combinações disponíveis para o usuário.

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Sucesso | `200` + array de combinações possíveis |

---

## 🎯 INTERAÇÃO NARRATIVA (3 rotas)

### `POST /api/interaction`
**Propósito:** Registrar decisão interativa do usuário na narrativa.

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Body | `{ agentId: string, decision: string, context: object }` |
| Sucesso | `201` + `{ consequence, nextStep }` |
| Cognição | Narrative Engine, Relationship Engine, Phase Router |

### `GET /api/explorer`
**Propósito:** Carregar dados da trilha de exploração atual.

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Query | `?trackId=tech` |
| Sucesso | `200` + `{ explorers, progress }` |

### `GET /api/seasons`
**Propósito:** Listar temporadas e fases do sistema LEGO (50 temporadas, 5 fases).

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Sucesso | `200` + array de temporadas agrupadas por fase |
| Cognição | Phase Router |

---

## 🎙️ VOZ (4 rotas)

### `POST /api/elevenlabs/speak`
**Propósito:** Converter texto em fala usando ElevenLabs.

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Body | `{ text: string, voiceId?: string }` |
| Sucesso | `200` + audio/mpeg stream |
| Rate Limit | 10 requisições/minuto |
| Max Duration | 15s |

### `POST /api/voice/converse`
**Propósito:** Conversa por voz (transcrição → resposta → síntese).

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Body | `FormData` com arquivo de áudio |
| Sucesso | `200` + `{ transcript, response, audioUrl }` |

### `POST /api/voice/transcribe`
**Propósito:** Transcrever áudio para texto.

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Body | `FormData` com arquivo de áudio |
| Sucesso | `200` + `{ text }` |

### `POST /api/voice/emotion`
**Propósito:** Analisar emoção na voz do usuário.

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Body | `FormData` com arquivo de áudio |
| Sucesso | `200` + `{ emotion, confidence }` |
| Cognição | Identity Profiler (atualiza dimensão emocional) |

---

## 🏆 GAMIFICAÇÃO (4 rotas)

### `GET /api/xp`
**Propósito:** Consultar XP e streak do usuário.

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Sucesso | `200` + `{ totalXP, streak, level }` |

### `POST /api/xp/events`
**Propósito:** Registrar evento que gera XP (conclusão de episódio, decisão, streak).

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Body | `{ eventType: string, value: number }` |
| Sucesso | `201` + `{ newTotal, streak }` |

### `GET /api/badges`
**Propósito:** Listar badges/conquistas do usuário.

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Sucesso | `200` + array de badges |

### `GET /api/ranking`
**Propósito:** Carregar leaderboard global.

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Query | `?limit=50&offset=0` |
| Sucesso | `200` + array de usuários rankeados |

---

## 📊 DASHBOARD & HOME (2 rotas)

### `GET /api/dashboard`
**Propósito:** Dados agregados para a dashboard do usuário.

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Sucesso | `200` + `{ progress, recentActivity, recommendations }` |

### `GET /api/home/journey`
**Propósito:** Dados da jornada do usuário para a Home cinematográfica.

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Sucesso | `200` + `{ episodes, xp, archetype, progress }` |
| Cognição | Identity Profiler, Phase Router |

---

## 🧪 LABORATÓRIO (1 rota)

### `POST /api/lab/transformer`
**Propósito:** Experimento interativo com Transformer (demo educacional).

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Body | `{ input: string, layers?: number }` |
| Sucesso | `200` + `{ output, attentionMap, tokens }` |
| Max Duration | 30s |

---

## 🎓 LOGOS (QUIZ) (2 rotas)

### `POST /api/logos/question`
**Propósito:** Gerar pergunta do quiz (avaliação de aprendizado).

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Body | `{ topic: string, difficulty: string }` |
| Sucesso | `200` + `{ question, options }` |

### `POST /api/logos/evaluate`
**Propósito:** Avaliar resposta do quiz e atualizar progresso.

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Body | `{ questionId: string, answer: string }` |
| Sucesso | `200` + `{ correct, explanation, xpGained }` |

---

## 💳 PAGAMENTOS (2 rotas)

### `POST /api/checkout`
**Propósito:** Criar sessão de checkout do Stripe.

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Body | `{ planId: string }` |
| Sucesso | `200` + `{ sessionUrl }` |
| Nota | Stripe em modo teste — chaves `pk_test` / `sk_test` |

### `POST /api/webhooks/stripe`
**Propósito:** Webhook do Stripe para eventos de pagamento.

| Campo | Detalhe |
|-------|---------|
| Auth | Assinatura Stripe (`stripe-signature`) |
| Body | Evento Stripe (raw) |
| Sucesso | `200` |
| Nota | Atualiza status de assinatura no banco |

---

## 🏥 HEALTH (2 rotas)

### `GET /api/health/system`
**Propósito:** Healthcheck do sistema (DB, APIs externas, memória).

| Campo | Detalhe |
|-------|---------|
| Auth | Nenhuma (pública) |
| Sucesso | `200` + `{ status, db, anthropic, memory }` |

### `GET /api/health/anthropic`
**Propósito:** Verificar conectividade com a API Anthropic.

| Campo | Detalhe |
|-------|---------|
| Auth | Nenhuma (interna) |
| Sucesso | `200` + `{ available }` |

---

## 🛰️ SENTINELA (1 rota)

### `GET /api/sentinel/status`
**Propósito:** Status em tempo real do sistema para o dashboard Sentinela.

| Campo | Detalhe |
|-------|---------|
| Auth | Cookie `mente_ai_token` |
| Sucesso | `200` + `{ botsOnline, universosCriados, buildStatus, uptime }` |

---

## 📋 RESUMO POR DOMÍNIO

| Domínio | Rotas | Carga Cognitiva |
|---------|-------|-----------------|
| Auth | 4 | Nenhuma |
| Chat | 3 | Memory + CPE + Relationship + Meta-Cog |
| Memória | 2 | Semantic TF-IDF |
| Perfis | 1 | Identity Profiler |
| Agentes | 3 | Conflict System |
| Interação | 3 | Narrative Engine + Phase Router |
| Voz | 4 | Identity Profiler (emoção) |
| Gamificação | 4 | Nenhuma |
| Dashboard | 2 | Identity Profiler |
| Lab | 1 | Nenhuma |
| Logos | 2 | Nenhuma |
| Pagamentos | 2 | Nenhuma |
| Health | 2 | Nenhuma |
| Sentinel | 1 | Nenhuma |

---

> *"Uma API bem documentada não é um luxo — é um mapa que impede que cada novo desenvolvedor tenha que redescobrir o continente."*
