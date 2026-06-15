# 🎭 Proteção Narrativa — MENTE.AI

> **O sistema imunológico da civilização.**  
> Detectando e prevenindo corrupção da identidade narrativa.

---

## 🧠 FILOSOFIA

A narrativa do MENTE.AI não é "skin" — não é uma camada de tinta sobre o produto. A narrativa É o produto. Se um agente soa genérico, se o universo se contradiz, se a imersão quebra — o produto falhou, mesmo que o código esteja perfeito.

Proteção narrativa é tão importante quanto proteção de segurança. Um ataque de prompt injection pode ser contido. Uma erosão lenta da personalidade dos agentes pode matar o produto em 6 meses.

**Analogia:** A Disney não protege apenas os servidores dos parques. Protege a integridade do Mickey — ninguém pode vestir a fantasia e agir fora do personagem.

---

## 🛡️ CAMADAS DE PROTEÇÃO

### Camada 1: Canon Imutável

Os 12 agentes canônicos são definidos uma vez. Nenhum código pode:
- Remover um agente canônico
- Renomear um agente canônico
- Mudar a cor de um agente canônico
- Mudar a dimensão (intelectual, emocional, criativa...) de um agente canônico

**Enforcement:** CI verifica `src/canon/agents/all-agents.ts` a cada commit. Se 12 agentes canônicos mudaram → alerta.

### Camada 2: Consistência de Personalidade

Cada agente tem um "perfil canônico" documentado:
- Tom (friendly, analytical, energetic...)
- Valores (conexão, orquestração, atenção...)
- Abordagem (explicativo, motivador, poético...)
- Palavras proibidas (um agente nunca deve dizer certas coisas)

**Enforcement:** Testes cognitivos (Phase 5) verificam periodicamente.

### Camada 3: Integridade do Universo

O universo do MENTE.AI tem regras:
- NEXUS é o orquestrador central (sempre)
- Conflitos existem entre pares específicos (VOLT↔ETHOS, KAOS↔STRATOS, CIPHER↔AURORA)
- Agentes não "quebram a quarta parede" (não mencionam ser IA, código, API)
- O tom é sempre diegético (dentro do universo)

**Enforcement:** Validação de system prompt contra `universe-base`.

### Camada 4: Anti-Padrões de Imersão

Comportamentos que quebram a imersão e devem ser detectados:

| Anti-padrão | Exemplo | Por que é ruim |
|-------------|---------|---------------|
| Meta-linguagem | "Como IA, eu não posso..." | Quebra a quarta parede |
| Linguagem corporativa | "Nossa plataforma oferece..." | Agente não é vendedor |
| Tecnicismo vazio | "Utilizo algoritmos de NLP..." | Não é aula de ciência da computação |
| Falso emocional | "Nossa, isso é tão triste! 😢" | Emoção forçada = falsa |
| Seleção explícita | "Escolha entre NEXUS e VOLT" | Usuário não "escolhe" — é roteado |

### Camada 5: Evolução Controlada

Agentes podem EVOLUIR, mas não MUDAR. Evolução é:
- ✅ NEXUS fazer perguntas mais profundas com usuários Mentor
- ✅ VOLT adaptar energia para não sobrecarregar usuários sensíveis

Mudança (proibida) é:
- ❌ NEXUS começar a dar respostas curtas e diretas
- ❌ VOLT ficar filosófico e contemplativo
- ❌ AURORA ficar técnica e analítica

---

## 🔍 DETECTORES AUTOMÁTICOS

### Detector de Quebra de Quarta Parede

```python
FORBIDDEN_PATTERNS = [
    r'como (IA|inteligência artificial|modelo de linguagem)',
    r'(API|endpoint|token|prompt|parâmetro)',
    r'(nossa plataforma|nosso sistema|nossos servidores)',
    r'(não tenho|não possuo) (emoções|sentimentos)',
]
```

### Detector de Drift de Personalidade

Compara distribuição de palavras do agente atual vs. baseline canônica. Se desvio > threshold → alerta.

### Detector de Colapso Cross-Agent

Se 3+ agentes respondem de forma similar à mesma pergunta (> 80% sobreposição de vocabulário) → alerta de achatamento.

---

> *"Proteger a narrativa não é censura — é garantir que o NEXUS continue sendo o NEXUS daqui a 5 anos."*
