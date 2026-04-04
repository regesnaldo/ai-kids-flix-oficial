"use client";
import { useLabStore, ZoneId } from "@/store/useLabStore";
import { motion } from "framer-motion";

const ZONES = [
  { id:"transformers" as ZoneId, icon:"⚡", label:"Transformers", sub:"Atenção multi-head", color:"#3B82F6" },
  { id:"redes" as ZoneId, icon:"🕸️", label:"Redes Neurais", sub:"Camadas e neurônios", color:"#8B5CF6" },
  { id:"criativa" as ZoneId, icon:"🎨", label:"Geração Criativa", sub:"Embeddings e vetores", color:"#EC4899" },
  { id:"etica" as ZoneId, icon:"⚖️", label:"Ética e Vieses", sub:"Bolhas de tendência", color:"#F59E0B" },
];

export default function ZoneSelector() {
  const { zonaAtiva, setZona } = useLabStore();

  return (
    <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", justifyContent:"center", marginBottom:"24px" }}>
      {ZONES.map((zone) => {
        const active = zonaAtiva === zone.id;
        return (
          <motion.button key={zone.id}
            onClick={() => setZona(zone.id)}
            whileHover={{ scale:1.04 }}
            whileTap={{ scale:0.97 }}
            style={{
              display:"flex", alignItems:"center", gap:"10px",
              padding:"10px 18px", borderRadius:"12px", cursor:"pointer",
              background: active ? `${zone.color}20` : "rgba(255,255,255,0.03)",
              border: `1px solid ${active ? zone.color+"70" : "rgba(255,255,255,0.08)"}`,
              boxShadow: active ? `0 0 20px ${zone.color}25` : "none",
              transition:"all 0.3s",
            }}>
            <span style={{ fontSize:"1.3rem" }}>{zone.icon}</span>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontSize:"0.82rem", fontWeight:700, color: active ? zone.color : "#fff", letterSpacing:"0.03em" }}>
                {zone.label}
              </div>
              <div style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.35)", marginTop:"1px" }}>
                {zone.sub}
              </div>
            </div>
            {active && (
              <motion.div layoutId="activeZone"
                style={{ marginLeft:"6px", width:"6px", height:"6px", borderRadius:"50%", background:zone.color, boxShadow:`0 0 8px ${zone.color}` }} />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
