import PageAudioGuide from "@/components/audio/PageAudioGuide";
import PraticoClient from "@/components/laboratorio/PraticoClient";

export default function LaboratorioPraticoPage() {
  return (
    <>
      <PageAudioGuide
        pageTitle="Laboratório Prático"
        audioPath="/audio/pratico-welcome.mp3"
        description="8 estações de experimento com mentoria dos agentes."
        script={`Bem-vindo ao Laboratório Prático de Dissecação Tecnológica.
Aqui você encontrará 8 estações de experimento guiadas pelos agentes avançados e mestres.

Clique em cada estação para abrir o experimento.
Execute testes, veja métricas e sincronize dados.
Os hologramas mostram o funcionamento interno.
Experimente, teste e aprenda na prática.`}
      />
      <PraticoClient />
    </>
  );
}
