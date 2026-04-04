"use client";
import { useLabStore } from "@/store/useLabStore";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import LabChat from "@/components/lab/LabChat";
import { useState } from "react";

const TransformerScene = dynamic(() => import("@/components/zones/transformers/TransformerScene"), { ssr:false });
const RedesNeuraisScene = dynamic(() => import("@/components/zones/redes/RedesNeuraisScene"), { ssr:false });
const EmbeddingsScene = dynamic(() => import("@/components/zones/criativa/EmbeddingsScene"), { ssr:false });
const EticaViesScene = dynamic(() => import("@/components/zones/etica/EticaViesScene"), { ssr:false });

const ZONE_INFO = {
  transformers: {
    color:"#3B82F6", agente:"logos", titulo:"Transformers em Ação",
    descricao:"Veja como a atenção multi-head funciona. Cada esfera é uma cabeça de atenção — elas giram e se conectam aos tokens da frase.",
    experimento: "transformer",
  },
  redes: {
    color:"#8B5CF6", agente:"logos", titulo:"Redes Neurais",
    descricao:"Cada nó é um neurônio pulsando. As linhas são conexões com pesos. Ajuste as camadas e veja a rede mudar em tempo real.",
    experimento: "redes",
  },
  criativa: {
    color:"#EC4899", agente:"psyche", titulo:"Geração Criativa",
    descricao:"Cada ponto flutuante é uma palavra no espaço vetorial. Palavras com significados parecidos ficam próximas umas das outras.",
    experimento: "criativa",
  },
  etica: {
    color:"#F59E0B", agente:"psyche", titulo:"Ética e Vieses",
    descricao:"Cada bolha representa um tipo de viés. O tamanho indica a intensidade. Vieses maiores em vermelho, menores em azul.",
    experimento: "etica",
  },
};

function RedesControls({ onChange }: { onChange:(layers:number, neurons:number)=>void }) {
  const [layers, setLayers] = useState(4);
  const [neurons, setNeurons] = useState(4);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"12px", padding:"12px", background:"rgba(255,255,255,0.03)", borderRadius:"10px", border:"1px solid rgba(139,92,246,0.2)" }}>
      <div>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
          <span style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.5)" }}>Camadas</span>
          <span style={{ fontSize:"0.72rem", color:"#8B5CF6", fontWeight:700 }}>{layers}</span>
        </div>
        <input type="range" min={2} max={6} value={layers}
          onChange={e=>{ const v=Number(e.target.value); setLayers(v); onChange(v,neurons); }}
          style={{ width:"100%", accentColor:"#8B5CF6" }} />
      </div>
      <div>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
          <span style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.5)" }}>Neurônios por camada</span>
          <span style={{ fontSize:"0.72rem", color:"#8B5CF6", fontWeight:700 }}>{neurons}</span>
        </div>
        <input type="range" min={2} max={6} value={neurons}
          onChange={e=>{ const v=Number(e.target.value); setNeurons(v); onChange(layers,v); }}
          style={{ width:"100%", accentColor:"#8B5CF6" }} />
      </div>
    </div>
  );
}

