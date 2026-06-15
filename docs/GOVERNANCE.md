# MENTE.AI — Governance

> "Se você não sabe para onde vai, qualquer caminho serve.  
> Este documento existe para que todos saibam para onde estamos indo."

---

## 1. NORTH STAR

### Missão

**"Onde mentes são formadas, não formatadas."**

O MENTE.AI não é uma plataforma de ensino tradicional. É um metaverso narrativo impulsionado por IA — onde o usuário aprende vivendo histórias, não lendo apostilas.

### Visão

Ser a plataforma de aprendizado de IA mais desejada do Brasil: um "Netflix do conhecimento", onde cada episódio revela um agente, cada agente ensina uma dimensão da inteligência artificial, e cada interação molda a jornada do usuário.

### Usuário-alvo

Estudantes brasileiros de **14 a 25 anos** — nativos digitais que:
- Têm curiosidade sobre IA mas acham cursos tradicionais entediantes
- Aprendem melhor com narrativa, jogo e interação social
- Precisam de acessibilidade (mobile-first, sem barreira de idioma)
- Merecem qualidade premium sem pagar por isso no início

### Norte verdadeiro

Se uma decisão **não aproxima** o MENTE.AI de ser:
- Bonito
- Imersivo
- Fácil para iniciantes
- Poderoso para avançados
- Motivante e viciante
- Rápido e moderno

...ela **não** pertence a este projeto.

---

## 2. TECHNICAL DECISIONS (ADR)

Decisões arquiteturais são registradas como ADRs (Architecture Decision Records) em [`docs/architecture/ADR/`](architecture/ADR/README.md). Nenhuma decisão técnica maior entra sem ADR.

### Stack atual

| Camada | Escolha | ADR | Motivo principal |
|--------|---------|-----|------------------|
| Framework | Next.js 16 (App Router) | [011](architecture/ADR/ADR-011-nextjs-app-router.md) | RSC, streaming, rotas server-side |
| Linguagem | TypeScript 5.x | — | Tipagem ponta-a-ponta |
| Estilo | Tailwind CSS 4 | [013](architecture/ADR/ADR-013-tailwind-css-strategy.md) | Utility-first, zero runtime |
| Estado | Zustand (5 stores) | [012](architecture/ADR/ADR-012-zustand-state-management.md) | Minimal, sem boilerplate |
| 3D | Three.js + @react-three/fiber | [019](architecture/ADR/ADR-019-threejs-scene-architecture.md) | Cenas imersivas com lazy loading |
| Banco | TiDB Cloud | [002](architecture/ADR/ADR-002-tidb-architecture.md) | MySQL-compatível, serverless |
| ORM | Drizzle | [001](architecture/ADR/ADR-001-drizzle-vs-prisma.md) | Type-safe, sem geração de código |
| Auth | JWT + cookie `mente_ai_token` | [003](architecture/ADR/ADR-003-jwt-auth-strategy.md) | Server-side, httpOnly |
| Pagamento | Stripe Checkout | [022](architecture/ADR/ADR-022-stripe-subscription-model.md) | Webhooks + portal |
| Deploy | Vercel (gru1, free tier) | [014](architecture/ADR/ADR-014-vercel-deploy-platform.md) | CDN global, zero-ops |
| Build | Webpack (não Turbopack) | [024](architecture/ADR/ADR-024-webpack-wsl-build-strategy.md) | WSL + lockfile cross-platform |
| Animação | Framer Motion | — | Animações declarativas |

### AI Providers

| Função | Provedor | Modelo | Custo |
|--------|----------|--------|-------|
| Chat/Agentes | Groq | `llama-3.3-70b-versatile` | Free tier |
| Geração de imagens | Pollinations.ai | — | Gratuito, sem API key |
| TTS (voz) | Web Speech API | Navegador nativo | Zero custo |
| Voz premium | ElevenLabs | — | Pago (fallback) |

### Princípios de decisão

1. **Free-first.** Só usar API paga quando não existe alternativa gratuita viável.
2. **Simplifique, depois escale.** Não adicionar complexidade que o estágio atual não justifica.
3. **Cada ADR conta uma história.** Contexto → decisão → tradeoffs. Sempre.
4. **ADR é memória de engenharia.** Nunca se deleta um ADR, só se deprecia.
5. **Stack do usuário-alvo importa.** Mobile, 4G, dispositivos medianos. Não otimizar para high-end.

---

## 3. AGENT HIERARCHY

O MENTE.AI tem **12 agentes canônicos**, organizados em 4 dimensões cruzadas com 3 facções (order, chaos, balance) em 4 níveis evolutivos.

### Agentes sempre disponíveis

| Agente | Dimensão | Facção | Papel |
|--------|----------|--------|-------|
| **NEXUS** "O Conector" | intellectual | balance | Guia primário — mentor paciente, sempre acessível |

### Agentes secundários (desbloqueados no Lab)

| Agente | Dimensão | Facção | Papel |
|--------|----------|--------|-------|
| **VOLT** "O Energético" | scientific | chaos | Redes neurais, backpropagation |
| **AURORA** "A Criadora" | creative | balance | Espaços vetoriais, word embeddings |

### Agentes bloqueados (desbloqueio por progressão de episódios)

