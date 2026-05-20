# 🤖 AGENTS.md — MENTE.AI

> **Este arquivo é um alias de compatibilidade.**  
> O arquivo canônico para agentes de IA é [`CLAUDE.md`](CLAUDE.md).

---

## POR QUE ESTE ARQUIVO EXISTE?

Ferramentas diferentes procuram arquivos diferentes:

| Ferramenta | Arquivo que procura |
|-----------|-------------------|
| Claude Code | `CLAUDE.md` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Cursor | `.cursorrules` |
| Windsurf | `.windsurfrules` |
| OpenCode | `AGENTS.md` |
| Cline | `.clinerules` |

O MENTE.AI mantém **um único arquivo canônico** (`CLAUDE.md`) para evitar divergência — se dois arquivos existirem, um será atualizado e o outro ficará desatualizado. Já cometemos esse erro antes (ver `docs/archive/AGENTS.md` — duplicado e depois arquivado).

## ESTRATÉGIA

**`CLAUDE.md` é o arquivo canônico.** Contém:
- Product DNA
- Regras comportamentais
- Stack técnica exata
- Estrutura do projeto
- Regras críticas (Drizzle-only, cookie `mente_ai_token`, etc.)
- Workflows padrão
- Design reference

**`AGENTS.md` (este arquivo) é apenas um ponteiro.** Ele existe unicamente para ferramentas que procuram `AGENTS.md`. Leia `CLAUDE.md` para o conteúdo real.

## REGRA DE OURO

Se você é um agente de IA ou um desenvolvedor:

1. **Leia `CLAUDE.md`** — lá está tudo
2. **Atualize APENAS `CLAUDE.md`** — nunca este arquivo
3. **Se adicionar uma ferramenta nova que procura outro nome** — crie um arquivo ponteiro como este

---

*"Um sistema com duas fontes da verdade não tem verdade nenhuma."*
