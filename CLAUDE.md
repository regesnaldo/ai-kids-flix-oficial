# 📁 Instruções da Pasta — MENTE.AI (AI-KIDS-OFICIAL)

## 🎯 Visão Geral do Projeto

**MENTE.AI** é uma plataforma educacional imersiva que ensina Inteligência Artificial para públicos não técnicos através de experiências interativas, visualizações 3D, agentes de IA especializados e áudio em português do Brasil.

**Premissa:** *"Mentes são formadas, não formatadas."*

---

## 🏗️ Arquitetura Técnica

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Framework** | Next.js (App Router) | 16.1.6 |
| **Linguagem** | TypeScript | 5.x |
| **Estilos** | Tailwind CSS | 3.x |
| **3D** | Three.js / @react-three/fiber | r128 / 8.x |
| **Animações** | Framer Motion | 11.x |
| **Estado** | Zustand | 4.x |
| **Áudio TTS** | ElevenLabs API | v1 |
| **Chat IA** | Anthropic Claude Haiku | claude-haiku-4-5 |
| **Banco** | TiDB Cloud | MySQL-compat |
| **ORM** | Drizzle | 0.x |
| **Build** | Turbopack | Incluído no Next.js 16 |

---

## 📂 Estrutura de Arquivos Principal

```
/src
  /app/(main)/
    /home/              → Página inicial com carrosséis de agentes
    /laboratorio/       → Laboratório Virtual (4 zonas interativas)
    /biblioteca/        → Biblioteca Viva (livros conceituais)
    /ranking/           → Ranking semanal de XP
    /api/               → Rotas de API (chat, tts, xp, notes)
  
  /components/
    /laboratorio/       → Componentes do lab (AudioController, LabChat, ZoneSelector)
    /biblioteca/        → Componentes da biblioteca (BookModal)
    /zones/             → Cenas 3D por zona (Transformers, Redes, Criativa, Etica)
  
  /cognitive/audio/
    ambientEngine.ts    → Motor de áudio ambiente (Tone.js) — ⚠️ EM MOCK
    testAudio.ts        → Arquivo de teste de áudio
  
  /canon/agents/
    all-agents.ts       → Definição de TODOS os agentes do sistema — ⚠️ CRÍTICO
  
  /hooks/
    useAudio.ts         → Hook ElevenLabs TTS
    useTTS.ts           → Hook TTS isolado (alternativo)
  
  /store/
    useLabStore.ts      → Estado global do laboratório (Zustand)
```

---

## ✅ Erros Corrigidos (Status Atual)

| # | Erro | Status | Solução Aplicada |
|---|------|--------|-----------------|
| #01 | Card cortado na Home | ✅ **CORRIGIDO** | padding-right 80px no container de scroll |
| #02 | Agentes sem personalidade | ✅ **CORRIGIDO** | NEXUS, VOLT, AURORA, ETHOS adicionados ao all-agents.ts |
| #04 | Tone.js NotSupportedError | ✅ **WORKAROUND** | ambientEngine.ts em modo MOCK |
| #05 | ParticleField redirecionando | ✅ **WORKAROUND** | interactive={false} aplicado |
| #06 | Botões de áudio duplicados | ✅ **RESOLVIDO** | LabAudioButton removido, mantido apenas AudioController |
| #07 | BookModal TTS encoding | ✅ **CORRIGIDO** | encodeURIComponent() aplicado na URL TTS |

---

## ⚠️ Erros para Monitorar (Baixa Prioridade)

| # | Erro | Impacto | Ação |
|---|------|---------|------|
| #08 | Chat sem persistência | Baixo | Implementar localStorage ou DB na próxima sprint |
| #09 | Warnings ESLint | Baixo | Alinhar versões na próxima atualização |
| #10 | Middleware deprecado | Baixo | Migrar middleware.ts → proxy.ts (Next.js 16) |

---

## 🚫 O Que NÃO Fazer

1.  **NÃO reinstalar dependências** sem necessidade — o projeto está estável.
2.  **NÃO modificar `ambientEngine.ts`** — está em MOCK intencionalmente para evitar erros de Tone.js.
3.  **NÃO adicionar novos botões de áudio** — já há conflitos resolvidos.
4.  **NÃO remover agentes do `all-agents.ts`** — NEXUS, VOLT, AURORA, ETHOS são críticos para o laboratório.
5.  **NÃO rodar múltiplas instâncias do `npm run dev`** — causa corrupção do cache do Turbopack.

---

