# 💳 Stripe — MENTE.AI

> **A catraca digital que controla o acesso às camadas premium da cidade cognitiva.**

---

## 🎯 VISÃO GERAL

O Stripe gerencia o fluxo de pagamentos do MENTE.AI. Quando um usuário decide acessar conteúdo premium, o Stripe é o portal que valida, processa e registra essa transação.

**Status atual:** ⚠️ Modo teste (`pk_test` / `sk_test`). Chaves live pendentes (Fase 6 do roadmap).

---

## 🔄 FLUXO DE PAGAMENTO

```
Usuário clica "Assinar Pro"
        │
        ▼
┌──────────────────────┐
│  Frontend             │
│  POST /api/checkout   │  ← Envia planId
│  { planId: "pro" }    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  /api/checkout        │
│  Cria Checkout Session│
│  no Stripe            │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Stripe Checkout      │  ← Página hospedada pelo Stripe
│  (usuário insere      │
│   dados de pagamento) │
└──────────┬───────────┘
           │
           ├─→ Sucesso → Stripe redireciona para /conta?success=true
           │
           └─→ Cancelado → Stripe redireciona para /planos?canceled=true
                │
                ▼
┌──────────────────────┐
│  Stripe Webhook       │
│  POST /api/webhooks/  │
│  stripe               │
│  Evento: checkout.    │
│  session.completed    │
└──────────┬───────────┘
           │
           ├─→ Verifica assinatura do webhook (stripe-signature)
           │
           ├─→ Atualiza user.plan = 'pro' no banco
           │
           └─→ Responde 200 para Stripe (confirma recebimento)
```

---

## 🏗️ ARQUITETURA DE WEBHOOK

### Por que webhooks?

Pagamentos são **assíncronos**. O usuário pode fechar o browser após pagar, ou o banco pode levar minutos para confirmar. Webhooks garantem que o MENTE.AI **sempre** saiba o estado real da assinatura.

### Eventos tratados

| Evento Stripe | O que faz |
|---------------|-----------|
| `checkout.session.completed` | Ativa assinatura pro |
| `customer.subscription.updated` | Atualiza status (renovação, upgrade) |
| `customer.subscription.deleted` | Cancela acesso premium |
| `invoice.payment_failed` | Notifica usuário sobre falha |

---

## 🔐 SEGURANÇA

### Verificação de assinatura

Todo webhook é verificado criptograficamente:

```typescript
const sig = request.headers.get('stripe-signature');
const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
// Se a assinatura não conferir → 401
```

### Limites de segurança

- **Stripe lida com PCI compliance** — MENTE.AI nunca toca em números de cartão
- **Webhook secret** em variável de ambiente (nunca hardcoded)
- **Idempotência:** Stripe garante que o mesmo evento não é processado 2x

---

## 🔄 CICLO DE VIDA DA ASSINATURA

```
free ─────→ pro (checkout.session.completed)
               │
               ├─→ renovação automática (invoice.paid)
               │
               ├─→ falha de pagamento (invoice.payment_failed)
               │      └─→ usuário tem 7 dias para corrigir
               │
               └─→ cancelamento (subscription.deleted)
                      └─→ free (acesso premium removido)
```

---

## 🚨 RECUPERAÇÃO DE FALHA

| Falha | Recuperação |
|-------|------------|
| Webhook não recebido | Stripe retry com exponential backoff (até 3 dias) |
| Banco de dados offline | Webhook responde 500 → Stripe retry |
| Assinatura inválida | 401 → evento descartado (possível ataque) |
| Usuário já pro | Idempotente — não duplica |

---

## 📋 CHECKLIST DE ATIVAÇÃO (Fase 6)

- [ ] Criar chaves live no dashboard Stripe
- [ ] Configurar `STRIPE_SECRET_KEY` (live) no Vercel
- [ ] Configurar `STRIPE_PUBLISHABLE_KEY` (live) no Vercel
- [ ] Configurar webhook endpoint no dashboard Stripe
- [ ] Testar fluxo completo em staging
- [ ] Criar `STRIPE_WEBHOOK_SECRET` no Vercel
- [ ] Ativar em produção

---

> *"Pagamento não é sobre dinheiro — é sobre acesso. O Stripe é a porta que diz 'sim, você pode entrar'."*
