# ADR-003: Estratégia de Autenticação — JWT + Cookies

## Status
**Accepted** — Maio 2026

## Contexto

O MENTE.AI precisava de autenticação para:
- Proteger 30+ API routes
- Suportar sessão persistente (lembrar usuário)
- Funcionar em serverless (sem estado no servidor)
- Ser simples de implementar e auditar

O Next.js App Router oferece múltiplas opções: NextAuth.js, Supabase Auth, Clerk, ou JWT manual. O projeto precisava de algo leve, sem dependência de terceiros, e com controle total sobre o fluxo.

## Decisão

**JWT assinado com `jose` + cookie `mente_ai_token`**. Sem bibliotecas de auth.

## Por quê?

1. **Stateless por natureza:** JWT carrega userId, email, role no payload. Sem consulta ao banco a cada request. Ideal para serverless onde cada função é efêmera.

2. **`jose` é mínimo:** 45KB vs jsonwebtoken (150KB+). Implementa apenas o padrão JWT/JWS, sem dependências. Usado pela Vercel internamente.

3. **Cookie, não localStorage:** Cookies HttpOnly são imunes a XSS. localStorage pode ser lido por qualquer script malicioso injetado.

4. **Sem vendor lock-in:** Trocar JWT por session tokens depois é trivial — a interface (`getSessionUser()`) não muda.

5. **Middleware validation:** O middleware `src/middleware.ts` valida o JWT criptograficamente (não apenas verifica existência do cookie). Isso foi um bug corrigido durante a Fase 0.

## Alternativas Consideradas

- **NextAuth.js / Auth.js** — rejeitado. Excelente para OAuth (Google, GitHub), mas o MENTE.AI usa email/senha. Adiciona ~300KB de deps, overhead de configuração JWT/DB adapter.
- **Clerk** — rejeitado. UI pronta, mas $25/mês após 10k MAU. Vendor lock-in total — trocar de provider quebra toda a UX de login.
- **Supabase Auth** — rejeitado. Exige usar Supabase como banco (somos TiDB). GoTrue é complexo.
- **Sessions em DB** — rejeitado. Exige query a cada request autenticado. Latência extra em serverless.
- **API Keys** — rejeitado. Sem sessão de usuário, sem UX de login.

## Consequências

### Positivas
- Zero dependências externas de auth
- Middleware valida JWT sem tocar no banco
- Cookie HttpOnly + SameSite=Lax = seguro contra XSS e CSRF básico
- `getSessionUser()` unifica acesso ao usuário em qualquer lugar do código

### Negativas
- Sem refresh token (JWT expira = usuário desloga)
- Revogação de token difícil (precisa de blacklist em DB se necessário)
- Sem "login with Google/GitHub" nativo (teria que implementar manualmente)
- Timeout do JWT é fixo (atualmente ~7 dias)

### Riscos
- Se `JWT_SECRET` vazar, todos os tokens são forjáveis
- Mitigação: secret em variável de ambiente, rotação manual

## Evolução Futura

- Adicionar refresh token com rotação (curto prazo)
- Suporte OAuth2 (Google, GitHub) quando usuários pedirem
- Rate limiting por userId extraído do JWT (já implementado parcialmente)
