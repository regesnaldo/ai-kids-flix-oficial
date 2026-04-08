import { notFound } from "next/navigation";
import { getEpisodeBySlug, episodes } from "@/types/episode";
import { EpisodeView } from "@/components/episodios/EpisodeView";

type PageParams = Promise<{ temporada: string; episodio: string }>;

const translations = {
  season: "Temporada",
  episode: "Episódio",
  xp: "XP",
  inputPlaceholder: "Faça sua escolha...",
  send: "Enviar",
};

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}) {
  const { temporada, episodio } = await params;
  const episode = getEpisodeBySlug(temporada, episodio);

  if (!episode) {
    return {
      title: "Episódio não encontrado | MENTE.AI",
      robots: "noindex"
    };
  }

  return {
    title: `${episode.title} | MENTE.AI`,
    description: episode.description,
    alternates: {
      canonical: `https://mente.ai/episodios/${temporada}/${episodio}`,
      languages: {
        'pt-BR': `https://mente.ai/episodios/${temporada}/${episodio}`,
        'en-US': `https://mente.ai/en/episodios/${temporada}/${episodio}`
      }
    },
    openGraph: {
      title: episode.title,
      description: episode.description,
      type: 'article',
      section: episode.theme
    }
  };
}

export default async function EpisodePage({
  params,
}: {
  params: PageParams;
}) {
  const { temporada, episodio } = await params;
  const episode = getEpisodeBySlug(temporada, episodio);

  if (!episode) {
    notFound();
  }

  return <EpisodeView episode={episode} t={translations} />;
}

export async function generateStaticParams() {
  return episodes.map((ep) => ({
    temporada: ep.season,
    episodio: ep.slug,
  }));
}
