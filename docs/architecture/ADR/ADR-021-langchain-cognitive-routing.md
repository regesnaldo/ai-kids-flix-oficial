# ADR-021: Roteamento Cognitivo — LangChain + ToT

## Status
**Accepted** — Junho 2026

## Contexto

O sistema Tree of Thoughts (ToT) precisava de um orquestrador para gerenciar múltiplas chamadas LLM, avaliação e seleção. Implementar isso com fetch() puro seria frágil e verboso.

## Decisão

**LangChain como orquestrador do pipeline Tree of Thoughts.** O ToT está contido em `src/engine/langchain-integration.ts`, isolado do resto do sistema.

## Por quê?

1. **Abstração de chains:** LangChain gerencia o fluxo "gerar 3 ramos → avaliar → selecionar melhor" sem código boilerplate.
2. **Prompt templates reutilizáveis:** Templates de prompt para cada ramo (lógico, emocional, criativo) são versionados e testáveis.
3. **Fallback simples:** Se LangChain/OpenAI falhar, fallback para resposta linear direta. O usuário nunca vê erro.
4. **Contido em 1 arquivo:** Se LangChain se tornar problema, trocar por implementação nativa afeta apenas `langchain-integration.ts`.

## Alternativas Consideradas

- **Fetch() puro** — rejeitado. Exigiria ~200 linhas de código customizado para gerenciar o fluxo multi-ramo.
- **Vercel AI SDK** — rejeitado. Bom para streaming simples, mas não tem suporte nativo a padrões multi-ramo como ToT.

## Consequências

### Positivas
- Pipeline ToT encapsulado e testável
- Fallback transparente para resposta simples
- Templates de prompt versionados

### Negativas
- Dependência externa (LangChain) — mais uma lib para manter atualizada
- Overhead de abstração para casos simples (chat linear sem ToT)

## Evolução Futura

- ToT cross-agent: cada ramo gerado por um agente canônico diferente
- Cache de ramos: reduzir custo reutilizando avaliações similares
