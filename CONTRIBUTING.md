# 🚀 Contribuindo com o MENTE.AI

> **Bem-vindo à tripulação.**  
> Este guia é seu manual de voo. Leia antes de tocar em qualquer arquivo.

---

## 🧭 FILOSOFIA DO PROJETO

O MENTE.AI não é "mais um app Next.js". É uma **civilização cognitiva** — um metaverso educacional onde 12 agentes com personalidade cinematográfica ensinam IA através de narrativa, memória e relacionamento.

Pense nele como uma **cidade viva**:

- **As ruas** são as API routes (30+ caminhos por onde os dados fluem)
- **Os prédios** são os sistemas cognitivos (memória, perfil, relacionamento)
- **Os habitantes** são os 12 agentes canônicos (cada um com personalidade, voz e propósito)
- **A prefeitura** é o Master Index (a fonte única da verdade)
- **Os arquivos** são os ADRs (a memória de por que cada rua foi construída daquele jeito)

Você não está apenas "codando". Você está **expandindo uma civilização**.

---

## 🗺️ MAPA RÁPIDO DA CIDADE

| Se quiser... | Vá para... |
|-------------|-----------|
| Entender a arquitetura completa | `MENTE_AI_COGNITIVE_ARCHITECTURE_MASTER_INDEX.md` |
| Saber por que decisões foram tomadas | `docs/architecture/ADR/` |
| Entender segurança | `docs/security/SECURITY.md` |
| Entender o banco de dados | `docs/backend/DATABASE.md` |
| Ver o roadmap | `ROADMAP.md` |
| Ver fluxos de engenharia | `docs/architecture/FLOWS.md` |
| Ver diagramas | `docs/architecture/SYSTEM_DIAGRAMS.md` |
| Ver catálogo de APIs | `docs/backend/API.md` |
| Entender a narrativa | `docs/narrative/` |

---

## 🛠️ CONFIGURAÇÃO DO AMBIENTE

### Pré-requisitos

- **Node.js** 20+
- **npm** 10+
- **Git**
- **WSL** (se estiver no Windows — o projeto roda em ambiente Linux)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/regesnaldo/ai-kids-flix-oficial.git
cd AI-KIDS-OFICIAL

# 2. Mude para a branch ativa
git checkout feat/lab-redesign

# 3. Instale dependências
npm install

# 4. Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves

# 5. Rode o projeto
npm run dev -- --webpack
```

### ⚠️ Atenção: WSL + Turbopack

Se você usa WSL (Windows Subsystem for Linux), o Turbopack **não funciona** (conflito de lockfile cross-platform). Use sempre:

```bash
npm run dev -- --webpack
```

---

## 🏃 RODANDO LOCALMENTE

```bash
# Desenvolvimento (com hot reload)
npm run dev -- --webpack

# Build de produção
npm run build

# TypeScript check
npm run typecheck

# Testes unitários
npm test

# Testes E2E
npm run test:e2e

# Validação arquitetural (dependências circulares)
npm run arch:validate
```

O projeto roda em `http://localhost:3000`.

---

## 🌳 ESTRATÉGIA DE BRANCHES

```
main  ←── feat/lab-redesign  ←── feat/nova-feature
  │              │                      │
  │              └── Branch ATIVA       └── Suas branches
  │                   (NUNCA commite
  │                    direto aqui
  │                    sem PR)
```

- **`main`:** Produção. Só recebe merge via PR.
- **`feat/lab-redesign`:** Branch ativa de desenvolvimento. **Esta é a branch que você deve usar como base.**
- **Suas branches:** Crie a partir de `feat/lab-redesign`. Nomeie como `feat/descricao-curta`, `fix/descricao-curta`.

---

## ✍️ CONVENÇÕES DE COMMIT

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: adiciona sistema de recall emocional
fix: corrige validação JWT no middleware
docs: atualiza ADR-004 com nova camada de memória
refactor: extrai profiler para módulo separado
test: adiciona testes para o Context Priority Engine
chore: atualiza dependências
```

**Regras:**
- Um commit por mudança lógica — não agrupe coisas não relacionadas
- Mensagem em português
- Build deve passar antes do commit: `npm run build`

---

## 📋 WORKFLOW DE ADR

Toda decisão arquitetural significativa precisa de um ADR.

```bash
# 1. Copie o template
cp docs/architecture/ADR/README.md  # (leia o template na seção "Como criar")

# 2. Crie o arquivo
# docs/architecture/ADR/ADR-NNN-nome-curto.md

# 3. Preencha as 7 seções obrigatórias:
#    Status, Contexto, Decisão, Por quê, Alternativas, Consequências, Evolução