| # | Agente | Dimensão | Facção | Gatilho de desbloqueio |
|---|--------|----------|--------|------------------------|
| 1 | **KAOS** "O Caos Criativo" | creative | chaos | Rebeldia criativa |
| 2 | **CIPHER** "O Criptógrafo" | intellectual | order | Identificação de padrões |
| 3 | **LYRA** "A Artista" | aesthetic | balance | Sensibilidade emocional |
| 4 | **AXIOM** "O Cientista" | scientific | order | Raciocínio analítico |
| 5 | **STRATOS** "O Estrategista" | practical | order | Visão de longo prazo |
| 6 | **TERRA** "A Guardiã" | emotional | balance | Empatia genuína |
| 7 | **PRISM** "O Revelador" | philosophical | balance | Mudança de perspectiva |
| 8 | **JANUS** "O Humorista" | social | chaos | Humor no caos |
| 9 | **ETHOS** "O Filósofo" | ethical | order | Questionamento ético |

### Regras de agente

- **NEXUS nunca é desabilitado.** É a âncora da experiência.
- **VOLT e AURORA são o segundo contato.** Aparecem no Laboratório Virtual.
- **Agentes bloqueados são revelados por narrativa**, não por menu.
- **Cada agente tem badge própria.** Conquistas visíveis no perfil.
- **Personalidade é canônica.** Todo agente tem tone, values, approach e visualPrompt definidos em [`src/canon/agents/all-agents.ts`](../src/canon/agents/all-agents.ts).

---

## 4. FEATURE PRIORITIES (Current Sprint)

### P0 — Critical (produção quebrada = para tudo)

- Deploy quebrado no Vercel
- Auth (login/cookie `mente_ai_token`) falhando
- Chat com agentes não responde
- Regressão que quebra mobile
- Erro 500 em rota crítica (`/api/chat`, `/api/agents`)

### P1 — High (completa o MVP)

- Novos episódios da narrativa principal
- Desbloqueio de agentes por progressão
- Sistema de badges funcionando
- Stripe checkout + planos
- Onboarding de primeiro acesso

### P2 — Medium (melhora a experiência)

- Animações e transições
- Easter eggs narrativos
- Melhorias de acessibilidade
- Otimização de bundle size
- Cache de imagens de agentes

### P3 — Low (quando der tempo)

- Temas alternativos
- Ranking social
- Conteúdo gerado por usuário
- Integrações externas (Discord, WhatsApp)

### Regras de priorização

1. **P0 não espera sprint.** Resolve imediatamente.
2. **P1 antes de P2, sempre.** MVP mínimo antes de polimento.
3. **Nenhum P3 bloqueia entrega.** Se atrasar P1/P2, corta P3.
4. **Feature nova só entra se tem dono.** Alguém com contexto para mantê-la.

---

## 5. WHAT NOT TO BUILD (Constraints)

### Restrições financeiras

- **Zero APIs pagas até existir receita.** Groq free tier, Pollinations.ai gratuito, Web Speech API nativa do browser. Stripe é a única exceção (necessário para cobrar).
- **Nada que exija servidor dedicado.** Vercel serverless + TiDB serverless cobre 100% do backend.

### Restrições técnicas

- **Nenhuma dependência nova sem justificativa escrita.** Toda lib nova pesa no bundle e na manutenção. A justificativa vai no commit message.
- **Nada que quebre a experiência mobile.** O Brasil é mobile-first. Toda feature é testada em 375px de viewport.
- **Nenhum rewrite de componente estável.** Se funciona e não tem bug, não mexe. Refatoração cosmética não é prioridade.
- **Nada que dependa de Turbopack.** O build oficial é Webpack. Turbopack quebra com lockfile cross-platform no WSL.

### Restrições de produto

- **Nada que transforme o MENTE.AI em "mais um curso online".** A narrativa e a imersão são o diferencial. Features puramente utilitárias (PDF, quiz, certificado) vêm depois — se vierem.
- **Nada que pareça "enterprise".** O tom é jovem, brasileiro, acessível. Nada de corporativês, nada de complexidade desnecessária.
- **Nada que exponha o usuário a risco.** Conteúdo gerado por IA passa por filtro de segurança. Dados de menores têm proteção redobrada.

---

## 6. DEFINITION OF DONE

Uma feature ou fix **não está pronta** até que:

- [ ] `tsc --noEmit` passa sem erros (zero erros, zero warnings)
- [ ] Build no Vercel production passa (deploy verde)
- [ ] Funciona em mobile (375px viewport mínimo)
- [ ] Funciona em desktop (1440px viewport)
- [ ] Navegação entre páginas não quebra
- [ ] Nenhum `console.log` em código de produção
- [ ] Nenhum `// TODO` ou `// FIXME` sem ticket associado
- [ ] Código novo tem tipos explícitos (nada de `any` sem justificativa)
- [ ] Se mexe em auth, testa login/logout completo
- [ ] Se mexe em agente, testa chat com o agente alterado
- [ ] Commit segue o padrão: `type(scope): descrição em português`
- [ ] PR descreve **o que**, **por que** e **como testar**

### O que NÃO conta como "done"

- "Funcionou na minha máquina"
- "O código tá pronto, só falta testar"
- "Build passou local mas não no Vercel"
- "Funciona no desktop, mobile depois eu vejo"

---

## 7. GOVERNANCE CYCLE

Este documento é vivo. Revisão a cada **duas sprints** ou quando:

- Uma decisão arquitetural maior é tomada (novo ADR)
- Um agente novo entra no cânone
- Uma constraint deixa de valer (ex: surge receita, muda stack)
- O norte verdadeiro é questionado (pivot de produto)

### Quem mantém

- **CTO/Arquiteto** — decisões técnicas e ADRs
- **Product Owner** — prioridades e norte
- **Qualquer dev** — propor atualização via PR

### Como propor mudança

1. Abra uma issue com o label `governance`
2. Descreva a mudança proposta e a motivação
3. Se for decisão técnica: rascunhe o ADR
4. Discussão → aprovação → merge na main

---

*"Governança não é burocracia. É memória coletiva."*

*Última atualização: 2026-05-20*
