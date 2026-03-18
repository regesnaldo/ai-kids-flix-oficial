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
    <html lang="pt-BR">
      <body style={{ backgroundColor: "#141414", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
