# ADR-005: Recuperação Semântica — TF-IDF

## Status
**Accepted** — Maio 2026

## Contexto

A camada de Semantic Memory do sistema de 5 camadas precisava de um mecanismo para recuperar memórias relevantes. Dado um banco com até 200 memórias por par (usuário, agente), o sistema precisa escolher as top 4 para injetar no contexto do chat (~600 chars, ~150 tokens).

O tradeoff central: **precisão vs custo computacional**. Embeddings são mais precisos, mas exigem chamada de API (custo + latência). TF-IDF é menos preciso semanticamente, mas roda localmente em < 1ms.

## Decisão

**TF-IDF com similaridade de cosseno como mecanismo primário de recuperação semântica.**

## Por quê?

1. **Zero custo operacional:** TF-IDF roda no servidor Node.js sem chamada externa. Nenhum centavo gasto em API de embeddings.

2. **Latência desprezível:** Cálculo de similaridade em < 1ms vs ~200ms de uma chamada de embedding API.

3. **Explicabilidade:** TF-IDF é determinístico. Dá para auditar exatamente por que a memória X foi escolhida ("as palavras 'ansiedade' e 'trabalho' têm peso 0.8 na query"). Embeddings são caixa-preta.

4. **Português funciona bem:** TF-IDF em português brasileiro tem performance comparável ao inglês para textos curtos (memórias são ~180 chars).

5. **MVP pragmático:** A diferença de qualidade entre TF-IDF e embeddings para o caso de uso atual (memórias curtas, domínio específico de saúde mental/educação) é marginal — talvez 5-10% de melhoria, não justificando o custo.

## Alternativas Consideradas

- **OpenAI Embeddings (`text-embedding-3-small`)** — rejeitado para MVP. Custo de $0.02/1M tokens, mas exige chamada de API assíncrona + latência. Será reavaliado quando o volume justificar.
- **Embeddings locais (Transformers.js)** — rejeitado. Modelo de embedding (Xenova/all-MiniLM-L6-v2) pesa ~80MB. Cold start no Vercel seria catastrófico.
- **Busca exata (keyword match)** — rejeitado. "Ansiedade" não recuperaria "nervosismo". Perda semântica muito alta.
- **Pinecone / vector DB** — rejeitado. Overkill para 200 memórias por par. Custo de infra adicional sem ganho proporcional.

## Consequências

### Positivas
- Recuperação instantânea (< 1ms)
- Custo zero
- Totalmente auditável e debugável
- Sem dependência externa

### Negativas
- Não captura sinonímia complexa ("estou pra baixo" vs "tristeza" podem ter similaridade TF-IDF baixa)
- Performance degrada com vocabulário muito amplo
- Exige tokenização e stemming em português (manutenção extra)

### Riscos
- Se o vocabulário dos usuários se expandir muito, recall pode cair
- Mitigação: híbrido TF-IDF + embeddings quando volume justificar

## Evolução Futura

- **Curto prazo:** Adicionar stemming em português (Removedor de Sufixos de Orengo)
- **Médio prazo:** Sistema híbrido: TF-IDF para cold path, embeddings cache para hot path
- **Longo prazo:** Embeddings como camada primária, TF-IDF como fallback