# 4. Atualize o índice
# Edite docs/architecture/ADR/README.md (tabela de ADRs)

# 5. Atualize o Master Index
# Edite MENTE_AI_COGNITIVE_ARCHITECTURE_MASTER_INDEX.md
```

---

## 🔒 REGRAS DE SEGURANÇA

1. **Cookie é `mente_ai_token`.** NUNCA use outro nome. Está em `src/lib/auth.ts`.
2. **Middleware valida JWT criptograficamente.** Não apenas verifica se o cookie existe.
3. **Nunca hardcode segredos.** Use variáveis de ambiente.
4. **Prompt injection é real.** Todo input de usuário passa por sanitização antes do system prompt.
5. **Rotas novas precisam de rate limiting.** Configure no `vercel.json`.

Leia `docs/security/SECURITY.md` antes de mexer em auth, cookies ou middleware.

---

## 🎭 REGRAS DE PROTEÇÃO NARRATIVA

1. **12 agentes canônicos são IMUTÁVEIS.** Pode adicionar agentes gerados, nunca remover ou alterar a essência dos 12.
2. **Conflitos narrativos são sagrados.** VOLT↔ETHOS, KAOS↔STRATOS, CIPHER↔AURORA — não quebre essas relações.
3. **NEXUS é o orquestrador central.** Sempre. Ele conecta todos os outros.
4. **Alterações de personalidade de agente exigem revisão narrativa.** Um agente não pode mudar de tom sem justificativa no universo.
5. **Novos episódios seguem a estrutura LEGO:** 5 fases × 10 temporadas = 50 temporadas.

---

## ❌ ERROS COMUNS (NÃO FAÇA ISSO)

| Erro | Por que é problema |
|------|-------------------|
| Usar Prisma em vez de Drizzle | ORM é Drizzle EXCLUSIVAMENTE. Prisma foi removido. |
| Mudar o nome do cookie | `mente_ai_token` está em 15+ arquivos. Quebrar isso = quebrar auth. |
| Commitar na `main` | Sempre use `feat/lab-redesign` como base. |
| Deletar documentação | Docs obsoletos vão para `docs/archive/`. Nunca para a lixeira. |
| Usar Turbopack no WSL | Lockfile cross-platform quebra. Use `--webpack`. |
| Criar API route sem documentar | Toda rota nova vai no `docs/backend/API.md`. |
| `Math.random()` em `useMemo` | Causa hydration mismatch. Use o padrão `mounted` state. |
| Alterar `layout.tsx` ou `middleware.ts` | São arquivos protegidos. Consequências em cascata. |

---

## 🤖 COMO AGENTES DE IA DEVEM INTERAGIR COM ESTE REPO

Se você é um agente de IA (Claude, Copilot, Cursor, OpenCode):

1. **Leia `CLAUDE.md` primeiro.** É o sistema operacional do projeto.
2. **Carregue a skill `mente-ai-development`.** Contém padrões, pitfalls e convenções.
3. **NUNCA delete documentação.** Mova para `docs/archive/`.
4. **Siga o workflow ADR.** Se criar uma feature significativa, crie o ADR.
5. **Build deve passar.** `npm run build` antes de declarar "pronto".
6. **Explique o que vai fazer antes de fazer.** Transparência é o padrão.
7. **Atualize o Master Index.** Se criou um documento novo, ele precisa aparecer no índice.

---

## 🧪 WORKFLOW DE BUILD E TESTE

```bash
# 1. TypeScript check
npm run typecheck
# Deve retornar zero erros

# 2. Build
npm run build
# Deve compilar sem erros (~52 segundos)

# 3. Testes
npm test
# Unitários (Jest + React Testing Library)

npm run test:e2e
# E2E (Playwright)

npm run arch:validate
# Dependências circulares (Madge)

# 4. Commit
git add .
git commit -m "feat: descricao clara"

# 5. Push + PR
git push origin feat/sua-branch
# Abra PR contra feat/lab-redesign
```

---

## 📞 PRECISANDO DE AJUDA?

1. **Dúvida de arquitetura?** → `docs/architecture/ADR/`
2. **Dúvida de segurança?** → `docs/security/SECURITY.md`
3. **Dúvida de banco?** → `docs/backend/DATABASE.md`
4. **Dúvida narrativa?** → `docs/narrative/`
5. **Não sabe por onde começar?** → `MENTE_AI_COGNITIVE_ARCHITECTURE_MASTER_INDEX.md`

---

> *"Você não está apenas contribuindo com código. Você está expandindo uma civilização cognitiva. Cada linha que você escreve pode ser lembrada por um agente, ensinada a um usuário, e preservada como memória arquitetural. Faça valer a pena."*
