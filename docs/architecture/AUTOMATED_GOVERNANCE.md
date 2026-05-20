# 🤖 Governança Automatizada — MENTE.AI

> **Quando as regras se tornam comportamento.**  
> Transformando princípios em verificações automáticas.

---

## 🧠 FILOSOFIA

Regras que dependem de humanos lembrarem são regras que serão violadas. A governança do MENTE.AI está evoluindo de "documento que alguém lê" para "comportamento que o sistema impõe".

**Analogia:** Um prédio não confia que as pessoas vão lembrar de não cair do 10o andar. Ele tem parapeitos. Governança automatizada são os parapeitos da civilização cognitiva.

---

## 🔒 REGRAS AUTO-APLICÁVEIS

### Regra 1: Mudança de arquitetura → ADR obrigatório

```yaml
trigger: arquivos em src/lib/, src/engine/, middleware.ts modificados
action: verificar se ADR foi criado no mesmo commit
enforcement: CI bloqueia merge se mudança arquitetural sem ADR
escape: flag --skip-adr para hotfixes (log de auditoria obrigatório)
```

### Regra 2: Mudança de API → API.md atualizado

```yaml
trigger: arquivos em src/app/api/ modificados
action: verificar se docs/backend/API.md foi atualizado
enforcement: CI alerta (warning, não bloqueio — docs podem ser atualizados depois)
escape: tag [api-docs-pending] no commit message
```

### Regra 3: Mudança narrativa → validação de universo

```yaml
trigger: arquivos em src/canon/agents/, system prompts modificados
action: verificar consistência contra docs/narrative/AI_KIDS_FLIX_UNIVERSE_BASE.md
enforcement: CI alerta + requisitar revisão de narrative designer
escape: aprovação explícita no PR
```

### Regra 4: Mudança de segurança → SECURITY.md revisado

```yaml
trigger: middleware.ts, auth.ts, rotas de auth modificadas
action: verificar se docs/security/SECURITY.md foi atualizado
enforcement: CI bloqueia merge
escape: aprovação de security owner
```

### Regra 5: Links quebrados → CI falha

```yaml
trigger: qualquer .md modificado
action: executar scripts/validate-docs.py
enforcement: CI falha com links quebrados
escape: nenhum — links quebrados são sempre erro
```

### Regra 6: Documentação órfã → CI alerta

```yaml
trigger: novo .md criado em docs/
action: verificar se está referenciado no Master Index
enforcement: CI alerta (warning)
escape: tag [doc-pending-index] no commit
```

---

## 🔄 FLUXO DE ENFORCEMENT

```
Desenvolvedor faz commit
        │
        ▼
┌──────────────────────────┐
│  CI/CD (GitHub Actions)   │
│                           │
│  1. Lint (ESLint)         │
│  2. TypeScript (tsc)      │
│  3. Build (next build)    │
│  4. Testes (Jest + E2E)   │
│  5. Validação de docs     │  ← NOVO
│  6. Verificação de ADR    │  ← NOVO
│  7. Verificação narrativa │  ← NOVO
└──────────┬───────────────┘
           │
           ├─→ Tudo passou? → Merge permitido
           │
           └─→ Algo falhou? → PR bloqueado
                │
                └─→ Mensagem explica EXATAMENTE o que violou
                    e como corrigir (link para doc de governança)
```

---

## 📋 MATRIZ DE ENFORCEMENT

| Tipo de mudança | Bloqueia merge? | Quem pode aprovar? |
|----------------|-----------------|-------------------|
| Arquitetura sem ADR | ✅ Sim | Tech Lead |
| API sem docs | ⚠️ Warning | Dev (com tag) |
| Narrativa sem validação | ⚠️ Warning | Narrative Designer |
| Segurança sem revisão | ✅ Sim | Security Owner |
| Links quebrados | ✅ Sim | Ninguém (corrigir) |
| Docs órfãos | ⚠️ Warning | Dev (com tag) |
| Build quebrado | ✅ Sim | Ninguém (corrigir) |
| TypeScript error | ✅ Sim | Ninguém (corrigir) |

---

> *"A melhor regra não é a mais bonita — é a que se aplica sozinha."*
