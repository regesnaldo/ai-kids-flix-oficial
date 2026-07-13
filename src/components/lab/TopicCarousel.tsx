"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Clock3, FlaskConical } from "lucide-react";
import type { Topic } from "@/types/topic";

interface TopicCarouselProps {
  topics: Topic[];
  onSelect: (question: string) => void;
  agentColor: string;
  compact?: boolean;
}

const EXPERIMENT_DETAILS: Record<string, { code: string; objective: string; specialist: string; duration: string; level: string }> = {
  "como-ia-aprende": { code: "EXP-01 · FUNDAMENTOS", objective: "Entenda como dados viram previsões e decisões.", specialist: "NEXUS", duration: "8 min", level: "Iniciante" },
  "deep-learning": { code: "EXP-02 · REDES NEURAIS", objective: "Veja como camadas aprendem padrões complexos.", specialist: "CIPHER", duration: "12 min", level: "Intermediário" },
  "etica-ia": { code: "EXP-03 · ÉTICA", objective: "Avalie escolhas responsáveis no uso de IA.", specialist: "ETHOS", duration: "10 min", level: "Iniciante" },
  "futuro-ia": { code: "EXP-04 · CENÁRIOS", objective: "Projete impactos possíveis para os próximos anos.", specialist: "KAOS", duration: "9 min", level: "Intermediário" },
  llms: { code: "EXP-05 · MODELOS", objective: "Descubra como modelos de linguagem geram respostas.", specialist: "AURORA", duration: "14 min", level: "Intermediário" },
  "ia-criativa": { code: "EXP-06 · CRIAÇÃO", objective: "Explore ideias, repertório e criação assistida.", specialist: "AURORA", duration: "11 min", level: "Iniciante" },
  "ia-meio-ambiente": { code: "EXP-07 · IMPACTO", objective: "Investigue eficiência, energia e sustentabilidade.", specialist: "VOLT", duration: "10 min", level: "Intermediário" },
};

function getExperiment(topic: Topic) {
  return EXPERIMENT_DETAILS[topic.id] ?? {
    code: "EXP · EXPLORAÇÃO",
    objective: "Investigue este tema com um especialista do Laboratório.",
    specialist: "NEXUS",
    duration: "10 min",
    level: "Iniciante",
  };
}

export function TopicCarousel({ topics, onSelect, agentColor, compact }: TopicCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScroll = () => {
    const element = scrollRef.current;
    if (!element) return;
    setCanScrollLeft(element.scrollLeft > 4);
    setCanScrollRight(element.scrollLeft < element.scrollWidth - element.clientWidth - 4);
  };

  useEffect(() => {
    updateScroll();
    const element = scrollRef.current;
    if (!element) return;
    element.addEventListener("scroll", updateScroll, { passive: true });
    const observer = new ResizeObserver(updateScroll);
    observer.observe(element);
    return () => {
      element.removeEventListener("scroll", updateScroll);
      observer.disconnect();
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: direction === "left" ? -380 : 380, behavior: "smooth" });
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {topics.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => onSelect(topic.question)}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-cyan-300/50 hover:text-white"
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: topic.color }} />
            {getExperiment(topic).code}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/70">Controle de missões</p>
          <h2 className="mt-1 text-lg font-bold text-white">Experimentos do Laboratório</h2>
          <p className="mt-1 text-sm text-slate-400">Escolha uma missão e aprenda fazendo.</p>
        </div>
        <span className="hidden items-center gap-2 text-xs text-cyan-100/70 sm:flex">
          <FlaskConical size={15} className="text-cyan-300" />
          {topics.length} experimentos disponíveis
        </span>
      </div>

      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Ver experimentos anteriores"
          className="absolute left-2 top-[58%] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/25 bg-slate-950/95 text-cyan-100 shadow-xl transition hover:border-cyan-300 hover:bg-cyan-400/10"
        >
          <ChevronLeft size={19} />
        </button>
      )}

      <div ref={scrollRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
        {topics.map((topic) => {
          const experiment = getExperiment(topic);
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => onSelect(topic.question)}
              className="group relative w-[310px] shrink-0 snap-start overflow-hidden rounded-2xl border bg-[#091326]/90 p-5 text-left transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(0,0,0,0.36)] focus:outline-none focus:ring-2 focus:ring-cyan-300 lg:w-[calc((100%-2rem)/3)]"
              style={{ borderColor: `${topic.color}70` }}
            >
              <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: topic.color }} />
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-15 blur-2xl" style={{ backgroundColor: topic.color }} />
              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[10px] font-bold tracking-[0.16em]" style={{ color: topic.color }}>{experiment.code}</p>
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/5 px-2 py-1 text-[10px] font-medium text-cyan-100/80">Disponível</span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-white">{topic.label}</h3>
                <p className="mt-2 min-h-10 text-sm leading-relaxed text-slate-300">{experiment.objective}</p>
                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Especialista recomendado</p>
                  <p className="mt-1 text-sm font-semibold" style={{ color: topic.color }}>{experiment.specialist}</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><Clock3 size={14} />{experiment.duration}</span>
                  <span>{experiment.level}</span>
                </div>
                <span className="mt-5 flex items-center gap-2 text-sm font-bold text-cyan-200 transition group-hover:gap-3">
                  Iniciar experimento <ArrowRight size={16} />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Ver próximos experimentos"
          className="absolute right-2 top-[58%] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/25 bg-slate-950/95 text-cyan-100 shadow-xl transition hover:border-cyan-300 hover:bg-cyan-400/10"
        >
          <ChevronRight size={19} />
        </button>
      )}
    </div>
  );
}
