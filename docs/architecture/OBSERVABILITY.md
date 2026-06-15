# 🔭 Observabilidade — MENTE.AI

> **O monitor cardíaco da civilização cognitiva.**  
> Como o MENTE.AI observa a si mesmo em tempo real.

---

## 🧠 FILOSOFIA

Um ecossistema cognitivo não pode ser monitorado como um app CRUD. Não basta medir "CPU em 70%". É preciso medir se o NEXUS ainda soa como NEXUS, se a memória está recuperando contextos relevantes, se o streaming não está perdendo tokens.

**Analogia:** Um hospital não monitora apenas a temperatura ambiente. Monitora o coração, os pulmões, o cérebro de cada paciente. O MENTE.AI é o hospital — os agentes são os pacientes.

---

## 📊 DIMENSÕES DE OBSERVABILIDADE

### 1. Latência (o pulso)

| Métrica | O que mede | Alerta se... |
|---------|-----------|-------------|
| `chat_response_time_p50` | Tempo até primeiro token (mediana) | > 800ms |
| `chat_response_time_p95` | Tempo até primeiro token (p95) | > 2s |
| `stream_token_interval` | Intervalo médio entre tokens | > 100ms |
| `memory_retrieval_time` | Tempo para buscar Top 4 memórias | > 50ms |
| `tot_evaluation_time` | Tempo do Tree of Thoughts | > 3s |

### 2. Qualidade (a respiração)

| Métrica | O que mede | Alerta se... |
|---------|-----------|-------------|
| `memory_injection_chars` | Tamanho do contexto de memória injetado | > 600 chars (estourou limite) |
| `prompt_total_tokens` | Tokens totais no system prompt | > 2000 (custo subindo) |
| `stream_completion_rate` | Streams completadas sem abort | < 90% |
| `fallback_activation_rate` | Fallback ativado (LLM fora do ar) | > 5% das requisições |

### 3. Cognição (o cérebro)

| Métrica | O que mede | Alerta se... |
|---------|-----------|-------------|
| `memory_diversity_score` | Variedade de tipos de memória injetada | < 2 tipos (só emocional ou só factual) |
| `relationship_stagnation` | Dias sem evolução de relacionamento | > 30 dias |
| `meta_cognition_insights` | Insights gerados por sessão | 0 (sistema não está aprendendo) |
| `recall_activation_rate` | Recall moments disparados | 0 (memória antiga nunca resgatada) |

### 4. Narrativa (a alma)

| Métrica | O que mede | Alerta se... |
|---------|-----------|-------------|
| `agent_tone_drift` | Desvio do tom canônico do agente | Detectado em > 10% das respostas |
| `conflict_activation_balance` | Conflitos narrativos ativados | 1 agente domina todos os conflitos |
| `phase_progression_rate` | Usuários avançando fases | < 5% dos usuários ativos |
| `universe_immersion_score` | Tempo médio no universo por visita | < 30 segundos |

---

## 🏗️ ARQUITETURA DE COLETA

```
┌────────────────────────────────────────────┐
│              API Routes                     │
│  (chat, universo, voice, interaction...)    │
│                                              │
│  Cada rota emite eventos:                    │
│  • chat.response.started                     │
│  • chat.response.completed                   │
│  • memory.retrieved                          │
│  • memory.stored                             │
│  • relationship.evolved                      │
│  • tot.evaluated                             │
└──────────────────┬─────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────┐
│           Logger Estruturado                │
│  (src/lib/logger.ts)                        │
│                                              │
│  Níveis: debug, info, warn, error           │
│  Transport: console (dev) + Sentry (prod)   │
│  Formato: JSON estruturado                   │
└──────────────────┬─────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────┐
│           Health Endpoint                   │
│  GET /api/health/system                     │
│                                              │
│  Agrega últimas N métricas:                 │
│  • latência p50/p95                         │
│  • taxa de erro                             │
│  • memória em uso                           │
│  • conexões DB ativas                       │
└────────────────────────────────────────────┘
```

---

## 🚨 SISTEMA DE ALERTAS

Alerta NUNCA deve ser "método X está lento". Deve ser acionável:

| Alerta | Significado real | Ação |
|--------|-----------------|------|
| `memory_diversity_score < 2` | Agente só fala de emoção (ou só de fatos) | Revisar pesos do CPE |
| `relationship_stagnation > 30d` | Usuário não avança relacionamento | Revisar thresholds de transição |
| `stream_completion_rate < 90%` | Usuários abortando streams | Investigar latência ou qualidade |
| `agent_tone_drift detectado` | Agente mudou personalidade | Revisar system prompt ou modelo |
| `prompt_total_tokens > 2000` | Custo de inferência subindo | Revisar injeção de memória |

---

> *"Monitorar uma civilização cognitiva não é contar bytes — é ouvir o batimento cardíaco de cada agente."*
