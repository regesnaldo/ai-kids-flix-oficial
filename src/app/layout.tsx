import "./globals.css";

export const metadata = {
  title: "MENTE.AI — Laboratório de Inteligência Viva",
  description: "MENTE.AI: Plataforma de autoconhecimento com agentes inteligentes e simulador emocional.",
  applicationName: "MENTE.AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" style={{ backgroundColor: "#0a0a1a !important" as any, margin: 0 }}>
      <body style={{ backgroundColor: "#0a0a1a !important" as any, margin: 0, padding: 0, boxSizing: "border-box" }}>
        {children}
      </body>
    </html>
  );
}
