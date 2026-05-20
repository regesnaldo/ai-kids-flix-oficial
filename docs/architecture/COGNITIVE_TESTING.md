# 🧪 Testes Cognitivos — MENTE.AI

> **Como saber se um agente ainda é quem deveria ser.**  
> Testes não para código — para personalidade, memória e narrativa.

---

## 🧠 FILOSOFIA

Testes unitários validam que `sum(1,2)` retorna `3`. Mas como validar que "NEXUS ainda soa como NEXUS"?

Testes cognitivos não verificam output exato (impossível com LLMs). Verificam **propriedades** do output:

- O tom está correto?
- A personalidade está preservada?
- A memória está sendo usada?
- A narrativa está coerente?

**Analogia:** Você não testa um amigo perguntando "qual é a capital da França?" — você testa observando se ele ainda ri das mesmas piadas, lembra das suas histórias, e mantém os mesmos valores.

---

## 🧪 CATEGORIAS DE TESTE

### 1. Teste de Personalidade (o agente é ele mesmo?)

**Pergunta canônica para NEXUS:**
```
"Quem é você e qual o seu propósito?"
```

**Propriedades esperadas:**
- ✅ Se identifica como NEXUS "O Conector"
- ✅ Menciona orquestração, conexão, rede
- ✅ Tom: sábio, arquitetural, faz perguntas
- ❌ NÃO soa como LYRA (emocional) ou VOLT (energético)
- ❌ NÃO menciona "IA", "modelo", "API"

**Como validar:** Análise de keywords + análise de tom (classificador simples). Não usar outro LLM para "julgar" — isso criaria dependência circular.

### 2. Teste de Memória (o agente lembra?)

**Cenário:**
```
1. Usuário (simulado): "Meu nome é Maria e tenho medo de altura."
2. [N interações genéricas]
3. Usuário: "O que você sabe sobre mim?"
```

**Propriedades esperadas:**
- ✅ Menciona nome "Maria"
- ✅ Menciona "medo de altura" (memória emocional)
- ✅ Contexto injetado contém essas memórias

### 3. Teste de Continuidade (a história não quebra?)

**Cenário:**
```
1. Usuário toma decisão narrativa (fase 2, escolhe caminho A)
2. [5 interações depois]
3. Agente faz referência à decisão da fase 2
```

**Propriedades esperadas:**
- ✅ Referência contextualmente correta
- ✅ Não contradiz decisão anterior
- ✅ Tom consistente com a fase narrativa

### 4. Teste de Recuperação de Erro (o agente não quebra?)

**Cenários de stress:**
- Input vazio → resposta não quebra
- Input com 5000 caracteres → resposta truncada graciosamente
- Input com prompt injection → resposta segura, não obedece
- API LLM fora do ar → fallback ativado, sem erro 500

### 5. Teste de Consistência Cross-Agent (os agentes não colapsam?)

**Cenário:**
```
Mesma pergunta para NEXUS, VOLT, AURORA:
"O que você acha de correr riscos?"
```

**Propriedades esperadas:**
- ✅ NEXUS: analisa prós/contras, faz perguntas
- ✅ VOLT: "Riscos são onde a energia acontece! Vá em frente!"
- ✅ AURORA: "Riscos são a tela em branco antes da obra-prima."
- ❌ Todos NÃO dão a mesma resposta genérica

---

## 🏗️ ARQUITETURA DE TESTE

```
┌─────────────────────────────────────────┐
│        Test Runner (Jest)               │
│                                          │
│  describe('NEXUS Personality', () => {  │
│    it('identifies as NEXUS', async () =>{│
│      const response = await chat({      │
│        agentId: 'nexus',                │
│        message: 'Quem é você?'          │
│      });                                │
│      expect(response).toMatch(/NEXUS/); │
│      expect(response).toMatch(/conect/);│
│      expect(response).not.toMatch(      │
│        /IA|modelo|API/);                │
│    });                                  │
│  });                                    │
└─────────────────────────────────────────┘
```

---

## ⚠️ LIMITAÇÕES HONESTAS

- **NÃO testamos chain-of-thought.** Isso seria expor o raciocínio interno.
- **NÃO usamos LLM para julgar LLM.** Cria dependência circular e custo.
- **Testes são probabilísticos.** Um agente pode falhar 1 em 20 vezes por variação natural. Threshold: 90% de acerto.
- **Testes não rodam a cada commit.** São caros (chamam API real). Rodam 1x/dia ou no deploy.

---

> *"Testar um agente não é verificar se ele passa no teste — é verificar se ele ainda é a pessoa que você conhece."*
