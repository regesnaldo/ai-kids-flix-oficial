# 🧪 Guia de Testes — MENTE.AI

## Tipos de Testes

### Unitários (Jest + React Testing Library)
- **Foco:** Testar componentes isolados e lógica pura.
- **Localização:** `src/**/*.test.tsx` ou `src/**/*.test.ts`.
- **Comando:** `npm run test`
- **Watch Mode:** `npm run test:watch`

### Integração / E2E (Playwright)
- **Foco:** Testar fluxos completos do usuário no navegador.
- **Localização:** `tests/e2e/*.spec.ts`.
- **Comando:** `npm run test:e2e`
- **Interface UI:** `npm run test:e2e:ui`

### Arquitetura (Madge)
- **Foco:** Validar dependências circulares e hot spots.
- **Comando:** `npm run arch:validate`

---

## Execução Local

```bash
# Executar todos os testes (Unitários + E2E)
npm run test:all

# Gerar relatório de cobertura
npm run test:coverage
```

---

## Boas Práticas

1. **Nomeação:** Mantenha os testes unitários junto ao arquivo de origem (ex: `Button.tsx` -> `Button.test.tsx`).
2. **Mocks:** Use o `jest.setup.js` para mocks globais (Router, Audio API).
3. **E2E:** Garanta que o servidor esteja rodando ou use o `webServer` automático do Playwright.
4. **CI/CD:** Todos os PRs rodam automaticamente a suíte de testes no GitHub Actions.

---

## Adicionando Novos Testes

- **Componente:** Use `render` e `screen` do `@testing-library/react`.
- **Página E2E:** Use `page.goto()` e seletores `page.getBy...`.
- **Snapshot:** Evite snapshots excessivos; prefira asserções funcionais.

---
*Documentação gerada por TRAE Build — Sistema de Qualidade MENTE.AI*
