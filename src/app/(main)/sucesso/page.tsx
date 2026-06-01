"use client";

import Image from "next/image";
import Link from "next/link";
import { tokens } from "@/design-system/tokens";

export default function SucessoPage() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.badge}>PAGAMENTO CONFIRMADO</div>

        <div style={styles.iconWrap}>
          <Image
            src="/images/agentes/nexus.png"
            alt="NEXUS"
            width={160}
            height={160}
            style={styles.nexusImage}
            priority
          />
          <div style={styles.glow} />
        </div>

        <h1 style={styles.title}>Pagamento aprovado!</h1>
        <p style={styles.subtitle}>
          Bem-vindo ao MENTE.AI. Sua jornada no universo começa agora.
        </p>

        <Link href="/home" style={styles.button}>
          ENTRAR NO UNIVERSO
        </Link>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: tokens.color.surface.background,
    padding: tokens.spacing.md,
  },
  card: {
    background: tokens.color.surface.panelElevated,
    border: tokens.border.active,
    borderRadius: tokens.radius.panel,
    padding: tokens.spacing.xxxl,
    maxWidth: 420,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: tokens.spacing.lg,
    boxShadow: tokens.shadow.glowCyan,
  },
  badge: {
    fontFamily: "monospace",
    fontSize: "11px",
    letterSpacing: "3px",
    color: tokens.color.text.success,
    border: `1px solid ${tokens.color.text.success}`,
    padding: "6px 14px",
    borderRadius: tokens.radius.minimal,
  },
  iconWrap: {
    position: "relative",
    width: 160,
    height: 160,
  },
  nexusImage: {
    position: "relative",
    zIndex: 1,
    objectFit: "contain",
  },
  glow: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)",
    filter: "blur(12px)",
  },
  title: {
    color: tokens.color.text.primary,
    fontSize: "24px",
    fontWeight: 700,
    fontFamily: "monospace",
    letterSpacing: "1px",
    margin: 0,
  },
  subtitle: {
    color: tokens.color.text.secondary,
    fontSize: "14px",
    fontFamily: "monospace",
    lineHeight: 1.6,
    margin: 0,
    maxWidth: 300,
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    color: tokens.color.text.link,
    border: `1px solid ${tokens.color.text.link}`,
    borderRadius: tokens.radius.card,
    padding: "14px 32px",
    fontFamily: "monospace",
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "2px",
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: tokens.shadow.glowCyan,
  },
};
