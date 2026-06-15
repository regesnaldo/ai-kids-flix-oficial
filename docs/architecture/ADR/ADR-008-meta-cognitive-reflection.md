# ADR-008: Reflexão Meta-Cognitiva

## Status
**Accepted** — Maio 2026

## Contexto

Agentes de IA tradicionais respondem, mas não *pensam sobre como responderam*. Isso cria três problemas:

1. **Loop de repetição:** O agente não percebe que já deu a mesma explicação 3 vezes
2. **Falta de adaptação:** O agente não ajusta seu tom baseado no feedback implícito do usuário
3. **Zero autoconhecimento:** O agente não sabe o que sabe ou não sabe sobre o usuário

Para um produto que se propõe a criar relacionamento, a ausência de auto-reflexão é fatal — é como conversar com alguém que nunca aprende com as conversas passadas.

## Decisão

**Sistema de Reflexão Meta-Cognitiva — um ciclo assíncrono pós-resposta onde o agente avalia sua própria performance e ajusta comportamento futuro.**

## Por quê?

1. **Auto-correção sem supervisão humana:** O sistema detecta padrões negativos (repetição, evasão, tom inadequado) e ajusta parâmetros sem intervenção do desenvolvedor.

2. **Reflexão inspirada em psicologia:** O modelo segue o ciclo de Kolb (Experiência → Observação → Conceitualização → Experimentação):
   - O agente interage (Experiência)
   - O sistema analisa a resposta (Observação)
   - Gera um "insight" sobre o que funcionou ou não (Conceitualização)
   - Ajusta o tom/estilo para a próxima interação (Experimentação)

3. **Três dimensões de reflexão:**
   - **Qualidade:** A resposta foi útil? Engajou o usuário?
   - **Consistência:** A resposta contradiz algo dito antes?
   - **Afinidade:** O tom combinou com o perfil do usuário?

4. **Assíncrono e silencioso:** A reflexão acontece DEPOIS da resposta, em background. O usuário nunca espera. Se falhar, a UX não é afetada.

5. **Memória da reflexão:** Insights são armazenados como "meta-memórias" — o agente literalmente "lembra que da última vez explicou rápido demais e o usuário pediu mais detalhes".

## Alternativas Consideradas

- **Reflexão síncrona (pensar antes de responder)** — rejeitada. Adiciona latência perceptível. Usuário esperando 3 segundos enquanto o agente "pensa sobre pensar" é experiência ruim.
- **Apenas feedback explícito ("isso foi útil?")** — rejeitado. Usuários raramente dão feedback. Depender disso significa nunca aprender.
- **A/B testing manual** — rejeitado. Escala de 12 agentes × variações de tom = inviável testar manualmente.

## Consequências

### Positivas
- Agentes melhoram com o tempo sem intervenção humana
- Redução de loops de repetição
- Adaptação de tom por usuário (personalização real)
- Zero latência adicional para o usuário

### Negativas
- Complexidade de implementação: 3 dimensões de reflexão com scoring
- Meta-memórias consomem espaço adicional (~10% do storage de memória)
- Difícil de testar: comportamento emerge ao longo de dezenas de interações

### Riscos
- Overfitting: agente pode ficar "viciado" no estilo que funcionou uma vez
- Mitigação: decay factor nas meta-memórias, reavaliação periódica

## Evolução Futura

- Reflexão cross-agent: NEXUS aprende algo sobre o usuário e compartilha com VOLT
- "Modo professoral": agente detecta que usuário está aprendendo e adapta explicações
- Dashboard de reflexão para desenvolvedores: visualizar padrões de adaptação
