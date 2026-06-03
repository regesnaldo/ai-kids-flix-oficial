export type LabMode = "fast" | "complete";

export interface LabConfig {
  agents: string[];
  mode: LabMode;
}
