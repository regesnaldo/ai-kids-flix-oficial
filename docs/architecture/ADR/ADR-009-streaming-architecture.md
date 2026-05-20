# ADR-009: Arquitetura de Streaming

## Status
**Accepted** — Maio 2026

## Contexto

O chat com agentes de IA é a feature central do MENTE.AI. Em 2026, usuários esperam respostas instantâneas — ninguém tolera 5 segundos de tela branca enquanto o modelo "pensa".

Streaming (token por token) é o padrão da indústria (ChatGPT, Claude, Gemini). Mas implementar streaming corretamente em Next.js App Router + React envolve decisões não-triviais sobre:
- Transporte (Server-Sent Events vs WebSocket vs ReadableStream)
- Estado do React (como acumular tokens sem re-renderizar 50x por segundo)
- Abort (como parar a geração sem quebrar o estado)

## Decisão

**Server-Sent Events (SSE) via ReadableStream + AbortController no frontend, com indicadores UX progressivos (thinking → streaming → done).**

## Por quê?

1. **SSE é nativo do HTTP:** Diferente de WebSocket, SSE funciona em qualquer CDN, proxy, e serverless platform (Vercel suporta nativamente). Zero configuração extra.

2. **ReadableStream no backend:** A API de chat (`src/app/api/chat/route.ts`) usa `new ReadableStream()` com `controller.enqueue()` para cada token. O pattern é nativo do JavaScript, sem dependências.

3. **AbortController no frontend:** O botão "Parar" cria um `AbortController`. Quando o usuário clica, `controller.abort()` cancela a stream. O React handler captura `AbortError` como caso esperado (não como erro de rede).

4. **Três estados de UX:**
   - **Thinking:** Bolinhas animadas (CSS bounce) — antes do primeiro token
   - **Streaming:** Cursor pulsante `▌` no final do texto — durante o streaming
   - **Done:** Cursor some, mensagem finalizada

5. **Pattern de acumulação eficiente:** Em vez de re-renderizar a cada token, um `useRef` armazena o texto acumulado e um `useState` dispara re-render a cada ~100ms (throttle). Isso reduz renders de ~50/s para ~10/s.

## Alternativas Consideradas

- **WebSocket** — rejeitado. Overkill para streaming unidirecional. Exige infra de WS (não nativo do Vercel serverless). SSE resolve o mesmo problema com HTTP.
- **Polling** — rejeitado. Latência mínima de ~500ms entre polls. Experiência parece "aos trancos", não fluida.
- **Resposta completa (sem streaming)** — rejeitada. 3-8 segundos de espera com tela branca. Inaceitável em 2026.
- **WebTransport** — rejeitado. Muito novo, suporte limitado em browsers e CDNs.

## Consequências

### Positivas
- Primeiro token em < 500ms — sensação de resposta instantânea
- Usuário pode interromper geração a qualquer momento
- Indicadores visuais mantêm o usuário informado do estado
- Throttle de render reduz carga no React

### Negativas
- SSE é单向 (servidor → cliente). Para cancelar, usa-se um segundo request (POST vazio) ou AbortController
- Debugging de stream é mais complexo que request/response tradicional
- Vercel limita funções serverless a 30s (heavy chat routes configuradas para isso)

### Riscos
- Streaming longo (> 30s) pode ser cortado pelo Vercel
- Mitigação: `maxDuration: 30` no `vercel.json` para rotas de chat

## Evolução Futura

- Streaming de áudio (ElevenLabs streaming TTS) simultâneo ao texto
- Modo "resposta rápida" para perguntas simples (stream com modelo mais leve)
- Compressão de tokens repetidos no stream
