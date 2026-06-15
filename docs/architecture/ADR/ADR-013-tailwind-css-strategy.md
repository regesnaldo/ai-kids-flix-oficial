# ADR-013: Estratégia de Estilização — Tailwind CSS 4

## Status
**Accepted** — Maio 2026

## Contexto

O MENTE.AI tem identidade visual cyberpunk forte: fundo `#0a0a1a`, cores neon por agente, glassmorphism, animações Framer Motion. A pergunta era: como implementar esse design system de forma consistente em 56+ páginas?

Três caminhos: CSS Modules (escopo local, sem design system), Styled Components (runtime, pesado), ou Tailwind (utility-first, design system built-in).

## Decisão

**Tailwind CSS 4 como framework de estilização exclusivo.** Zero CSS Modules, zero Styled Components.

## Por quê?

1. **Design system no código:** As cores dos 12 agentes (`#3B82F6` para NEXUS, `#F59E0B` para VOLT...) são configuradas no `tailwind.config`. Usar `text-nexus` em vez de `style={{color: '#3B82F6'}}`.

2. **Tema escuro nativo:** `dark:` prefix em qualquer classe. O MENTE.AI é dark-only, mas Tailwind torna trivial adicionar light mode no futuro.

3. **Bundle zero em produção:** Tailwind 4 usa purging automático. Apenas classes usadas vão para o CSS final. Bundle de CSS ~10KB.

4. **Produtividade:** Sem trocar de arquivo (componente ↔ CSS). Estilização e markup no mesmo lugar. Iteração rápida.

5. **Consistência forçada:** `p-4` é sempre 1rem. `text-lg` é sempre o mesmo tamanho. Sem pixels mágicos espalhados em inline styles.

## Alternativas Consideradas

- **CSS Modules** — rejeitado. Bom para escopo local, mas não oferece design system. Cores, espaçamentos e tipografia seriam variáveis CSS dispersas.
- **Styled Components** — rejeitado. Runtime CSS-in-JS pesa ~12KB, gera CSS em runtime (não em build), não funciona bem com RSC (Server Components).
- **Panda CSS** — rejeitado. Promissor (build-time CSS-in-JS), mas imaturo em 2025-2026. Comunidade pequena.

## Consequências

### Positivas
- 56+ páginas com design 100% consistente
- Zero CSS customizado fora do config
- Animações com Framer Motion (className, não style)
- Dark theme garantido por padrão

### Negativas
- HTML pode ficar verboso (muitas classes em um elemento)
- Curva de aprendizado para devs que preferem CSS tradicional
- Tailwind 4 trouxe breaking changes (config via CSS, não JS)

### Riscos
- Se o design system mudar radicalmente, trocar classes em 56 páginas é trabalhoso
- Mitigação: cores centralizadas no config, componentes reutilizáveis

## Evolução Futura

- Design tokens via CSS custom properties (Tailwind 4 suporta nativamente)
- Temas por agente (cada universo com paleta própria)
