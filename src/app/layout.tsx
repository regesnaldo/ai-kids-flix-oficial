export const metadata = {
  title: "AI Kids Flix",
  description: 'SOMOS CONTRA AO SISTEMA: CONSTRUIMOS PENSADORES E NÃO "FERRAMENTAS"',
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
