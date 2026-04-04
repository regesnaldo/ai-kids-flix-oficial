export type AgentDimension =
  | "philosophical"
  | "emotional"
  | "creative"
  | "ethical"
  | "social"
  | "spiritual"
  | "intellectual"
  | "practical"
  | "aesthetic"
  | "political"
  | "scientific"
  | "mystical";

export type AgentLevel = "primordial" | "mythic" | "archetypal" | "human";
export type AgentFaction = "order" | "chaos" | "balance";

export interface AgentDefinition {
  id: string;
  name: string;
  dimension: AgentDimension;
  level: AgentLevel;
  faction: AgentFaction;
  season: number;
  personality: {
    tone: "formal" | "friendly" | "challenging" | "empathetic" | "analytical" | "inspirational";
    values: string[];
    approach: string;
  };
  visualPrompt: string;
  laboratoryTask: string;
  badge: {
    name: string;
    description: string;
    icon: string;
  };
  recommendedVideos: string[];
}

