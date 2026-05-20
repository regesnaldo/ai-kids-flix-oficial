# ADR-019: Arquitetura de Cenas — Three.js + Dynamic Loading

## Status
**Accepted** — Junho 2026

## Contexto

Com 12 agentes canônicos, cada um precisava de uma cena 3D imersiva para seu universo. Carregar 12 cenas Three.js no bundle inicial custaria ~500KB — inaceitável para performance.

O projeto precisava de uma arquitetura onde cenas fossem carregadas sob demanda, sem pesar no primeiro paint.

## Decisão

**Dynamic import + React Three Fiber com lazy loading universal.** `DynamicScene.tsx` atua como carregador único para as 12 cenas. Cada cena é um named export, carregada via `next/dynamic` com `ssr: false`.

## Por quê?

1. **Bundle splitting automático:** Cada cena é um chunk separado. O bundle inicial não inclui Three.js se o usuário não visita um universo.
2. **SSR seguro:** `ssr: false` evita quebras no servidor (Three.js precisa de WebGL, que só existe no browser).
3. **Loading state unificado:** O carregador mostra um spinner dual-ring (cyan/purple) enquanto a cena carrega (~200ms).
4. **Named exports:** Cada cena exporta um componente nomeado (ex: `export function AuroraScene`), permitindo um mapa simples de string → componente.

## Alternativas Consideradas

- **Import estático das 12 cenas** — rejeitado. 500KB no bundle inicial. Lighthouse score degradado.
- **Iframe por cena** — rejeitado. Perde integração React, difícil de sincronizar estado.
- **Canvas global único** — rejeitado. Cenas são atmosferas diferentes — precisam de isolamento.

## Consequências

### Positivas
- ~500KB removidos do bundle inicial
- Cenas isoladas: vazamento de memória em uma não afeta outras
- Spinner contextual durante carregamento

### Negativas
- 12 arquivos para manter (1 por cena)
- `ssr: false` significa que crawlers não "veem" a cena (SEO não afetado — cenas são decorativas)
- Debugging de carregamento dinâmico mais complexo

## Evolução Futura

- Preload de cenas prováveis (ex: se usuário está na home, pre-carregar NEXUS)
- Web Workers para animações pesadas não travarem a UI thread
