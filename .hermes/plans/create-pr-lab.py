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
    "title": "fix(layout): add /lab to blocked paths to prevent onboarding redirect loop",
    "head": "fix/lab-onboarding-loop",
    "base": "main",
    "body": "## Fix: add /lab to blocked paths in layout.tsx\n\n### Problema\n`/lab` nao estava na lista de blocked paths em `src/app/(main)/layout.tsx`. Qualquer navegacao para `/lab` (ex: chat do agente, canvas) disparava `shouldShowOnboarding()` que redirecionava para `/onboarding`, criando loop infinito se `/onboarding` tambem batesse no mesmo layout.\n\n### O que foi feito\nAdicionado `pathname.startsWith(\"/lab\")` ao bloco blocked no layout.tsx.\n\n### Status atual do blocked paths\n- /login\n- /planos\n- /sucesso\n- /conta\n- /onboarding\n- /home\n- /universo\n- /lab (novo)\n\n### Arquivo alterado\n- `src/app/(main)/layout.tsx`"
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
