#!/usr/bin/env python3
import subprocess, json

gcm_path = "/mnt/c/Progra~1/Git/mingw64/bin/git-credential-manager.exe"
result = subprocess.run([gcm_path, "get"], input="protocol=https\nhost=github.com\n\n", capture_output=True, text=True, timeout=10)
token = ""
for line in result.stdout.strip().split("\n"):
    if line.startswith("password="):
        token = line.split("=", 1)[1]
        break

payload = json.dumps({
    "title": "fix(sse): replace SSE runtime-sync with REST polling to eliminate Vercel timeout errors",
    "head": "fix/sse-to-rest-polling",
    "base": "main",
    "body": (
        "## Fix: replace SSE runtime-sync with REST polling\n\n"
        "### Problema\n"
        "`GET /api/ws/runtime-sync` mantinha uma conexao SSE (stream infinita) que excedia o "
        "timeout do Vercel Serverless Functions, gerando centenas de erros por minuto:\n"
        "```\n"
        "Vercel Runtime Timeout Error: Task timed out\n"
        "```\n\n"
        "### O que foi feito\n"
        "1. **`src/app/api/ws/runtime-sync/route.ts`** — convertido de SSE para REST instantaneo. "
        "Agora retorna `Response.json()` com o snapshot atual do Nexus, sem stream.\n"
        "2. **`src/lib/experience/experience-layer.ts`** — `connectToRuntimeSync()` e "
        "`disconnectFromRuntimeSync()` viraram no-ops (comentarios explicando).\n"
        "3. **`src/providers/OasisProvider.tsx`** — removidas as funcoes `connectSSE()` e "
        "`scheduleReconnect()`, junto com as variaveis `reconnectDelay`, `reconnectTimer`, `MAX_RECONNECT_DELAY`. "
        "O polling REST de 10s (ja existente como fallback) passa a ser o unico mecanismo.\n"
        "4. **Tipos atualizados** — `CognitiveProfileSummary`, `UserCognitiveProfile`, "
        "`DEFAULT_COGNITIVE_PROFILE` e `buildCognitiveProfile()` agora incluem "
        "`intellectualScore` e `moralScore`.\n"
        "5. **Teste atualizado** — `experience.test.ts` com os novos campos.\n\n"
        "### Arquivos alterados\n"
        "- `src/app/api/ws/runtime-sync/route.ts`\n"
        "- `src/lib/experience/experience-layer.ts`\n"
        "- `src/lib/experience/experience.types.ts`\n"
        "- `src/lib/experience/tests/experience.test.ts`\n"
        "- `src/lib/agents/memory-keeper.ts`\n"
        "- `src/providers/OasisProvider.tsx`\n\n"
        "### Validacao\n"
        "- `npx tsc --noEmit` — zero erros\n"
        "- Polling de 10s mantido como unico mecanismo de sincronizacao\n"
    )
})

pr = subprocess.run(
    ["curl", "-s", "-X", "POST",
     "-H", f"Authorization: token {token}",
     "-H", "Content-Type: application/json",
     "-d", payload,
     "https://api.github.com/repos/regesnaldo/ai-kids-flix-oficial/pulls"],
    capture_output=True, text=True, timeout=30
)
data = json.loads(pr.stdout)
print(f"PR: {data.get('html_url', 'ERROR: ' + json.dumps(data)[:200])}")
