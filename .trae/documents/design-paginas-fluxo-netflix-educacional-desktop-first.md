# Design de Páginas (desktop-first) — Fluxo Netflix educacional

## Global Styles (tokens)
- Background: #0a0a1a / zinc-950
- Texto primário: #FFFFFF; secundário: rgba(255,255,255,0.65)
- Accent primário: #00D9FF (progresso/ações); Accent secundário: #E50914 (ênfase)
- Tipografia: escala 12/14/16/20/28/42 (sm → hero)
- Botões:
  - Primário: fundo claro (branco) com texto escuro; hover: leve scale/elevação
  - Secundário: fundo translúcido + borda branca 20–30%
- Estados:
  - Focus ring visível (outline + glow)
  - Cards hover: scale 1.03–1.06 + sombra

---

## Página: Home ("/home")
### Meta Information
- Title: "MENTE.AI — Início"
- Description: "Descubra temporadas, retome o que você começou e explore mentores."
- OG: title/description + imagem do destaque (billboard)

### Layout
- Estrutura em camadas: Hero fullscreen (85vh) + seção de rows com margem negativa (efeito Netflix).
- Grid/Flex híbrido:
  - Hero: coluna esquerda (copy + CTAs) e card visual à direita.
  - Rows: containers horizontais com overflow-x auto + botões de navegação.

### Page Structure
1. Header fixo (marca + navegação)
2. Hero/Billboard
3. Rows (carrosséis)
4. CTA contextual (ex.: Lab) ao final

### Sections & Components
- Header
  - Logo (link para "/")
  - Navigation (links principais)
- Hero
  - Badge do destaque + título grande + subtítulo
  - CTA primário: "Começar" → "/onboarding"
  - CTA secundário: "Explorar mentores" → "/agentes"
  - Indicador de slides (dots)
- Rows
  - Título da fileira + link "Ver todos"
  - Cards 200x300 com imagem, tag, nome, descrição no hover
- CTA final
  - Card com texto + botão (somente para rota válida)

---

## Página: Aulas ("/aulas")
### Meta Information
- Title: "Aulas e Módulos — MENTE.AI"
- Description: "Catálogo por fases e temporadas com progresso e XP."

### Layout
- Header sticky com resumo (total módulos + concluídos) e link de volta.
- Conteúdo central (max-w-7xl) em coluna.

### Page Structure
1. Header sticky
2. Tabs horizontais de “Fases” (scroll)
3. Card de progresso da fase (barra)
4. Lista de temporadas
5. Grid de episódios por temporada

### Sections & Components
- Tabs de fase: estados ativo/inativo com borda/hover
- Temporada:
  - Título + tags (novo) + sinopse (line-clamp)
- Card de episódio:
  - Badge de tipo (teoria/lab/desafio/...)
  - Título + descrição curta
  - Metadados (minutos, XP, agente)
  - Barra de progresso (quando >0)
  - Clique abre "/player?episode=..."

---

## Página: Player ("/player")
### Meta Information
- Title: "Player — MENTE.AI"
- Description: "Assista ao episódio e conclua a missão interativa."

### Layout
- Experiência modal/fullscreen:
  - Fundo com textura sutil (stars/dots)
  - Side rail (60px) fixo à esquerda (atalhos)
  - Painel “Commander” no canto superior direito
  - Portal central com CTA “Continuar missão”

### Page Structure
1. Side rail (menu/atalhos)
2. HUD “Commander” (XP/progresso)
3. Portal central (retomar episódio)
4. Modal de missão (player de vídeo + overlay de quiz)

### Sections & Components
- Modal de missão:
  - Player de vídeo com gradient overlay
  - Checkpoint (quiz) centralizado:
    - Pergunta + botão de áudio
    - Opções selecionáveis
    - Ações: pular / confirmar
  - Rodapé: título/sinopse + progresso %

---

## Página: Agentes ("/agentes") e Detalhe ("/agentes/[id]")
### Meta Information
- Title: "Mentores — MENTE.AI"
- Description: "Explore agentes por estilo e encontre o mentor ideal."

### Layout
- Grid responsivo (desktop: 4–6 colunas) + busca/filtro (se já existir no layout atual).

### Sections & Components
- Lista: cards compactos com imagem, nome, tag/estilo
- Detalhe: hero do agente + descrição + CTAs para abrir conteúdos relacionados (linkando para "/aulas" e/ou "/player")

---

## Página: Onboarding/Login
### Meta Information
- Title: "Começar — MENTE.AI"
- Description: "Configure preferências e entre para continuar."

### Layout
- Uma coluna, centralizada, com etapas curtas.
- Componentes: WelcomeScreen, InteractiveTutorial, AgentSelector (se aplicável).
