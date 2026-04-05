import { nexus } from "@/data/agents";

export function getNexusSignature() {
  return nexus.signature;
}

export function suggestRelatedLevels(currentLevel: string) {
  if (currentLevel === "Fundamentos") {
    return ["Intermediário"];
  }
  if (currentLevel === "Intermediário") {
    return ["Fundamentos", "Avançado"];
  }
  if (currentLevel === "Avançado") {
    return ["Intermediário", "Mestre"];
  }
  return ["Avançado"];
}
