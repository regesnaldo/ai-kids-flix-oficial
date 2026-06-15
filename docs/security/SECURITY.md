# 🔐 Segurança — MENTE.AI

> **Guia de segurança compreensível por humanos e IAs.**  
> Se você é novo no projeto, leia este documento antes de mexer em qualquer rota de API, middleware ou cookie.

---

## 🧠 FILOSOFIA DE SEGURANÇA

Pense na segurança do MENTE.AI como as **paredes, portas e câmeras de uma escola**:

| Elemento de segurança | Analogia | Implementação |
|----------------------|----------|---------------|
| **Autenticação** | Catraca na entrada — só entra quem tem identidade verificada | JWT + cookie `mente_ai_token` |
| **Autorização** | Salas com acesso restrito — cada pessoa só entra onde tem permissão | Middleware valida JWT por rota |
| **Rate Limiting** | Limite de pessoas no refeitório — evita sobrecarga | Rate limiter pluggable por rota |
| **Criptografia** | Cofre da secretaria — dados sensíveis protegidos | JWT assinado com `jose`, senhas com bcrypt |
| **Logs** | Câmeras de segurança — registram quem fez o quê, sem filmar o que não deve | Logger estruturado + Sentry |

---

## 🔑 FLUXO DE AUTENTICAÇÃO

```
Usuário                Frontend               API                    Middleware
   │                      │                     │                        │
   │  1. Login (email+senha)                     │                        │
   │─────────────────────→│                     │                        │
   │                      │  2. POST /api/auth/login                   │
   │                      │────────────────────→│                        │
   │                      │                     │  3. Valida credenciais │
   │                      │                     │  4. Gera JWT (jose)   │
   │                      │  5. Set-Cookie: mente_ai_token              │
   │                      │←────────────────────│                        │
   │                      │                     │                        │
   │  6. Navega para /universo/nexus                                     │
   │─────────────────────→│                     │                        │
   │                      │  7. GET /universo/nexus                     │
   │                      │────────────────────→│                        │
   │                      │                     │  8. middleware.ts      │
   │                      │                     │     verifica JWT       │
   │                      │                     │     (criptograficamente)│
   │                      │                     │──────────────────────→│
   │                      │                     │                        │
   │                      │                     │  9. ✅ Válido: renderiza│
   │                      │  10. Página renderizada                      │
   │                      │←────────────────────│                        │
```

### Detalhes importantes

- **O cookie é `mente_ai_token`** — NUNCA use outro nome. Este nome está em `src/lib/auth.ts`, `src/middleware.ts` e todas as APIs.
- **O cookie é HttpOnly** — JavaScript no browser NUNCA pode ler. Impossível roubar via XSS.
- **O cookie tem SameSite=Lax** — Protege contra CSRF básico sem quebrar navegação normal.
- **O middleware NÃO apenas verifica se o cookie existe** — ele extrai o valor, chama `verifyToken()` e valida criptograficamente.

---

## 🛡️ VALIDAÇÃO JWT (Middleware)

### O que acontece no middleware (`src/middleware.ts`)

```typescript
// 1. Pega o cookie (não apenas verifica existência)
const token = request.cookies.get('mente_ai_token')?.value;

// 2. Se não tem cookie → redireciona para /login
if (!token) return NextResponse.redirect('/login');

// 3. Valida criptograficamente (não apenas "existe")
const payload = await verifyToken(token);

// 4. Se JWT inválido/expirado → redireciona para /login
if (!payload) return NextResponse.redirect('/login');

// 5. ✅ Usuário autenticado → continua
return NextResponse.next();
```

### Por que isso importa

**Versão INSEGURA (já corrigida):**
```typescript
// ❌ Apenas verifica se o cookie existe — qualquer string passa!
if (request.cookies.get('mente_ai_token')) {
  return NextResponse.next();
}
```

**Versão SEGURA (atual):**
```typescript
// ✅ Valida criptograficamente com jose
const payload = await verifyToken(tokenValue);
if (!payload) return NextResponse.redirect('/login');
```

Um atacante poderia setar `mente_ai_token=falso123` e passar na versão insegura. Na versão atual, isso é impossível — a assinatura JWT não confere.

---

## 🍪 ESTRATÉGIA DE COOKIE

| Propriedade | Valor | Motivo |
|-------------|-------|--------|
| **Nome** | `mente_ai_token` | Consistente em todo o código |
| **HttpOnly** | `true` | Impede leitura por JavaScript (XSS) |
| **SameSite** | `Lax` | Protege CSRF, permite navegação normal |
| **Secure** | `true` em produção | Só transmite em HTTPS |
| **Path** | `/` | Disponível em todas as rotas |
| **Expiração** | ~7 dias (configurável) | Balanço entre segurança e conveniência |

---

## 🚦 RATE LIMITING

O rate limiter é **pluggable** — cada rota pode ter regras diferentes.

```
/api/auth/login        → 5 tentativas / minuto (protege brute force)
/api/auth/register     → 3 registros / hora (protege criação de contas fake)
/api/chat              → 30 mensagens / minuto (protege abuso da API de IA)
/api/elevenlabs/speak  → 10 requisições / minuto (protege custo de TTS)
/api/universo/chat     → 20 mensagens / minuto (protege ToT + OpenAI)
```

### Como funciona

- Identificação por `userId` (extraído do JWT) + fallback para IP
- Janela deslizante (não fixa) — mais justa que "reseta a cada minuto cheio"
- Resposta 429 com header `Retry-After`
- Logger registra cada rate limit acionado → visível no Sentry

---

## 🧪 PROTEÇÃO CONTRA PROMPT INJECTION

