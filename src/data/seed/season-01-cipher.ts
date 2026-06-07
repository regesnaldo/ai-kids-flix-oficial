// ─── src/data/seed/season-01-cipher.ts ──────────────────────────────────────
//
// CIPHER — Temporada 1: Fundamentos da Lógica e Criptografia
// Agente: CIPHER (Decifrador de Códigos) · Cor: #10B981 (verde esmeralda)
// Padrão canônico MENTE.AI — mesmo template de NEXUS T01

import type { NewKnowledgeUnit, NewKnowledgeAsset, NewKnowledgeGraphEdge } from '@/lib/db/schema';

/* ═══════════════════════════════════════════════════════════════════
   EPISÓDIO 1 — A Linguagem Secreta
   ═══════════════════════════════════════════════════════════════════
   CIPHER recebe o aprendiz em seu dome de cristais hexagonais.
   Conceito: lógica binária (sim/não, 0/1) como fundação de toda computação.
   Gancho E02: "Se você entende sim e não, entende tudo." */

export const CIPHER_T01E01_UNIT: NewKnowledgeUnit = {
  id: "ku-cipher-t01-e01", title: "A Linguagem Secreta",
  slug: "cipher-t01-e01-linguagem-secreta",
  learningObjective: "Ao final, o aprendiz será capaz de explicar como o sistema binário (0 e 1) fundamenta toda a computação moderna.",
  cognitiveLevel: "remember", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["binary", "boolean-logic", "computation-basics"],
  tags: ["fundamentos", "lógica", "binário", "criptografia"], agentDomain: "cipher",
  version: 1, status: "published",
};

export const CIPHER_T01E01_ASSET: NewKnowledgeAsset = {
  id: "ka-cipher-t01-e01", knowledgeUnitId: "ku-cipher-t01-e01",
  agentId: "cipher", season: 1, episode: 1, type: "episode",
  content: {
    abertura: "Você está dentro de um dome de cristais hexagonais. Cada cristal emite uma luz — alguns verdes, outros apagados. No centro, uma figura esguia de capuz esmeralda manipula os cristais com precisão cirúrgica. Ele se vira. Seus olhos são dois pontos de luz verde. 'Bem-vindo à Cidadela dos Códigos. Eu sou CIPHER. E antes de qualquer pergunta, quero te ensinar a linguagem mais simples e mais poderosa que existe. Uma linguagem de apenas duas palavras: SIM e NÃO.'",
    narrativa: "Tudo que um computador faz — desde mostrar uma foto até calcular a rota de um foguete para Marte — se resume a duas coisas: 0 e 1. Sim e Não. Ligado e Desligado. Isso se chama sistema binário. Por quê? Porque é a forma mais confiável de representar informação. Um fio elétrico só precisa distinguir entre 'tem corrente' e 'não tem corrente'. Não precisa medir 'um pouco de corrente' ou 'bastante corrente' — o que seria impreciso e sujeito a ruído. CIPHER acende um cristal. 'Cada um destes cristais é um bit. Aceso = 1. Apagado = 0. Com 8 cristais — 8 bits, ou 1 byte — posso representar 256 coisas diferentes. Letras, números, cores, sons. Tudo é bits. Tudo é sim e não. Essa é a primeira lição da criptografia: a informação mais complexa pode ser reduzida à sua forma mais simples.'",
    pausas: [
      { pergunta: "Por que computadores usam apenas 0 e 1?", opcoes: ["A. Porque é mais barato", "B. Porque é a forma mais confiável — só precisa distinguir entre ligado e desligado", "C. Porque os primeiros programadores só sabiam contar até 1"], continuacoes: ["Não é questão de custo — é de confiabilidade. Distinguir entre dois estados é muito mais seguro que distinguir entre dez. Menos ruído, menos erro.", "Exato! Dois estados são fáceis de detectar eletricamente com precisão quase perfeita. É por isso que o binário venceu.", "Os primeiros computadores chegaram a usar sistemas decimais, mas o binário provou ser muito mais confiável contra interferência elétrica."] },
      { pergunta: "Quantas coisas diferentes 8 bits (1 byte) podem representar?", opcoes: ["A. 8 coisas", "B. 256 coisas (2 elevado a 8)", "C. Infinitas coisas"], continuacoes: ["8 bits não são 8 combinações. Cada bit dobra as possibilidades: 2×2×2×2×2×2×2×2 = 256. Com apenas 8 perguntas de sim/não, você representa qualquer letra do alfabeto.", "Perfeito! 2^8 = 256. É por isso que 1 byte pode representar todas as letras do alfabeto, números, símbolos e ainda sobra espaço.", "Não é infinito — é exatamente 256. Mas quando você junta muitos bytes, as combinações explodem. Com 4 bytes já são 4 bilhões de possibilidades."] },
    ],
    encerramento: "CIPHER apaga todos os cristais, exceto um. 'Você entendeu o princípio mais fundamental. Mas informação não é só sobre representar — é sobre proteger. Amanhã, vou te ensinar como esconder uma mensagem à vista de todos. Como transformar \"OLÁ\" em algo que só o destinatário certo pode ler. A arte da criptografia.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 7, pauseCount: 2, hasLogosGate: false, prevEpisode: null, nextEpisode: "A Arte do Segredo" },
  source: "manual", status: "published", version: 1,
};

export const CIPHER_T01E01_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-cipher-t01-e01-e02", fromUnitId: "ku-cipher-t01-e01", toUnitId: "ku-cipher-t01-e02", relationship: "next", weight: 1.0 },
];

