import type { ChatMessage } from "@/types/chat";
import { getAgentById } from "./agent.service";

const MOCK_RESPONSES: Record<string, string[]> = {
  nexus: [
    "Excelente pergunta! A inteligência artificial aprende através de padrões. Assim como você aprende a reconhecer um gato vendo vários gatos, a IA analisa milhares de exemplos para encontrar regras e conexões que não estão escritas em lugar nenhum — elas emergem dos dados.",
    "Pense na IA como um aluno curioso. Quanto mais dados de qualidade você fornece, melhor ela entende o mundo. O segredo está em três pilares: dados suficientes, um bom algoritmo e feedback constante para ajustar os erros.",
    "A beleza do aprendizado de máquina é que a IA não precisa ser programada com regras explícitas. Ela descobre as regras sozinha. É como ensinar uma criança a andar de bicicleta — você não dá um manual, ela simplesmente tenta, cai, ajusta e tenta de novo.",
  ],
  cipher: [
    "Deep learning é como uma rede de neurônios artificiais organizados em camadas. Cada camada extrai características cada vez mais abstratas dos dados. A primeira camada vê bordas simples, a seguinte vê formas, e as mais profundas reconhecem objetos completos.",
    "O que torna o deep learning tão poderoso é a profundidade. Redes rasas aprendem relações simples; redes profundas capturam hierarquias complexas. É por isso que modelos como transformers revolucionaram o processamento de linguagem natural.",
    "O termo 'profundo' não é marketing — refere-se ao número de camadas na rede. Uma rede com 50 camadas pode aprender conceitos que uma rede de 3 camadas jamais alcançaria. Cada camada adiciona um nível de abstração.",
  ],
  kaos: [
    "A ética na IA não é sobre o que a tecnologia pode fazer, mas sobre o que ela *deve* fazer. Viés em algoritmos, privacidade de dados, substituição de empregos —这些问题 não têm resposta técnica, têm resposta humana.",
    "Um dos maiores desafios é o viés algorítmico. Se treinamos uma IA com dados históricos que contêm preconceitos, ela vai reproduzir e amplificar esses preconceitos. A IA não é neutra — ela reflete quem a cria e os dados que recebe.",
    "Precisamos de diversidade nas equipes que criam IA. Um grupo homogêneo de desenvolvedores pode criar sistemas que funcionam bem para eles mas falham para outros. Ética em IA é, antes de tudo, um problema de representação.",
  ],
  aurora: [
    "LLMs são modelos de linguagem treinados em quantidades imensas de texto — livros, artigos, sites. Eles aprendem padrões estatísticos da linguagem humana: como as palavras se relacionam, que estrutura uma frase deve ter, qual palavra vem depois de qual.",
    "O que torna os LLMs fascinantes é que eles desenvolvem habilidades que não foram explicitamente programadas. Um modelo treinado apenas para prever a próxima palavra acaba aprendendo a traduzir idiomas, escrever código, fazer análise de sentimentos.",
    "Os transformers, arquitetura por trás dos LLMs modernos, introduziram o mecanismo de 'atenção'. Em vez de processar uma palavra de cada vez, o modelo olha para todas as palavras da frase simultaneamente e decide quais são mais relevantes para cada contexto.",
  ],
  volt: [
    "Machine learning se divide em três grandes categorias: aprendizado supervisionado (com exemplos rotulados), não supervisionado (buscando padrões sem rótulos) e por reforço (aprendendo por tentativa e erro com recompensas).",
    "A otimização é o coração do ML. Cada modelo busca minimizar uma 'função de perda' — basicamente, uma medida de quão errado ele está. O processo de ajustar os parâmetros para reduzir esse erro é o que chamamos de treinamento.",
    "Um dos conceitos mais importantes é o overfitting: quando o modelo decora os exemplos em vez de aprender o padrão geral. É como um estudante que memoriza as respostas da prova sem entender a matéria. Técnicas de regularização ajudam a evitar isso.",
  ],
  ethos: [
    "A IA generativa está redefinindo o que significa criar. Modelos como DALL-E, Midjourney e Stable Diffusion não apenas copiam estilos — eles compreendem conceitos visuais e os recombinam de maneiras originais. Mas quem é o autor: a IA, o usuário ou os criadores dos dados de treinamento?",
    "Criatividade sempre foi considerada uma capacidade exclusivamente humana. Mas se criatividade é a capacidade de combinar ideias existentes de formas novas e úteis, então a IA pode sim ser criativa — dentro dos limites do que aprendeu.",
    "A pergunta certa não é 'IA é criativa?' mas sim 'como a criatividade humana e a IA podem se complementar?' A IA gera possibilidades; o ser humano escolhe, refina e dá significado. É uma parceria, não uma substituição.",
  ],
};

const FALLBACK_RESPONSE =
  "Essa é uma pergunta fascinante! Deixe-me pensar... A IA está em constante evolução, e cada pergunta nos ajuda a entender melhor seus limites e possibilidades. O que mais você gostaria de saber?";

export function sendMessage(content: string, agentId: string): Promise<ChatMessage> {
  const agent = getAgentById(agentId);

  return new Promise((resolve) => {
    const delay = 800 + Math.random() * 1200;

    setTimeout(() => {
      const responses = MOCK_RESPONSES[agentId];
      const reply =
        responses?.[Math.floor(Math.random() * responses.length)] ?? FALLBACK_RESPONSE;

      const message: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        role: "agent",
        content: reply,
        agentId,
        timestamp: Date.now(),
      };

      resolve(message);
    }, delay);
  });
}

export function createUserMessage(content: string, agentId: string): ChatMessage {
  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    role: "user",
    content,
    agentId,
    timestamp: Date.now(),
  };
}
