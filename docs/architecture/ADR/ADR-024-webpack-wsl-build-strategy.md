# ADR-024: Estratégia de Build — Webpack no WSL

## Status
**Accepted** — Junho 2026

## Contexto

O ambiente de desenvolvimento primário é WSL (Windows Subsystem for Linux). O projeto está em `/mnt/c/`, o que cria um problema: o Turbopack (bundler padrão do Next.js 16) não consegue lidar com lockfiles cross-platform (Windows ↔ Linux).

Sintoma: `npm run dev` falha com erros de permissão e lockfile no WSL.

## Decisão

**Usar Webpack em vez de Turbopack no ambiente WSL.** Comando padrão: `npm run dev -- --webpack`.

## Por quê?

1. **Webpack é maduro:** 10+ anos de edge cases resolvidos. Turbopack é novo (2023+) e ainda tem bugs cross-platform.
2. **Performance aceitável:** Webpack é mais lento (~2s vs ~0.5s HMR), mas a diferença não justifica o custo de debuggar Turbopack.
3. **Compilação idêntica:** O build de produção (`npm run build`) usa Webpack de qualquer forma. Dev e prod usam o mesmo bundler = menos surpresas.
4. **Solução simples:** `--webpack` é uma flag documentada do Next.js. Sem workarounds frágeis.

## Alternativas Consideradas

- **Mover projeto para dentro do filesystem Linux (ext4)** — rejeitado. Projeto está em `/mnt/c/` porque o desktop do Windows é o workspace do desenvolvedor. Mover quebraria o fluxo de trabalho.
- **Turbopack com symlinks** — rejeitado. Workaround frágil que quebra a cada update do Next.js.
- **Dev no Windows nativo (PowerShell)** — rejeitado. Node.js no Windows tem problemas com path e scripts que assumem Linux.

## Consequências

### Positivas
- Ambiente de dev estável e previsível
- Mesmo bundler em dev e produção
- Zero bugs cross-platform

### Negativas
- HMR mais lento (~2s vs ~0.5s)
- Não usa a tecnologia mais recente do Next.js
- Pode precisar ser revisto quando Turbopack estabilizar

## Evolução Futura

- Reavaliar Turbopack a cada major release do Next.js (17, 18...)
- Se o projeto migrar para dev containers ou GitHub Codespaces, Turbopack pode voltar