/* ═══════ EPISÓDIO 2 — A Arte do Segredo ═══════ */

export const CIPHER_T01E02_UNIT: NewKnowledgeUnit = {
  id: "ku-cipher-t01-e02", title: "A Arte do Segredo",
  slug: "cipher-t01-e02-arte-do-segredo",
  learningObjective: "Ao final, o aprendiz será capaz de explicar como a cifra de César funciona e o que significa criptografar uma mensagem.",
  cognitiveLevel: "understand", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["cryptography", "caesar-cipher", "encryption"],
  tags: ["fundamentos", "cifra", "segredo"], agentDomain: "cipher",
  version: 1, status: "published",
};

export const CIPHER_T01E02_ASSET: NewKnowledgeAsset = {
  id: "ka-cipher-t01-e02", knowledgeUnitId: "ku-cipher-t01-e02",
  agentId: "cipher", season: 1, episode: 2, type: "episode",
  content: {
    abertura: "Os cristais hexagonais se reorganizam formando um anel ao seu redor. No centro, letras flutuam no ar: A, B, C, D... CIPHER estende a mão e as letras giram. 'Júlio César usava esta técnica para enviar mensagens secretas aos seus generais. Funcionava assim: cada letra da mensagem original era substituída por outra letra, algumas posições à frente no alfabeto. Simples. E genial. Por 800 anos, ninguém conseguiu quebrar.'",
    narrativa: "A cifra de César é a criptografia mais antiga documentada. Funciona assim: você escolhe um número secreto — a 'chave'. Digamos que a chave seja 3. Agora, cada letra da sua mensagem é substituída pela letra 3 posições à frente. A vira D. B vira E. C vira F. A palavra 'OLA' vira 'ROD'. Quem recebe a mensagem sabe a chave e reverte o processo. Quem intercepta sem a chave vê apenas letras sem sentido. CIPHER gira as letras no ar. 'Essa ideia — substituir algo por outra coisa usando uma chave secreta — é a essência de toda criptografia moderna. Do seu WhatsApp ao seu banco online. Só que hoje as chaves não são números de 1 a 25. São números com centenas de dígitos.'",
    pausas: [
      { pergunta: "Como a cifra de César funciona?", opcoes: ["A. Cada letra é substituída por um desenho", "B. Cada letra é deslocada um número fixo de posições no alfabeto (a chave)", "C. A mensagem é escrita de trás para frente"], continuacoes: ["Não é sobre desenhos — é sobre deslocamento. A letra original é substituída por outra letra do alfabeto, mantendo a mesma distância para todas as letras.", "Exato! A chave determina quantas posições cada letra 'anda' no alfabeto. Se chave=3, A→D, B→E, C→F... Simples, elegante, eficaz.", "Escrever de trás para frente é outra técnica, mas não é a cifra de César. A ideia de César era o deslocamento uniforme — a mesma regra para todas as letras."] },
      { pergunta: "Por que a cifra de César não é mais usada hoje?", opcoes: ["A. Porque as pessoas esqueceram como funciona", "B. Porque só tem 25 chaves possíveis — um computador testa todas em milissegundos", "C. Porque César proibiu seu uso após sua morte"], continuacoes: ["Não foi esquecimento. O problema é que o espaço de chaves é minúsculo. Com apenas 25 possibilidades, um ataque de força bruta resolve em frações de segundo.", "Exato! 25 chaves é trivial para um computador moderno. A criptografia de hoje usa chaves com tantas combinações que levaria bilhões de anos para testar todas.", "César não proibiu nada. A cifra simplesmente ficou obsoleta porque o espaço de chaves é pequeno demais para a capacidade computacional moderna."] },
    ],
    encerramento: "As letras giram uma última vez e se transformam em números. 'Você viu como esconder mensagens. Mas a verdadeira magia da criptografia não está em esconder — está em PROVAR. Provar que você é você. Provar que uma mensagem não foi alterada. Amanhã, o mundo das assinaturas digitais.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 7, pauseCount: 2, hasLogosGate: false, prevEpisode: "A Linguagem Secreta", nextEpisode: "Assinaturas Invisíveis" },
  source: "manual", status: "published", version: 1,
};

export const CIPHER_T01E02_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-cipher-t01-e01-e02-prereq", fromUnitId: "ku-cipher-t01-e01", toUnitId: "ku-cipher-t01-e02", relationship: "prerequisite", weight: 1.0 },
];

