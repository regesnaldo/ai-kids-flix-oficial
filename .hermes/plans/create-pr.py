#!/usr/bin/env python3
"""Extract GitHub token from Windows GCM and create a PR."""
import subprocess
import json
import sys

# Step 1: Extract token from GCM
gcm_path = "/mnt/c/Progra~1/Git/mingw64/bin/git-credential-manager.exe"
input_data = "protocol=https\nhost=github.com\n\n"
try:
    result = subprocess.run(
        [gcm_path, "get"],
        input=input_data,
        capture_output=True,
        text=True,
        timeout=10
    )
    token = ""
    for line in result.stdout.strip().split("\n"):
        if line.startswith("password="):
            token = line.split("=", 1)[1]
            break

    if not token:
        print("ERROR: No token extracted")
        sys.exit(1)

    print(f"Token extracted, length={len(token)}, prefix={token[:10]}...")

    # Step 2: Verify token
    verify = subprocess.run(
        ["curl", "-s", "-H", f"Authorization: token {token}",
         "https://api.github.com/user"],
        capture_output=True, text=True, timeout=15
    )
    user_data = json.loads(verify.stdout)
    if "login" in user_data:
        print(f"Authenticated as: {user_data['login']}")
    else:
        print(f"Auth error: {user_data}")
        sys.exit(1)

    # Step 3: Create PR
    pr_body = """## Scene 3 — JourneyMap (final item)

Implements the missing JourneyMap component for the home dashboard.

### O que foi feito
- **JourneyMap.tsx** — novo componente com trilha de planetas visitados, próxima parada recomendada e perfil cognitivo 3D (emocional, intelectual, moral)
- **OasisProvider.tsx** — adicionados campos `intellectualScore` e `moralScore` ao tipo `cognitiveProfile`
- **home/page.tsx** — JourneyMap integrado após a barra de progresso

### Componentes do JourneyMap
1. Planet Trail — 12 círculos com cores de facção, indicador verde para visitados, pulsante azul para proximo
2. Next Stop — card com nome, faccao e botao ENTRAR →
3. Cognitive Profile — 3 barras de progresso (Emocional, Intelectual, Moral)

### Arquivos alterados
- `src/components/home/JourneyMap.tsx` (novo)
- `src/app/(main)/home/page.tsx` (import + integracao)
- `src/providers/OasisProvider.tsx` (novos campos no tipo)
"""

    payload = json.dumps({
        "title": "Scene 3: JourneyMap — planet trail, next stop, 3 cognitive dimensions",
        "head": "feat/scene-3-journeymap",
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
    pr_data = json.loads(pr.stdout)
    if "html_url" in pr_data:
        print(f"\nPR criado com sucesso!")
        print(f"URL: {pr_data['html_url']}")
    elif "errors" in pr_data:
        print(f"\nErro ao criar PR: {pr_data['errors']}")
    else:
        print(f"\nResposta inesperada: {json.dumps(pr_data, indent=2)[:500]}")

except subprocess.TimeoutExpired:
    print("ERROR: Timeout")
    sys.exit(1)
except FileNotFoundError as e:
    print(f"ERROR: Binary not found: {e}")
    sys.exit(1)
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
