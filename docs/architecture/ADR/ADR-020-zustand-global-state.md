# ADR-020: Estratégia de Estado Global — 5 Stores Independentes

## Status
**Accepted** — Junho 2026

## Contexto

O MENTE.AI precisava gerenciar estado em 5 domínios distintos (app, usuário, laboratório, universo, orquestração). A pergunta era: um store global monolítico ou stores separadas por domínio?

Um store único seria mais simples de descobrir, mas causaria acoplamento indevido. Stores separadas exigem disciplina de design, mas garantem isolamento.

## Decisão

**5 stores Zustand independentes, uma por domínio.** Sem store global. Cada domínio é dono exclusivo dos seus dados.

## Por quê?

1. **Separação de responsabilidades:** `useUserStore` não precisa saber sobre experimentos do `useLabStore`. Isolamento previne bugs cross-domain.
2. **Selectors atômicos por store:** Cada componente assina apenas a store que precisa. Se `useLabStore` muda, componentes que só usam `useUserStore` não re-renderizam.
3. **Persistência seletiva:** `useUserStore` persiste em localStorage (auth). `useLabStore` não persiste (experimentos são efêmeros).
4. **Testabilidade:** Cada store pode ser testada isoladamente, sem mockar as outras.

## Alternativas Consideradas

- **Store global única** — rejeitada. Violaria separação de responsabilidades. Mudança no lab causaria re-render na home.
- **Context API por domínio** — rejeitada. Sem selectors, qualquer mudança re-renderiza toda a sub-árvore.
- **Redux Toolkit com slices** — rejeitada. Muito boilerplate para 5 domínios (~300 linhas vs ~150 do Zustand).

## Consequências

### Positivas
- Isolamento total entre domínios
- Persistência seletiva (só auth persiste)
- 150 linhas totais para 5 stores

### Negativas
- Novo dev precisa descobrir qual store usar (resolvido com documentação)
- Sem comunicação automática entre stores (intencional — usar hooks personalizados para cross-store logic)

## Evolução Futura

- Se surgir domínio 6, o padrão escala trivialmente (nova store, 30 linhas)
