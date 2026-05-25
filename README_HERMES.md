# HERMES LOCAL AGENT v3.0

## Production-grade operator for MENTE.AI / AI-KIDS-FLIX

---

## 1. NOVIDADES v3.0

| Feature | Descricao |
|---------|-----------|
| **Validacao automatica** | Apos cada missao, executa `tsc --noEmit` + `npm run build` automaticamente |
| **Rollback system** | Se a validacao falhar, restaura todos os arquivos ao estado anterior |
| **Protecao de arquivos criticos** | Bloqueia sobrescrita de `package.json`, `tsconfig.json`, `.env`, etc. |
| **Governanca dinamica** | Carrega regras de `MENTE_AI_GOVERNANCE.md` — edite sem tocar no script |
| **Dry-run mode** | `python hermes_agent.py --dry-run` — preview sem salvar |
| **Memoria expandida** | `PROJECT_MEMORY.json` com `architecture_decisions`, `recurring_errors`, `visual_rules`, `deployment_history`, `performance_notes` |
| **Missao via argumento** | `python hermes_agent.py --mission "Crie componente X"` — bypassa prompt interativo |

---

## 2. PRE-REQUISITOS

- **Python 3.10+** → https://python.org
- **Chave API DeepSeek** → https://platform.deepseek.com
- **Node.js 18+** → https://nodejs.org (para validacao de build)
- **Git** (para commitar)

---

## 3. INSTALACAO

Copie para a raiz do projeto:

```
AI-KIDS-OFICIAL/
├── hermes_agent.py
├── hermes.bat
├── MENTE_AI_GOVERNANCE.md    ← REGRAS OPERACIONAIS
├── PROJECT_MEMORY.json       ← criado automaticamente
├── .hermes_backups/          ← criado automaticamente
└── ...
```

Configure a chave API:

```cmd
setx DEEPSEEK_API_KEY "sk-sua-chave-aqui"
```

(Ou edite o inicio de `hermes_agent.py`)

---

## 4. COMO USAR

### Modo normal (interativo)
```cmd
python hermes_agent.py
```
Digite a missao quando solicitado.

### Dry-run (preview sem salvar)
```cmd
python hermes_agent.py --dry-run
```
Mostra quais arquivos seriam afetados sem modificar nada.

### Missao via argumento
```cmd
python hermes_agent.py --mission "Crie o componente HeroSection"
```

### Permitir edicao de arquivos criticos
```cmd
set ALLOW_CRITICAL_CHANGES=true
python hermes_agent.py
```

---

## 5. FLUXO DE EXECUCAO

1. Carrega governanca (`MENTE_AI_GOVERNANCE.md`)
2. Carrega memoria (`PROJECT_MEMORY.json`)
3. Escaneia arquivos do projeto
4. Voce digita a missao
5. Envia para DeepSeek com contexto completo
6. Extrai arquivos da resposta
7. **Verifica protecao de arquivos criticos**
8. **Cria backups antes de sobrescrever**
9. Salva os arquivos
10. **Executa `tsc --noEmit` + `npm run build`**
11. **Se falhar: rollback automatico**
12. Atualiza memoria
13. Exibe resposta completa + relatorio

---

## 6. SISTEMA DE ROLLBACK

Todo arquivo sobrescrito recebe backup em `.hermes_backups/`.

Se a validacao de build falhar:
- Todos os backups sao restaurados
- Missao e cancelada
- Erro registrado em `recurring_errors`
- Estado do projeto permanece estavel

---

## 7. ARQUIVOS CRITICOS PROTEGIDOS

Estes arquivos NAO podem ser modificados sem `ALLOW_CRITICAL_CHANGES=true`:

- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `next.config.js` / `next.config.mjs` / `next.config.ts`
- `.env` / `.env.local`
- `vercel.json`

---

## 8. GOVERNANCA

Edite `MENTE_AI_GOVERNANCE.md` para ajustar regras sem tocar no agente Python.

O arquivo contem:
- Regras absolutas (proibicoes)
- Stack exata
- Design tokens
- Matriz de escalacao
- Formato de resposta

---

## 9. MEMORIA EXPANDIDA

`PROJECT_MEMORY.json` agora inclui:

```json
{
  "version": "2.0",
  "decisions": [],
  "components_created": [],
  "api_integrations": [],
  "errors_fixed": [],
  "next_steps": [],
  "architecture_decisions": [],
  "recurring_errors": [],
  "visual_rules": [],
  "deployment_history": [],
  "performance_notes": []
}
```

Backward-compatible: campos novos sao criados automaticamente se ausentes.

---

## 10. SOLUCAO DE PROBLEMAS

| Problema | Solucao |
|----------|---------|
| "Python nao encontrado" | Instale Python 3.10+ |
| "Erro HTTP 401" | Chave API invalida |
| "Arquivo critico bloqueado" | `set ALLOW_CRITICAL_CHANGES=true` |
| "Validacao de build falhou" | Rollback automatico executado. Verifique `.hermes_backups/` |
| "MENTE_AI_GOVERNANCE.md nao encontrado" | Usa fallback minimo. Crie o arquivo para governanca completa. |

---

Version: 3.0
Project: MENTE.AI / AI-KIDS-FLIX
