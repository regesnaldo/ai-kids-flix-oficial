# 📊 Estratégia de Dashboard de Governança — MENTE.AI

> **O painel de controle da civilização.**  
> Não um dashboard de métricas de negócio — um dashboard de saúde operacional.

---

## 🧠 FILOSOFIA

Este documento define a ARQUITETURA do dashboard de governança, não sua implementação completa. É a planta baixa. Construir o dashboard inteiro agora seria overengineering. Mas sem a planta, construiremos errado depois.

**Analogia:** Antes de construir o painel de controle de uma usina nuclear, você projeta quais medidores são essenciais, quais são alertas, e quais são apenas informativos.

---

## 🖥️ VISÃO DO DASHBOARD

```
┌─────────────────────────────────────────────────────────────┐
│                  MENTE.AI Governance Dashboard               │
│                                                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────┐ │
│  │ ECOSYSTEM   │ │ COGNITIVE   │ │ MEMORY      │ │ ORCHES-│ │
│  │ HEALTH      │ │ INTEGRITY   │ │ HEALTH      │ │ TRATION│ │
│  │      🟢     │ │      🟢     │ │      🟡     │ │   🟢   │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────┘ │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ NARRATIVE STABILITY                          🟢       │   │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │   │
│  │ Agent tone drift: 0/12      Fourth wall breaks: 0    │   │
│  │ Canon consistency: 100%     Immersion score: 94%     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ SYSTEM EVOLUTION                            🟡       │   │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │   │
│  │ ADRs this month: 8         Docs updated: 12          │   │
│  │ Orphan docs: 3             Broken links: 0           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────┐ ┌──────────────────┐                   │
│  │ ONBOARDING       │ │ OPERATIONAL      │                   │
│  │ FRICTION     🟢  │ │ BLIND SPOTS  🟡  │                   │
│  └──────────────────┘ └──────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 SEÇÕES DO DASHBOARD

### 1. Ecosystem Health (saúde geral)
- Status dos 4 gates: Técnico, Documentação, Arquitetura, Narrativa
- Último deploy: timestamp + status
- Health check endpoints: DB, Anthropic, ElevenLabs

### 2. Cognitive Integrity (integridade cognitiva)
- Agent tone drift (0/12 ideal)
- Cross-agent differentiation score
- Memory diversity score
- Stream completion rate

### 3. Memory Health (saúde da memória)
- Total memories stored
- Avg memories per user-agent pair
- Memory injection efficiency
- TTL expirations this week

### 4. Orchestration Quality (qualidade da orquestração)
- Active relationships (usuários com nível > Stranger)
- Phase progression rate
- Conflict activation balance
- ToT success rate

### 5. Narrative Stability (estabilidade narrativa)
- Fourth wall breaks (deve ser 0)
- Diegetic language ratio
- Canon modification alerts
- Universe consistency checks

### 6. System Evolution (evolução do sistema)
- ADRs created this month
- Docs updated this month
- Orphan docs count
- Broken links count

### 7. Onboarding Friction (atrito de entrada)
- Time to first meaningful interaction
- New dev onboarding completion rate
- Documentation coverage %

### 8. Operational Blind Spots (pontos cegos)
- Undocumented API routes
- Systems without ADR
- Files modified without doc updates
- Governance violations in last 30 days

---

## 🚦 INDICADORES DE STATUS

| Cor | Significado |
|-----|------------|
| 🟢 | Saudável — dentro dos thresholds |
| 🟡 | Atenção — tendência de degradação |
| 🔴 | Crítico — requer intervenção imediata |
| ⚪ | Não monitorado — blind spot |

---

## 🔮 IMPLEMENTAÇÃO FUTURA

- **Fase 1 (agora):** Arquitetura definida (este documento)
- **Fase 2 (Agosto 2026):** Endpoint `/api/health/governance` com métricas agregadas
- **Fase 3 (Setembro 2026):** Dashboard estático (HTML gerado) com dados do health endpoint
- **Fase 4 (Outubro 2026):** Dashboard interativo com histórico (30 dias)

---

> *"Um dashboard de governança não é para admirar — é para detectar que algo está errado antes que alguém perceba."*
