# ADR-023: Governança de Documentação — Master Index como Fonte Única

## Status
**Accepted** — Junho 2026

## Contexto

Entre março e junho de 2026, o MENTE.AI passou de 18 arquivos .md desorganizados para 40+ documentos de engenharia estruturados. O crescimento acelerado criou um risco: documentação duplicada, desatualizada, ou contraditória.

Era necessário um sistema de governança que garantisse que a documentação permanecesse coerente conforme o projeto escala.

## Decisão

**Master Index como fonte única da verdade + ADRs como memória de decisões + Archive como preservação histórica.** Três regras fundamentais: (1) se não está no Master Index, não é canônico; (2) ADRs nunca são deletados; (3) documentos obsoletos vão para archive, não para a lixeira.

## Por quê?

1. **Prevenção de entropia documental:** Sem governança, documentação diverge do código. O Master Index força um "commit de documentação" junto com cada mudança.
2. **Onboarding acelerado:** Novo dev/humano/IA lê o Master Index e sabe exatamente onde cada coisa está.
3. **Memória institucional:** ADRs preservam o raciocínio por trás das decisões — a parte mais valiosa e mais perecível do conhecimento de engenharia.
4. **Nunca perder história:** Archive preserva documentos que não são mais canônicos, mas que contam a evolução do projeto.

## Alternativas Consideradas

- **Wiki (Notion/Confluence)** — rejeitada. Documentação separada do código diverge inevitavelmente. Docs no repositório viajam com o código.
- **Apenas código (zero documentação)** — rejeitada. "O código é a documentação" funciona para projetos de 1 pessoa. Para civilizações cognitivas, é amnésia garantida.

## Consequências

### Positivas
- Documentação e código versionados juntos
- Histórico completo de decisões (17→25 ADRs)
- Archive preserva evolução do projeto

### Negativas
- Overhead de manter Master Index atualizado
- Risco de inconsistência se atualizações não forem disciplina

## Evolução Futura

- CI validation de links quebrados (implementado: `scripts/validate-docs.py`)
- Templates de documentação por tipo (ADR, API doc, fluxo)
