import { notFound } from "next/navigation";
import { getEpisodeBySlug, episodes } from "@/types/episode";
import { EpisodeView } from "@/components/episodios/EpisodeView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ temporada: string; episodio: string }>;
}) {
  const { temporada, episodio } = await params;
  const episode = getEpisodeBySlug(temporada, episodio);

  if (!episode) {
    return { title: "Episode not found" };
  }

  return {
    title: `${episode.titleEn || episode.title} | MENTE.AI`,
    description: episode.descriptionEn || episode.description,
    alternates: {
      canonical: `https://mente.ai/en/episodes/${temporada}/${episodio}`,
    },
  };
}

export default async function EpisodePageEn({
  params,
}: {
  params: Promise<{ temporada: string; episodio: string }>;
}) {
  const { temporada, episodio } = await params;
  
  const episode = getEpisodeBySlug(temporada, episodio);

  if (!episode) {
    notFound();
  }

  const t = {
    season: "Season",
    episode: "Episode",
    xp: "XP",
    inputPlaceholder: "Make your choice...",
    send: "Send",
  };

  return <EpisodeView episode={episode} t={t} />;
}