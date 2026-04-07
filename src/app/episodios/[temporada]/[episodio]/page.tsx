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
    return { title: "Episódio não encontrado" };
  }

  return {
    title: `${episode.title} | MENTE.AI`,
    description: episode.description,
    alternates: {
      canonical: `https://mente.ai/episodios/${temporada}/${episodio}`,
    },
  };
}

export default async function EpisodePage({
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
    season: "Temporada",
    episode: "Episódio",
    xp: "XP",
    inputPlaceholder: "Faça sua escolha...",
    send: "Enviar",
  };

  return <EpisodeView episode={episode} t={t} />;
}

export async function generateStaticParams() {
  return episodes.map((ep) => ({
    temporada: ep.season,
    episodio: ep.slug,
  }));
}