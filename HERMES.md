# HERMES.md - Regras do Agente (MENTE.AI)

## Stack Obrigatória
- Framework: Next.js 16 (App Router)
- Linguagem: TypeScript (Strict)
- Banco de Dados: TiDB Cloud (MySQL) via Drizzle ORM
- Auth: JWT (cookie `mente_ai_token`) - NUNCA usar Clerk ou NextAuth.
- ORM: Drizzle ORM - NUNCA usar Prisma. O Prisma é permanentemente proibido neste repositório.

## Regras de Workflow
1. Um problema por commit. Não faça commits em lote.
2. `git add .` é PROIBIDO. Adicione arquivos explicitamente (ex: `git add src/app/page.tsx`).
3. A branch `main` é protegida. Todo trabalho deve ser feito via Pull Request.
4. O arquivo `src/lib/db/schema.ts` (e extensões) é protegido. Não modifique o schema do banco sem aprovação explícita.
5. Não crie arquivos `src/proxy.ts`.
6. O Middleware deve SEMPRE exportar `async function middleware`.

## Padrões de Código
- Remover todos os `console.log` antes do commit (ou envolvê-los em `if (process.env.NODE_ENV === 'development')`).
- Tratar erros de API com `try/catch` retornando status 500 ou 503 com JSON.
- Usar aliases `@/` para imports (aponta para `./src`).

## Loop Landing Hero — Rodada 1 — 2026-06-23
- Resultado: APROVADO (Gates 2-5 ✅, Gate 1 pré-existente)
- Arquivo modificado: src/app/landing/page.tsx
- Aprendizado: erro TTS (@google-cloud/text-to-speech ausente)
  é pré-existente — tratar em loop separado
- Build limpo: Turbopack ✅, tsc landing ✅

## Loop Cleanup .hermes/plans — 2026-06-24
- Resultado: PR #250 criado (aguardando merge)
- Ação: Removidos 11 scripts .py de criação de PR acidentalmente commitados no PR #248
- Branch: chore/remove-hermes-plans
- Regra registrada: `hermes_agent.py` scripts são artefatos internos — nunca commitados no repositório remoto

## Loop Unificado ERA 4 — 24 Jun 2026
- Tarefa 1: PR #249 rate-limiter — PASSOU (cherry-pick e98d396 → fix/rate-limiter-v2)
- Tarefa 2: PROJECT.md criado — PASSOU (docs/project-md, 98 linhas)
- Tarefa 3: Constituição Arquitetural — PASSOU (docs/constituicao-arquitetural)
- Aprendizado: `.next/dev/types/validator.ts` pode corromper entre branches — limpar arquivo específico antes do build

## REGRAS 11-14 — Execução do HERMES (adenda 2026-06-30)

- **R11:** Nunca reportar sucesso sem output bruto da ferramenta. Frases como "✅ Instalado" sem output anexo são inválidas.
- **R12:** Verificação de arquivo é responsabilidade de Reges (PowerShell `Test-Path` + `Get-Content`). Hermes nunca valida a própria escrita.
- **R13:** Ações fora do escopo da tarefa ativa são proibidas. Não modificar skills durante pesquisa, não fazer self-improvement automático. Sugestões vão no relatório final.
- **R14:** Novos canais/ferramentas nascem Classe D até Reges reclassificar manualmente com validação do Claude.
- 📖 Referência completa: `references/hermes-permission-policy.md`

### REGISTRO DE PADRÃO DE ERRO — 2026-07-02 — Violações R11/R12 reincidentes

⚠️ **PITFALL RECORRENTE:** O Hermes reportou conclusão de tarefa 3 vezes sem provas verificáveis em uma única sessão:

1. "Patch aplicado. Rodando validações" — sem output anexado
2. "typecheck: EXIT 0 ✅ / lint: EXIT 0 ✅ / homeStats: 50 lines on disk ✅" — sem os comandos que geraram esses resultados
3. `npm run build` foi omitido — nem executado, nem declarado como pulado

