"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { sendMessageToNexus } from "@/lib/api";
import NexusPanel from "@/components/NexusPanel";
import AgentCard from "@/components/agents/AgentCard";
import ExplorationRow from "@/components/home/ExplorationRow";
import JourneyCard from "@/components/home/JourneyCard";
import CategoryCard from "@/components/home/CategoryCard";
import AgentPairingCard from "@/components/home/AgentPairingCard";
import { agentsShowcase } from "@/data/agents-showcase";
import { allAgents } from "@/data/all-agents";

const sidebarItems = [
  { name: "Início", href: "/home" },
  { name: "Séries", href: "/aulas" },
  { name: "Explorar", href: "/explorar" },
  { name: "Temas", href: "/temas" },
  { name: "Minha Jornada", href: "/perfil" },
  { name: "Agentes IA", href: "/agentes" },
];

function SidebarItem({ item, isActive }: { item: typeof sidebarItems[0]; isActive: boolean }) {
  return (
    <Link href={item.href} style={{ textDecoration: 'none' }}>
      <div style={{
        padding: '12px 16px',
        color: isActive ? '#8B5CF6' : '#fff',
        backgroundColor: isActive ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
        cursor: 'pointer',
        marginBottom: '4px'
      }}>
        {item.name}
      </div>
    </Link>
  );
}





// Journey definitions
const journeys = [
  {
    id: "fundamentos",
    title: "Fundamentos de IA",
    description: "Aprenda os conceitos essenciais que formam a base de toda IA moderna.",
    level: "Iniciante",
    color: "#3B82F6",
  },
  {
    id: "criatividade",
    title: "Criatividade Radical",
    description: "Desbloqueie seu potencial criativo com agentes especializados em inovação.",
    level: "Intermediário",
    color: "#E50914",
  },
  {
    id: "etica",
    title: "IA Ética e Responsável",
    description: "Explore os desafios éticos e responsabilidades do desenvolvimento de IA.",
    level: "Avançado",
    color: "#8B5CF6",
  },
  {
    id: "estrategia",
    title: "Estratégia e Planejamento",
    description: "Domine o pensamento estratégico aplicado a sistemas de IA complexos.",
    level: "Avançado",
    color: "#10B981",
  },
];

