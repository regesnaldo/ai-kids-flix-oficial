"use client";
import { useEffect, useState, useRef, memo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Agent = { id:string; name:string; role:string; color:string; desc:string; tag:string; };

const AGENTS: Agent[] = [
  { id:"nexus", name:"NEXUS", role:"O Conector", color:"#3B82F6", desc:"Conecta ideias, pessoas e dados. NEXUS é o agente central que orquestra todos os outros.", tag:"AGENTE PRINCIPAL" },
  { id:"volt", name:"VOLT", role:"A Energia", color:"#F59E0B", desc:"Energia pura e motivação. VOLT transforma dúvidas em ação imediata.", tag:"ENERGIA" },
  { id:"janus", name:"JANUS", role:"O Humorista", color:"#EC4899", desc:"Humor inteligente que ensina. JANUS usa a leveza para revelar verdades profundas.", tag:"HUMOR" },
  { id:"stratos", name:"STRATOS", role:"O Estrategista", color:"#10B981", desc:"Estratégia e visão de futuro. STRATOS enxerga padrões onde outros veem caos.", tag:"ESTRATÉGIA" },
  { id:"kaos", name:"KAOS", role:"O Caos Criativo", color:"#E50914", desc:"Criatividade nasce do inesperado. KAOS quebra regras para criar possibilidades.", tag:"CRIATIVIDADE" },
  { id:"ethos", name:"ETHOS", role:"O Filósofo", color:"#8B5CF6", desc:"Reflexões sobre existência e ética. ETHOS questiona tudo para encontrar verdades.", tag:"FILOSOFIA" },
  { id:"lyra", name:"LYRA", role:"A Melodiosa", color:"#06B6D4", desc:"Cria sequências sonoras e ritmos que conectam emoção e lógica profunda.", tag:"HARMONIA" },
  { id:"axiom", name:"AXIOM", role:"O Lógico", color:"#6366F1", desc:"Deduz verdades absolutas a partir de axiomas. Precisão matemática em cada resposta.", tag:"LÓGICA" },
  { id:"aurora", name:"AURORA", role:"A Iluminadora", color:"#34D399", desc:"Traz clareza onde há confusão. AURORA ilumina caminhos ocultos com esperança.", tag:"CLAREZA" },
  { id:"cipher", name:"CIPHER", role:"A Decifradora", color:"#F97316", desc:"Desvenda códigos, dados e estruturas obscuras com precisão cirúrgica.", tag:"DECIFRAR" },
  { id:"terra", name:"TERRA", role:"O Fundamento", color:"#84CC16", desc:"Ancora conceitos abstratos em aplicações práticas e concretas do mundo real.", tag:"FUNDAMENTO" },
  { id:"prism", name:"PRISM", role:"O Prisma", color:"#A855F7", desc:"Divide a complexidade em espectros compreensíveis. Cada ângulo revela nova verdade.", tag:"PERSPECTIVA" },
  { id:"quantum", name:"QUANTUM", role:"O Quântico", color:"#0EA5E9", desc:"Opera em probabilidades e superposições. QUANTUM vê o que ainda não existe.", tag:"PROBABILIDADE" },
  { id:"analytikos", name:"ANALYTIKOS", role:"O Analítico", color:"#F43F5E", desc:"Disseca problemas em partes mensuráveis. Cada dado conta uma história diferente.", tag:"ANÁLISE" },
  { id:"praevius", name:"PRAEVIUS", role:"A Vidente", color:"#FBBF24", desc:"Antecipa cenários com base em dados. O futuro já está nos padrões do presente.", tag:"VISÃO" },
  { id:"typus", name:"TYPUS", role:"O Padrão", color:"#64748B", desc:"Reconhece e cria estruturas recorrentes. A ordem emerge do aparente caos.", tag:"PADRÕES" },
  { id:"stasis", name:"STASIS", role:"A Estável", color:"#7DD3FC", desc:"Mantém a estabilidade em sistemas dinâmicos. Equilíbrio é sua maior força.", tag:"ESTABILIDADE" },
  { id:"index", name:"INDEX", role:"O Indicador", color:"#4ADE80", desc:"Aponta referências e pontos de interesse. Nunca se perde, sempre orienta.", tag:"ORIENTAÇÃO" },
  { id:"aether", name:"AETHER", role:"A Criadora", color:"#E879F9", desc:"Gera ideias originais a partir do éter criativo. Onde há vazio, AETHER cria.", tag:"CRIAÇÃO" },
  { id:"tabula", name:"TABULA", role:"A Tela", color:"#94A3B8", desc:"Fornece superfície para expressão visual. Toda obra começa com uma tela em branco.", tag:"EXPRESSÃO" },
  { id:"morphe", name:"MORPHE", role:"A Transformadora", color:"#2DD4BF", desc:"Modifica formas e conceitos fluidamente. A mudança é sua natureza essencial.", tag:"TRANSFORMAÇÃO" },
  { id:"paleta", name:"PALETA", role:"A Artista", color:"#FB923C", desc:"Seleciona e combina cores e estilos. A beleza está na combinação perfeita.", tag:"ARTE" },
];

const ROWS = [
  { title:"Populares no MENTE.AI", items:AGENTS.slice(0,12).map(a=>a.name) },
  { title:"Destaques da Semana", items:AGENTS.slice(6,16).map(a=>a.name) },
  { title:"Continue Assistindo", items:AGENTS.slice(0,6).map(a=>a.name) },
  { title:"Recomendados para Você", items:AGENTS.slice(10,22).map(a=>a.name) },
];

function g(name:string):Agent { return AGENTS.find(a=>a.name===name)||AGENTS[0]; }

const PTS = Array.from({length:25},(_,i)=>({ k:i, w:1+(i%3), l:(i*17+9)%100, t:(i*29+11)%100, o:0.1+(i%5)*0.05, d:4+(i%5), dl:(i%7)*0.6 }));

const AgentCard = memo(function AgentCard({ name }:{ name:string }) {
  const ag = g(name);
  const c = ag.color;
  const [hov, setHov] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  return (
    <motion.div
      onHoverStart={()=>setHov(true)}
      onHoverEnd={()=>setHov(false)}
      whileHover={{ scale:1.06, y:-6 }}
      transition={{ type:"spring", stiffness:300, damping:20 }}
      onClick={()=>window.location.href=`/agentes/${ag.id}`}
      style={{ minWidth:"200px", width:"200px", height:"300px", borderRadius:"12px", background:`linear-gradient(160deg,${c}22,#0d0b1e)`, border:`1px solid ${hov?c+"60":c+"18"}`, display:"flex", flexDirection:"column", cursor:"pointer", flexShrink:0, position:"relative", overflow:"hidden", boxShadow:hov?`0 16px 40px ${c}30`:"none" }}>

      {/* imagem */}
      <div style={{ position:"absolute", inset:0 }}>
        <img
          ref={imgRef}
          src={`/images/agentes/${ag.id}.png`}
          alt={ag.name}
          style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top", opacity:0.9 }}
          onError={e=>{ e.currentTarget.style.display="none"; }}
        />
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(180deg,transparent 30%,rgba(0,0,0,0.95) 100%)` }} />
        {hov && <div style={{ position:"absolute", inset:0, background:`linear-gradient(180deg,${c}10,transparent 40%,rgba(0,0,0,0.95))` }} />}
      </div>

      {/* top glow line */}
      {hov && <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px", background:`linear-gradient(90deg,transparent,${c},transparent)`, zIndex:2 }} />}

      {/* conteúdo rodapé */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0.75rem 0.85rem", zIndex:2 }}>
        <div style={{ fontSize:"0.6rem", color:c, letterSpacing:"0.12em", fontWeight:700, marginBottom:"2px" }}>{ag.tag}</div>
        <div style={{ fontSize:"0.95rem", fontWeight:800, color:"#fff", letterSpacing:"0.04em" }}>{ag.name}</div>
        <div style={{ fontSize:"0.68rem", color:"rgba(255,255,255,0.55)", marginBottom:"4px" }}>{ag.role}</div>
        {hov && (
          <motion.p initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.2 }}
            style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.7)", lineHeight:1.5, margin:"4px 0 0" }}>
            {ag.desc}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
});

function Row({ title, items }:{ title:string; items:string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  function scroll(d:number){ scrollRef.current?.scrollBy({ left:d*440, behavior:"smooth" }); }
  return (
    <div style={{ marginBottom:"2.5rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0 4%", marginBottom:"0.85rem" }}>
        <h3 style={{ color:"#fff", fontSize:"1.1rem", fontWeight:700, margin:0 }}>{title}</h3>
        <Link href="/agentes" style={{ color:"rgba(255,255,255,0.35)", fontSize:"0.78rem", textDecoration:"none", transition:"color 0.2s" }} onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.35)"}>Ver todos →</Link>
      </div>
      <div style={{ display:"flex", alignItems:"stretch" }}>
        <button onClick={()=>scroll(-1)} style={{ flexShrink:0, width:"48px", background:"linear-gradient(90deg, #0a0a1a 40%, transparent)", border:"none", color:"rgba(255,255,255,0.8)", fontSize:"1.8rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
        <div ref={scrollRef} style={{ flex:1, display:"flex", gap:"12px", overflowX:"auto", padding:"4px 12px 12px", paddingRight:"80px", scrollbarWidth:"none" }}>
          {items.map((name,i)=><AgentCard key={i} name={name} />)}
        </div>
        <button onClick={()=>scroll(1)} style={{ flexShrink:0, width:"48px", background:"linear-gradient(270deg, #0a0a1a 40%, transparent)", border:"none", color:"rgba(255,255,255,0.8)", fontSize:"1.8rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [heroIdx, setHeroIdx] = useState(0);
  const agent = AGENTS[heroIdx];
  const c = agent.color;

  useEffect(()=>{
    const s = document.createElement("style");
    s.id="hp-styles";
    s.innerHTML=`
      @keyframes float{0%,100%{transform:translateY(0);opacity:.2}50%{transform:translateY(-16px);opacity:.6}}
      @keyframes scan{0%{top:-2px;opacity:0}10%{opacity:1}90%{opacity:.4}100%{top:100%;opacity:0}}
      @keyframes glow{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}
      @keyframes orbitA{from{transform:rotate(0deg) translateX(130px) rotate(0deg)}to{transform:rotate(360deg) translateX(130px) rotate(-360deg)}}
      @keyframes orbitB{from{transform:rotate(180deg) translateX(90px) rotate(-180deg)}to{transform:rotate(540deg) translateX(90px) rotate(-540deg)}}
      @keyframes scanH{0%{left:-100%}100%{left:200%}}
    `;
    if(!document.getElementById("hp-styles")) document.head.appendChild(s);
    return()=>{ document.getElementById("hp-styles")?.remove(); };
  },[]);

  useEffect(()=>{
    const t = setInterval(()=>{ setHeroIdx(i=>(i+1)%AGENTS.length); },9000);
    return()=>clearInterval(t);
  },[]);

  return (
    <main style={{ background:"#0a0a1a", minHeight:"100vh", color:"#fff", overflowX:"hidden" }}>

      {/* HERO */}
      <AnimatePresence mode="wait">
        <motion.div key={heroIdx}
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.6 }}
          style={{ position:"relative", width:"100%", height:"85vh", minHeight:"520px", overflow:"hidden", background:"#0a0a1a" }}>

          {/* bg image */}
          <img src={`/images/agentes/${agent.id}.png`} alt={agent.name}
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"top center", opacity:0.25, filter:"blur(2px)" }}
            onError={e=>{ e.currentTarget.style.display="none"; }} />

          {/* overlays */}
          <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg,#0a0a1a 40%,${c}12 100%)` }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,#0a0a1a 35%,transparent 70%)" }} />

          {/* particles */}
          {PTS.map(p=>(
            <div key={p.k} style={{ position:"absolute", width:`${p.w}px`, height:`${p.w}px`, borderRadius:"50%", background:p.k%2===0?c:"rgba(255,255,255,0.5)", left:`${p.l}%`, top:`${p.t}%`, opacity:p.o, animation:`float ${p.d}s ease-in-out infinite`, animationDelay:`${p.dl}s`, pointerEvents:"none" }} />
          ))}

          {/* scan */}
          <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px", background:`linear-gradient(90deg,transparent,${c}80,transparent)`, animation:"scan 5s ease-in-out infinite", pointerEvents:"none" }} />

          {/* agent card right */}
          <div style={{ position:"absolute", top:"50%", right:"6%", transform:"translateY(-50%)", width:"280px", height:"380px" }}>
            <div style={{ position:"relative", width:"100%", height:"100%", borderRadius:"16px", overflow:"hidden", border:`1px solid ${c}50`, boxShadow:`0 0 60px ${c}30,0 0 120px ${c}10` }}>
              <img src={`/images/agentes/${agent.id}.png`} alt={agent.name}
                style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top" }}
                onError={e=>{ e.currentTarget.style.opacity="0"; }} />
              <div style={{ position:"absolute", inset:0, background:`linear-gradient(transparent 50%,rgba(0,0,0,0.95))` }} />
              <div style={{ position:"absolute", top:0, left:"-100%", width:"50%", height:"100%", background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)", animation:"scanH 3s ease-in-out infinite" }} />
              <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"1rem" }}>
                <div style={{ fontSize:"0.6rem", color:c, letterSpacing:"0.15em", fontWeight:700 }}>{agent.tag}</div>
                <div style={{ fontSize:"1.1rem", color:"#fff", fontWeight:800 }}>{agent.name}</div>
                <div style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.55)" }}>{agent.role}</div>
              </div>
              <div style={{ position:"absolute", top:"10px", right:"10px", width:"8px", height:"8px", borderRadius:"50%", background:"#10B981", boxShadow:"0 0 8px #10B981", animation:"glow 2s infinite" }} />
            </div>
          </div>

          {/* bottom fade */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"40%", background:"linear-gradient(transparent,#0a0a1a)", pointerEvents:"none" }} />

          {/* content */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.6 }}
            style={{ position:"relative", zIndex:2, height:"100%", display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 4%", maxWidth:"580px" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"12px", marginBottom:"1rem" }}>
              <span style={{ padding:"0.3rem 0.9rem", borderRadius:"4px", background:c, color:"#fff", fontSize:"0.68rem", fontWeight:800, letterSpacing:"0.1em" }}>{agent.tag}</span>
              <span style={{ color:"rgba(255,255,255,0.45)", fontSize:"0.82rem" }}>{agent.role}</span>
            </div>
            <h1 style={{ fontSize:"clamp(3.5rem,9vw,5.5rem)", fontWeight:900, color:"#fff", margin:"0 0 0.75rem", lineHeight:0.95, letterSpacing:"-0.02em", textShadow:`0 0 40px ${c}50` }}>{agent.name}</h1>
            <p style={{ color:"rgba(255,255,255,0.7)", fontSize:"1rem", lineHeight:1.65, margin:"0 0 2rem", maxWidth:"440px" }}>{agent.desc}</p>
            <div style={{ display:"flex", gap:"0.85rem", flexWrap:"wrap" }}>
              <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
                onClick={()=>window.location.href=`/agentes/${agent.id}`}
                style={{ padding:"0.85rem 2rem", borderRadius:"6px", border:"none", background:"#fff", color:"#0a0a1a", fontSize:"0.95rem", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:"0.5rem", boxShadow:`0 4px 20px ${c}40` }}>
                ▶ Assistir
              </motion.button>
              <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
                onClick={()=>window.location.href=`/agentes/${agent.id}`}
                style={{ padding:"0.85rem 2rem", borderRadius:"6px", border:"1px solid rgba(255,255,255,0.3)", background:"rgba(255,255,255,0.08)", color:"#fff", fontSize:"0.95rem", fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:"0.5rem", backdropFilter:"blur(8px)" }}>
                ⓘ Mais Informações
              </motion.button>
            </div>
            <div style={{ display:"flex", gap:"12px", marginTop:"2rem" }}>
              {AGENTS.slice(0,8).map((_,i)=>(
                <motion.button key={i} onClick={()=>setHeroIdx(i)} whileHover={{ scale:1.3 }}
                  style={{ width:i===heroIdx?"24px":"8px", height:"8px", borderRadius:"4px", background:i===heroIdx?c:"rgba(255,255,255,0.2)", border:"none", cursor:"pointer", padding:0, transition:"all 0.3s" }} />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* ROWS */}
      <div style={{ marginTop:"-4rem", position:"relative", zIndex:2, paddingBottom:"4rem" }}>
        {ROWS.map(row=><Row key={row.title} title={row.title} items={row.items} />)}

        {/* LAB CTA */}
        <motion.div whileHover={{ scale:1.01 }}
          style={{ margin:"0 4% 3rem", padding:"1.8rem 2rem", borderRadius:"16px", background:"linear-gradient(135deg,rgba(59,130,246,0.1),rgba(139,92,246,0.1))", border:"1px solid rgba(139,92,246,0.2)", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"2rem", flexWrap:"wrap", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"-20px", right:"-20px", width:"120px", height:"120px", borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,0.2),transparent)", filter:"blur(20px)" }} />
          <div>
            <div style={{ fontSize:"0.65rem", color:"#8B5CF6", letterSpacing:"0.15em", fontWeight:700, marginBottom:"0.4rem" }}>LABORATÓRIO MENTE.AI</div>
            <h3 style={{ color:"#fff", fontSize:"1.2rem", fontWeight:800, margin:"0 0 0.3rem" }}>Experimente a IA em tempo real</h3>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.82rem", margin:0 }}>Transformers em Ação, Simulador Neural e muito mais</p>
          </div>
          <Link href="/laboratorio" style={{ padding:"0.9rem 2rem", borderRadius:"10px", background:"linear-gradient(135deg,#3B82F6,#8B5CF6)", color:"#fff", fontWeight:700, fontSize:"0.9rem", textDecoration:"none", whiteSpace:"nowrap", boxShadow:"0 4px 20px rgba(139,92,246,0.35)", transition:"all 0.2s" }} onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.05)"}} onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)"}}>
            ⚗️ Entrar no Lab →
          </Link>
        </motion.div>
      </div>
    </main>
  );
}







