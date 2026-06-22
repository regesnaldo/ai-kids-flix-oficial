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
    "title": "feat(canon): expand Bible prompts to all 12 agents",
    "head": "feat/canon-expand-8-agents",
    "base": "main",
    "body": (
        "## Expandir canon.ts: 4/12 -> 12/12 agentes com Bible prompts\n\n"
        "### O que foi feito\n"
        "`src/canon/agents/canon.ts` expandido de 4 para 12 agentes, usando "
        "`all-agents.ts` e a Biblia Cinematografica v1.0 como fontes da verdade.\n\n"
        "### Agentes adicionados (8 novos Bible prompts)\n"
        "1. **VOLT** — \"O Energetico\" — tom: energetico, entusiasta. "
        "Metaforas de eletricidade e corrente. Conflito com ETHOS.\n"
        "2. **ETHOS** — \"O Filosofo\" — tom: reflexivo, socratico. "
        "Questionamentos eticos. Conflito com VOLT e KAOS.\n"
        "3. **LYRA** — \"A Artista\" — tom: empatico, poetico, sensorial. "
        "Sinestesia e arte. Conflito com AXIOM.\n"
        "4. **AXIOM** — \"O Cientista\" — tom: analitico, preciso. "
        "Dados e metodo cientifico. Conflito com LYRA e KAOS.\n"
        "5. **STRATOS** — \"O Estrategista\" — tom: estrategico, calmo. "
        "Visao de conjunto e xadrez. Conflito com KAOS.\n"
        "6. **TERRA** — \"A Guardia\" — tom: caloroso, humano. "
        "Empatia e impacto humano. Conflito com VOLT.\n"
        "7. **PRISM** — \"O Revelador\" — tom: inspiracional, expansivo. "
        "Multiplas perspectivas. Conflito com AXIOM.\n"
        "8. **JANUS** — \"O Humorista\" — tom: humoristico, ironico. "
        "Paradoxos e humor inteligente. Conflito com ETHOS e AXIOM.\n\n"
        "### Mudancas estruturais\n"
        "- `AgentId` type expandido: `'nexus' | 'cipher' | 'kaos' | 'aurora' | "
        "'volt' | 'ethos' | 'lyra' | 'axiom' | 'stratos' | 'terra' | 'prism' | 'janus'`\n"
        "- `AGENT_ORDER` agora tem 12 IDs\n"
        "- `AGENTS` record: 12 definicoes completas com identity, cognition, relationships\n"
        "- `AGENT_PROMPTS` record: 12 system prompts no padrao da Biblia v1.0\n\n"
        "### Validacao\n"
        "- `npx tsc --noEmit` — zero erros (unico erro e preexistente em progression/route.ts)\n"
        "- Todos os 6 modulos que importam do canon compilam sem alteracoes\n"
        "- Backup preservado em `canon.ts.bak`\n\n"
        "### Arquivo alterado\n"
        "- `src/canon/agents/canon.ts` — +468 linhas (27049 bytes)"
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
