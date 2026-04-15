# 📁 Instruções da Pasta — MENTE.AI (AI-KIDS-OFICIAL)

## 🎯 Visão Geral do Projeto

**MENTE.AI** é uma plataforma educacional imersiva que ensina Inteligência Artificial para públicos não técnicos através de experiências interativas, visualizações 3D, agentes de IA especializados e áudio em português do Brasil.

**Premissa:** *"Mentes são formadas, não formatadas."*

---

## 🏗️ Arquitetura Técnica

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Framework** | Next.js (App Router) | 16.1.6 |
| **Linguagem** | TypeScript | 5.x |
| **Estilos** | Tailwind CSS | 4.x |
| **3D** | Three.js / @react-three/fiber | r183 / 9.x |
| **Animações** | Framer Motion | 11.x |
| **Estado** | Zustand | 5.x |
| **Áudio TTS** | ElevenLabs API + Web Speech API | — |
| **Chat IA** | Anthropic Claude (primário) + OpenAI (fallback) | — |
| **Banco** | TiDB Cloud | MySQL-compat |
| **ORM** | Drizzle | 0.45.x |
| **Auth** | JWT (jose) + cookies | — |
| **Pagamento** | Stripe | 20.x |
| **Build** | Turbopack | Incluído no Next.js 16 |

---

## 📂 Estrutura de Arquivos Principal

```
/src
  /app/(main)/
    /home/              → Página inicial com carrosséis de agentes
    /agentes/           → Catálogo de agentes (+120 agentes canônicos)
    /agentes/[id]/      → Detalhe de agente individual
    /aulas/             → Aulas/conteúdo educacional
    /dashboard/         → Dashboard do usuário
    /explorar/          → Explorar/Discovery
    /ranking/           → Ranking semanal de XP
    /perfil/            → Perfil do usuário
    /perfis/            → Gerenciamento de perfis
    /planos/            → Planos de assinatura
    /player/            → Player de conteúdo
    /conta/             → Conta (visão geral, segurança, perfis, pagamento, assinatura, etc.)
    /universo/nexus/    → Universo 3D (zona Nexus)
    /login/             → Autenticação
    /logout/            → Logout
    /onboarding/        → Onboarding de novos usuários
    /api/               → Rotas de API (chat, tts, xp, notes, badges, ranking, etc.)

  /components/
    /home/              → AgentCard, AgentRow, HeroBanner, InfoModal
    /agents/            → AgentCard, AgentCardCompact, AgentHero
    /biblioteca/        → BibliotecaVivaClient, BookModal, InfiniteShelves
    /zones/             → Cenas 3D por zona
    /lab/               → LabAudioButton, TransformerDemo
    /combinacao/        → AgentCombinationModal, AgentSelectorSlot, etc.
    /features/aulas/    → AulaCard
    /features/layout/   → Header, MenuPerfil
    /onboarding/        → AgentSelector, InteractiveTutorial, WelcomeScreen
    /simulador/         → ParticleField, SceneTransition
    /ui/                → NetflixModal, SoundToggle

  /cognitive/audio/
    ambientEngine.ts    → Motor de áudio ambiente (Tone.js real, NÃO mock)

  /canon/agents/
    all-agents.ts       → Definição de TODOS os agentes do sistema — ⚠️ CRÍTICO
    types.ts            → Tipos de AgentDefinition
    generated/          → Agentes gerados por script

  /hooks/
    useChatHistory.ts   → Histórico de chat
    useXPStream.ts      → Stream de XP
    useFocusMode.tsx    → Modo foco
    useHoverSound.ts    → Sons de hover
    useMatchCalculator.ts → Calculadora de match
    useMyList.ts        → Lista pessoal
    usePrefersReducedMotion → Acessibilidade

  /store/
    useLabStore.ts      → Estado global do laboratório (Zustand)
```

### 📡 Rotas de API

```
/api/chat                → Chat com IA (Anthropic + OpenAI fallback)
/api/elevenlabs/speak    → TTS ElevenLabs
/api/voice/converse      → Conversa por voz
/api/voice/emotion       → Detecção de emoção por voz
/api/voice/transcribe    → Transcrição de voz
/api/xp                  → Sistema de XP
/api/xp/events           → Eventos de XP
/api/notes               → Notas do usuário (CRUD)
/api/badges              → Conquistas/badges
/api/ranking             → Ranking de XP
/api/agentes             → Lista de agentes
/api/agent-combination   → Combinação de agentes (sinergia)
/api/auth/login          → Login
/api/auth/logout         → Logout
/api/auth/register       → Registro
/api/auth/session        → Sessão
/api/dashboard           → Dados do dashboard
/api/explorer            → Explorar conteúdo
/api/interaction         → Interações do usuário
/api/lab/transformer     → Demo de transformer
/api/seasons             → Temporadas
/api/profiles            → Perfis
/api/checkout            → Checkout Stripe
/api/webhooks/stripe     → Webhook Stripe
/api/health/anthropic    → Health check Anthropic
```

---

## ✅ Erros Corrigidos (Status Atual)

| # | Erro | Status | Solução Aplicada |
|---|------|--------|-----------------|
| #01 | Card cortado na Home | ✅ **CORRIGIDO** | padding-right 80px no container de scroll |
| #02 | Agentes sem personalidade | ✅ **CORRIGIDO** | LOGOS, PSYCHE + 120+ agentes gerados + NEXUS, VOLT, AURORA, ETHOS |
| #04 | Tone.js NotSupportedError | ✅ **WORKAROUND** | ambientEngine.ts com inicialização controlada pelo usuário (Tone.start()) |
| #05 | ParticleField redirecionando | ✅ **WORKAROUND** | interactive={false} aplicado |
| #07 | BookModal TTS encoding | ✅ **CORRIGIDO** | encodeURIComponent() aplicado na URL TTS |

