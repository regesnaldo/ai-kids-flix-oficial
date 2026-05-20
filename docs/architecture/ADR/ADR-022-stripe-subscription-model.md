# ADR-022: Modelo de Assinatura — Stripe Checkout + Webhooks

## Status
**Accepted (modo teste)** — Junho 2026

## Contexto

O MENTE.AI precisava de um sistema de pagamentos para planos premium. Os requisitos: PCI compliance (não tocar em dados de cartão), suporte a assinaturas recorrentes, webhooks para eventos assíncronos, e checkout hospedado (não customizado).

## Decisão

**Stripe Checkout (hospedado) + Webhooks para eventos de assinatura.** Aplicação nunca toca em dados de cartão. Stripe gerencia toda a parte PCI.

## Por quê?

1. **PCI compliance delegada:** Stripe lida com certificação PCI DSS. O MENTE.AI nunca armazena ou processa números de cartão.
2. **Checkout hospedado:** Página de pagamento é do Stripe — design responsivo, suporte a PIX, boleto e cartão no Brasil.
3. **Webhooks para estado real:** Assinaturas são assíncronas (banco pode demorar para confirmar). Webhooks garantem que o sistema sempre sabe o estado real.
4. **Cliente Stripe já incluído:** `stripe` npm package (~500KB) já está no projeto. Sem dependência nova.
5. **Modo teste gratuito:** Desenvolvimento e teste sem custo. Chaves `pk_test` / `sk_test` ilimitadas.

## Alternativas Consideradas

- **Stripe Elements (customizado)** — rejeitado para MVP. Exige construir UI de pagamento. Checkout hospedado é mais rápido e seguro.
- **Mercado Pago** — rejeitado. Popular no Brasil, mas API menos madura, documentação inferior, sem suporte nativo a assinaturas recorrentes no nível do Stripe.
- **Pagar.me** — rejeitado. Foco em e-commerce, não em SaaS/assinaturas.

## Consequências

### Positivas
- Zero código PCI (dados de cartão nunca passam pelo servidor)
- Checkout em português com métodos brasileiros (PIX, boleto)
- Webhooks robustos com retry automático

### Negativas
- Dependência do Stripe (vendor lock-in moderado)
- Taxa de ~3.99% + R$2 por transação no Brasil
- Chaves ainda em modo teste (live pendente)

## Evolução Futura

- Customer Portal para usuários gerenciarem assinatura
- Planos anuais com desconto
- Métricas de conversão e churn no dashboard
