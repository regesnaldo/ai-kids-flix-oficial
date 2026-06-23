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
    "title": "Scene 5: Nexus Audio Engine — Tone.js drone, hover, click with fade in/out",
    "head": "feat/scene-5-nexus-audio-engine",
    "base": "main",
    "body": (
        "## Scene 5 — Nexus Audio Engine\n\n"
        "### O que foi feito\n"
        "Audio engine extraido do `NexusCosmos.tsx` para um modulo dedicado "
        "e reutilizavel em `src/lib/audio/nexus-audio.ts`.\n\n"
        "### Audio Engine (Tone.js)\n"
        "**Ambient Drone:**\n"
        "- drone1: sine C1, attack 4s, release 6s (fade in/out suave)\n"
        "- drone2: sine G1, attack 6s, release 8s, delay 2s apos drone1\n"
        "- Reverb: decay 8s, wet 0.8, volume -20dB\n"
        "- `stop(fadeOutMs)`: triggerRelease + espera pelo envelope de release\n\n"
        "**Interaction Sounds:**\n"
        "- `playNucleusHover()` — sine G2, 0.3s, reverb decay 2s\n"
        "- `playNucleusClick()` — MetalSynth G3, reverb decay 6s\n\n"
        "**Lazy loading:** Tone.js importado dinamicamente (nao infla bundle inicial)\n"
        "**AudioContext gate:** `initAudio()` chamado no primeiro som, respeitando "
        "a politica do browser\n\n"
        "### Refatoracao\n"
        "- `NexusCosmos.tsx` — 56 linhas de audio removidas, substituidas por 3 imports\n"
        "- `NexusDroneHandle` — interface tipada com `stop()` assincrono\n"
        "- Cleanup com fade out: `stopAmbientDrone(droneRef.current, 2000)` "
        "em vez de `triggerRelease()` abrupto\n\n"
        "### Arquivos alterados\n"
        "- `src/lib/audio/nexus-audio.ts` — ★ novo (107 linhas, 5KB)\n"
        "- `src/components/universo/NexusCosmos.tsx` — -56/+2 linhas\n\n"
        "### Validacao\n"
        "- `npx tsc --noEmit` — zero erros\n\n"
        "### Cena 5 status\n"
        "- CinematicIntro (3 linhas, fade)\n"
        "- ParticleField (500 nodes: 400 cyan pulse + 60 blue + 40 white)\n"
        "- Nucleus (sphere + 2 torus rings, hover/click handlers)\n"
        "- EffectComposer + Bloom\n"
        "- HUDOverlay (info left, UTC right, blinking CTA bottom)\n"
        "- ChatPanel (380px, NEXUS_RESPONSES ciclicas)\n"
        "- Audio Engine (extraido para modulo dedicado) — ✅ NOVO\n"
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
