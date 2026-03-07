export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ backgroundColor: "#0a0e27", minHeight: "100vh", margin: 0 }}>
      <header style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(to bottom, rgba(10,14,39,0.95), transparent)",
      }}>
        <span style={{ fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.02em" }}>
          <span style={{ color: "#ffffff" }}>MENTE</span>
          <span style={{ color: "#E50914" }}>.AI</span>
        </span>
        <nav style={{ display: "flex", gap: "1.5rem" }}>
          {["Início", "Explorar", "Minha Lista"].map((item) => (
            <a key={item} href="#" style={{
              color: "rgba(255,255,255,0.8)",
              textDecoration: "none",
              fontSize: "0.95rem",
              fontWeight: 500,
            }}>{item}</a>
          ))}
        </nav>
      </header>
      {children}
    </div>
  );
}
