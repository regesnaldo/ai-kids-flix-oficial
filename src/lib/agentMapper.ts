import { AgentRaw, AgentFull } from "@/types/agent";

const ROLE_COLORS: Record<string, string> = {
  mentor: "#7C3AED",
  guide: "#059669",
  scholar: "#2563EB",
  guardian: "#DC2626",
  creator: "#D97706",
};

const DEFAULT_ROLE = "guide";
const DEFAULT_COLOR = "#6366F1";

export function normalizeAgent(raw: AgentRaw, index: number): AgentFull {
  const id = raw.id || raw.name.toLowerCase().replace(/\s+/g, "-") + "-" + index;
  const role = raw.role || (raw.tag ? raw.tag.toLowerCase() : DEFAULT_ROLE);
  const color = raw.color || ROLE_COLORS[role] || DEFAULT_COLOR;
  const desc = raw.desc || raw.description || "Explore com sabedoria.";

  return {
    id: id,
    name: raw.name,
    role: role,
    color: color,
    desc: desc,
    tag: raw.tag || "explorer",
  };
}

export function mapAgents(rawAgents: AgentRaw[]): AgentFull[] {
  return rawAgents.map((raw, idx) => normalizeAgent(raw, idx));
}
