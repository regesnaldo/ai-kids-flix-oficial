# 🏪 Gerenciamento de Estado — MENTE.AI

> **5 lojas. 1 cidade. Zero caos.**  
> Como o MENTE.AI mantém estado consistente em 56+ páginas.

---

## 🧠 FILOSOFIA

Pense no estado do MENTE.AI como **salas de memória compartilhada** espalhadas pela cidade:

- Cada sala (store) tem um **propósito único**
- As salas **não se sobrepõem** — cada dado tem um dono claro
- Qualquer cidadão (componente) pode **entrar na sala** e ler o que precisa
- Quando algo muda na sala, **apenas quem está olhando aquela informação** reage

Isso é o oposto de uma "assembleia geral" (Context API pura), onde qualquer mudança faz todo mundo reagir.

---

## 🗺️ AS 5 STORES

```
┌─────────────────────────────────────────────────────────┐
│                    MENTE.AI State                        │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │ useApp   │ │useUser   │ │ useLab   │ │useUniverse │ │
│  │ Store    │ │Store     │ │ Store    │ │Store       │ │
│  │          │ │          │ │          │ │            │ │
│  │ • tema   │ │ • auth   │ │ • exp    │ │ • agente   │ │
│  │ • nav    │ │ • perfil │ │ • estado │ │ • decisão  │ │
│  │ • layout │ │ • plano  │ │ • output │ │ • fase     │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬──────┘ │
│       │             │             │              │       │
│       └─────────────┼─────────────┼──────────────┘       │
│                     │             │                      │
│              ┌──────▼─────────────▼──────┐               │
│              │       useNexusStore       │               │
│              │  (orquestração central)   │               │
│              │  • conexões ativas        │               │
│              │  • fluxo narrativo        │               │
│              │  • estado do metaverso    │               │
│              └───────────────────────────┘               │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 DETALHAMENTO POR STORE

### 1. `useAppStore` — A Recepção

**Responsabilidade:** Estado global da aplicação.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `theme` | `'dark'` | Tema (sempre escuro no MENTE.AI) |
| `sidebarOpen` | `boolean` | Sidebar expandida/recolhida |
| `currentRoute` | `string` | Rota ativa para highlight no nav |
| `isLoading` | `boolean` | Estado de carregamento global |

**Quem usa:** Layout principal, navegação, todas as páginas.

**Analogia:** A recepção do prédio — controla iluminação, placas, diretórios.

---

### 2. `useUserStore` — O Documento de Identidade

**Responsabilidade:** Dados do usuário autenticado.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `user` | `User \| null` | Dados do usuário (id, email, nome) |
| `profile` | `Profile \| null` | Perfil cognitivo (avatar, arquétipo) |
| `plan` | `'free' \| 'pro'` | Plano de assinatura |
| `isAuthenticated` | `boolean` | Status de autenticação |

**Quem usa:** Middleware, páginas de conta, chat (extrai userId).

**Analogia:** Seu documento de identidade dentro da cidade — todo lugar que você vai, ele te identifica.

---

### 3. `useLabStore` — O Laboratório

**Responsabilidade:** Estado do Laboratório de Inteligência Viva.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `activeExperiment` | `string \| null` | Experimento atual (transformer, diffusion...) |
| `experimentState` | `object` | Estado interno do experimento |
| `outputHistory` | `array` | Histórico de outputs do experimento |
| `isRunning` | `boolean` | Experimento em execução |

**Quem usa:** Páginas do laboratório, componentes de experimento.

**Analogia:** A bancada do laboratório — cada experimento tem seu espaço, ferramentas e resultados.

---

### 4. `useUniverseStore` — O Portal dos Agentes

**Responsabilidade:** Estado do universo/agente atual.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `activeAgent` | `Agent \| null` | Agente com quem o usuário está interagindo |
| `currentDecision` | `Decision \| null` | Decisão narrativa pendente |
| `phase` | `number` | Fase narrativa atual (1-5) |
| `season` | `number` | Temporada atual (1-50) |

**Quem usa:** Páginas de universo, chat do agente, motor narrativo.

**Analogia:** O portal que te leva ao universo de um agente específico — cada portal tem suas regras, atmosfera e história.

---

### 5. `useNexusStore` — O Orquestrador Central

**Responsabilidade:** Estado de orquestração entre agentes.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `activeConnections` | `string[]` | Conexões ativas entre agentes |
| `narrativeFlow` | `object` | Estado do fluxo narrativo global |
| `metaverseState` | `object` | Estado compartilhado do metaverso |

**Quem usa:** NEXUS (orquestrador), sistema de conflitos, phase router.

**Analogia:** A central de controle do metaverso — NEXUS usa esta sala para coordenar todos os outros agentes.

---

## 🔄 FLUXO DE DADOS

```
Usuário interage
      │
      ▼
┌─────────────────┐
│  Componente      │  ← Lê estado via hook (useAppStore, useUserStore...)
│  (página/UI)     │
└────────┬────────┘
         │ dispatch action
         ▼
┌─────────────────┐
│  Zustand Store   │  ← Atualiza estado (imutável)
│  (set/get)       │
└────────┬────────┘
         │ notifica apenas subscribers afetados
         ▼
┌─────────────────┐
│  Componentes     │  ← Re-renderizam seletivamente
│  (apenas quem   │     (selectors atômicos)
│   usa o campo)  │
└─────────────────┘
```

---

## 🚫 ANTI-PADRÕES EVITADOS

| Anti-padrão | Por que foi evitado |
|-------------|-------------------|
| **Prop drilling** | Passar `user` por 10 níveis de componente. Substituído por `useUserStore()`. |
| **Context API para tudo** | Qualquer mudança re-renderiza a árvore inteira. Stores têm selectors. |
| **Estado no localStorage sem store** | Dados duplicados, inconsistência. Stores têm middleware `persist`. |
| **Redux boilerplate** | Actions, reducers, dispatchers para 5 domínios seriam 300+ linhas. Zustand: ~150 linhas totais. |
| **useState em componente pai** | Estado que 5 componentes precisam — vai para a store, não para o pai. |

---

## 💾 PERSISTÊNCIA

Stores que precisam sobreviver a reloads usam o middleware `persist` do Zustand:

```typescript
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    { name: 'mente-user-store' }  // chave no localStorage
  )
);
```

**Quem persiste:** `useUserStore` (auth + perfil).  
**Quem NÃO persiste:** `useLabStore` (experimentos são efêmeros), `useAppStore` (UI state).

---

## 🧪 POR QUE ZUSTAND?

Ver [ADR-012](ADR/ADR-012-zustand-state-management.md) para a decisão completa.

Resumo: 1KB gzipped, zero boilerplate, selectors atômicos, persist middleware nativo. Ideal para 5 domínios independentes.

---

> *"Bom estado é como boa memória — você encontra o que precisa sem revirar a casa inteira."*
