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
    "title": "feat(canon-database): sync 12 MENTE.AI agents with progression DB",
    "head": "feat/canon-database-sync-12",
    "base": "main",
    "body": (
        "## Sincronizar canon-database.ts com os 12 agentes do canon.ts\n\n"
        "### Problema\n"
        "A auditoria do PHASE2_READINESS.md revelou que 7 dos 12 agentes MENTE.AI "
        "estavam ausentes do CANON_DATABASE (usado para progressao, filtros por "
        "nivel de usuario, estatisticas e desbloqueio): CIPHER, AURORA, VOLT, "
        "LYRA, AXIOM, TERRA, PRISM.\n\n"
        "### O que foi feito\n"
        "Adicionados 7 agentes ao CANON_DATABASE no final do array, apos EXOUSIA, "
        "com secao comentada \"AGENTES MENTE.AI (12 canonicos)\".\n\n"
        "### Mapeamento\n"
        "| Agente | Dimensao | Faccao | Nivel | Season | minLevel |\n"
        "|--------|----------|--------|-------|--------|----------|\n"
        "| CIPHER | philosophical | order | operator | 1 | 1 |\n"
        "| AURORA | philosophical | balance | operator | 1 | 1 |\n"
        "| VOLT | philosophical | chaos | operator | 1 | 1 |\n"
        "| LYRA | philosophical | balance | operator | 1 | 1 |\n"
        "| AXIOM | philosophical | order | operator | 1 | 1 |\n"
        "| TERRA | philosophical | balance | operator | 1 | 1 |\n"
        "| PRISM | philosophical | balance | operator | 1 | 1 |\n\n"
        "**Criterios de mapeamento:**\n"
        "- Dimensao: todos como `philosophical` (consistencia com a base grega de 98 agentes)\n"
        "- Faccao: derivada do `faction` no `all-agents.ts` (order/chaos/balance)\n"
        "- Nivel: `operator` (nivel 1) — todos sao agentes de entrada na plataforma\n"
        "- Season: 1 (estreia na primeira temporada)\n"
        "- minUserLevel: 1 (disponivel desde o inicio)\n\n"
        "### Status apos o fix\n"
        "CANON_DATABASE agora contem 127 agentes (120 originais + 7 MENTE.AI adicionados).\n"
        "NEXUS, KAOS, ETHOS, STRATOS, JANUS ja estavam presentes.\n\n"
        "### Validacao\n"
        "- `npx tsc --noEmit` — zero erros (apenas preexistente em progression/route.ts)\n"
        "- `grep` confirma cada um dos 12 exatamente 1 vez no DB\n\n"
        "### Arquivo alterado\n"
        "- `src/canon/canon-database.ts` — +76/-10 linhas"
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