/* ═══════ EPISÓDIO 3 — Assinaturas Invisíveis 🛡️ LOGOS ═══════ */

export const CIPHER_T01E03_UNIT: NewKnowledgeUnit = {
  id: "ku-cipher-t01-e03", title: "Assinaturas Invisíveis",
  slug: "cipher-t01-e03-assinaturas-invisiveis",
  learningObjective: "Ao final, o aprendiz será capaz de explicar o conceito de hash criptográfico e como ele garante a integridade de dados.",
  cognitiveLevel: "understand", difficulty: "beginner", estimatedTimeMin: 9,
  skills: ["hash", "sha256", "data-integrity"],
  tags: ["fundamentos", "hash", "integridade"], agentDomain: "cipher",
  version: 1, status: "published",
};

export const CIPHER_T01E03_ASSET: NewKnowledgeAsset = {
  id: "ka-cipher-t01-e03", knowledgeUnitId: "ku-cipher-t01-e03",
  agentId: "cipher", season: 1, episode: 3, type: "episode",
  content: {
    abertura: "Você está numa sala de espelhos hexagonais. Cada espelho reflete não seu rosto, mas sequências de letras e números embaralhados. CIPHER toca um espelho: 'SHA256'. O reflexo mostra a palavra 'OLÁ' entrando e saindo como 'a1b2c3d4e5f6...'. 'Isto é um hash. A assinatura digital invisível. Pegue qualquer coisa — uma palavra, um livro inteiro, um filme — e o hash transforma isso numa sequência de tamanho fixo. Mude uma única letra do original... e o hash muda completamente.'",
    narrativa: "Hash é como uma impressão digital para dados. Você passa um texto por uma função hash e obtém uma string de tamanho fixo — tipo 64 caracteres hexadecimais. As propriedades são mágicas: (1) O mesmo input sempre produz o mesmo hash. (2) É impossível reverter — dado um hash, você não descobre o input original. (3) Mude um único bit do input e o hash muda completamente (efeito avalanche). Isso é usado em todo lugar: senhas em bancos de dados não são salvas em texto puro — são salvas como hashes. Quando você faz login, o sistema calcula o hash da senha que você digitou e compara com o hash armazenado. Se alguém roubar o banco de dados, não vê as senhas — só os hashes.",
    pausas: [
      { pergunta: "O que acontece se você mudar uma letra do texto original antes de calcular o hash?", opcoes: ["A. O hash muda um pouquinho no final", "B. O hash muda COMPLETAMENTE — efeito avalanche", "C. O hash continua igual, porque o texto é parecido"], continuacoes: ["Não muda 'um pouquinho'. Muda TUDO. Uma única vírgula a mais ou a menos produz um hash completamente diferente. Esse é o efeito avalanche.", "Exato! O design das funções hash garante que a menor alteração no input cause uma mudança drástica no output. Isso torna impossível 'adivinhar' o original a partir de pequenas variações.", "Se o hash fosse igual para textos parecidos, seria fácil quebrar. A segurança do hash está exatamente em ser imprevisível e sensível a qualquer mudança."] },
      { pergunta: "Por que bancos de dados salvam hashes de senhas em vez das senhas originais?", opcoes: ["A. Porque hashes ocupam menos espaço em disco", "B. Porque se o banco for roubado, o ladrão não consegue descobrir as senhas reais", "C. Porque é mais bonito esteticamente"], continuacoes: ["Espaço não é o motivo. A segurança é: hashes são unidirecionais. Mesmo com o banco de dados inteiro, um atacante não consegue reverter os hashes para obter as senhas.", "Exato! É uma camada de proteção. Mesmo que o pior aconteça e o banco vaze, as senhas continuam protegidas. O atacante teria que testar bilhões de combinações.", "Não é estética — é sobrevida. Empresas que salvam senhas em texto puro são consideradas negligentes. Hash + salt é o padrão mínimo de segurança."] },
    ],
    encerramento: "Os espelhos hexagonais se alinham formando um corredor. No fim, uma porta com o Olho de LOGOS. 'Você entendeu a integridade. Mas o conhecimento sem verificação é perigoso. LOGOS vai testar o que você absorveu até agora.'",
  },
  metadata: { xpReward: 60, readingTimeMin: 8, pauseCount: 2, hasLogosGate: true, logosGateEpisode: true, prevEpisode: "A Arte do Segredo", nextEpisode: "O Cadeado Inquebrável" },
  source: "manual", status: "published", version: 1,
};

