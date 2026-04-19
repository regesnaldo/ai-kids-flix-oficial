## 1.Architecture design
```mermaid
graph TD
  A["User Browser"] --> B["Next.js (React) Frontend"]
  B --> C["Next.js Route Handlers (/api/*)"]
  C --> D["LLM APIs (OpenAI / Anthropic)"]
  C --> E["Stripe API"]
  C --> F["MySQL Database (Drizzle ORM)"]

  subgraph "Frontend Layer"
    B
  end

  subgraph "Backend Layer (Next.js)"
    C
  end

  subgraph "External Services"
    D
    E
  end

  subgraph "Data Layer"
    F
  end
```

## 2.Technology Description
- Frontend: Next.js@16 + React@19 + TailwindCSS@4
- Backend: Next.js Route Handlers (App Router)
- Database: MySQL + drizzle-orm
- State/UI: Zustand + Framer Motion + Radix UI
- Payments: Stripe
- AI: OpenAI SDK + Anthropic SDK

## 3.Route definitions
| Route | Purpose |
|-------|---------|
| / | Redirecionar para /home |
| /home | Home estilo Netflix (descoberta + rows) |
| /aulas | Catálogo estruturado (fases/temporadas/episódios) |
| /player | Player do episódio (query: episode) |
| /explorar | Biblioteca/exploração |
| /agentes | Catálogo de mentores |
| /agentes/[id] | Detalhe do mentor |
| /onboarding | Gate/configuração inicial |
| /login | Autenticação |
| /perfil | Página de perfil |
| /conta | Hub de conta e subrotas |
| /planos | Página de planos |
| /sucesso | Pós-checkout |

## 4.API definitions
### 4.1 Core API (Route Handlers)
- POST /api/interaction: gerar perguntas/itens interativos para o player
- POST /api/chat: chat/assistência
- POST /api/voice/transcribe: transcrição de áudio
- POST /api/checkout: iniciar checkout
- POST /api/webhooks/stripe: webhook do Stripe
- POST /api/xp e /api/xp/events: eventos de XP/gamificação
- POST /api/lab/transformer: demo/experimentos

## 6.Data model(if applicable)
### 6.1 Data model definition
```mermaid
erDiagram
  USERS ||--o{ PROFILES : has
  USERS ||--o{ WATCH_PROGRESS : tracks
  SERIES ||--o{ EPISODES : contains
  USERS ||--o{ FAVORITES : saves
  USERS ||--o{ CHAT_HISTORY : writes

  USERS {
    int id
    string email
    string role
    string subscriptionPlan
  }
  PROFILES {
    int id
    int userId
    string name
    string ageGroup
  }
  SERIES {
    int id
    string title
    string category
  }
  EPISODES {
    int id
    int seriesId
    int seasonNumber
    int episodeNumber
    string title
  }
  WATCH_PROGRESS {
    int id
    int userId
    int seriesId
    int episodeId
    int progressSeconds
    bool isCompleted
  }
  FAVORITES {
    int id
    int userId
    int seriesId
  }
  CHAT_HISTORY {
    int id
    int userId
    string userMessage
  }
```
