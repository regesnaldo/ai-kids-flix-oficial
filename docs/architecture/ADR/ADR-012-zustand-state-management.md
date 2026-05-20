# ADR-012: Gerenciamento de Estado — Zustand

## Status
**Accepted** — Maio 2026

## Contexto

O MENTE.AI tem 5 domínios de estado: app (tema, sidebar), usuário (auth, perfil), laboratório (experimentos), universo (agente atual, decisões) e chat (mensagens, streaming).

O ecossistema React oferece dezenas de opções: Redux, Jotai, Recoil, MobX, Context API, Zustand. Cada uma com tradeoffs diferentes entre boilerplate, performance, curva de aprendizado e bundle size.

## Decisão

**Zustand como gerenciador de estado exclusivo.** 5 stores separadas por domínio.

## Por quê?

1. **Minimalismo radical:** Uma store Zustand é uma função. Sem providers, sem reducers, sem actions types. 10 linhas = uma store funcional.

2. **Bundle size:** Zustand pesa ~1KB gzipped. Redux Toolkit pesa ~11KB. Em serverless, cada KB importa.

3. **Sem Provider hell:** Zustand stores são hooks puros. Não precisa envolver a árvore React em `<Provider>`. Isso simplifica o App Router (que já tem Providers do Next.js, Theme, Auth).

4. **Selectors atômicos:** `useAppStore(s => s.theme)` só re-renderiza quando `theme` muda. Performance comparável a Jotai/Recoil sem a complexidade de átomos.

5. **Middleware built-in:** Persist (localStorage), devtools (Redux DevTools),immer (mutabilidade). Sem dependências extras.

## Alternativas Consideradas

- **Redux Toolkit** — rejeitado. Muito boilerplate para o tamanho do time. Actions, reducers, slices, selectors — 5 stores Zustand (50 linhas) virariam 300+ linhas Redux.
- **Jotai** — rejeitado. Excelente para estado atômico, mas 5 stores independentes são mais naturais em Zustand. Jotai brilha com estado derivado complexo (não é nosso caso).
- **Context API puro** — rejeitado. Sem selectors, qualquer mudança re-renderiza toda a árvore. Inviável para chat streaming (50 tokens/segundo).
- **Recoil** — rejeitado. Experimental, desenvolvimento lento, futuro incerto.

## Consequências

### Positivas
- 5 stores em ~150 linhas totais
- Zero boilerplate
- Selectors automáticos (sem `useSelector`, `useMemo`)
- Persistência com middleware de 1 linha

### Negativas
- Menos "padrão de mercado" que Redux (devs novos podem não conhecer)
- Sem estrutura opinativa — liberdade total pode levar a padrões inconsistentes
- Devtools menos maduros que Redux DevTools

### Riscos
- Se o projeto crescer para 20+ stores, organização pode virar problema
- Mitigação: convenção de 1 store por domínio, nomes padronizados

## Evolução Futura

- Se Zustand 5 trouxer breaking changes, migrar stores é barato (~150 linhas)
- Avaliar Jotai para estado derivado complexo (ex: lab experiments)
