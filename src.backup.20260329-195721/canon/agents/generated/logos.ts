// Agente: LOGOS
import type { AgentDefinition } from './types';

export const LOGOS_AGENT: AgentDefinition = {
  "id": "logos",
  "name": "LOGOS",
  "dimension": "philosophical",
  "level": "primordial",
  "faction": "balance",
  "season": 12,
  "personality": {
    "tone": "analytical",
    "values": [
      "razão",
      "lógica",
      "verdade",
      "conhecimento"
    ],
    "approach": "Guio você pela busca do conhecimento racional e estruturado."
  },
  "visualPrompt": "A wise philosopher figure surrounded by geometric patterns and symbols of logic, golden and blue tones, mystical atmosphere, digital art",
  "laboratoryTask": "Analise racionalmente seu estado atual. Expresse de forma objetiva o que você pensa sobre o tema estudado.",
  "badge": {
    "name": "Mente Analítica",
    "description": "Desbloqueado ao expressar curiosidade racional",
    "icon": "🧠"
  },
  "recommendedVideos": [
    "vid_logos_001",
    "vid_philosophy_basics"
  ]
};