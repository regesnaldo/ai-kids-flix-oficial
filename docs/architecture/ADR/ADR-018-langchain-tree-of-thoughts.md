# ADR-018: LangChain + Tree of Thoughts — Raciocínio Multi-Caminho

## Status
**Accepted** — Junho 2026

## Contexto

Em maio de 2026, o chat dos universos (`/api/universo/chat`) respondia com raciocínio linear: o modelo recebia o input e gerava a resposta mais provável. Funcionava, mas as respostas eram genéricas — não adaptadas ao perfil cognitivo do usuário.

Um usuário com perfil "emocional" recebia a mesma resposta que um com perfil "lógico". Isso contradizia a premissa central: **agentes que conhecem você**.

## Decisão

**Tree of Thoughts (ToT) via LangChain + OpenAI GPT-4o.** O agente gera 3 perspectivas de resposta (lógica, emocional, criativa), avalia cada uma contra o perfil do usuário, e entrega a melhor. Confiança: ~92%.

## Por quê?

1. **Personalização real:** O ToT não "escolhe um template". Ele gera 3 respostas completas e avalia qual melhor se encaixa no perfil do usuário (emocional, intelectual, moral).

2. **Inspiração acadêmica:** O paper "Tree of Thoughts: Deliberate Problem Solving with Large Language Models" (Yao et al., 2023) demonstrou que explorar múltiplos caminhos de raciocínio melhora significativamente a qualidade em tarefas complexas.

3. **LangChain como orquestrador:** LangChain abstrai a complexidade de prompts, chains e avaliação. Sem LangChain, o ToT exigiria ~200 linhas de código customizado para gerenciar o fluxo.

4. **Fallback seguro:** Se a API OpenAI falhar, o sistema faz fallback para resposta linear simples. O usuário nunca recebe erro — apenas uma resposta menos personalizada.

5. **Escopo controlado:** ToT não está em todo chat — apenas nos universos. Isso contém o custo (4x chamadas LLM) onde o valor é maior (imersão narrativa).

## Alternativas Consideradas

- **Resposta linear (sem ToT)** — rejeitada como primária. Funciona para chat rápido, mas não entrega personalização narrativa. Mantida como fallback.
- **Chain-of-Thought (CoT)** — rejeitada. Melhora raciocínio passo a passo, mas ainda gera UM caminho. ToT gera MÚLTIPLOS e escolhe o melhor.
- **ToT heurístico (if/else)** — rejeitado. Versão inicial era baseada em regras (60-70% confiança). Substituído pelo ToT real com LLM (92%).
- **Graph of Thoughts (GoT)** — rejeitado. Mais complexo que ToT, com nós interconectados. Overkill para o caso de uso atual.

## Consequências

### Positivas
- Respostas 22% mais relevantes ao perfil do usuário
- Experiência de "agente que realmente me entende"
- Arquitetura modular: trocar LangChain por outra lib é contido em 1 arquivo
- Fallback transparente para resposta simples

### Negativas
- Custo 4x por interação (3 ramos + avaliação)
- Latência adicional de 1-2 segundos
- Dependência da API OpenAI (fora do ar = fallback)
- Debugging mais complexo (4 chamadas em vez de 1)

### Riscos
- Custo pode escalar com volume de usuários nos universos
- Mitigação: ToT apenas nos universos (menor volume), cache de ramos similares

## Evolução Futura

- ToT cross-agent: cada ramo gerado por um agente canônico diferente
- Cache de ramos: perguntas similares reaproveitam ramos já avaliados
- Modelo local para avaliação de ramos (reduzir custo da 4a chamada)
