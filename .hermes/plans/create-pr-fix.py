#!/usr/bin/env python3
"""Create PR for fix/onboarding-loop."""
import subprocess, json

gcm_path = "/mnt/c/Progra~1/Git/mingw64/bin/git-credential-manager.exe"
input_data = "protocol=https\nhost=github.com\n\n"
result = subprocess.run([gcm_path, "get"], input=input_data, capture_output=True, text=True, timeout=10)
token = ""
for line in result.stdout.strip().split("\n"):
    if line.startswith("password="):
        token = line.split("=", 1)[1]
        break

pr_body = """## Fix: onboarding infinite loop

### Causa raiz
`shouldShowOnboarding()` em `src/lib/onboarding/types.ts` sempre retornava `true` para novos usuarios sem `localStorage` configurado. Isso fazia o `useEffect` no `layout.tsx` redirecionar para `/onboarding` em qualquer rota nao-bloqueada, criando um loop infinito.

### O que foi feito
1. **`shouldShowOnboarding()` desabilitado temporariamente** — sempre retorna `false` ate que uma logica de validacao por sessao seja implementada. A funcao ainda verifica `mente_ai_onboarding_complete` no localStorage, mas por seguranca retorna `false` em qualquer caso.

### Nota
`/universo` ja estava na lista de blocked paths em `layout.tsx` (linha 23) — nao era necessario adicionar.

### Arquivo alterado
- `src/lib/onboarding/types.ts` — `shouldShowOnboarding()`

### Prox passo
Implementar validacao por sessao (checkar se usuario completou onboarding via API/database) em vez de localStorage-only.
"""

payload = json.dumps({
    "title": "fix(onboarding): prevent infinite redirect loop",
    "head": "fix/onboarding-loop",
    "base": "main",
    "body": pr_body
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
if "html_url" in data:
    print(f"PR: {data['html_url']}")
else:
    print(f"Error: {data}")
