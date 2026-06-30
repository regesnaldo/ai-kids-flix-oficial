'use client'

/**
 * HeroNavbar — Navbar minimalista do Hero.
 *
 * Logo: MENTE.AI
 * Subtítulo: Universe of Agents
 * Links discretos + botão SIGN IN
 */

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HeroNavbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5"
      style={{
        background: 'linear-gradient(to bottom, rgba(5,5,7,0.8) 0%, transparent 100%)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* ── Logo ── */}
      <Link href="/home" className="group">
        <div className="flex flex-col">
          <span
            className="text-xl md:text-2xl font-black tracking-[0.2em] text-white"
            style={{
              fontFamily: 'var(--font-orbitron)',
              textShadow: '0 0 20px rgba(0,240,255,0.3)',
            }}
          >
            MENTE.AI
          </span>
          <span
            className="text-[0.6rem] md:text-[0.65rem] tracking-[0.35em] text-cyan-300/60 uppercase mt-0.5"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Universe of Agents
          </span>
        </div>
      </Link>

      {/* ── Links + Sign In ── */}
      <div className="flex items-center gap-6 md:gap-8">
        <Link
          href="/explorar"
          className="hidden md:block text-xs tracking-[0.15em] uppercase text-white/60 hover:text-cyan-300 transition-colors duration-300"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          Explorar
        </Link>
        <Link
          href="/planos"
          className="hidden md:block text-xs tracking-[0.15em] uppercase text-white/60 hover:text-cyan-300 transition-colors duration-300"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          Planos
        </Link>
        <motion.a
          href="/login"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 text-xs tracking-[0.2em] uppercase font-bold text-cyan-300 border border-cyan-400/40 rounded-sm hover:bg-cyan-400/10 transition-colors duration-300"
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            boxShadow: '0 0 15px rgba(0,240,255,0.1)',
          }}
        >
          Sign In
        </motion.a>
      </div>
    </nav>
  )
}
