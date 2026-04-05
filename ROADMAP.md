# 🚀 MENTE.AI - ROADMAP DE DESENVOLVIMENTO

**Versão:** 1.0  
**Última Atualização:** Março 2025  
**Status:** MVP em Produção  
**URL:** https://mente-ai.vercel.app

---

## 🎯 VISÃO GERAL

**MENTE.AI** é uma plataforma educacional cyberpunk que transforma conceitos de IA em agentes especializados com personalidade cinematográfica.

---

## 📊 ARQUITETURA DE AGENTES
┌─────────────────────────────────────────────────────────┐
│ NEXUS "O Conector" │
│ (Agente Central - Orquestrador) │
└─────────────────────────────────────────────────────────┘
│
┌───────────────────┼───────────────────┐
▼ ▼ ▼
┌─────────┐ ┌───────── ┌─────────┐
│ 20 │ │ 100 │ │ Futuro │
│Agentes │ + │Agentes │ + │Agentes │
│Especial.│ │Expansão │ │Dinâmicos│
└─────────┘ └─────────┘ └─────────┘
12345678910111213141516171819202122232425262728293031323334353637383940414243444546
**Total:**- **Fase 1 (MVP):** 20 + NEXUS = 21- **Fase 2 (Beta):** +30 = 51- **Fase 3 (Early):** +40 = 91- **Fase 4 (Completo):** +30 = 121---## 🗓️ FASES### 🟢 FASE 1: MVP (Atual - 2 semanas)- [x] 20 agentes especializados- [x] NEXUS definido- [ ] Laboratório 100% funcional- [ ] 20 imagens cyberpunk (5/20)- [ ] Biblioteca com PDFs- [ ] 50+ usuários beta### 🟡 FASE 2: EXPANSÃO BETA (1-2 meses)- [ ] +30 agentes (total 50)- [ ] Categorias: Ferramentas, Colaborativos- [ ] Combinação de agentes- [ ] Desbloqueio por progresso### 🟠 FASE 3: EARLY ACCESS (2-4 meses)- [ ] +40 agentes (total 90)- [ ] Evolução de agentes- [ ] Laboratório 2.0- [ ] Eventos sazonais### 🔴 FASE 4: LANÇAMENTO (4-6 meses)- [ ] +30 agentes (total 120)- [ ] IA sugere combinações- [ ] Usuários propõem agentes- [ ] Laboratório 3.0 personalizado### 🟣 FASE 5: FUTURO (6+ meses)- [ ] Agentes gerados por IA- [ ] Ecossistema aberto- [ ] API pública---##  ESTRUTURA

src/
├── app/(main)/
│ ├── agentes/
│ ├── laboratorio/
│ └── conta/
├── components/
│ ├── agents/
│ └── laboratorio/
├── data/agents.ts
└── canon/agents/all-agents.ts (120 peças)
1234567891011121314151617181920212223242526272829303132333435363738394041
---## 🎨 IDENTIDADE VISUAL- **Roxo:** #9333ea- **Azul:** #3b82f6- **Ciano:** #06b6d4- **Fundo:** #0a0a0f- **Estilo:** Cyberpunk/Netflix---## 🔐 VARIÁVEIS (Vercel)- ✅ JWT_SECRET- ✅ STRIPE_SECRET_KEY- ✅ STRIPE_PUBLISHABLE_KEY- ✅ DATABASE_URL- ✅ GOOGLE_AI_STUDIO_API_KEY- ✅ OPENAI_API_KEY---## 📈 MÉTRICAS| Métrica | MVP | Fase 2 ||---------|-----|--------|| Usuários/semana | 50 | 500 || Tempo no Lab | 3 min | 5 min || NPS | 70% | 85% || Conversão | 5% | 10% |---## 🚀 DEPLOY```bashnpm run typechecknpm run buildvercel --prod --yes

Produção: https://mente-ai.vercel.app
"Orquestrado por NEXUS 'O Conector'"
