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
    "title": "fix(build): remove NextRequest.from() — method doesn't exist in Next.js App Router",
    "head": "fix/nextrequest-from",
    "base": "main",
    "body": (
        "## Fix: erro de build NextRequest.from()\n\n"
        "### Problema\n"
        "`src/app/api/universe/progression/route.ts` linha 20 usava "
        "`NextRequest.from()` — metodo que nao existe no Next.js App Router.\n"
        "Isso gerava erro em todo `npx tsc --noEmit`:\n"
        "```\n"
        "Property 'from' does not exist on type 'typeof NextRequest'\n"
        "```\n\n"
        "### Causa\n"
        "O helper `getUserIdFromRequest` aceitava `NextRequest | Request` e "
        "tentava converter `Request` para `NextRequest` via `NextRequest.from()`. "
        "Em Next.js App Router, as funcoes `GET(request: NextRequest)` ja recebem "
        "um `NextRequest` diretamente — a conversao nunca seria executada.\n\n"
        "### Fix\n"
        "1. Tipo do parametro simplificado para `NextRequest` (apenas)\n"
        "2. Linha `NextRequest.from()` removida\n"
        "3. `getAuthCookieFromRequest(request)` chamado diretamente\n\n"
        "### Arquivo alterado\n"
        "- `src/app/api/universe/progression/route.ts` — -3/+2 linhas\n\n"
        "### Validacao\n"
        "- `npx tsc --noEmit` — **zero erros** (antes: 1 erro)"
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