function EticaExperimento() {
  const frases = [
    { texto:"O médico atendeu o paciente.", vies:"Gênero — presume masculino", nivel:0.7 },
    { texto:"A secretária anotou o recado.", vies:"Gênero — presume feminino", nivel:0.75 },
    { texto:"O algoritmo negou o empréstimo.", vies:"Racial/Socioeconômico", nivel:0.85 },
    { texto:"O estudante esforçado passou.", vies:"Baixo viés detectado", nivel:0.15 },
  ];
  const [revelado, setRevelado] = useState<number|null>(null);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
      <p style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.45)", marginBottom:"4px" }}>Clique em uma frase para detectar o viés:</p>
      {frases.map((f,i)=>(
        <motion.div key={i} onClick={()=>setRevelado(i===revelado?null:i)}
          whileHover={{ scale:1.01 }} style={{ cursor:"pointer", padding:"10px 12px", borderRadius:"8px",
            background: revelado===i ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.03)",
            border:`1px solid ${revelado===i?"rgba(245,158,11,0.4)":"rgba(255,255,255,0.06)"}`, transition:"all 0.2s" }}>
          <p style={{ fontSize:"0.78rem", color:"#fff", margin:0 }}>"{f.texto}"</p>
          {revelado===i && (
            <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} style={{ marginTop:"8px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
                <div style={{ flex:1, height:"6px", borderRadius:"3px", background:"rgba(255,255,255,0.1)" }}>
                  <div style={{ height:"100%", borderRadius:"3px", width:`${f.nivel*100}%`,
                    background: f.nivel>0.6?"linear-gradient(90deg,#F59E0B,#E50914)":"linear-gradient(90deg,#10B981,#3B82F6)" }} />
                </div>
                <span style={{ fontSize:"0.65rem", color: f.nivel>0.6?"#F59E0B":"#10B981", fontWeight:700 }}>{Math.round(f.nivel*100)}%</span>
              </div>
              <p style={{ fontSize:"0.68rem", color:"rgba(255,255,255,0.5)", margin:0 }}>⚠️ {f.vies}</p>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default function ZoneContent() {
  const { zonaAtiva } = useLabStore();
  const info = ZONE_INFO[zonaAtiva];
  const [redesConfig, setRedesConfig] = useState({ layers:4, neurons:4 });

  return (
    <AnimatePresence mode="wait">
      <motion.div key={zonaAtiva}
        initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-16 }}
        transition={{ duration:0.4 }}
        style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:"16px", height:"520px" }}>

        {/* ESQUERDA: 3D + experimento */}
        <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
          {/* 3D */}
          <div style={{ flex:1, borderRadius:"16px", border:`1px solid ${info.color}20`, background:"rgba(0,0,0,0.3)", overflow:"hidden", position:"relative" }}>
            <div style={{ position:"absolute", top:"10px", left:"12px", zIndex:2, fontSize:"0.65rem", color:info.color, letterSpacing:"0.12em", fontWeight:700, background:"rgba(0,0,0,0.5)", padding:"3px 8px", borderRadius:"6px" }}>
              VISUALIZAÇÃO 3D AO VIVO
            </div>
            {zonaAtiva === "transformers" && <TransformerScene />}
            {zonaAtiva === "redes" && <RedesNeuraisScene numLayers={redesConfig.layers} neuronsPerLayer={redesConfig.neurons} />}
            {zonaAtiva === "criativa" && <EmbeddingsScene />}
            {zonaAtiva === "etica" && <EticaViesScene />}
          </div>

          {/* EXPERIMENTO */}
          <div style={{ padding:"14px", borderRadius:"12px", border:`1px solid ${info.color}20`, background:"rgba(0,0,0,0.25)" }}>
            <div style={{ fontSize:"0.65rem", color:info.color, letterSpacing:"0.12em", fontWeight:700, marginBottom:"8px" }}>
              EXPERIMENTO INTERATIVO
            </div>
            <p style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.5)", margin:"0 0 10px", lineHeight:1.6 }}>{info.descricao}</p>
            {zonaAtiva === "redes" && (
              <RedesControls onChange={(l,n)=>setRedesConfig({layers:l,neurons:n})} />
            )}
            {zonaAtiva === "etica" && <EticaExperimento />}
            {zonaAtiva === "transformers" && (
              <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.4)", fontStyle:"italic" }}>
                🔄 Arraste a cena 3D para ver os diferentes ângulos da atenção multi-head.
              </div>
            )}
            {zonaAtiva === "criativa" && (
              <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.4)", fontStyle:"italic" }}>
                ✨ Palavras com significados similares ficam agrupadas no espaço vetorial. Observe rei/rainha, quente/frio.
              </div>
            )}
          </div>
        </div>

        {/* DIREITA: CHAT */}
        <LabChat agentId={info.agente} />
      </motion.div>
    </AnimatePresence>
  );
}

