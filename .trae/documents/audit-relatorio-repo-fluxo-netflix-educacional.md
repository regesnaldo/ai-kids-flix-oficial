# Audit Report — Repo (Fluxo educacional estilo Netflix)

## 1) Objetivo
Auditar o estado atual do repo para suportar um fluxo “Netflix-style” (catálogo → detalhe → player → progresso), **com mudanças mínimas**, **reuso de componentes** e **preservando rotas já em funcionamento**.

## 2) Inventário de rotas (App Router)
### Rotas-chave de aprendizado (core)
- "/" → redireciona para "/home" (RootPage)
- "/home" (Home Netflix-like, implementada inline)
- "/aulas" (catálogo por fases/temporadas/episódios)
- "/player?episode=..." (player + quiz/“sincronia” + persistência local)
- "/explorar" (biblioteca/exploração)
- "/agentes" e "/agentes/[id]" (mentores/agentes)

### Rotas de acesso/conta
- "/login", "/logout", "/onboarding"
- "/planos", "/sucesso"
- "/perfil", "/perfis"
- "/conta" e subrotas (visão geral/segurança/plano/pagamento/...)

### Rotas com potencial de inconsistência
- Link para "/laboratorio" existe na Home "/home", mas não há página encontrada sob src/app/**/laboratorio.

## 3) Componentes existentes que já suportam “Netflix UI”
Há um conjunto de componentes prontos que **não são a Home ativa** hoje:
- Home composta por componentes: HeroBanner + AgentRow + modais (em src/app/(main)/page.tsx)
- Componentes de estilo Netflix: src/components/netflix/* (ex.: Billboard, InfiniteRow, ProfileGate)
- Componentes home reutilizáveis: src/components/home/* (ex.: HeroBanner, AgentRow, AgentDetailModal)

## 4) Achados (riscos e oportunidades)
1. **Duplicidade de Home**
   - A rota ativa é "/home" (src/app/(main)/home/page.tsx) com muita UI inline.
   - Existe outra Home (src/app/(main)/page.tsx) que já usa componentes reutilizáveis, mas fica “invisível” porque "/" redireciona para "/home".
   - Risco: manutenção duplicada, estilos divergentes, features repetidas.

2. **Rota possivelmente quebrada: "/laboratorio"**
   - CTA na Home aponta para "/laboratorio", mas não há página correspondente.
   - Risco: quebra no funil (Home → Lab).

3. **Inconsistência de organização de UI**
   - Há pastas e naming misturados (ex.: src/components vs src/componentes).
   - A Home "/home" usa muitos estilos inline; outras telas usam Tailwind.
   - Risco: UI/UX fragmentada e difícil de padronizar.

4. **Preservação de rotas (requisito do usuário)**
   - O repo já tem uma árvore rica de rotas; mexer em rotas pode gerar regressões.

## 5) Recomendações (mínimas, com reuso)
### Prioridade P0 (sem quebrar rotas)
- **Manter "/home" como rota canônica**, mas **refatorar internamente** para reutilizar:
  - src/components/home/* (HeroBanner, AgentRow, AgentDetailModal)
  - e/ou src/components/netflix/* (Billboard/InfiniteRow), se preferir UX mais “Netflix puro”.
- **Tratar CTA de "/laboratorio"** sem criar nova rota agora:
  - Opção A (mais segura): esconder/desabilitar CTA até existir página.
  - Opção B (mínima): apontar para uma rota existente equivalente (ex.: "/universo/nexus" se isso for o “lab”).

### Prioridade P1 (padronização incremental)
- Migrar estilos inline da Home "/home" para tokens/classes (Tailwind), mantendo o layout.
- Consolidar “UI primitives” (botões, cards, modal) para reduzir variações.

## 6) “Home sections” observadas / recomendadas (baseadas no que já existe)
- Header fixo + navegação global
- Hero/Billboard (destaque principal + CTA)
- Fileiras (rows) horizontais:
  - "Populares"
  - "Destaques da semana"
  - "Continue assistindo" (ligado ao progresso)
  - "Recomendados"
- CTA de exploração (ex.: entrar no Lab — **somente se rota existir**)

## 7) Critérios de aceite do audit (para guiar mudanças mínimas)
- Nenhuma rota atual deixa de existir (especialmente "/home", "/aulas", "/player").
- Mudanças concentradas em composição/extração de componentes.
- Reuso explícito de componentes existentes antes de criar novos.
