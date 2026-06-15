# ADR-004: Sistema de Memória em 5 Camadas

## Status
**Accepted** — Maio 2026

## Contexto

Em abril de 2026, durante a auditoria de arquitetura, identificamos que o MENTE.AI não tinha memória persistente entre sessões. Cada conversa com um agente recomeçava do zero. O usuário dizia "lembra que eu falei sobre ansiedade?" e o agente respondia como se fosse a primeira interação.

Isso quebrava a premissa central do produto: **relacionamento contínuo entre humano e agente de IA**. Sem memória, não há vínculo. Sem vínculo, não há retenção.

A decisão não era *se* ter memória, mas *qual arquitetura de memória* adotar.

## Decisão

**Sistema de memória em 5 camadas**, inspirado em psicologia cognitiva humana:

```
Identity Profiler → Semantic Memory → Consolidator → Context Priority → Recall
```

Cada camada tem responsabilidade específica e pode evoluir independentemente.

## Por quê?

1. **Inspiração biológica comprovada:** O cérebro humano não armazena tudo. Ele filtra, consolida durante o sono, e recupera por gatilhos emocionais. Replicar esse padrão cria uma experiência mais natural para o usuário.

2. **Separação de responsabilidades:** Cada camada pode ser otimizada, substituída ou desligada sem quebrar as outras. Se o TF-IDF for trocado por embeddings, o Consolidator não muda.

3. **Proteção contra sobrecarga de contexto:** Sem filtro, 100 interações = ~10k tokens no system prompt = custo inviável. A camada Context Priority Engine garante que apenas as 4 memórias mais relevantes (~600 chars) entrem no contexto.

4. **Fire-and-forget no storage:** A camada de armazenamento é assíncrona e não bloqueia a resposta do chat. Se falhar, o usuário não percebe — o chat continua fluindo.

5. **Evolução incremental:** Começamos com TF-IDF (simples, rápido, explicável). Podemos evoluir para embeddings (mais precisos, maior custo) sem reescrever as outras camadas.

## Alternativas Consideradas

- **Memória única (vetor store)** — rejeitada. Colocar tudo em um único vector DB (Pinecone, Chroma) é tentador, mas perde a nuance emocional. "Ansiedade leve" e "crise de pânico" são vetorialmente próximos, mas emocionalmente distantes.
- **Apenas sumarização** — rejeitada. Resumir conversas em parágrafos perde as arestas — as pequenas preferências ("gosto de explicações com analogias") que tornam a experiência pessoal.
- **Memória apenas em localStorage** — rejeitada. Não escala entre dispositivos. A memória precisa ser persistente no servidor.

## Consequências

### Positivas
- Usuário sente continuidade real entre sessões
- Agentes lembram preferências, estado emocional, decisões passadas
- Sistema de Recall Moments cria "surpresas" emocionais quando o agente resgata algo antigo
- Arquitetura modular: trocar uma camada não quebra as outras

### Negativas
- 5 camadas = 5 pontos de falha potencial
- Complexidade de debug: "por que o agente X respondeu Y?" exige tracing em 5 camadas
- Custo de armazenamento: 200 memórias por par (usuário, agente) × 12 agentes × N usuários

### Riscos
- Memórias emocionais sensíveis exigem política de privacidade clara
- Mitigação: TTL de 90 dias, sem dados identificáveis nas memórias

## Evolução Futura

- Trocar TF-IDF por embeddings (OpenAI `text-embedding-3-small`) na camada semântica
- Adicionar "memória compartilhada" entre agentes (um agente sabe o que outro aprendeu)
- Sleep/wake cycle real: consolidação noturna agendada por cron
