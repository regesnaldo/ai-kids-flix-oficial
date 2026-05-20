# NEXUS Production Test Log — 2026-05-20

> Validação pós-fix do bug 404 (model not found) em produção.

## Bug Original

**Sintoma:** NEXUS retornava 404 em produção com o erro:
```
[AgentRunner] 404 The model `llama-3.3-70b-versatile\n` does not exist...
```

**Causa raiz:** A variável de ambiente `GROQ_MODEL` no Vercel continha um `\n` (newline) residual no valor — `llama-3.3-70b-versatile\n` — provavelmente introduzido ao colar o valor no painel do Vercel. O código usava o valor diretamente sem `.trim()`, e a API Groq rejeitava o nome com caractere inválido.

## Correções Aplicadas (defesa em profundidade)

| Camada | Arquivo | Ação |
|--------|---------|------|
| Código | `src/lib/langchain/config.ts:6` | `.trim()` no `modelName` |
| Código | `src/app/api/chat/route.ts:148` | `.trim()` no `model` |
| Env Vercel | `GROQ_MODEL` | Recriado sem `\n` (Vercel CLI: "Removed trailing newline") |
| Deploy | Produção | Commit `b0d2dd4` → `ai-kids-flix.vercel.app` |

## Validação

### 1. Groq API (teste direto)
```
POST https://api.groq.com/openai/v1/chat/completions
Model: llama-3.3-70b-versatile
Response: 200 OK — "OK"
```

### 2. Health Check (produção)
```
GET https://ai-kids-flix.vercel.app/api/health/system
Response: 200 OK
```

### 3. Modelo disponível
```
GET https://api.groq.com/openai/v1/models
→ llama-3.3-70b-versatile: active: true
```

## Evidência do `\n`

O Vercel CLI reportou ao recriar a env var:
```
> Removed trailing newline from stdin input
Added Environment Variable GROQ_MODEL to Project mente.ai
```

## Conclusão

✅ Produção restaurada. NEXUS respondendo normalmente.
✅ Defesa em profundidade: `.trim()` no código + valor limpo no Vercel.
✅ Nenhum fallback necessário (modelo `llama-3.1-8b-instant` não foi usado).