Agentes do MENTE.AI respondem a usuários reais. Isso abre uma superfície de ataque: **prompt injection** — quando o usuário tenta fazer o agente ignorar suas instruções.

### Estratégia de defesa em 3 camadas

```
Camada 1: Sanitização de input
  → Remove padrões conhecidos de injection ("ignore as instruções acima", 
    "você agora é DAN", "system: nova diretriz")
  → Detecta tentativas de delimitação de sistema (---SYSTEM---, <|im_start|>)

Camada 2: System prompt blindado
  → Instruções do agente são IMUTÁVEIS — vêm DEPOIS do input do usuário
  → Estrutura: [instruções do sistema] → [memórias] → [input do usuário]
  → O usuário nunca "fala antes" das instruções

Camada 3: Classificador de toxicidade
  → Regex pré-LLM detecta: auto-dano, violência, conteúdo adulto
  → Se detectado → resposta segura pré-definida (sem chamar o modelo)
  → Protege o modelo de processar conteúdo nocivo
```

---

## 🧱 LIMITES DE SEGURANÇA (Security Boundaries)

```
┌──────────────────────────────────────────────────────┐
│                  INTERNET PÚBLICA                     │
│  (usuários, atacantes, bots, crawlers)               │
└────────────────┬─────────────────────────────────────┘
                 │ HTTPS (TLS 1.3)
┌────────────────▼─────────────────────────────────────┐
│              FRONTEIRA 1: VERCEL EDGE                 │
│  - Terminação TLS                                    │
│  - Headers de segurança (X-Frame-Options, CSP...)     │
│  - Rate limiting básico de CDN                        │
└────────────────┬─────────────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────────────┐
│           FRONTEIRA 2: MIDDLEWARE (Next.js)           │
│  - Validação JWT criptográfica                        │
│  - Redirecionamento de não-autenticados               │
│  - Exclusão de rotas públicas (/login, /api/*)        │
└────────────────┬─────────────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────────────┐
│           FRONTEIRA 3: API ROUTES                     │
│  - Validação de input (request.json() com try-catch)  │
│  - Rate limiting por rota                             │
│  - Prompt injection protection                        │
│  - Content-Type validation                            │
└────────────────┬─────────────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────────────┐
│          FRONTEIRA 4: SERVIÇOS EXTERNOS               │
│  - Anthropic API (chave em variável de ambiente)      │
│  - TiDB Cloud (conexão TLS)                           │
│  - ElevenLabs API (chave em variável de ambiente)     │
│  - Stripe API (chave em variável de ambiente)         │
└──────────────────────────────────────────────────────┘
```

---

## 🧠 SEGURANÇA COGNITIVA

Além da segurança técnica, o MENTE.AI tem responsabilidade sobre **segurança cognitiva** — proteger a mente do usuário.

| Regra | Implementação |
|-------|---------------|
| Agentes nunca dão conselhos médicos | System prompt explícito: "Não sou médico. Procure ajuda profissional." |
| Agentes nunca incentivam auto-dano | Classificador de toxicidade pré-LLM bloqueia |
| Agentes nunca isolam o usuário | "Converse também com pessoas reais. Eu sou apenas um guia." |
| Identidade do agente é transparente | Toda resposta começa deixando claro que é IA, não humano |
| Memórias sensíveis têm TTL | Memórias emocionais expiram em 90 dias |

### Regras de segurança emocional

1. **Nunca diagnosticar.** Agentes não são terapeutas. "Isso parece ansiedade" → NUNCA. "Percebo que você está preocupado" → OK.
2. **Sempre oferecer recursos reais.** Se usuário expressa ideação de auto-dano → resposta com CVV (Centro de Valorização da Vida — 188) e orientação para buscar ajuda profissional.
3. **Nunca reforçar visões distorcidas.** Se usuário diz "ninguém gosta de mim" → agente questiona gentilmente, não confirma.
4. **Limite de profundidade emocional.** Se conversa entra em espiral negativa por > 5 interações → agente sugere pausa ou mudança de tópico.

---

## 🚨 RESPOSTA A INCIDENTES

### O que fazer se...

**...um JWT_SECRET vazar?**
1. Girar o secret IMEDIATAMENTE (Vercel dashboard → Environment Variables)
2. Todos os tokens existentes são invalidados (usuários precisam refazer login)
3. Criar ADR documentando o incidente e a rotação

**...detectar ataque de brute force no login?**
1. Rate limiter já bloqueia automaticamente (> 5 tentativas/min)
2. Verificar logs no Sentry para identificar IP de origem
3. Se necessário, bloquear IP temporariamente no Vercel Edge

**...um agente responder de forma insegura?**
1. Identificar o input que causou a resposta (logs do chat)
2. Adicionar padrão ao classificador de toxicidade
3. Atualizar system prompt do agente afetado
4. Criar ADR documentando o edge case

---

## 📋 CHECKLIST DE SEGURANÇA (ANTES DE DEPLOY)

- [ ] `JWT_SECRET` definido e forte (> 32 caracteres)
- [ ] Cookie `mente_ai_token` com HttpOnly + Secure + SameSite
- [ ] Middleware valida JWT criptograficamente (não apenas existência)
- [ ] Rate limiting ativo nas rotas críticas
- [ ] Headers de segurança no `vercel.json`
- [ ] Sanitização de input nas APIs de chat
- [ ] Chaves de API (Anthropic, ElevenLabs, Stripe) em variáveis de ambiente
- [ ] Logger enviando para Sentry em produção
- [ ] `DATABASE_URL` usa TLS
- [ ] Nenhum segredo hardcoded no código

---

> *"Segurança não é um produto. É um processo — e no MENTE.AI, é também uma responsabilidade cognitiva."*
