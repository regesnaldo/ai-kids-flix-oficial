# SETUP — Stripe + Resend (Local e Producao)

## 1) Desenvolvimento local (Stripe test)

No `.env.local`, use:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Validar variaveis:

```bash
npm run stripe:check-env
```

Observacao: em ambiente local, `pk_test`/`sk_test` sao aceitos.

## 2) Webhook local

Terminal A:

```bash
npm run dev
```

Terminal B:

```bash
stripe login
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

Copie o `whsec_...` mostrado pelo Stripe CLI para o `.env.local`.

## 3) Teste de pagamento local

1. Abrir `/planos`.
2. Escolher `PRÊMIO` ou `FAMILIAR`.
3. Finalizar checkout teste (cartao `4242 4242 4242 4242`).
4. Confirmar redirecionamento para `/sucesso`.
5. Confirmar logs do webhook e atualizacao da assinatura no banco.

## 4) Resend (email de boas-vindas)

Adicionar no `.env.local`:

```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=MENTE.AI <onboarding@seu-dominio.com>
```

Se `RESEND_*` nao estiver configurado, o webhook nao quebra; apenas nao envia email.

## 5) Producao (quando for publicar)

Trocar para chaves live:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

No Vercel: `Settings -> Environment Variables`, adicionar as mesmas chaves em `Production` (e opcionalmente `Preview`/`Development`).

Em producao, `stripe:check-env` exige `pk_live`/`sk_live`.