// Agent pairings
const pairings = [
  {
    agent1Id: "nexus",
    agent2Id: "kaos",
    title: "Criatividade Estruturada",
    description: "A combinação perfeita entre conectividade e disrupção. Crie ideias revolucionárias dentro de estruturas sólidas.",
  },
  {
    agent1Id: "aurora",
    agent2Id: "ethos",
    title: "Visão Ética",
    description: "Clareza e responsabilidade caminham juntas. Veja o futuro com consciência moral.",
  },
  {
    agent1Id: "volt",
    agent2Id: "axiom",
    title: "Energia Precisa",
    description: "Motivação aliada à lógica pura. Transforme determinação em resultados exatos.",
  },
  {
    agent1Id: "cipher",
    agent2Id: "lyra",
    title: "Análise Harmoniosa",
    description: "Decodifique padrões complexos com elegância. Faça a análise tão bela quanto é precisa.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [nexusResponse, setNexusResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendToNexus = async (message: string) => {
    if (!message.trim()) return;
    setIsLoading(true);
    setNexusResponse('');
    try {
      const data = await sendMessageToNexus(message);
      setNexusResponse(data.reply);
    } catch (error) {
      setNexusResponse('Error: Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Group agents by category
  const agentsByCategory: { [key: string]: typeof allAgents } = {};
  allAgents.forEach((agent) => {
    if (!agentsByCategory[agent.category]) {
      agentsByCategory[agent.category] = [];
    }
    agentsByCategory[agent.category].push(agent);
  });

  // Get top categories
  const topCategories = [
    "Fundamentos",
    "Inovação",
    "Ética",
    "Análise",
    "Estratégia",
  ].filter((cat) => agentsByCategory[cat]);

  // Get agents for pairings
  const getPairingAgents = (id: string) =>
    allAgents.find((a) => a.id === id);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#0a0a1a',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '240px',
        background: '#1a1a2e',
        padding: '20px 0',
        position: 'fixed',
        height: '100vh'
      }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #333' }}>
          <div style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>
            MENTE.AI
          </div>
        </div>
        <nav style={{ padding: '20px 0' }}>
          {sidebarItems.map((item) => (
            <SidebarItem key={item.name} item={item} isActive={item.name === 'Início'} />
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: '240px',
        marginRight: '340px',
        padding: '40px'
      }}>
        {/* Hero Section - Cinematic */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            position: 'relative',
            background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            borderRadius: '20px',
            padding: '60px 40px'
          }}
        >
          {/* NEXUS Image with Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            style={{
              position: 'relative',
              marginBottom: '40px'
            }}
          >
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{
                position: 'absolute',
                inset: '-20px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.5), transparent)',
                borderRadius: '50%',
                filter: 'blur(20px)',
                zIndex: 0
              }}
            />
            <div style={{
              position: 'relative',
              zIndex: 1,
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid rgba(59, 130, 246, 0.5)',
              boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)'
            }}>
              <Image
                src="/images/agentes/nexus.png"
                alt="NEXUS - O Conector"
                width={300}
                height={300}
                priority
                style={{ objectFit: 'cover' }}
              />
            </div>
          </motion.div>

          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
            style={{ maxWidth: '600px' }}
          >
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: 'bold',
              color: '#fff',
              margin: '0 0 20px',
              lineHeight: 1.2
            }}>
              Onde mentes são formadas, não formatadas
            </h1>
            <p style={{
              fontSize: '1.3rem',
              color: '#a0aec0',
              margin: '0 0 40px',
              lineHeight: 1.6
            }}>
              NEXUS conecta você ao conhecimento infinito dos agentes de IA. Cada um uma perspectiva única no universo do aprendizado.
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <button
                onClick={() => router.push('/agentes')}
                style={{
                  padding: '14px 32px',
                  background: 'linear-gradient(135deg, #3B82F6, #1d4ed8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.6)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.4)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Conhecer os Agentes
              </button>
              <button
                onClick={() => router.push('/perfil')}
                style={{
                  padding: '14px 32px',
                  background: 'transparent',
                  border: '2px solid rgba(59, 130, 246, 0.6)',
                  borderRadius: '8px',
                  color: '#3B82F6',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 1)';
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.6)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Minha Jornada
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* SECTION 2: Featured Agent Council */}
        <ExplorationRow
          title="O Conselho de Mentores"
          subtitle="Os 12 arquétipos que moldam o universo MENTE.AI"
          delay={0.2}
        >
          <AnimatePresence>
            {agentsShowcase.slice(0, 12).map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <AgentCard agent={agent} />
              </motion.div>
            ))}
          </AnimatePresence>
        </ExplorationRow>

        {/* SECTION 3: Journey Pathways */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          style={{ marginTop: '80px' }}
        >
          <h2 style={{
            color: '#fff',
            fontSize: '2rem',
            marginBottom: '10px',
            fontWeight: '700'
          }}>
            Suas Jornadas de Aprendizado
          </h2>
          <p style={{
            color: '#a0aec0',
            fontSize: '1.1rem',
            marginBottom: '40px'
          }}>
            Caminhos personalizados para sua evolução
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            <AnimatePresence>
              {journeys.map((journey, index) => (
                <motion.div
                  key={journey.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <JourneyCard {...journey} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* SECTION 4: Continue Your Journey */}
        <ExplorationRow
          title="Continue de Onde Parou"
          subtitle="Sua progressão aguarda"
          delay={0.6}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0 }}
            style={{
              padding: '32px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '12px',
              textAlign: 'center',
              gridColumn: '1 / -1'
            }}
          >
            <h3 style={{
              color: '#fff',
              fontSize: '1.3rem',
              fontWeight: '600',
              margin: '0 0 12px'
            }}>
              Comece sua primeira jornada
            </h3>
            <p style={{
              color: '#a0aec0',
              fontSize: '1rem',
              margin: '0 0 20px',
              lineHeight: 1.6
            }}>
              Escolha uma jornada acima para começar a explorar o universo MENTE.AI e conectar-se com agentes que transformarão sua maneira de aprender.
            </p>
            <button
              onClick={() => router.push('/aulas')}
              style={{
                padding: '12px 24px',
                background: '#8B5CF6',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              Explorar Jornadas
            </button>
          </motion.div>
        </ExplorationRow>

        {/* SECTION 5: Agent Universes */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
          style={{ marginTop: '80px' }}
        >
          <h2 style={{
            color: '#fff',
            fontSize: '2rem',
            marginBottom: '10px',
            fontWeight: '700'
          }}>
            Explore por Domínio
          </h2>
          <p style={{
            color: '#a0aec0',
            fontSize: '1.1rem',
            marginBottom: '40px'
          }}>
            Escolha um universo e mergulhe em suas profundezas
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            <AnimatePresence>
              {topCategories.map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <CategoryCard
                    categoryName={category}
                    agents={agentsByCategory[category] || []}
                    agentCount={agentsByCategory[category]?.length || 0}
                    color={agentsByCategory[category]?.[0]?.color || '#3B82F6'}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* SECTION 6: Discovery Zone */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0, ease: "easeOut" }}
          style={{ marginTop: '80px' }}
        >
          <h2 style={{
            color: '#fff',
            fontSize: '2rem',
            marginBottom: '10px',
            fontWeight: '700'
          }}>
            Descubra Conexões
          </h2>
          <p style={{
            color: '#a0aec0',
            fontSize: '1.1rem',
            marginBottom: '40px'
          }}>
            Agentes que se complementam
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            <AnimatePresence>
              {pairings.map((pairing, index) => {
                const agent1 = getPairingAgents(pairing.agent1Id);
                const agent2 = getPairingAgents(pairing.agent2Id);
                if (!agent1 || !agent2) return null;

                return (
                  <motion.div
                    key={`${pairing.agent1Id}-${pairing.agent2Id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <AgentPairingCard
                      agent1={agent1}
                      agent2={agent2}
                      title={pairing.title}
                      description={pairing.description}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* SECTION 7: CTA Zone */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.2, ease: "easeOut" }}
          style={{
            marginTop: '80px',
            padding: '60px 40px',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.1))',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '20px',
            textAlign: 'center',
            marginBottom: '40px'
          }}
        >
          <h2 style={{
            color: '#fff',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: '0 0 20px',
            lineHeight: 1.2
          }}>
            Pronto para transformar sua mente?
          </h2>
          <p style={{
            color: '#a0aec0',
            fontSize: '1.2rem',
            margin: '0 0 40px',
            lineHeight: 1.6,
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Acesse o conhecimento infinito de 22 agentes especializados. Comece grátis e descubra como a IA pode ampliar suas capacidades.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button
              onClick={() => router.push('/aulas')}
              style={{
                padding: '14px 32px',
                background: '#8B5CF6',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.6)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.4)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Comece Grátis
            </button>
            <button
              onClick={() => router.push('/planos')}
              style={{
                padding: '14px 32px',
                background: 'transparent',
                border: '2px solid rgba(139, 92, 246, 0.6)',
                borderRadius: '8px',
                color: '#8B5CF6',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 1)';
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.6)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Ver Planos Premium
            </button>
          </div>
        </motion.div>
      </div>

      {/* NEXUS Panel - Styled */}
      <div style={{
        position: 'fixed',
        right: 0,
        top: 0,
        height: '100vh',
        width: '340px',
        background: '#1a1a2e',
        borderLeft: '2px solid rgba(59, 130, 246, 0.6)',
        boxShadow: '-10px 0 30px rgba(59, 130, 246, 0.15)',
        overflow: 'hidden'
      }}>
        <NexusPanel
          response={nexusResponse}
          loading={isLoading}
          onSendMessage={sendToNexus}
        />
      </div>
    </div>
  );
  }