---

## ⚠️ Itens para Monitorar

| # | Item | Impacto | Ação |
|---|------|---------|------|
| #08 | Chat sem persistência | Baixo | Implementar localStorage ou DB na próxima sprint |
| #09 | Warnings ESLint | Baixo | Alinhar versões na próxima atualização |
| #10 | Middleware usando `middleware.ts` | Baixo | Migrar para `proxy.ts` quando Next.js 16 estabilizar |

---

## 🚫 O Que NÃO Fazer

1.  **NÃO reinstalar dependências** sem necessidade — o projeto está estável.
2.  **NÃO modificar `ambientEngine.ts`** sem validar — usa Tone.js real com inicialização controlada.
3.  **NÃO remover agentes do `all-agents.ts`** — LOGOS, PSYCHE, NEXUS, VOLT, AURORA, ETHOS são críticos.
4.  **NÃO rodar múltiplas instâncias do `npm run dev`** — causa corrupção do cache do Turbopack.
5.  **NÃO criar novos endpoints de áudio duplicados** — TTS já existe em `/api/elevenlabs/speak`.

---

## ✅ Padrões de Desenvolvimento

### 1. Sempre Validar com Build
```powershell
npm run build
```
Antes de considerar qualquer correção como concluída.

### 2. Usar PowerShell para Modificações
Todos os comandos de modificação de arquivos devem ser via PowerShell para consistência:
```powershell
Set-Content -Path "caminho/do/arquivo" -Value $conteudo -Encoding UTF8
```

### 3. Backup Antes de Modificar
```powershell
Copy-Item "arquivo.ts" "arquivo.ts.bak" -ErrorAction SilentlyContinue
```

### 4. Limpar Cache do Next.js Após Mudanças Críticas
```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
```

### 5. Nunca Rodar Múltiplas Instâncias do Dev Server
Isso corrompe o cache do Turbopack e causa erros de persistência.

---

## 🔑 Arquivos Críticos (Não Modificar Sem Necessidade)

| Arquivo | Função | Risco |
|---------|--------|-------|
| `src/canon/agents/all-agents.ts` | Define TODOS os agentes do sistema (120+) | 🔴 ALTO — Quebra o chat se corrompido |
| `src/app/api/chat/route.ts` | API de chat com Anthropic + OpenAI | 🔴 ALTO — Quebra toda comunicação |
| `src/app/api/elevenlabs/speak/route.ts` | API ElevenLabs TTS | 🔴 ALTO — Quebra áudio educativo |
| `src/cognitive/audio/ambientEngine.ts` | Motor de áudio ambiente (Tone.js) | 🟠 MÉDIO — Pode reintroduzir erros de autoplay |
| `src/store/useLabStore.ts` | Estado global do laboratório | 🟠 MÉDIO — Pode quebrar navegação entre zonas |
| `middleware.ts` | Middleware de autenticação JWT | 🟠 MÉDIO — Pode quebrar rotas protegidas |

---

## 🧪 Testes de Validação Após Qualquer Mudança

1.  **Build passa sem erros:**
    ```powershell
    npm run build
    ```

2.  **Home — Carrosséis:**
    -   Último card de cada linha aparece completo
    -   Botões de seta não sobrepõem conteúdo

3.  **Agentes — Chat:**
    -   Cada agente responde com personalidade correta
    -   Provider switch (Anthropic ↔ OpenAI) funciona

4.  **TTS — Áudio:**
    -   Botão de áudio toca sem erros
    -   Títulos com acentos funcionam corretamente

5.  **Console do Navegador:**
    -   Sem erros vermelhos de `NotSupportedError`
    -   Sem erros de `Cannot redeclare exported variable`

---

## 📝 Comandos PowerShell Úteis

```powershell
# Validar build
npm run build

# Limpar cache
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Buscar referências a um componente
Get-ChildItem -Recurse -Include *.tsx,*.ts -Exclude "node_modules" | Select-String -Pattern "NomeDoComponente"

# Backup de arquivo crítico
Copy-Item "src\canon\agents\all-agents.ts" "src\canon\agents\all-agents.ts.bak" -ErrorAction SilentlyContinue
```

---

## 🎯 Prioridades para Próximas Sprints

| Prioridade | Tarefa | Complexidade |
|-----------|--------|-------------|
| 🔴 URGENTE | Nenhuma — erros críticos corrigidos | — |
| 🟠 ALTA | Implementar persistência do chat (localStorage/DB) | Média |
| 🟡 MÉDIA | Migrar middleware.ts → proxy.ts | Baixa |
| 🟢 BAIXA | Alinhar warnings ESLint | Baixa |

---

## 🆘 Em Caso de Erro

1.  **Identifique o arquivo e linha** no stack trace
2.  **Verifique se há backup** `.bak` do arquivo
3.  **Rode `npm run build`** para confirmar o erro
4.  **Cole o erro completo** para diagnóstico
5.  **NÃO tente corrigir sem validar no build**

---

## 📞 Contato e Contexto

-   **Projeto:** MENTE.AI — Laboratório Virtual de IA
-   **Ambiente:** Windows 11, PowerShell, Node.js v25.2.1
-   **IDE:** VS Code (recomendado)
-   **Deploy:** Vercel (variáveis de ambiente configuradas)
-   **Última Atualização:** Abril 2026

---

> **Regra de Ouro:** *"Se o build passa e os testes de validação funcionam, a correção está concluída. Não otimize prematuramente."*

---

**Fim das Instruções da Pasta — MENTE.AI v1.1**
