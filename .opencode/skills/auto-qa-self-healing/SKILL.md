---
name: auto-qa-self-healing
description: "Executa QA automatizado após qualquer implementação, refatoração ou correção de código. Simula usuário real testando Home, Navbar, agente, universo, laboratório e demais rotas do MENTE.AI. Corrige problemas encontrados e repete o ciclo até zero erros ou regressões. Use APÓS qualquer alteração em src/ — build, typecheck, API routes, componentes, páginas."
---

# AUTO-QA-SELF-HEALING (SKILL-001)

## Objetivo

Após qualquer alteração em `src/`, executar um ciclo completo de:

1. Build + typecheck
2. Teste de rotas (simulando usuário real)
3. Identificação e correção de problemas
4. Repetição até zero erros

---

## Ciclo de QA

### Passo 1 — Build

```powershell
cd <project_root>
npm run build 2>&1
```

Se falhar:
- Identificar o erro exato
- Corrigir
- Rebuildar
- Repetir até `Compiled successfully`

### Passo 2 — Typecheck

```powershell
npx tsc --noEmit 2>&1
```

Se houver erro de tipo:
- Identificar o erro
- Corrigir
- Repetir até zero erros

### Passo 3 — Servidor dev

Iniciar servidor e aguardar ready:

```powershell
npx next dev -p 3000
```

Aguardar log `localhost:3000` aparecer.

### Passo 4 — Rotas estáticas (simular usuário real)

Testar **todas** as rotas abaixo como um usuário real navegando:

| Rota | O que verificar |
|------|----------------|
| `GET /` | Homepage carrega, HTTP 200 |
| `GET /explorar` | Catálogo de agentes |
| `GET /agentes` | Lista de agentes |
| `GET /universo` | Universo carrega |
| `GET /universo/nexus` | Planeta Nexus |
| `GET /login` | Página de login |
| `GET /cadastro` | Página de cadastro |
| `GET /planos` | Planos/assinatura |
| `GET /blog` | Blog carrega |
| `GET /aulas` | Aulas carrega |
| `GET /lab` | Laboratório carrega |
| `GET /player` | Player carrega |
| `GET /series` | Séries carrega |
| `GET /series/nexus` | Série do Nexus |

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/<rota>" -Method GET -SkipCertificateCheck -SkipHttpErrorCheck
```

Toda rota deve retornar HTTP 200. Qualquer 500 ou erro: parar, identificar, corrigir.

### Passo 5 — API routes (funcional)

Testar endpoints funcionais:

```powershell
# Chat
Invoke-WebRequest -Uri "http://localhost:3000/api/health/system" -Method GET

# LLM (se credenciais disponíveis)
$body = @{ system = "teste"; prompt = "ok" } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/llm/chat" -Method POST -Body $body -ContentType "application/json"

# Conteúdo (se cache populado)
Invoke-WebRequest -Uri "http://localhost:3000/api/series/content?agent=nexus&season=1&ep=1" -Method GET
```

### Passo 6 — Auto-healing

Se algum teste falhar:

1. Capturar o erro completo (`$_.Exception.Message`)
2. Identificar a causa raiz
3. Corrigir com edição cirúrgica (mínimo de linhas alteradas)
4. Rebuildar
5. Repetir o ciclo desde o Passo 1

### Passo 7 — Critério de parada

O ciclo SÓ para quando **todos** os itens abaixo forem verdade:

- ✅ `npm run build` → `Compiled successfully`
- ✅ `npx tsc --noEmit` → zero erros
- ✅ Todas as rotas estáticas → HTTP 200
- ✅ API routes → HTTP 200
- ✅ Nenhum erro no console do servidor

---

## Regras de auto-healing

1. **Mínimo de linhas**: corrigir apenas o necessário
2. **Preservar contratos**: não mudar nomes de exports, tipos públicos, ou formatos de resposta
3. **Preservar estilo**: seguir o padrão do arquivo (espaços, aspas, imports)
4. **Comentar a correção**: adicionar breve comentário explicando POR QUE o erro ocorreu
5. **Não deixar débito**: se a correção revelar um problema arquitetural, documentar em vez de remendar

## Arquivos prioritários em caso de erro

Se o build falhar, verificar nesta ordem:

1. `tsconfig.tsbuildinfo` → limpar com `Remove-Item .next -Recurse -Force`
2. `package.json` → dependências faltando
3. Arquivo mencionado no erro → corrigir
4. Imports quebrados → verificar caminhos após refatoração
