# 🧠 MENTE.AI

> **Metaverso educacional de Inteligência Artificial.**  
> Onde 12 agentes com personalidade cinematográfica ensinam IA através de narrativa, memória e relacionamento.

---

## 🎯 Sobre

MENTE.AI é uma plataforma que transforma conceitos abstratos de IA em experiências imersivas:

- 🎭 **12 agentes canônicos** com personalidade, voz e conflitos narrativos
- 🧠 **5 camadas de memória cognitiva** (semântica, emocional, relacional)
- 🎬 **Interface Netflix-style** com partículas interativas e cenas 3D
- 🧪 **Laboratório de Inteligência Viva** com experimentos educacionais
- 🏆 **Gamificação** com XP, streaks e progressão de relacionamento
- 🌐 **30+ APIs** para chat, memória, voz, narrativa e pagamentos

**Premissa:** *Mentes são formadas, não formatadas.*

---

## 🚀 Quick Start

```bash
# 1. Clone e entre na branch ativa
git clone https://github.com/regesnaldo/ai-kids-flix-oficial.git
cd AI-KIDS-OFICIAL
git checkout feat/lab-redesign

# 2. Instale dependências
npm install

# 3. Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com JWT_SECRET, DATABASE_URL, chaves de API

# 4. Rode o projeto
npm run dev -- --webpack
```

> ⚠️ **WSL:** Use sempre `--webpack`. Turbopack quebra com lockfile cross-platform.

---

## 📁 Estrutura do Projeto

```
MENTE.AI/
├── src/
│   ├── app/(main)/         ← 56+ páginas (home, universo, lab, player, conta)
│   ├── app/api/             ← 34 API routes (auth, chat, voice, memory)
│   ├── canon/agents/        ← Catálogo canônico (12 agentes + 108 gerados)
│   ├── lib/
│   │   ├── auth.ts          ← JWT + cookie mente_ai_token
│   │   ├── db/              ← Drizzle ORM + lazy pool
│   │   └── engine/          ← Motor narrativo (profiler, router, conflicts)
│   ├── components/
│   │   ├── scenes/          ← 12 cenas Three.js (lazy loaded)
│   │   └── agents/          ← UI dos agentes (chat, cards, hero)
│   ├── store/               ← 5 Zustand stores
│   └── hooks/               ← useChatHistory, useHydrated, useXPStream
├── docs/                    ← Documentação completa (Master Index + 40 docs)
└── CONTRIBUTING.md          ← Guia de onboarding (devs + IAs)
```

---

## 🧪 Comandos

```bash
npm run dev -- --webpack    # Desenvolvimento
npm run build               # Build de produção
npm run typecheck           # TypeScript check
npm test                    # Testes unitários (Jest)
npm run test:e2e            # Testes E2E (Playwright)
npm run arch:validate       # Validação arquitetural (Madge)
```

---

## 📚 Documentação

| Documento | Conteúdo |
|-----------|----------|
| [Master Index](MENTE_AI_COGNITIVE_ARCHITECTURE_MASTER_INDEX.md) | Fonte única da verdade da arquitetura |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Onboarding para devs e IAs |
| [CLAUDE.md](CLAUDE.md) | Sistema operacional para agentes IA |
| [ROADMAP.md](ROADMAP.md) | Roadmap de desenvolvimento |
| [ADR/](docs/architecture/ADR/) | 17 ADRs — memória arquitetural |
| [API.md](docs/backend/API.md) | Catálogo das 34 API routes |
| [SECURITY.md](docs/security/SECURITY.md) | Segurança completa |
| [DATABASE.md](docs/backend/DATABASE.md) | Arquitetura de banco |

---

## 🌐 Produção

- **URL:** https://mente-ai.vercel.app
- **Região:** gru1 (São Paulo)
- **Branch:** `feat/lab-redesign`
- **Status:** ✅ Online — Beta em Produção

---

> *"Mentes são formadas, não formatadas."*  
> *— MENTE.AI, 2026*
