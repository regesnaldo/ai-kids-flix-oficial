import type { Emotion } from "@/cognitive/audio/ambientEngine";

export function detectEmotion(text: string): Emotion {
  const lower = text.toLowerCase();

  const joyKeywords = [
    "feliz",
    "alegre",
    "bom",
    "otimo",
    "ótimo",
    "maravilha",
    "amor",
    "gracas",
    "graças",
  ];
  const sadnessKeywords = [
    "triste",
    "ruim",
    "pessimo",
    "péssimo",
    "chorar",
    "dor",
    "saudade",
  ];
  const tensionKeywords = [
    "raiva",
    "medo",
    "tenso",
    "ansioso",
    "preocupado",
    "estresse",
    "stress",
  ];

  if (joyKeywords.some((k) => lower.includes(k))) return "alegria";
  if (sadnessKeywords.some((k) => lower.includes(k))) return "tristeza";
  if (tensionKeywords.some((k) => lower.includes(k))) return "tensao";
  return "neutro";
}
