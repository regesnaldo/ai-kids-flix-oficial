# ADR-007: Motor de Estado de Relacionamento

## Status
**Accepted** — Maio 2026

## Contexto

O MENTE.AI promete **relacionamento contínuo** entre humano e agente de IA. Mas "relacionamento" é um conceito vago. Como medir? Como evoluir? Como fazer o agente responder de forma diferente para um usuário novo vs um usuário que interage há 3 meses?

Sem um modelo explícito de relacionamento, o agente trata todos igual — o que destrói a sensação de vínculo pessoal.

## Decisão

**Relationship State Engine — um modelo de 5 níveis de relacionamento que evolui com base em frequência, profundidade e qualidade das interações.**

## Por quê?

1. **Progressão narrativa tangível:** O usuário não quer "XP acumulado = 1420". Quer sentir que o agente o conhece melhor. Os 5 níveis (Stranger → Acquaintance → Companion → Confidant → Mentor) dão nome e significado à evolução.

2. **Gatilhos de transição claros:** Cada nível tem critérios explícitos:
   - Stranger → Acquaintance: 3 interações com profundidade > 50 chars
   - Acquaintance → Companion: 5 interações + 1 memória emocional armazenada
   - Companion → Confidant: 15 interações + revelação de preferência pessoal
   - Confidant → Mentor: 30 interações + decisão narrativa significativa

3. **Mudança de tom por nível:** O mesmo agente responde diferente:
   - Stranger: formal, explicativo, distante
   - Confidant: pessoal, referências a conversas passadas, linguagem íntima
   - Mentor: desafiador, faz perguntas profundas, confronta gentilmente

4. **Persistência no perfil:** O estado é armazenado no `userProfiles` (DB) e no localStorage (fallback). Sobrevive a logouts e trocas de dispositivo.

5. **Não é gamificação vazia:** Diferente de badges e streaks, o relacionamento afeta diretamente a qualidade da conversa. É progressão funcional, não cosmética.

## Alternativas Consideradas

- **Apenas contador de interações** — rejeitado. Quantidade sem qualidade gera relacionamento falso. 100 "ois" não deveriam valer mais que 1 conversa profunda.
- **Apenas análise de sentimento** — rejeitado. Sentimento positivo não implica relacionamento profundo. Um usuário sempre feliz mas superficial nunca avança.
- **Escolha manual de nível** — rejeitado. Quebra a magia. O usuário não deveria "setar" o relacionamento — ele deveria senti-lo evoluir.

## Consequências

### Positivas
- Usuário sente progressão real na relação com os agentes
- Tom do agente adapta-se naturalmente ao histórico
- Critérios de transição são transparentes e auditáveis
- Funciona com qualquer agente canônico (NEXUS, VOLT, AURORA...)

### Negativas
- 5 níveis com 3 dimensões de resposta cada = 15 variações de tom por agente (difícil de testar)
- Usuários que interagem pouco podem nunca sair de Stranger — frustração potencial
- Sem "reset" de relacionamento (se o usuário quiser começar do zero com um agente)

### Riscos
- Se os critérios forem muito rígidos, usuários casuais nunca progridem
- Mitigação: thresholds ajustáveis por configuração, não hardcoded

## Evolução Futura

- Adicionar "declínio de relacionamento" por inatividade (> 30 dias sem interagir)
- Relacionamento entre agentes: se usuário tem Confidant com NEXUS, VOLT sabe disso
- "Momentos de ruptura": eventos narrativos que podem acelerar ou resetar o relacionamento