## ✅ Padrões de Desenvolvimento

### 1. Sempre Validar com Build
```powershell
npm run build
```
Antes de considerar qualquer correção como concluída.

### 2. Usar PowerShell para Modificações
Todos os comandos de modificação de arquivos devem ser via PowerShell para consistência:
```powershell
Set-Content -Path "caminho/do/arquivo" -Value $conteudo -Encoding UTF8
```

### 3. Backup Antes de Modificar
```powershell
Copy-Item "arquivo.ts" "arquivo.ts.bak" -ErrorAction SilentlyContinue
```

### 4. Limpar Cache do Next.js Após Mudanças Críticas
```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
```

### 5. Nunca Rodar Múltiplas Instâncias do Dev Server
Isso corrompe o cache do Turbopack e causa erros de persistência.

---

## 🔑 Arquivos Críticos (Não Modificar Sem Necessidade)

| Arquivo | Função | Risco |
|---------|--------|-------|
| `src/canon/agents/all-agents.ts` | Define TODOS os agentes do sistema | 🔴 ALTO — Quebra o chat se corrompido |
| `src/app/api/chat/route.ts` | API de chat com Claude | 🔴 ALTO — Quebra toda comunicação |
| `src/app/api/tts/route.ts` | API ElevenLabs TTS | 🔴 ALTO — Quebra áudio educativo |
| `src/cognitive/audio/ambientEngine.ts` | Motor de áudio (MOCK) | 🟠 MÉDIO — Pode reintroduzir erros de Tone.js |
| `src/store/useLabStore.ts` | Estado global do laboratório | 🟠 MÉDIO — Pode quebrar navegação entre zonas |

---

## 🧪 Testes de Validação Após Qualquer Mudança

1.  **Build passa sem erros:**
    ```powershell
    npm run build
    ```

2.  **Home — Carrosséis:**
    -   Último card de cada linha aparece completo
    -   Botões de seta não sobrepõem conteúdo

3.  **Laboratório — Chat:**
    -   Cada zona responde com agente correto (NEXUS, VOLT, AURORA, ETHOS)
    -   Personalidade do agente corresponde à zona

4.  **Biblioteca — TTS:**
    -   Botão de áudio dos livros toca sem mostrar "..."
    -   Títulos com acentos funcionam corretamente

5.  **Console do Navegador:**
    -   Sem erros vermelhos de `NotSupportedError`
    -   Sem erros de `Cannot redeclare exported variable`

---

## 📝 Comandos PowerShell Úteis

```powershell
# Validar build
npm run build

# Limpar cache
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Buscar referências a um componente
Get-ChildItem -Recurse -Include *.tsx,*.ts -Exclude "node_modules" | Select-String -Pattern "NomeDoComponente"

# Contar ocorrências de um agente no all-agents.ts
(Select-String -Path "src\canon\agents\all-agents.ts" -Pattern "export const NEXUS").Count

# Backup de arquivo crítico
Copy-Item "src\canon\agents\all-agents.ts" "src\canon\agents\all-agents.ts.bak" -ErrorAction SilentlyContinue
```

---

## 🎯 Prioridades para Próximas Sprints

| Prioridade | Tarefa | Complexidade |
|-----------|--------|-------------|
| 🔴 URGENTE | Nenhuma — todos erros críticos corrigidos | — |
| 🟠 ALTA | Implementar persistência do chat (localStorage/DB) | Média |
| 🟡 MÉDIA | Migrar middleware.ts → proxy.ts | Baixa |
| 🟢 BAIXA | Alinhar warnings ESLint | Baixa |

---

## 🆘 Em Caso de Erro

1.  **Identifique o arquivo e linha** no stack trace
2.  **Verifique se há backup** `.bak` do arquivo
3.  **Rode `npm run build`** para confirmar o erro
4.  **Cole o erro completo** para diagnóstico
5.  **NÃO tente corrigir sem validar no build**

---

## 📞 Contato e Contexto

-   **Projeto:** MENTE.AI — Laboratório Virtual de IA
-   **Ambiente:** Windows 11, PowerShell, Node.js v25.2.1
-   **IDE:** VS Code (recomendado)
-   **Deploy:** Vercel (variáveis de ambiente configuradas)
-   **Última Atualização:** Março 2026

---

> **Regra de Ouro:** *"Se o build passa e os testes de validação funcionam, a correção está concluída. Não otimize prematuramente."*

---

**Fim das Instruções da Pasta — MENTE.AI v1.0**