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
    "title": "Scene 5: ElevenLabs TTS — NEXUS voice on intro + chat responses",
    "head": "feat/scene-5-nexus-tts",
    "base": "main",
    "body": (
        "## Scene 5 — Nexus Voice (ElevenLabs TTS)\n\n"
        "### O que foi feito\n"
        "Integracao do ElevenLabs TTS na Cena 5 (Nexus Core).\n\n"
        "### Novos modulos\n"
        "**`src/hooks/useTts.ts`** — Hook generico de TTS:\n"
        "- `speak(text)` — POST para /api/elevenlabs/speak, toca MP3 via Audio element\n"
        "- `stop()` — interrompe reproducao atual\n"
        "- Tratamento de autoplay bloqueado pelo browser (resolve silenciosamente)\n\n"
        "**`src/lib/audio/voices.ts`** — Config centralizada de voice IDs:\n"
        "- `VOICE_IDS` — mapa agentId → voice ID\n"
        "- `getAgentVoiceId(agentId)` — fallback para DEFAULT_VOICE_ID\n"
        "- Voice ID do NEXUS: `NEXT_PUBLIC_ELEVENLABS_VOICE_ID_NEXUS`\n\n"
        "### Integracao no NexusCosmos\n"
        "1. **CinematicIntro** — cada linha da intro e falada em voz alta "
        "quando aparece (1200ms de intervalo)\n"
        "2. **ChatPanel** — primeira mensagem do NEXUS falada ao abrir; "
        "cada resposta do NEXUS falada automaticamente ao chegar\n"
        "3. **AudioEngine extraido** — `createAmbientDrone`, `playNucleusHover`, "
        "`playNucleusClick` movidos para `src/lib/audio/nexus-audio.ts`\n\n"
        "### Arquivos novos\n"
        "- `src/hooks/useTts.ts`\n"
        "- `src/lib/audio/voices.ts`\n"
        "- `src/lib/audio/nexus-audio.ts`\n\n"
        "### Arquivos alterados\n"
        "- `src/components/universo/NexusCosmos.tsx` — imports, `speak` passado "
        "para CinematicIntro + ChatPanel, audio inline removido\n\n"
        "### ENV necessario\n"
        "- `ELEVENLABS_API_KEY` — ja existe em .env.local\n"
        "- `NEXT_PUBLIC_ELEVENLABS_VOICE_ID_NEXUS` — ja existe\n\n"
        "### Validacao\n"
        "- `npx tsc --noEmit` — zero erros"
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
