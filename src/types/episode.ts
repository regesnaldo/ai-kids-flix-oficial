import { SEASONS_2_5 } from "@/data/episodes";

export interface Episode {
  id: string;
  season: string;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  mainAgent: string;
  secondaryAgents: string[];
  theme: string;
  concepts: string[];
  xp: number;
  duration: number;
  difficulty: number;
  type: "interativo" | "video" | "quiz" | "desafio";
}

function generateSlug(seasonNumber: number, episodeNumber: number, title: string): string {
  const cleanTitle = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `ep-${episodeNumber}-${cleanTitle}`;
}

function convertToEpisode(ep: {
  id: number;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  agentePrincipal: string;
  agentesSecundarios: string[];
  tema: string;
  conceitos: string[];
  xpRecompensa: number;
  duracaoMinutos: number;
  dificuldade: number;
  tipo: string;
}): Episode {
  return {
    id: `s${ep.seasonNumber}-ep${ep.episodeNumber}`,
    season: `s${ep.seasonNumber}`,
    slug: generateSlug(ep.seasonNumber, ep.episodeNumber, ep.title),
    title: ep.title,
    titleEn: ep.titleEn,
    description: ep.description,
    descriptionEn: ep.descriptionEn,
    mainAgent: ep.agentePrincipal,
    secondaryAgents: ep.agentesSecundarios,
    theme: ep.tema,
    concepts: ep.conceitos,
    xp: ep.xpRecompensa,
    duration: ep.duracaoMinutos,
    difficulty: ep.dificuldade,
    type: ep.tipo as Episode["type"],
  };
}

export const episodes: Episode[] = SEASONS_2_5.flatMap((season) =>
  season.episodes.map(convertToEpisode)
);

export function getEpisodeBySlug(season: string, slug: string): Episode | undefined {
  return episodes.find((e) => e.season === season && e.slug === slug);
}

export function getEpisodesBySeason(season: string): Episode[] {
  return episodes.filter((e) => e.season === season);
}

export function getSeasonLabel(season: string): string {
  const seasonNum = parseInt(season.replace("s", ""));
  const seasonData = SEASONS_2_5.find((s) => s.number === seasonNum);
  return seasonData?.title || season;
}