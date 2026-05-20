# ADR-025: Imersão Cognitiva no Frontend

## Status
**Accepted** — Junho 2026

## Contexto

O MENTE.AI não é uma plataforma de cursos — é um metaverso narrativo. A experiência do usuário precisa refletir isso em cada pixel. A pergunta era: como traduzir "arquitetura cognitiva" em experiência visual?

## Decisão

**Design system cyberpunk imersivo com 5 princípios: (1) atmosfera sobre informação, (2) transições sobre carregamentos, (3) personalidade sobre genérico, (4) partículas sobre estático, (5) escuridão como tela.**

## Por quê?

1. **Atmosfera sobre informação:** A home não lista features — ela mergulha o usuário em partículas interativas. O aprendizado começa antes da primeira palavra.

2. **Transições sobre carregamentos:** 6 loading states contextuais ("Conectando ao metaverso...", "Atravessando o portal...") em vez de spinners genéricos. Cada espera é parte da narrativa.

3. **Personalidade sobre genérico:** Cada agente tem cor, cena 3D e voz únicos. O design system não é "uma paleta" — são 12 paletas, uma por agente.

4. **Partículas sobre estático:** Canvas de partículas (80 partículas que reagem ao mouse) na home. Fundo nunca é "só uma cor" — é um organismo vivo.

5. **Escuridão como tela:** Fundo `#0a0a1a` universal. Não é "dark mode" — é o universo. A escuridão faz as cores neon brilharem.

## Alternativas Consideradas

- **Design tradicional (light mode, cards brancos)** — rejeitado. Pareceria "mais um app". A imersão começa no design.
- **Tema claro/escuro toggle** — rejeitado. O universo é escuro. Um toggle quebraria a diegese (a lógica interna do mundo narrativo).

## Consequências

### Positivas
- Identidade visual única e memorável
- Design que reforça a narrativa (diegese)
- 6 loading states que transformam espera em experiência

### Negativas
- Dark-only pode alienar usuários que preferem light mode
- Cenas 3D pesadas em dispositivos low-end
- Manutenção de 12 paletas de cores

## Evolução Futura

- Temas por agente (fundo muda sutilmente ao entrar no universo de cada um)
- Acessibilidade: modo de alto contraste como alternativa ao dark-only
