"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { sendMessageToNexus } from "@/lib/api";
import NexusPanel from "@/components/NexusPanel";
import AgentCard from "@/components/agents/AgentCard";
import { agentsShowcase } from "@/data/agents-showcase";

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

  console.log('HomePage rendering');

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

        {/* Agent Carousel Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{ marginTop: '80px' }}
        >
          <h2 style={{
            color: '#fff',
            fontSize: '2rem',
            marginBottom: '10px',
            fontWeight: '700'
          }}>
            Explore os 12 Agentes Principais
          </h2>
          <p style={{
            color: '#a0aec0',
            fontSize: '1.1rem',
            marginBottom: '40px'
          }}>
            Cada agente traz uma perspectiva única do universo de IA
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            overflowX: 'auto',
            paddingBottom: '20px'
          }}>
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
