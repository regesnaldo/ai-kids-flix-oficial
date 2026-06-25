# PROJECT.md — Regras Invioláveis para MENTE.AI

> Este arquivo é lido pelo Hermes antes de qualquer execução.
> Viola uma regra = loop para imediatamente e escala para Reges.

## Stack Canônica

| Camada | Tecnologia | Proibido |
|---|---|---|
| Framework | Next.js 16 (App Router) | Pages Router, Express |
| Estilo | Tailwind CSS v4 | CSS inline, styled-components |
| Banco | Drizzle ORM + TiDB Cloud | Prisma (permanentemente proibido) |
| Auth | Cookie mente_ai_token | Cookie token ou qualquer outro nome |
| 3D | Three.js / R3F | Three.js em páginas de landing |
| Schema | src/lib/schema.ts | Modificar sem aprovação de Reges |

## Convenções de Código

- Componentes Server Component por padrão
- "use client" só com useState/useEffect
- Funções máx 40 linhas — se passar, extraia
- Sem git add . — sempre arquivos específicos
- Sem push direto para main — tudo via PR
- Sem libs novas sem aprovação
- Variáveis de ambiente: sempre process.env.NOME

## Convenção de Documentação

- Decisão arquitetural → docs/decisions/YYYY-MM-DD-titulo.md
- Loop executado → registrar no HERMES.md ao final
- Nenhuma skill sem seção "Por que funciona"

## Regras do Loop (Agent OS)

### Antes de executar
- [ ] Branch criada
- [ ] Arquivos permitidos listados
- [ ] Gate definido e verificável

### Durante
- [ ] Máximo 3 tentativas por Gate
- [ ] Um arquivo por commit
- [ ] Nunca tocar schema.ts sem aprovação
- [ ] Nunca abrir PR sem Gates verificados

### Após
- [ ] npm run build passa com zero erros
- [ ] PR com título semântico
- [ ] HERMES.md atualizado
- [ ] Reges revisa antes de mergear

## Checklist Humano (Gate Final)

Antes de mergear qualquer PR, Reges responde:
  □ Entendo o que essa mudança faz?
  □ O git diff faz sentido — arquivos esperados?
  □ Vi a página no browser antes de aprovar?
  □ Vercel mostrou ✅ no preview?

Se qualquer □ for NÃO → não mergeie.

## Agentes Canônicos

12 agentes bloqueados:
NEXUS, VOLT, AURORA, ETHOS, KAOS, CIPHER,
LYRA, AXIOM, STRATOS, TERRA, PRISM, JANUS

Fonte de verdade: src/lib/presence.ts
Nenhum agente novo sem decisão arquitetural datada.

## Pipeline Cognitivo Canônico

PRISM (context) →
NEXUS (runtime) →
STRATOS (planejamento) →
[AURORA ∥ TERRA ∥ JANUS ∥ KAOS] (geração paralela) →
LYRA (síntese) →
AXIOM (validação lógica) →
LOGOS (validação epistêmica) →
ETHOS (validação ética) →
Entrega

## Erros Conhecidos e Soluções

| Erro | Arquivo | Solução | PR |
|---|---|---|---|
| @google-cloud/text-to-speech not found | src/app/api/tts/route.ts:36 | npm install @google-cloud/text-to-speech | #249 |
| resetRateLimit Expected 1 arg got 2 | src/lib/llm/rate-limiter.ts:61 | Remover segundo argumento prefixar key | #249 |

## Incidentes — Não Repetir

| Data | Incidente | Causa | Prevenção |
|---|---|---|---|
| Jun 2026 | PR #204 revertido | 24 arquivos modificados | Um agente, um problema |
| Jun 2026 | Hermes scripts no remote | .gitignore incompleto | .hermes/ no .gitignore |
| Jun 2026 | Merge sem revisão visual | Gate humano pulado | Checklist obrigatório |

*ERA 4 Agent OS — Reges (arquiteto) + Hermes (executor) + Claude (juiz)*
