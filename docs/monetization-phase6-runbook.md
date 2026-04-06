# Fase 6 — Monetizacao (Stripe + Webhook + Email + Funil)

## 1) Chaves reais (local + Vercel)

Atualize `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... # gerado pelo Stripe CLI ou endpoint de producao
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=MENTE.AI <onboarding@seu-dominio.com>
```

Valide:

```bash
npm run stripe:check-env
```

No Vercel, adicione as mesmas variaveis em `Development`, `Preview` e `Production`.

## 2) Rodar app + listener de webhook

Terminal A:

```bash
npm run dev
```

Terminal B (Stripe CLI):

```bash
stripe login
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

Copie o `whsec_...` exibido e coloque em `STRIPE_WEBHOOK_SECRET`.

## 3) Teste E2E de pagamento

1. Abrir `http://localhost:3000/planos`.
2. Clicar em `PRÊMIO` ou `FAMILIAR`.
3. Concluir checkout.
4. Confirmar redirecionamento para `/sucesso`.

Verificacoes:

1. Webhook recebeu `checkout.session.completed`.
2. Tabela `users` atualizou `subscriptionPlan`, `subscriptionStatus`, `stripeCustomerId`, `stripeSubscriptionId`.
3. Email de boas-vindas enviado (Resend).
4. Eventos de funil no log: `page_view`, `sign_up`, `paywall_hit`, `purchase`.

## 4) Query TiDB para validar assinatura

```bash
mysql --ssl-mode=REQUIRED \
  -h gateway01.us-east-1.prod.aws.tidbcloud.com \
  -P 4000 \
  -u Xp3F88Yn4YRQBSX.root \
  -p test \
  -e "SELECT id,email,subscriptionPlan,subscriptionStatus,stripeCustomerId,stripeSubscriptionId,subscriptionEndDate FROM users ORDER BY id DESC LIMIT 20;"
```

## 5) Cancelamento / downgrade

1. No Stripe Dashboard, cancele ou troque o plano da assinatura.
2. Validar webhook `customer.subscription.updated`/`customer.subscription.deleted`.
3. Confirmar em TiDB:
   - cancelado -> `subscriptionPlan=FREE`, `subscriptionStatus=canceled`
   - alterado -> `subscriptionPlan` refletindo o novo price id

## 6) Alerta do primeiro pagamento

No Stripe Dashboard:

1. `Developers` -> `Events` / `Notifications`.
2. Criar alerta para evento `checkout.session.completed`.
3. Enviar para email do time de produto.

## 7) Tabela semanal de conversao (operacao)

Campos sugeridos:

1. Semana
2. page_view
3. sign_up
4. paywall_hit
5. purchase
6. CVR signup/page_view
7. CVR purchase/paywall_hit
