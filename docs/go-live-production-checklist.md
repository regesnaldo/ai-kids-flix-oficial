# Go-Live Production Checklist (Stripe + Resend + Vercel)

## 1) Stripe em modo Live

1. No Stripe Dashboard, ativar `Live mode`.
2. Em `Developers -> API keys`, copiar:
   - `pk_live_...`
   - `sk_live_...`
3. Em `Developers -> Webhooks`, criar endpoint de producao:
   - `https://seu-dominio.com/api/webhooks/stripe`
4. Selecionar eventos necessarios (minimo):
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copiar o `Signing secret` desse endpoint.
   - Deve comecar com `whsec_...`
   - Importante: usar o `whsec_` do endpoint de producao (nao usar o do Stripe CLI local).

## 2) Resend (email real)

1. Criar `RESEND_API_KEY` de producao (`re_...`).
2. Verificar dominio de envio na Resend.
3. Definir remetente real, por exemplo:
   - `MENTE.AI <onboarding@seu-dominio.com>`

## 3) Variaveis no Vercel

Em `Vercel -> Project -> Settings -> Environment Variables`, cadastrar:

1. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...`
2. `STRIPE_SECRET_KEY = sk_live_...`
3. `STRIPE_WEBHOOK_SECRET = whsec_...`
4. `RESEND_API_KEY = re_...`
5. `RESEND_FROM_EMAIL = MENTE.AI <onboarding@seu-dominio.com>`

Aplicar em:

1. `Production`
2. `Preview` (opcional, recomendado)
3. `Development` (opcional, recomendado)

## 4) Redeploy na Vercel

1. Abrir `Deployments`.
2. Selecionar o deploy mais recente.
3. Clicar em `Redeploy`.
4. Confirmar que o redeploy terminou sem erro.

## 5) Validacao E2E em producao

1. Abrir pagina de planos em producao.
2. Iniciar checkout de `PREMIO` ou `FAMILIAR`.
3. Fazer compra real de baixo valor (recomendado para validar ponta a ponta).
4. Confirmar redirecionamento para `/sucesso`.
5. Verificar no Stripe:
   - pagamento aprovado
   - assinatura criada
6. Verificar webhook:
   - evento recebido com status 2xx
7. Verificar banco:
   - `subscriptionPlan` atualizado
   - `subscriptionStatus` atualizado
   - `stripeCustomerId` e `stripeSubscriptionId` preenchidos
8. Verificar email:
   - mensagem de boas-vindas entregue (caixa principal ou spam)

## 6) Validacao de cancelamento/downgrade

1. No Stripe, cancelar assinatura de teste real.
2. Confirmar evento `customer.subscription.deleted`.
3. Confirmar no banco:
   - plano volta para `FREE`
   - status ajustado para `canceled`
4. Testar troca de plano (upgrade/downgrade) e confirmar `customer.subscription.updated`.

## 7) Monitoramento inicial de conversao

Confirmar logs/eventos do funil:

1. `page_view`
2. `sign_up`
3. `paywall_hit`
4. `purchase`

## 8) Checklist rapido de seguranca

1. Nao expor `sk_live_...` em frontend.
2. Manter segredos apenas em env vars servidor/Vercel.
3. Revisar permissoes de acesso ao dashboard Stripe/Resend.
4. Validar HTTPS ativo no dominio final.
