# Constituição Arquitetural — MENTE.AI
**Data:** 2026-06-24
**Status:** Aprovada
**Versão:** 1.0

## Contexto
NEXUS acumulava responsabilidades de runtime, personagem,
planeta, interface e orquestrador simultaneamente.
Isso viola o princípio: uma entidade não deve ser
simultaneamente infraestrutura e domínio de negócio.

## Decisão

### Separação canônica
NEXUS = Runtime (infraestrutura)
12 agentes = Domínio cognitivo

### Responsabilidades por agente
| Agente | Responsabilidade única |
|--------|----------------------|
| NEXUS | Runtime — orquestração de infraestrutura |
| PRISM | Context Provider — perfil do aluno |
| STRATOS | Planejamento estratégico |
| AURORA | Geração — despertar de potenciais |
| TERRA | Geração — base e estabilidade |
| JANUS | Geração — perspectivas duais |
| KAOS | Geração — caos criativo |
| LYRA | Síntese harmônica |
| AXIOM | Validação lógica |
| LOGOS | Validação epistêmica (verdade) |
| ETHOS | Validação ética |
| VOLT | Energia e velocidade de execução |
| CIPHER | Decifração de padrões |

### Cadeia de validação
AXIOM → Está logicamente correto?
LOGOS → Está epistemicamente correto?
ETHOS → Deve ser permitido?

## Consequências
- Reduz acoplamento conceitual
- PRISM atua antes de STRATOS como context provider
- LOGOS separado de AXIOM e ETHOS — três perguntas distintas
- Base sólida para o runtime cognitivo ERA 4+

## Pendências Fase 2
- Governança de memória: quem é o dono?
- PRISM: confirmar se agente cognitivo ou puro provider

## Score
Arquitetura anterior: 6.5/10
Após constituição: 9.0/10

## Referência
ERA 4 — Jun 2026
Aprovada por: Reges (arquiteto)
Validada por: Claude (juiz)
