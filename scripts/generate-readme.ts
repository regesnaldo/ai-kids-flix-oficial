import { writeFileSync } from 'fs';

const readme = `# 🧠 MENTE.AI

> Plataforma de Inteligência Emocional e Autoconhecimento

## 🎯 Sobre

MENTE.AI é uma experiência interativa que combina:
- 🤖 **120 Agentes** com personalidades únicas divididos em 12 Dimensões.
- 🎬 **Player de vídeo** estilo Netflix para aprendizado emocional.
- 🧪 **Laboratório de Inteligência Viva** com áudio e visuais reativos.
- 🏆 **Gamificação** com sistema de badges e streaks de autoconhecimento.

## 🚀 Quick Start

\`\`\`bash
# Instalar dependências
npm install

# Iniciar desenvolvimento (Windows fix incluído)
npm run dev:clean

# Build production
npm run build

# Rodar todos os testes (Unitários + E2E)
npm run test:all
\`\`\`

## 📁 Estrutura do Projeto

\`\`\`
MENTE.AI/
├── src/
│   ├── app/
│   │   ├── (main)/
│   │   │   └── laboratorio/simulador/   # Core Hub (Laboratório)
│   │   ├── onboarding/                 # Fluxo de Boas-vindas
│   │   └── layout.tsx
│   ├── canon/
│   │   └── agents/                     # Definição dos 120 agentes
│   ├── cognitive/                      # Motores de análise emocional
│   └── components/                     # Componentes React reutilizáveis
├── tests/
│   └── e2e/                            # Testes de integração (Playwright)
├── docs/                               # Documentação técnica e guias
└── scripts/                            # Scripts de automação e limpeza
\`\`\`

## 🧪 Suíte de Testes

\`\`\`bash
# Unitários (Jest)
npm run test

# E2E (Playwright)
npm run test:e2e

# Cobertura de Código
npm run test:coverage

# Validação Arquitetural
npm run arch:validate
\`\`\`

## 🌐 Produção

- **URL:** [https://mente-ai.vercel.app](https://mente-ai.vercel.app)
- **Status:** ✅ Online e Estável

## 📚 Documentação Adicional

- [Guia de Testes](docs/TESTING_GUIDE.md)
- [Protocolo Arquitetural](docs/ARCHITECTURE_PROTOCOL.md)
- [Diário de Decisões (ADR)](docs/ARCHITECTURE_DECISIONS.md)
- [Mapa de Hot Spots](docs/architecture/heatmap-report.md)

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), React 18, TypeScript
- **Estilização:** Tailwind CSS, Framer Motion
- **Áudio:** Web Audio API
- **Qualidade:** Jest, Playwright, Madge
- **Deploy:** Vercel

---
**Desenvolvido com ❤️ pelo Agente MENTE.AI Build**
`;

writeFileSync('README.md', readme, 'utf-8');
console.log('✅ README.md gerado com sucesso!');
