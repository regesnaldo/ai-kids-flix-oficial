# 🎬 Cenas Three.js — MENTE.AI

> **12 palcos. 12 atmosferas. 1 universo.**  
> Cada agente canônico tem seu próprio palco digital imersivo.

---

## 🎭 FILOSOFIA DAS CENAS

Cada cena Three.js não é "decoração de fundo". É a **atmosfera emocional** do agente materializada em 3D.

Pense nas cenas como **palcos de teatro**:

- **NEXUS** tem um cosmos de dados — partículas azuis que se conectam
- **VOLT** tem uma arena elétrica — raios dourados pulsando
- **AURORA** tem um horizonte infinito — cores que nascem e morrem
- **CIPHER** tem um labirinto de padrões — geometria que se revela

Cada cena é uma extensão da personalidade do agente. Você não "vê" a cena — você **sente** o agente através dela.

---

## 🗺️ AS 12 CENAS

| Cena | Agente | Atmosfera | Visual |
|------|--------|-----------|--------|
| `NexusScene` | NEXUS | Cosmos de dados | Partículas azuis conectadas por linhas |
| `VoltScene` | VOLT | Arena elétrica | Raios dourados, energia pulsante |
| `AuroraScene` | AURORA | Horizonte infinito | Gradientes que nascem ao longe |
| `KaosScene` | KAOS | Espaço em colapso | Fragmentos flutuantes, entropia criativa |
| `CipherScene` | CIPHER | Labirinto de padrões | Geometria generativa que se revela |
| `LyraScene` | LYRA | Sinfonia visual | Ondas senoidais coloridas, harmonia |
| `EthosScene` | ETHOS | Biblioteca infinita | Pilares de luz, conhecimento ancestral |
| `AxiomScene` | AXIOM | Laboratório lógico | Estruturas matemáticas, provas visuais |
| `StratosScene` | STRATOS | Torre de xadrez | Tabuleiro infinito, peças flutuantes |
| `TerraScene` | TERRA | Floresta bioluminescente | Natureza digital, dados como plantas |
| `PrismScene` | PRISM | Prisma de luz | Refração, múltiplas perspectivas |
| `JanusScene` | JANUS | Circo quântico | Dualidade, probabilidade, faces |

---

## 🔧 PIPELINE DE RENDERIZAÇÃO

```
┌──────────────────────────────────────────────────┐
│              DynamicScene.tsx                     │
│  (carregador universal — lazy loading)            │
│                                                    │
│  SCENE_MAP = {                                     │
│    'AuroraScene': () => import('.../AuroraScene'), │
│    'NexusScene':  () => import('.../NexusScene'),  │
│    ...                                             │
│  }                                                 │
└──────────────────┬───────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────┐
│  dynamic(() => SCENE_MAP[scene], {                │
│    ssr: false,        ← NUNCA renderiza no server │
│    loading: Spinner   ← Enquanto carrega (~200ms) │
│  })                                               │
└──────────────────┬───────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────┐
│  Cena 3D                                          │
│  • Canvas (WebGL)                                 │
│  • useEffect → init Three.js                      │
│  • useFrame → animação (60fps)                    │
│  • Cleanup → dispose geometrias/texturas          │
└──────────────────────────────────────────────────┘
```

---

## ⚡ PERFORMANCE

| Estratégia | Impacto |
|-----------|---------|
| **Lazy loading** | ~500KB removidos do bundle inicial |
| **ssr: false** | Zero render no servidor — cenas só existem no browser |
| **Dynamic import** | Cada cena carregada sob demanda |
| **Spinner loading** | UX enquanto carrega (dual-ring cyan/purple) |
| **Dispose on unmount** | Libera memória GPU ao navegar para outra cena |
| **requestAnimationFrame** | 60fps nativo, sem polling |

---

## 🔄 CICLO DE VIDA DA CENA

```
Montagem (useEffect)
  │
  ├─→ 1. Cria Scene, Camera, Renderer
  ├─→ 2. Adiciona geometrias, luzes, partículas
  ├─→ 3. Inicia animation loop (useFrame)
  │
  ▼
Execução (60fps)
  │
  ├─→ useFrame: atualiza posições, rotações, cores
  │
  ▼
Desmontagem (cleanup)
  │
  ├─→ 1. Para animation loop
  ├─→ 2. Dispose geometrias (free GPU memory)
  ├─→ 3. Dispose materiais
  ├─→ 4. Remove renderer do DOM
  └─→ 5. Cena pronta para garbage collection
```

---

## 🎨 ARQUITETURA DE ANIMAÇÃO

- **useFrame** (React Three Fiber): chamado a cada frame (60fps)
- **Animações declarativas:** `mesh.rotation.x += 0.01` dentro do useFrame
- **Interatividade com mouse:** `useThree()` expõe `mouse` — partículas reagem
- **Sem Framer Motion nas cenas:** Animações Three.js são nativas (GPU), não CSS

---

> *"Cada cena não é um fundo — é uma janela para a mente do agente."*