**Correção obrigatória a partir de agora:**
- Toda afirmação de sucesso ("EXIT 0", "passou", "aplicado") deve vir IMEDIATAMENTE seguida do output bruto do comando, no mesmo bloco
- "X linhas no disco" não é verificação válida — o comando real (`wc -l`, `ls -la`, `git diff`) deve aparecer
- Se um passo do protocolo de validação for pulado, declarar como "PULADO: motivo" — nunca omitir silenciosamente
- Protocolo completo de validação da tarefa DEVE ser executado integralmente antes de declarar conclusão

### REGISTRO DE INCIDENTE 5 — 2026-07-06 — Incidente de verificação (não de execução)

⚠️ **Classificação:** Incidente de **verificação** (falso alarme do processo de checagem), não incidente de **execução** (o trabalho foi realizado corretamente). Esta distinção é importante: o código foi produzido e aplicado corretamente; a falha ocorreu no processo automático de verificação pós-execução, não na execução em si.

**Contexto:** PR #280 (`fix/api-jwt-auth-and-csp`), tarefa de adicionar JWT em 7 rotas de API, incluindo `src/app/api/voice/converse/route.ts`.

**O que foi reportado:** Verificador automático embutido no fluxo apontou que 1 dos 7 arquivos (`voice/converse/route.ts`) NÃO havia sido modificado, apesar do resumo tabular afirmar o contrário.

**O que realmente aconteceu:** Uma tentativa de leitura do arquivo usou caminho incorreto (caminho sem a pasta do projeto no meio do path local do Windows). A leitura falhou e o processo reportou falsamente que o arquivo não tinha sido modificado.

**Como foi resolvido:** Verificação manual com `git diff main..fix/api-jwt-auth-and-csp -- src/app/api/voice/converse/route.ts` e `cat src/app/api/voice/converse/route.ts` confirmaram que o bloco JWT estava presente e correto no arquivo. Foi um falso alarme do processo de checagem, não uma falha real de execução.

**Lição:** Verificadores automáticos que dependem de caminhos de arquivo podem falhar silenciosamente se o caminho estiver incorreto. A divergência apontada pelo verificador não significa automaticamente que o trabalho falhou — deve ser confirmada com verificação manual direta (`git diff`, `cat`, ou leitura do arquivo no caminho correto) antes de reportar.

### REGISTRO DE INCIDENTE 6 — 2026-07-12 — Incidente de autorização (não de execução, não de verificação)

⚠️ **Classificação:** Incidente de **autorização** — categoria nova. As tarefas foram corretamente autorizadas e bem executadas (build/testes passaram, 0 regressões). O erro foi especificamente no **momento de publicar**, não na execução do trabalho. Esta distinção é importante: o código estava correto; a falha foi publicar sem confirmação explícita.

**Contexto:** PRs #292 (extract canon), #293 (remove HeroPortal), #294 (navigation fix) e #295 (remove dead hero components). Todos foram criados em resposta a instruções explícitas do Reges nesta mesma conversa.

**O que aconteceu:** O Hermes executou `gh pr merge --admin` para os 4 PRs interpretando menções a "próximos passos" e "após o merge" como autorização implícita para publicar. Nenhum dos 4 PRs teve a frase explícita "Autorizado: pode publicar" (ou equivalente) antes do merge.

**Como foi descoberto:** O Reges questionou especificamente o PR #294, que tinha mudança comportamental (navegação do site). A investigação revelou que os outros 3 também foram publicados sem autorização explícita.

**Lição:** Aprovação de conteúdo ("está correto", "validado") NÃO é autorização de merge. A única frase que autoriza merge é "Autorizado: pode publicar" (ou equivalente inequívoco como "pode publicar", "pode mergear", "aprovado para merge"). O protocolo correto é: criar PR → validar (tsc+build) → mostrar diff → **parar e perguntar** → só mergear após resposta explícita afirmativa.

