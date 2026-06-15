# ADR-011: Escolha do Framework — Next.js App Router

## Status
**Accepted** — Maio 2026

## Contexto

Em 2025, quando o MENTE.AI começou, o Next.js oferecia duas abordagens: Pages Router (estável, maduro) e App Router (novo, com React Server Components). O projeto precisava decidir em qual paradigma construir.

A decisão não era trivial: App Router era o futuro evidente, mas tinha bugs, documentação imatura e breaking changes frequentes. Muitos projetos grandes ficaram no Pages Router.

## Decisão

**Next.js App Router como framework exclusivo.** Zero uso de Pages Router.

## Por quê?

1. **React Server Components (RSC):** App Router é a única forma de usar RSC. Componentes server-side reduzem JS enviado ao browser — crítico para um app com 12 cenas Three.js pesadas.

2. **Layouts aninhados:** App Router permite `layout.tsx` que persiste entre navegações. O layout `(main)/layout.tsx` com nav+header é compartilhado por 56+ páginas sem re-render.

3. **Route Groups `(main)`:** Permite organizar rotas em grupos lógicos sem afetar a URL. `/home`, `/universo/nexus`, `/conta` compartilham layout mas têm URLs limpas.

4. **Streaming nativo:** `loading.tsx` com Suspense boundaries. Cada página tem seu próprio loading state contextual — impossível no Pages Router.

5. **Futuro garantido:** Vercel investe 100% no App Router. Pages Router está em manutenção. Construir no legado seria dívida técnica desde o dia 1.

## Alternativas Consideradas

- **Pages Router** — rejeitado. Mais estável, mas sem RSC, sem layouts aninhados, sem streaming nativo. Ficar no passado por medo do novo.
- **Remix** — rejeitado. Excelente para apps tradicionais, mas ecossistema menor, sem RSC nativo, deploy principal é Fly.io (não Vercel).
- **SvelteKit** — rejeitado. Equipe tem expertise em React. Reescrever 120 agentes em Svelte seria inviável.

## Consequências

### Positivas
- 12 cenas Three.js com lazy loading (dynamic import + ssr:false)
- 6 loading states contextuais (um por seção)
- Layout persistente entre navegações (nav não pisca)
- Build com code splitting automático

### Negativas
- Curva de aprendizado íngreme ('use client' vs 'use server')
- Bugs de hidratação (Math.random em useMemo)
- Documentação oficial ainda incompleta em 2025-2026
- Breaking changes entre versões (13 → 14 → 15 → 16)

### Riscos
- App Router ainda evolui rapidamente — cada upgrade de versão requer testes
- Mitigação: ficar 1 versão atrás da latest, testar em staging antes de produção

## Evolução Futura

- Turbopack quando estabilizar (atualmente quebra no WSL)
- Partial Prerendering (PPR) quando sair de experimental
- Server Actions para formulários (substituir API routes simples)
