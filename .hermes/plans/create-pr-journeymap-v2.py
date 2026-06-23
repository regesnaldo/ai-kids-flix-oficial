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
    "title": "Scene 3: JourneyMap — planet trail, next stop, 3 cognitive dimensions",
    "head": "feat/scene-3-journeymap-v2",
    "base": "main",
    "body": (
        "## Scene 3 — Dashboard de Progresso (final item)\n\n"
        "### O que foi implementado\n"
        "**JourneyMap** — novo componente de painel de progresso na home page.\n\n"
        "### Componentes do JourneyMap\n"
        "1. **Planet Trail** — 12 circulos coloridos representando cada agente: "
        "verde com checkmark para visitados, pulsante azul para o proximo, "
        "translucido para nao visitados. Cada circulo e um link para "
        "`/universo/{agentId}`.\n"
        "2. **Next Stop** — card com nome, faccao e botao ENTRAR → para o "
        "proximo agente na rota de progressao.\n"
        "3. **3 Cognitive Dimensions** — barras de progresso para EMOCIONAL "
        "(rosa), INTELECTUAL (azul) e MORAL (verde). Scores vem do "
        "`cognitiveProfile` no OasisProvider.\n\n"
        "### Arquivos alterados\n"
        "- `src/components/home/JourneyMap.tsx` — ★ novo (171 linhas, 7KB)\n"
        "- `src/app/(main)/home/page.tsx` — import + componente apos progression bar\n"
        "- `src/providers/OasisProvider.tsx` — campos `intellectualScore` e `moralScore` "
        "adicionados ao tipo `cognitiveProfile` e ao DEFAULT_OASIS\n\n"
        "### Notas\n"
        "- JourneyMap usa seu proprio `AGENTS` com `color` por faccao "
        "(o AGENTS da home page nao tem cor)\n"
        "- Os scores cognitivos atualmente virao 0 ate que o Memory Keeper "
        "passe a popular `intellectualScore` e `moralScore`\n"
        "- Cena 3 esta **100% completa** apos este PR\n\n"
        "### Validacao\n"
        "- `npx tsc --noEmit` — zero erros (apenas preexistente em progression/route.ts)"
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
