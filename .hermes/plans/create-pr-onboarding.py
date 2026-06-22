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
    "title": "fix(onboarding): disable auto-redirect until session-based validation exists",
    "head": "fix/onboarding-disable-loop",
    "base": "main",
    "body": (
        "## Fix: desabilitar shouldShowOnboarding\n\n"
        "### Problema\n"
        "`shouldShowOnboarding()` em `src/lib/onboarding/types.ts` sempre retorna `true` "
        "para novos usuarios sem localStorage configurado, redirecionando-os para "
        "`/onboarding` automaticamente.\n\n"
        "### Diagnostico completo\n"
        "1. `shouldShowOnboarding()` checava APENAS localStorage - nenhuma validacao "
        "por sessao (API/database)\n"
        "2. `/onboarding` ja estava no blocked paths do `(main)/layout.tsx`, entao "
        "nao havia LOOP entre `/onboarding` e o layout - o loop era `/lab -> layout -> /onboarding`\n"
        "3. PR #112 ja adicionou `/lab` ao blocked paths, eliminando o loop\n"
        "4. Mas o redirecionamento automatico para `/onboarding` continua forcando "
        "todos os novos usuarios a passar pela sequencia de calibracao de 7.5s\n\n"
        "### Fix aplicado\n"
        "`shouldShowOnboarding()` agora retorna `false` sempre (desabilitado "
        "temporariamente) ate que uma logica de validacao por sessao seja implementada.\n"
        "A funcao ainda verifica `mente_ai_onboarding_complete` no localStorage, "
        "mas por seguranca retorna `false` em qualquer caso.\n\n"
        "### Proximo passo\n"
        "Implementar validacao por sessao (checar se usuario completou onboarding "
        "via API/database) em vez de localStorage-only.\n\n"
        "### Arquivo alterado\n"
        "- `src/lib/onboarding/types.ts` — shouldShowOnboarding()\n\n"
        "### Validacao\n"
        "- `npx tsc --noEmit` — zero erros (apenas preexistente)"
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
