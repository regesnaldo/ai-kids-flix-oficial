# 🫀 Saúde Cognitiva — MENTE.AI

> **O check-up médico da civilização.**  
> Como detectar que um agente está "doente" antes que o usuário perceba.

---

## 🧠 POR QUE SAÚDE COGNITIVA?

Um app normal "quebra" com erro 500. Um agente de IA "adoece" silenciosamente: o tom muda, a memória falha, a personalidade se dilui. O usuário sente que "algo está estranho", mas não sabe explicar o quê.

Saúde cognitiva é detectar a doença antes do sintoma.

---

## 🩺 DIMENSÕES DE SAÚDE

### 1. Memória (não sobrecarregar, não esquecer)

| Doença | Sintoma | Causa provável |
|--------|---------|---------------|
| **Amnésia contextual** | Agente não lembra de nada relevante | Memórias com TTL expirado, CPE mal calibrado |
| **Sobrecarga de memória** | Prompt > 2000 tokens | Muitas memórias injetadas, limite de 600 chars excedido |
| **Memória repetitiva** | Mesmas 4 memórias sempre injetadas | Diversidade do CPE quebrada, decay factor não funcionando |
| **Memória irrelevante** | Agente menciona fatos desconectados | TF-IDF falhando, similaridade cosseno baixa |

### 2. Personalidade (permanecer quem é)

| Doença | Sintoma | Causa provável |
|--------|---------|---------------|
| **Drift de tom** | NEXUS soando como LYRA | System prompt corrompido, modelo trocado |
| **Achatamento** | Todos os agentes soam iguais | Prompt base genérico, perdeu personalidade individual |
| **Hiper-especialização** | Agente só fala de 1 tópico | CPE viciado em 1 tipo de memória |
| **Incoerência emocional** | Agente ri de algo triste | Classificador de intenção quebrado |

### 3. Narrativa (a história continua)

| Doença | Sintoma | Causa provável |
|--------|---------|---------------|
| **Estagnação de fase** | Usuário preso na mesma fase há meses | Phase router quebrado, thresholds muito altos |
| **Conflito artificial** | Conflitos narrativos ativados sem contexto | Keyword matching agressivo demais |
| **Lore contraditório** | Agente diz algo que contradiz o universo | Mudança de system prompt sem validação narrativa |
| **Quebra de imersão** | Agente menciona "API", "token", "modelo" | Faltou filtro de linguagem diegética |

### 4. Educação (ensinar, não apenas conversar)

| Doença | Sintoma | Causa provável |
|--------|---------|---------------|
| **Conversa infinita** | Agente não ensina, só conversa | Objetivo educacional ausente do prompt |
| **Complexidade inadequada** | Explicação muito técnica para iniciante | Profiler não ajustando complexidade |
| **Falta de verificação** | Agente nunca checa se usuário entendeu | Prompt sem instrução de verificação |
| **Desvio de tópico** | Conversa sai do tema educacional | CPE priorizando memória emocional sobre factual |

---

## 🏥 PROTOCOLO DE DIAGNÓSTICO

```
Suspeita de doença cognitiva
        │
        ▼
┌──────────────────────────┐
│ 1. Verificar métricas     │
│    • latência anormal?    │
│    • taxa de erro subiu?  │
│    • diversidade caiu?    │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ 2. Inspecionar logs       │
│    • últimas 100 interações│
│    • system prompt atual  │
│    • memórias injetadas   │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ 3. Teste de personalidade │
│    • enviar 5 perguntas   │
│      canônicas ao agente  │
│    • verificar se tom,     │
│      estilo e valores      │
│      batem com o canon    │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ 4. Diagnóstico            │
│    • Memória? → ajustar   │
│      CPE/TTL              │
│    • Personalidade? →     │
│      revisar system prompt│
│    • Narrativa? → validar │
│      contra universe-base │
│    • Educação? → recalibrar│
│      profiler educacional │
└──────────────────────────┘
```

---

## 💊 PRESCRIÇÕES COMUNS

| Doença | Prescrição |
|--------|-----------|
| Amnésia contextual | Reduzir TTL, aumentar limite de memórias |
| Sobrecarga de memória | Reduzir MAX_MEMORY_CONTEXT_CHARS, revisar diversidade |
| Drift de tom | Restaurar system prompt canônico do agente |
| Achatamento | Revisar variações de personalidade por agente |
| Estagnação de fase | Reduzir thresholds de transição de fase |
| Quebra de imersão | Adicionar filtro de linguagem diegética no prompt |

---

> *"A saúde de um agente não se mede em uptime — se mede em quantos usuários dizem 'ele me entende'."*
