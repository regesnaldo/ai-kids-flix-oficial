"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const MANIFESTO = [
  "// O QUE ACREDITAMOS",
  "",
  "A inteligência artificial não é uma ferramenta.",
  "É uma linguagem.",
  "",
  "E como toda linguagem —",
  "quem aprende primeiro,",
  "lidera.",
  "",
  "Não construímos um curso.",
  "Não construímos um app.",
  "",
  "Construímos um universo",
  "onde a IA deixa de ser intimidante",
  "e vira sua aliada.",
  "",
  "Cada agente tem uma missão.",
  "Cada episódio tem um propósito.",
  "Cada escolha que você faz aqui",
  "molda quem você será lá fora.",
  "",
  "Isso não é entretenimento.",
  "É preparação.",
  "",
  "Bem-vindo ao MENTE.AI.",
  "Sua jornada começa agora.",
  "",
  "// FIM DA TRANSMISSÃO",
];

const CHAR_SPEED = 35;

function ManifestoContent() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (done) return;
    const allChars = MANIFESTO.join("\n");
    if (currentChar >= allChars.length) {
      setDone(true);
      return;
    }
    timerRef.current = setTimeout(() => setCurrentChar((c) => c + 1), CHAR_SPEED);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [currentChar, done]);

  // Calculate which lines to show
  let charCount = 0;
  const linesToShow: string[] = [];
  for (const line of MANIFESTO) {
    if (charCount > currentChar) break;
    linesToShow.push(line);
    charCount += line.length + 1;
  }

  // Last line partial
  const lastLine = linesToShow[linesToShow.length - 1] || "";
  const partialChars = currentChar - (charCount - lastLine.length - 1);
  const displayLast = partialChars > 0 && partialChars < lastLine.length
    ? lastLine.slice(0, partialChars)
    : lastLine;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "#050510" }}>
      <div className="max-w-[680px] w-full">
        {linesToShow.slice(0, -1).map((line, i) => (
          <p key={i} className="text-white/90 text-lg md:text-2xl leading-relaxed mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: line.startsWith("//") ? 700 : 400 }}>
            {line || " "}
          </p>
        ))}
        {!done && (
          <p className="text-white/90 text-lg md:text-2xl leading-relaxed mb-1" style={{ fontFamily: "var(--font-display)" }}>
            {displayLast}
            <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block" style={{ color: "var(--neon-cyan)" }}>
              ▌
            </motion.span>
          </p>
        )}

        {/* CTA Button */}
        {done && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-12 text-center">
            <Link
              href="/series"
              className="inline-flex px-8 py-4 rounded-lg text-lg font-bold transition"
              style={{ background: "var(--neon-cyan)", color: "#050510", boxShadow: "0 0 32px rgba(0,240,255,0.2)" }}
            >
              Começar Jornada
            </Link>
            <p className="text-gray-600 text-sm mt-4">
              <Link href="/blog" className="hover:text-gray-400 transition">← Voltar ao Blog</Link>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ManifestoPage() {
  return <ManifestoContent />;
}