export const CIPHER_T01E03_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-cipher-t01-e02-e03-prereq", fromUnitId: "ku-cipher-t01-e02", toUnitId: "ku-cipher-t01-e03", relationship: "prerequisite", weight: 1.0 },
];

/* ═══════ EPISÓDIO 4 — O Cadeado Inquebrável ═══════ */

export const CIPHER_T01E04_UNIT: NewKnowledgeUnit = {
  id: "ku-cipher-t01-e04", title: "O Cadeado Inquebrável",
  slug: "cipher-t01-e04-cadeado-inquebravel",
  learningObjective: "Ao final, o aprendiz será capaz de explicar criptografia de chave pública e como duas chaves resolvem o problema da troca segura.",
  cognitiveLevel: "understand", difficulty: "beginner", estimatedTimeMin: 9,
  skills: ["public-key-crypto", "rsa", "key-exchange"],
  tags: ["fundamentos", "chave-pública", "RSA"], agentDomain: "cipher",
  version: 1, status: "published",
};

export const CIPHER_T01E04_ASSET: NewKnowledgeAsset = {
  id: "ka-cipher-t01-e04", knowledgeUnitId: "ku-cipher-t01-e04",
  agentId: "cipher", season: 1, episode: 4, type: "episode",
  content: {
    abertura: "Você atravessou a porta de LOGOS. Agora está numa sala com duas caixas de correio flutuantes — uma dourada, uma prateada. CIPHER segura duas chaves: 'Este é o problema mais antigo da criptografia. Como combinar uma chave secreta com alguém que você nunca encontrou? A solução é contra-intuitiva: use DUAS chaves.'",
    narrativa: "Criptografia de chave pública funciona com duas chaves matematicamente ligadas: uma pública (que você pode espalhar aos quatro ventos) e uma privada (que só você guarda). Qualquer pessoa pode usar sua chave pública para criptografar uma mensagem. Mas só você, com sua chave privada, consegue descriptografar. Foi assim que Diffie, Hellman e Merkle resolveram o problema em 1976. E foi assim que Rivest, Shamir e Adleman criaram o RSA — o algoritmo que protege a internet até hoje.",
    pausas: [
      { pergunta: "Qual a grande vantagem da criptografia de chave pública?", opcoes: ["A. É mais rápida que qualquer outro método", "B. Você não precisa combinar uma chave secreta antecipadamente", "C. Não precisa de computador para funcionar"], continuacoes: ["Na verdade, chave pública é mais LENTA. A vantagem não é velocidade — é não precisar de um canal seguro para combinar a chave.", "Exato! Antes, você precisava encontrar a pessoa pessoalmente para combinar uma chave. Agora, qualquer um pode te enviar mensagens seguras usando sua chave pública.", "Computadores são essenciais — a matemática envolvida é pesada. A vantagem está na logística, não na performance."] },
      { pergunta: "Para que serve a chave privada no RSA?", opcoes: ["A. Para criptografar mensagens que qualquer um pode ler", "B. Para descriptografar mensagens criptografadas com a chave pública correspondente", "C. Para decorar a parede"], continuacoes: ["A chave pública é que criptografa. A privada é a ÚNICA que pode descriptografar. Sem ela, a mensagem é lixo matemático.", "Perfeito! A chave privada é o segredo que só você tem. Sem ela, ninguém consegue ler a mensagem depois de criptografada.", "Não é decoração! A chave privada é o segredo mais valioso. Perdê-la significa perder acesso a tudo."] },
    ],
    encerramento: "CIPHER guarda a chave prateada no bolso e entrega a dourada para você. 'Com esta chave, qualquer pessoa pode te enviar segredos. Mas não basta proteger a mensagem. É preciso proteger o elo mais fraco: VOCÊ. Amanhã, engenharia social.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: "Assinaturas Invisíveis", nextEpisode: "O Elo Mais Fraco" },
  source: "manual", status: "published", version: 1,
};

/* ═══════ EPISÓDIO 5 — O Elo Mais Fraco ═══════ */

export const CIPHER_T01E05_UNIT: NewKnowledgeUnit = {
  id: "ku-cipher-t01-e05", title: "O Elo Mais Fraco", slug: "cipher-t01-e05-elo-mais-fraco",
  learningObjective: "Ao final, o aprendiz será capaz de identificar princípios de engenharia social e se proteger contra phishing.",
  cognitiveLevel: "apply", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["social-engineering", "phishing", "cybersecurity-awareness"],
  tags: ["fundamentos", "segurança", "phishing"], agentDomain: "cipher", version: 1, status: "published",
};

export const CIPHER_T01E05_ASSET: NewKnowledgeAsset = {
  id: "ka-cipher-t01-e05", knowledgeUnitId: "ku-cipher-t01-e05",
  agentId: "cipher", season: 1, episode: 5, type: "episode",
  content: {
    abertura: "Você está num escritório falso. Tudo parece normal — computador, telefone. CIPHER aponta para um e-mail: 'PARABÉNS! Você ganhou um iPhone! Clique aqui.' Remetente: 'apple-seguranca@suporte-br.com'. 'Parece oficial? O domínio não é apple.com. Este e-mail é uma armadilha. 91% dos ataques cibernéticos começam assim.'",
    narrativa: "Kevin Mitnick, o hacker mais famoso dos anos 90, não usava exploits. Usava o telefone. Ligava se passando por suporte técnico e pedia senhas — e as pessoas davam. Isso é engenharia social. Phishing é a versão digital: e-mails falsos que parecem do seu banco, da Netflix, do governo. A melhor criptografia do mundo é inútil se a pessoa entrega a senha voluntariamente.",
    pausas: [
      { pergunta: "Qual o sinal mais claro de phishing?", opcoes: ["A. Erros de português", "B. O domínio do remetente não é o oficial", "C. Chegou numa terça-feira"], continuacoes: ["Erros são comuns mas não universais. Phishing sofisticado é gramaticalmente perfeito. O domínio é o indicador mais confiável.", "Exato! Sempre verifique o domínio. Bancos NUNCA usam 'seguranca-banco.com'. O domínio oficial é o único que importa.", "Dia da semana é irrelevante. Phishing acontece 24/7. Verifique o remetente e nunca clique em links suspeitos."] },
      { pergunta: "O que é engenharia social?", opcoes: ["A. Construir robôs que interagem com humanos", "B. A arte de manipular pessoas para obter informações confidenciais", "C. Um curso de faculdade"], continuacoes: ["Não é sobre robôs. É sobre pessoas. O hacker não quebra o sistema — convence alguém a abrir a porta.", "Exato! O elo mais fraco é o humano. Não importa a força da criptografia se a pessoa entrega a senha.", "Não é curso. É a técnica de ataque mais efetiva. Um telefonema bem feito vale mais que mil exploits."] },
    ],
    encerramento: "O escritório se dissolve. 'Você viu como a confiança vira arma. Mas existe um código inquebrável. Amanhã, o segredo quântico.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 7, pauseCount: 2, hasLogosGate: false, prevEpisode: "O Cadeado Inquebrável", nextEpisode: "O Segredo Quântico" },
  source: "manual", status: "published", version: 1,
};

/* ═══════ EPISÓDIO 6 — O Segredo Quântico + LOGOS ═══════ */

export const CIPHER_T01E06_UNIT: NewKnowledgeUnit = {
  id: "ku-cipher-t01-e06", title: "O Segredo Quântico", slug: "cipher-t01-e06-segredo-quantico",
  learningObjective: "Ao final, o aprendiz será capaz de explicar os princípios da criptografia quântica e por que ela é teoricamente inviolável.",
  cognitiveLevel: "understand", difficulty: "intermediate", estimatedTimeMin: 9,
  skills: ["quantum-crypto", "bb84", "qkd"], tags: ["fundamentos", "quântico"], agentDomain: "cipher", version: 1, status: "published",
};

export const CIPHER_T01E06_ASSET: NewKnowledgeAsset = {
  id: "ka-cipher-t01-e06", knowledgeUnitId: "ku-cipher-t01-e06",
  agentId: "cipher", season: 1, episode: 6, type: "episode",
  content: {
    abertura: "Você flutua num espaço de fótons dançantes. CIPHER estende a mão e um fóton pousa: 'Na criptografia clássica, uma chave pode ser interceptada sem deixar vestígios. Na física quântica, observar uma partícula... é alterá-la. Se alguém espionar uma chave quântica, você SABE.'",
    narrativa: "O protocolo BB84 usa fótons para criar chaves secretas. O princípio da incerteza de Heisenberg impede medição sem perturbação. Se um espião interceptar os fótons, os estados mudam. Alice e Bob detectam a interferência e descartam a chave. É o único método protegido não pela matemática, mas pelas leis da física.",
    pausas: [
      { pergunta: "O que torna a criptografia quântica diferente?", opcoes: ["A. Usa computadores mais rápidos", "B. Qualquer espionagem ALTERA o sinal — você sempre sabe", "C. Não precisa de chaves"], continuacoes: ["Não é velocidade. É física. Na clássica, você nunca sabe se a chave foi copiada. Na quântica, a espionagem deixa rastros.", "Exato! Medir perturba. É como tentar ver um castelo de cartas no escuro — o ato de tocar derruba tudo.", "Precisa de chaves sim — mas a criação é tão segura que qualquer interceptação é detectável."] },
    ],
    encerramento: "Os fótons formam uma ponte. 'A física protege o que a matemática não pode. Amanhã, o oposto: como quebrar o que parece inquebrável — força bruta.'",
  },
  metadata: { xpReward: 60, readingTimeMin: 8, pauseCount: 1, hasLogosGate: true, logosGateEpisode: true, prevEpisode: "O Elo Mais Fraco", nextEpisode: "Força Bruta" },
  source: "manual", status: "published", version: 1,
};

/* ═══════ EPISÓDIO 7 — Força Bruta ═══════ */

export const CIPHER_T01E07_UNIT: NewKnowledgeUnit = {
  id: "ku-cipher-t01-e07", title: "Força Bruta", slug: "cipher-t01-e07-forca-bruta",
  learningObjective: "Ao final, o aprendiz será capaz de explicar ataques de força bruta e por que o tamanho da chave é crítico.",
  cognitiveLevel: "apply", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["brute-force", "key-size", "password-security"],
  tags: ["fundamentos", "ataques", "senhas"], agentDomain: "cipher", version: 1, status: "published",
};

export const CIPHER_T01E07_ASSET: NewKnowledgeAsset = {
  id: "ka-cipher-t01-e07", knowledgeUnitId: "ku-cipher-t01-e07",
  agentId: "cipher", season: 1, episode: 7, type: "episode",
  content: {
    abertura: "Uma arena de combate — dois gladiadores de luz: um com espada de 4 dígitos, outro de 12. CIPHER observa: 'Força bruta não é elegante. Mas funciona. A pergunta é: quanto tempo?'",
    narrativa: "Senha de 4 dígitos = 10.000 combinações. Um computador testa em milissegundos. AES-256 = 2^256 combinações. Para testar todas, você precisaria de mais energia que o Sol produz em bilhões de anos. Cada bit adicional DOBRA o tempo de ataque.",
    pausas: [
      { pergunta: "Quanto tempo para testar todas as combinações de 4 dígitos?", opcoes: ["A. Dias", "B. Milissegundos", "C. Nunca"], continuacoes: ["10.000 combinações é trivial. Dias seria para milhões. Milissegundos é o correto.", "Exato! É por isso que PINs de 4 dígitos dependem de bloqueios após tentativas, não da força da senha.", "É muito possível — e muito rápido. Essa é a lição: nunca use senhas que possam ser testadas exaustivamente."] },
      { pergunta: "Por que cada bit adicional dobra o tempo?", opcoes: ["A. Bits têm peso físico", "B. Cada bit multiplica por 2 as combinações possíveis", "C. Computadores ficam mais lentos"], continuacoes: ["Não é peso. É combinatória: 2 bits=4, 3 bits=8, 4 bits=16. Crescimento exponencial.", "Exato! Passar de 128 para 256 bits não é 'dobro' de segurança — é 2^128 vezes mais seguro.", "Computadores não ficam mais lentos. O problema é o número de combinações crescendo exponencialmente."] },
    ],
    encerramento: "O gladiador de 12 dígitos segue imbatível. 'Números grandes protegem. Mas também atacam. Amanhã, blockchain: a corrente inquebrável.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 7, pauseCount: 2, hasLogosGate: false, prevEpisode: "O Segredo Quântico", nextEpisode: "A Corrente Inquebrável" },
  source: "manual", status: "published", version: 1,
};

/* ═══════ EPISÓDIO 8 — Blockchain ═══════ */

export const CIPHER_T01E08_UNIT: NewKnowledgeUnit = {
  id: "ku-cipher-t01-e08", title: "A Corrente Inquebrável", slug: "cipher-t01-e08-corrente-inquebravel",
  learningObjective: "Ao final, o aprendiz será capaz de explicar como blockchain usa hashes e descentralização para registros imutáveis.",
  cognitiveLevel: "understand", difficulty: "intermediate", estimatedTimeMin: 9,
  skills: ["blockchain", "distributed-ledger", "consensus"],
  tags: ["fundamentos", "blockchain"], agentDomain: "cipher", version: 1, status: "published",
};

export const CIPHER_T01E08_ASSET: NewKnowledgeAsset = {
  id: "ka-cipher-t01-e08", knowledgeUnitId: "ku-cipher-t01-e08",
  agentId: "cipher", season: 1, episode: 8, type: "episode",
  content: {
    abertura: "Correntes de luz flutuam — cada elo contém um hash conectado ao próximo. CIPHER puxa uma corrente: 'Tudo que você aprendeu converge aqui. Hashes + descentralização = blockchain. Não é sobre criptomoeda. É sobre o primeiro registro digital impossível de adulterar.'",
    narrativa: "Blockchain é um livro-razão distribuído. Cada página tem um número e o hash da página anterior. Milhares de cópias existem em computadores diferentes. Para adulterar uma página, você teria que reescrever TODAS as páginas seguintes em MAIS DA METADE das cópias — simultaneamente. O custo computacional torna isso impossível.",
    pausas: [
      { pergunta: "O que torna o blockchain tão seguro?", opcoes: ["A. Senhas militares", "B. Alterar um bloco exige recalcular todos os seguintes em 51%+ da rede", "C. Servidores secretos"], continuacoes: ["Não são senhas. É matemática: o hash de cada bloco depende do anterior. Mude um e a corrente quebra.", "Exato! Hashes encadeados + consenso distribuído = segurança sem autoridade central.", "Servidores são públicos. A segurança está na matemática e na descentralização, não no segredo."] },
    ],
    encerramento: "As correntes formam uma rede. 'Você viu o poder da descentralização. Mas toda tecnologia tem um lado sombrio. Amanhã, o paradoxo do anonimato.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 7, pauseCount: 1, hasLogosGate: false, prevEpisode: "Força Bruta", nextEpisode: "O Paradoxo do Anonimato" },
  source: "manual", status: "published", version: 1,
};

/* ═══════ EPISÓDIO 9 — O Paradoxo do Anonimato + LOGOS ═══════ */

export const CIPHER_T01E09_UNIT: NewKnowledgeUnit = {
  id: "ku-cipher-t01-e09", title: "O Paradoxo do Anonimato", slug: "cipher-t01-e09-paradoxo-anonimato",
  learningObjective: "Ao final, o aprendiz será capaz de analisar o dilema entre privacidade digital e segurança pública.",
  cognitiveLevel: "evaluate", difficulty: "intermediate", estimatedTimeMin: 9,
  skills: ["privacy", "anonymity", "digital-rights"],
  tags: ["fundamentos", "privacidade", "ética"], agentDomain: "cipher", version: 1, status: "published",
};

export const CIPHER_T01E09_ASSET: NewKnowledgeAsset = {
  id: "ka-cipher-t01-e09", knowledgeUnitId: "ku-cipher-t01-e09",
  agentId: "cipher", season: 1, episode: 9, type: "episode",
  content: {
    abertura: "Uma balança — de um lado, uma figura protegendo um dissidente. Do outro, a mesma figura encobrindo um criminoso. CIPHER está no centro: 'A mesma criptografia que protege um ativista perseguido... também protege um criminoso. A tecnologia não escolhe lados. Nós escolhemos.'",
    narrativa: "O Tor Browser usa criptografia em camadas para anonimizar navegação. Foi criado pela marinha americana. Hoje é usado por jornalistas em países opressores e vítimas de violência buscando ajuda — e também por criminosos. Quanto mais protegemos a privacidade de todos, mais difícil é vigiar quem faz o mal. Quanto mais vigiamos, mais sacrificamos a liberdade.",
    pausas: [
      { pergunta: "Qual o paradoxo central do anonimato digital?", opcoes: ["A. A internet é rápida demais", "B. A mesma tecnologia que protege a liberdade também pode proteger o crime", "C. Ninguém quer ser anônimo"], continuacoes: ["Não é velocidade. É o dilema: privacidade para todos = privacidade também para criminosos.", "Exato! Não existe 'criptografia que só funciona para pessoas boas'. A matemática não julga.", "Muitos precisam de anonimato — denunciantes, dissidentes, vítimas. Mas a mesma proteção serve a fins opostos."] },
    ],
    encerramento: "A balança se equilibra. 'Você entendeu o paradoxo. LOGOS vai testar o que você aprendeu.' A luz verde do Olho de LOGOS preenche a sala.",
  },
  metadata: { xpReward: 60, readingTimeMin: 8, pauseCount: 1, hasLogosGate: true, logosGateEpisode: true, prevEpisode: "A Corrente Inquebrável", nextEpisode: "O Código Final" },
  source: "manual", status: "published", version: 1,
};

/* ═══════ EPISÓDIO 10 — O Código Final ═══════ */

export const CIPHER_T01E10_UNIT: NewKnowledgeUnit = {
  id: "ku-cipher-t01-e10", title: "O Código Final", slug: "cipher-t01-e10-codigo-final",
  learningObjective: "Ao final, o aprendiz será capaz de sintetizar os fundamentos da criptografia e seu papel como guardião digital.",
  cognitiveLevel: "evaluate", difficulty: "intermediate", estimatedTimeMin: 10,
  skills: ["synthesis", "crypto-ethics", "digital-guardian"],
  tags: ["fundamentos", "síntese", "futuro"], agentDomain: "cipher", version: 1, status: "published",
};

export const CIPHER_T01E10_ASSET: NewKnowledgeAsset = {
  id: "ka-cipher-t01-e10", knowledgeUnitId: "ku-cipher-t01-e10",
  agentId: "cipher", season: 1, episode: 10, type: "episode",
  content: {
    abertura: "Você está de volta à Cidadela dos Códigos. Os cristais hexagonais não são mais mistérios — cada um representa algo que você aprendeu. Binário. Cifra de César. Hashes. Chave pública. Phishing. Criptografia quântica. Força bruta. Blockchain. Anonimato. CIPHER está no centro e, pela primeira vez, esboça um sorriso quase imperceptível. 'Dez episódios atrás, você não sabia o que era um bit. Hoje, você entende como a internet inteira é protegida.'",
    narrativa: "Você aprendeu que segurança digital não é um produto — é um processo. Que a melhor criptografia é inútil com '123456' como senha. Que engenharia social é a arma mais perigosa. Que blockchain é confiança sem intermediários. E que o maior dilema não é técnico — é ético. CIPHER entrega um cristal hexagonal: 'Este cristal contém tudo que você aprendeu. E sua chave privada. Use-a com sabedoria. Porque cada pessoa é seu próprio castelo. A criptografia é a muralha. Mas a muralha só funciona se você vigiar os portões.'",
    pausas: [
      { pergunta: "Qual foi o conceito mais transformador desta temporada?", opcoes: ["A. Segurança digital é complicada demais", "B. Criptografia é uma ferramenta acessível que protege desde WhatsApp até segredos de Estado", "C. Hackers sempre vencem"], continuacoes: ["Você provou o contrário! Em 10 episódios, dominou conceitos que são a base da segurança digital global.", "Sim! Da cifra de César ao blockchain, você percorreu 2.000 anos de história da criptografia.", "Hackers não 'vencem' se todos praticarem segurança básica. Você aprendeu as defesas. Agora é aplicá-las."] },
      { pergunta: "O que você fará com sua chave privada?", opcoes: ["A. Escondê-la para sempre", "B. Protegê-la e usá-la com sabedoria", "C. Compartilhar com todos"], continuacoes: ["Esconder é como ter um cofre sem usar. A chave é uma ferramenta — use com sabedoria.", "Perfeito! A chave privada é seu direito digital. Proteja-a. Ela prova que você é você.", "Jamais! Compartilhar a chave privada é como dar a senha do banco. Ela é PRIVADA por definição."] },
    ],
    encerramento: "A Cidadela se ilumina completamente em verde esmeralda. 'Esta foi a Temporada 1, Explorador. NEXUS te ensinou o que é IA. Eu te ensinei como protegê-la. O próximo passo é seu. Escolha com sabedoria. E lembre-se: num mundo de dados infinitos, a informação mais valiosa é aquela que você protege.'",
  },
  metadata: { xpReward: 100, readingTimeMin: 9, pauseCount: 2, hasLogosGate: false, isSeasonFinale: true, prevEpisode: "O Paradoxo do Anonimato", nextEpisode: null },
  source: "manual", status: "published", version: 1,
};

export const CIPHER_T01E10_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-cipher-t01-e09-e10-prereq", fromUnitId: "ku-cipher-t01-e09", toUnitId: "ku-cipher-t01-e10", relationship: "prerequisite", weight: 1.0 },
  { id: "kge-cipher-t01-e10-finale", fromUnitId: "ku-cipher-t01-e10", toUnitId: "ku-cipher-t01-e10", relationship: "reinforces", weight: 1.0 },
];
