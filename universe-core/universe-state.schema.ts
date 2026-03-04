export type AgeGroup = "kids-4-6" | "kids-7-9" | "kids-10-12" | "teens-13" | "adults-18" | "all-ages";
export type TrackId = "tech" | "science" | "arts" | "math" | "philosophy";
export type PillarId = "autonomy" | "curiosity" | "creativity" | "critical-thinking";
export type ContentStatus = "draft" | "review" | "published" | "archived";
export interface EpisodeMetadata { id: string; title: string; trackId: TrackId; ageGroup: AgeGroup; pillars: PillarId[]; status: ContentStatus; }
export function isValidAgeGroup(v: string): v is AgeGroup { return ["kids-4-6","kids-7-9","kids-10-12","teens-13","adults-18","all-ages"].includes(v as AgeGroup); }
export function getAgeGroupLabel(a: AgeGroup): string { const l: Record<AgeGroup,string> = {"kids-4-6":"4-6 anos","kids-7-9":"7-9 anos","kids-10-12":"10-12 anos","teens-13":"13-17 anos","adults-18":"18+ anos","all-ages":"Qualquer idade"}; return l[a]; }
