# 🔍 Pontos Cegos Operacionais — MENTE.AI

> **O que ainda nao vemos. O que ainda nao medimos. O que ainda confiamos na sorte.**  
> Honestidade radical sobre as fragilidades do ecossistema.

---

## 🧠 FILOSOFIA

Toda civilizacao tem pontos cegos — areas onde a governanca nao alcanca, onde a observabilidade nao ve, onde o conhecimento ainda e tribal.

Reconhecer pontos cegos nao e fraqueza. E o primeiro passo para elimina-los.

**Analogia:** Um hospital que so monitora a temperatura dos pacientes mas nunca checa a pressao arterial esta criando uma falsa sensacao de seguranca.

---

## 🔴 PONTOS CEGOS CRITICOS

### 1. Streaming sem resiliência de rede

**O que e:** Se a conexao SSE cair no meio de uma resposta longa do agente, o usuario perde tudo.

**Por que e cego:** Nao ha retry, checkpoint ou buffer de reconexao. O sistema assume que a conexao e sempre estavel.

**Risco:** Em redes moveis ou conexoes ruins, a experiencia degrada silenciosamente.

**O que fazer:** Buffer de ultimos N tokens no backend. Se conexao cair, usuario reconecta e recebe o restante.

### 2. Memoria sem backup testado

**O que e:** O TiDB tem backups automaticos, mas nunca foi testado um restore completo.

**Por que e cego:** "Backup existe" nao e igual a "backup funciona".

**Risco:** Em caso de corrupcao, as memorias de todos os usuarios podem ser perdidas.

**O que fazer:** Teste de restore trimestral. Documentar procedimento em DATABASE.md.

### 3. Dependencia silenciosa de APIs externas

**O que e:** Anthropic, OpenAI, ElevenLabs — se qualquer uma cair, parte do produto para de funcionar.

**Por que e cego:** Fallbacks existem (browser TTS, resposta simples), mas nao sao monitorados para qualidade.

**Risco:** Degradacao nao detectada. Usuario recebe resposta pior e nao sabe por que.

**O que fazer:** Monitorar taxa de fallback. Alertar se > 5% das requisicoes estao em fallback.

### 4. Testes E2E nao deterministicos

**O que e:** Testes que dependem de API externa quebram quando a API esta lenta ou fora do ar.

**Por que e cego:** Falso negativo gera ruido. Time comeca a ignorar falhas de teste.

**Risco:** Testes que ninguem confia sao piores que nenhum teste.

**O que fazer:** Mocks deterministicos para APIs externas nos testes. Separar testes de integracao real (rodam 1x/dia).

### 5. Onboarding nunca validado com humano real

**O que e:** CONTRIBUTING.md foi escrito por IA. Nenhum dev humano novo tentou segui-lo.

**Por que e cego:** O guia pode estar correto mas ser inutil na pratica.

**Risco:** Dev novo desiste ou ignora o guia — documentacao vira peso morto.

**O que fazer:** Teste de onboarding: dev novo, cronometrado, feedback documentado.

---

## 🟡 PONTOS CEGOS MODERADOS

### 6. Governanca parcialmente manual

**O que e:** Regras existem, mas enforcement depende de disciplina humana.

**Por que e cego:** Um dev apressado pode commitar sem ADR se pular o CI.

**Risco:** Degradacao lenta da qualidade arquitetonica.

### 7. Narrativa nao validada com usuarios reais

**O que e:** Todo o universo narrativo e internamente consistente, mas nunca foi testado com 100 usuarios.

**Por que e cego:** Consistencia interna nao garante engajamento externo.

**Risco:** Construimos um universo que usuarios nao se importam.

### 8. Falta de testes de carga

**O que e:** Arquitetura de streaming, memoria e ToT foi projetada para escala mas nunca testada com > 10 usuarios.

**Por que e cego:** "Funciona no papel" nao e igual a "funciona com 1000 usuarios".

**Risco:** Primeiro pico de uso real revela gargalos que exigem re-arquitetura.

---

## 🟢 PONTOS CEGOS MENORES (conhecidos, monitorados)

- Dependencia de IA para manutencao de documentacao (CI ajuda)
- Complexidade de onboarding (CONTRIBUTING.md como fast path)
- Logs sem agregacao (Sentry cobre producao, dev e console)

---

> *"O ponto cego mais perigoso nao e o que voce sabe que existe — e o que voce nem imagina que esta la."*
