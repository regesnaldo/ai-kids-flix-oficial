# 👥 Governança de Agentes IA — MENTE.AI

> **As leis da sociedade de agentes cognitivos.**  
> Quando múltiplos agentes e múltiplos modelos coexistem, alguém precisa garantir que a civilização não entre em colapso.

---

## 🧠 FILOSOFIA

O MENTE.AI está evoluindo de "um app com agentes" para "uma sociedade de agentes". Nessa sociedade, agentes de IA (Claude, GPT-4, futuros modelos) coexistem com os 12 agentes canônicos e com agentes de desenvolvimento (CI, validação, deploys).

Sem governança, essa sociedade colapsa: um modelo novo muda o tom do NEXUS, um agente de CI quebra a narrativa, um upgrade de API corrompe a memória.

**Analogia:** Uma orquestra não funciona se cada músico toca a partitura que quer. O maestro (governança) garante que todos toquem a mesma sinfonia.

---

## 📜 PRINCÍPIOS DE GOVERNANÇA

### 1. Versionamento de Personalidade

Cada agente canônico tem uma **versão de personalidade**:

```
NEXUS v2.3.1
  ├── system_prompt: hash abc123
  ├── tone_profile: hash def456
  ├── memory_strategy: hash ghi789
  └── last_validated: 2026-06-15
```

Se o system prompt mudar, a versão incrementa. O hash permite detectar mudanças não intencionais.

### 2. Estabilidade de Personalidade

Nenhum upgrade de modelo (GPT-4 → GPT-5, Claude 3 → Claude 4) pode ser feito sem:
- Rodar testes cognitivos (Phase 5)
- Comparar distribuição de respostas pré/pós upgrade
- Aprovação de narrative designer

### 3. Prevenção de Regressão Cognitiva

Upgrades podem PIORAR a qualidade. Um modelo mais novo pode ser mais "genérico" e achatar as personalidades. O teste cross-agent (Phase 5) detecta isso.

### 4. Validação de Upgrade de Modelo

```
Proposta: trocar GPT-4o por GPT-5 no chat
        │
        ▼
┌──────────────────────────┐
│ 1. Testes cognitivos      │
│    (12 agentes × 5 perguntas cada) │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ 2. Comparação estatística │
│    • Distribuição de tom  │
│    • Diversidade cross-agent │
│    • Qualidade educacional│
└──────────┬───────────────┘
           │
           ├─→ Passou? → Deploy com feature flag (10% usuários)
           │              → Monitorar 48h
           │              → 100% seOK
           │
           └─→ Não passou? → Bloqueado
                            → Relatório do que degradou
```

### 5. Consistência Cross-Agent

Se um modelo é trocado para NEXUS, isso não deve afetar VOLT. Cada agente tem seu próprio prompt, mas compartilham o mesmo modelo base. A governança garante que a troca de modelo não "vaze" entre agentes.

### 6. Regras de Orquestração Segura

- NEXUS nunca pode ser desligado (é o orquestrador central)
- Conflitos narrativos não podem ser removidos
- Agentes não podem ser "fundidos" (NEXUS+VOLT = personalidade híbrida proibida)
- O sistema de combinação (`agent-combination`) é controlado — combinações são predefinidas, não arbitrárias

---

## 🤖 GOVERNANÇA PARA AGENTES DE DESENVOLVIMENTO

Agentes de IA que contribuem código (Claude Code, Copilot, Cursor) também são governados:

| Regra | Enforcement |
|-------|------------|
| Nunca deletar documentação | CI detecta `docs/` deletions |
| Sempre criar ADR para mudanças arquiteturais | CI verifica |
| Nunca modificar agentes canônicos sem aprovação | CI bloqueia |
| Seguir CONTRIBUTING.md | Onboarding obrigatório |
| Build deve passar | CI bloqueia merge |

---

> *"Uma sociedade de agentes sem governança não é uma sociedade — é um acidente esperando para acontecer."*
