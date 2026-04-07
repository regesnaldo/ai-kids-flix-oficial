import { SEASONS_2_5, type EpisodeData, type SeasonData } from "@/data/episodes";
import { getSeasonDefinition } from "@/canon/canon-structure";

export interface EpisodePageConfig {
  id: string;
  slug: string;
  locale: string;
  title: string;
  description: string;
  episode: EpisodeData;
  season: SeasonData;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  layout: "video" | "interactive" | "quiz";
  components: string[];
  scripts?: Record<string, unknown>[];
}

export interface EpisodeTemplate {
  version: string;
  createdAt: string;
  seasonNumber: number;
  episodes: Record<number, EpisodePageConfig>;
}

function generateEpisodeSlug(
  seasonNumber: number,
  episodeNumber: number,
  title: string
): string {
  const cleanTitle = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `s${seasonNumber}e${episodeNumber}-${cleanTitle}`;
}

function getLayoutForType(tipo: string): "video" | "interactive" | "quiz" {
  switch (tipo) {
    case "video":
      return "video";
    case "quiz":
      return "quiz";
    case "desafio":
      return "interactive";
    default:
      return "interactive";
  }
}

export function generateEpisodePageConfig(
  episode: EpisodeData,
  locale: string = "pt-BR"
): EpisodePageConfig {
  const season = SEASONS_2_5.find(s => s.number === episode.seasonNumber);
  if (!season) {
    throw new Error(`Season ${episode.seasonNumber} not found`);
  }

  const isEnglish = locale === "en";
  const title = isEnglish && episode.titleEn ? episode.titleEn : episode.title;
  const description = isEnglish && episode.descriptionEn
    ? episode.descriptionEn
    : episode.description;

  const keywords = [
    ...episode.conceitos,
    episode.tema,
    season.title,
    "IA",
    "Artificial Intelligence",
    "Machine Learning"
  ];

  return {
    id: `ep-${episode.id}`,
    slug: generateEpisodeSlug(episode.seasonNumber, episode.episodeNumber, title),
    locale,
    title,
    description,
    episode,
    season,
    seo: {
      title: `${title} | MENTE.AI - ${season.title}`,
      description,
      keywords
    },
    layout: getLayoutForType(episode.tipo),
    components: generateComponentList(episode),
    scripts: generateScripts(episode, locale)
  };
}

function generateComponentList(episode: EpisodeData): string[] {
  const components = ["EpisodeHero"];

  switch (episode.tipo) {
    case "video":
      components.push("VideoPlayer", "ChapterSelector");
      break;
    case "quiz":
      components.push("QuizPlayer", "ProgressBar");
      break;
    case "desafio":
      components.push("ChallengePlayer", "CodeEditor", "OutputViewer");
      break;
    default:
      components.push("InteractivePlayer", "DecisionTree", "ChatInterface");
  }

  if (episode.agentesSecundarios.length > 0) {
    components.push("AgentCard");
  }

  components.push("XpReward", "NextEpisode", "ShareButtons");

  return components;
}

function generateScripts(
  episode: EpisodeData,
  locale: string
): Record<string, unknown>[] {
  const isEnglish = locale === "en";

  return [
    {
      id: `intro-${episode.id}`,
      type: "dialogue",
      agent: episode.agentePrincipal,
      content: isEnglish
        ? `Welcome to episode ${episode.episodeNumber} of ${episode.seasonNumber}. Today we'll explore: ${episode.tema}`
        : `Bem-vindo ao episódio ${episode.episodeNumber} da temporada ${episode.seasonNumber}. Hoje vamos explorar: ${episode.tema}`,
      duration: 30
    },
    {
      id: `main-${episode.id}`,
      type: "content",
      agent: episode.agentePrincipal,
      concepts: episode.conceitos,
      difficulty: episode.dificuldade,
      xpReward: episode.xpRecompensa
    }
  ];
}

export function generateSeasonPages(
  seasonNumber: number,
  locale: string = "pt-BR"
): EpisodePageConfig[] {
  const season = SEASONS_2_5.find(s => s.number === seasonNumber);
  if (!season) {
    throw new Error(`Season ${seasonNumber} not found`);
  }

  return season.episodes.map(ep => generateEpisodePageConfig(ep, locale));
}

export function generateAllPages(locale: string = "pt-BR"): EpisodePageConfig[] {
  return SEASONS_2_5.flatMap(season =>
    season.episodes.map(ep => generateEpisodePageConfig(ep, locale))
  );
}

export function getEpisodeUrl(seasonNumber: number, episodeNumber: number): string {
  return `/episodes/s${seasonNumber}e${episodeNumber}`;
}

export function getSeasonUrl(seasonNumber: number): string {
  return `/seasons/${seasonNumber}`;
}

export const EPISODE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "",
  description: "",
  duration: "",
  uploadDate: "",
  thumbnailUrl: ""
};

export interface CanonicalMetadata {
  alternateLanguages: Record<string, string>;
  hreflang: string;
  currentLocale: string;
}

export function generateCanonicalMetadata(
  episode: EpisodeData,
  baseUrl: string
): CanonicalMetadata {
  const slug = generateEpisodeSlug(
    episode.seasonNumber,
    episode.episodeNumber,
    episode.title
  );

  return {
    alternateLanguages: {
      "pt-BR": `${baseUrl}/episodes/${slug}`,
      en: `${baseUrl}/en/episodes/${slug}`
    },
    hreflang: "pt-BR, en",
    currentLocale: "pt-BR"
  };
}

export interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: number;
}

export function generateSitemapEntries(baseUrl: string): SitemapEntry[] {
  const entries: SitemapEntry[] = [];

  for (const season of SEASONS_2_5) {
    entries.push({
      loc: `${baseUrl}/seasons/${season.number}`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: 0.8
    });

    for (const episode of season.episodes) {
      const slug = generateEpisodeSlug(
        episode.seasonNumber,
        episode.episodeNumber,
        episode.title
      );

      entries.push({
        loc: `${baseUrl}/episodes/${slug}`,
        lastmod: new Date().toISOString(),
        changefreq: "monthly",
        priority: episode.episodeNumber === 1 ? 0.9 : 0.6
      });

      entries.push({
        loc: `${baseUrl}/en/episodes/${slug}`,
        lastmod: new Date().toISOString(),
        changefreq: "monthly",
        priority: episode.episodeNumber === 1 ? 0.9 : 0.6
      });
    }
  }

  return entries;
}

export function exportPagesAsJson(locale: string = "pt-BR"): string {
  const pages = generateAllPages(locale);
  return JSON.stringify(pages, null, 2);
}

export function exportTemplatesAsJson(): string {
  const templates = SEASONS_2_5.map(season => ({
    seasonNumber: season.number,
    title: season.title,
    titleEn: season.titleEn,
    episodeCount: season.episodes.length,
    agentLeader: season.agenteLider,
    temaPrincipal: season.temaPrincipal,
    episodes: season.episodes.map(ep => ({
      id: ep.id,
      title: ep.title,
      titleEn: ep.titleEn,
      tipo: ep.tipo,
      dificuldade: ep.dificuldade,
      xpRecompensa: ep.xpRecompensa
    }))
  }));

  return JSON.stringify(templates, null, 2);
}