# ADR-014: Plataforma de Deploy — Vercel

## Status
**Accepted** — Maio 2026

## Contexto

O MENTE.AI é um app Next.js. O deploy natural seria Vercel (criadora do Next.js), mas outras opções existem: AWS (ECS/Amplify), Railway, Fly.io, Cloudflare Pages. A decisão afeta latency, custo, DX e integrações nativas.

## Decisão

**Vercel como plataforma de deploy exclusiva.** Região `gru1` (São Paulo).

## Por quê?

1. **Next.js nativo:** Vercel criou Next.js. Funcionalidades como ISR, streaming, edge functions e Server Components funcionam sem configuração. Em outras plataformas, exigem workarounds.

2. **Região São Paulo (gru1):** Latência < 50ms para usuários brasileiros. TiDB Cloud também está em SP → latência API↔DB < 5ms.

3. **Serverless com cold start otimizado:** Vercel otimiza cold starts de Next.js especificamente. Nosso build de 52s é razoável para a plataforma.

4. **Preview deployments:** Cada PR gera URL única. Testar features em produção-like sem ambiente separado. Essencial para time pequeno.

5. **Integração GitHub nativa:** Push na branch → deploy automático. Sem configurar CI/CD de deploy separado.

## Alternativas Consideradas

- **AWS (Amplify / ECS)** — rejeitado. Next.js funciona, mas sem otimizações nativas. Cold starts piores. Custo de infra maior. Complexidade de VPC, security groups.
- **Railway** — rejeitado. Excelente DX, mas servidores nos EUA (latência > 150ms para BR). Sem região SP.
- **Fly.io** — rejeitado. Bom para apps stateful, mas Next.js serverless não é o caso de uso ideal. Região SP disponível, mas configuração manual.
- **Cloudflare Pages** — rejeitado. Next.js suporte limitado (sem ISR completo, sem middleware como Vercel).

## Consequências

### Positivas
- Deploy automático (git push → produção em 2 min)
- Preview deployments por PR
- Analytics e logs integrados
- HTTPS + CDN automáticos
- Headers de segurança via `vercel.json`

### Negativas
- Vendor lock-in: migrar da Vercel exige adaptar ISR, middleware, edge functions
- Custo pode escalar com tráfego (serverless pricing)
- Cold starts em rotas pouco usadas (~200ms)

### Riscos
- Se Vercel aumentar preços, migração é custosa
- Mitigação: app é Next.js padrão (sem APIs proprietárias Vercel)

## Evolução Futura

- Edge Functions para rotas críticas (auth, rate limiting)
- Vercel KV para cache de memórias quentes
- Vercel Cron Jobs para consolidação noturna de memória
