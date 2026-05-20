# ADR-006: Motor de Prioridade de Contexto

## Status
**Accepted** — Maio 2026

## Contexto

Com o sistema de memória em 5 camadas, tínhamos um problema novo: **quais memórias entram no contexto do chat e quais ficam de fora?**

O limite é severo: 600 caracteres (~150 tokens) para memórias no system prompt. Com 200 memórias armazenadas por par (usuário, agente), escolher as 4 certas é a diferença entre uma conversa que parece mágica e uma que parece aleatória.

O problema se agrava porque diferentes tipos de interação pedem diferentes tipos de memória:
- Uma conversa emocional precisa de memórias afetivas
- Uma pergunta técnica precisa de memórias factuais
- Uma decisão narrativa precisa de memórias de escolhas passadas

## Decisão

**Context Priority Engine (CPE) — um classificador de 5 níveis que pontua cada memória candidata antes da injeção no contexto.**

## Por quê?

1. **Nem toda memória é igual:** "O usuário prefere explicações simples" (preferência) tem valor diferente de "O usuário mencionou ansiedade com provas" (emocional) dependendo do contexto atual da conversa.

2. **Classificação contextual:** O CPE analisa a mensagem atual do usuário e classifica a intenção (emotional, factual, preference, narrative, casual). Memórias do mesmo tipo recebem peso maior.

3. **Decaimento temporal:** Memórias de 3 dias atrás têm peso 0.7. Memórias de 80 dias têm peso 0.1. Isso evita que memórias irrelevantes ocupem espaço.

4. **Peso emocional:** Memórias com alta carga emocional (detectada via regex de sinais: "sinto", "medo", "feliz") recebem boost de 1.5x. Emoção forte = mais relevante para o relacionamento.

5. **Diversidade forçada:** O CPE garante que pelo menos 1 memória factual e 1 memória emocional entrem no contexto, evitando que todas as 4 slots sejam do mesmo tipo.

## Alternativas Consideradas

- **Apenas as mais recentes (LIFO)** — rejeitado. As últimas 4 interações seriam triviais ("oi", "tudo bem", "sim", "ok") em vez das significativas.
- **Apenas as de maior peso emocional** — rejeitado. Criaria um loop onde o agente só fala sobre emoções, ignorando fatos e preferências.
- **LLM como juiz** — rejeitado. Pedir para o modelo escolher quais memórias usar consome tokens, adiciona latência, e cria um meta-loop complexo.

## Consequências

### Positivas
- Contexto do chat sempre contém as memórias mais relevantes para a conversa atual
- Diversidade de tipos de memória evita viés emocional
- Decaimento temporal mantém o contexto fresco
- Sistema totalmente determinístico — debugável

### Negativas
- 5 fatores de scoring = lógica complexa para ajustar
- Pesos (1.5x emocional, 0.7x 3 dias) são heurísticos, não calibrados com dados
- Classificador de intenção é baseado em regex — frases ambíguas podem ser mal classificadas

### Riscos
- Se os pesos estiverem mal calibrados, o contexto injetado pode ser irrelevante
- Mitigação: logging de quais memórias foram injetadas para auditoria futura

## Evolução Futura

- Substituir classificador de intenção por modelo leve (não LLM — algo como Naive Bayes treinado)
- Aprendizado de pesos por reinforcement (quais memórias geraram engajamento?)
- Suporte a "contexto forçado" — o usuário pode pinar uma memória como relevante
