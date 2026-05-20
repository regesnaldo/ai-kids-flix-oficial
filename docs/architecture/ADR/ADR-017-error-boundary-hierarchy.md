# ADR-017: Hierarquia de Error Boundaries

## Status
**Accepted** — Maio 2026

## Contexto

Em produção, erros são inevitáveis. Uma API falha, um componente quebra, um layout corrompe. A pergunta é: **como o sistema se degrada graciosamente?**

Sem error boundaries, um erro em qualquer componente quebra a página inteira (tela branca). Com error boundaries, o sistema isola o dano e mantém o resto funcional.

## Decisão

**Hierarquia de 4 níveis de Error Boundary + 6 loading states contextuais.**

```
global-error.tsx        ← Nível 4: crash do layout raiz (último recurso)
    ↓
error.tsx               ← Nível 3: fallback do segmento raiz
    ↓
(main)/error.tsx        ← Nível 2: grupo de rotas principal (header preservado)
    ↓
(main)/conta/error.tsx  ← Nível 1: seção específica de conta
```

## Por quê?

1. **Degradação graciosa:** Se `/conta` quebrar, `/universo/nexus` continua funcionando. O erro é contido na sua seção.

2. **Preservação de contexto:** `(main)/error.tsx` mantém o header e nav visíveis. O usuário ainda pode navegar para outras páginas — não fica preso em tela de erro.

3. **Global error como último recurso:** `global-error.tsx` só dispara se o próprio layout raiz quebrar. Define seu próprio `<html>` e `<body>` — não depende de nada.

4. **Identidade visual consistente:** Todos os error boundaries usam tema `#0a0a1a`, glass card, neon cyan. O erro não parece "outro site" — parece parte do MENTE.AI.

5. **`reset()` function:** Cada error boundary oferece botão "Tentar novamente". Não é só "deu erro, atualize a página" — é "deu erro, tente de novo sem perder o contexto".

## Alternativas Consideradas

- **Error boundary único (apenas root)** — rejeitado. Um erro em `/conta` derrubaria `/home`. Degradação total, não graciosa.
- **Error boundary por página (56 error.tsx)** — rejeitado. Overhead de manutenção insano. 4 níveis estratégicos cobrem 56 páginas.
- **Sem error boundaries (try/catch apenas)** — rejeitado. Erros de renderização do React não são capturáveis por try/catch. Error boundaries são a única forma.

## Consequências

### Positivas
- Sistema resiliente: erro em uma seção não afeta outras
- UX de erro consistente com identidade visual
- Botão "Tentar novamente" em todos os níveis
- Erro não parece falha do sistema — parece parte da experiência

### Negativas
- 4 arquivos para manter sincronizados (design, mensagens)
- `global-error.tsx` precisa de HTML/BODY próprio (não herda layout)
- Testar todos os níveis em produção é difícil (simular erros específicos)

### Riscos
- Se `global-error.tsx` também quebrar → tela branca inevitável
- Mitigação: `global-error.tsx` é minimalista, usa inline styles (não depende de CSS modules)

## Evolução Futura

- Error logging contextual (qual boundary disparou, qual rota)
- "Modo de segurança" — se erro persiste após 3 resets, sugere voltar para /home
- Integration com Sentry para tracking de frequência de erros por boundary
