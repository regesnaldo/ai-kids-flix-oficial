import PageAudioGuide from "@/components/audio/PageAudioGuide";
import BibliotecaVivaClient from "@/components/biblioteca/BibliotecaVivaClient";

type BibliotecaPageProps = {
  searchParams: Promise<{
    season?: string;
    agent?: string;
  }>;
};

export default async function BibliotecaPage({ searchParams }: BibliotecaPageProps) {
  const params = await searchParams;

  return (
    <>
      <PageAudioGuide
        pageTitle="Biblioteca Viva"
        audioPath="/audio/biblioteca-welcome.mp3"
        description="Explore 4 andares de conhecimento guiados por 20 agentes."
        script={`Bem-vindo à Biblioteca Viva do MENTE.AI.
Aqui você encontra 4 andares de conhecimento:

Fundamentos, Linguagens, Criação e Inovação.

Cada livro é guiado por um agente especializado.
Passe o mouse para ver detalhes e clique para abrir.
Use as partículas para navegar entre conceitos.
NEXUS conecta todo o conhecimento para você.
Explore, aprenda e evolua.`}
      />
      <BibliotecaVivaClient
        initialSeason={params.season ?? null}
        initialAgent={params.agent ?? null}
      />
    </>
  );
}
