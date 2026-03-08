 
"use client";
import { usePathname } from "next/navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Início", href: "/home" },
    { label: "Explorar", href: "/planos" },
    { label: "Minha Lista", href: "/login" },
  ];

  return (
    <div style={{ backgroundColor: "#0a0e27", minHeight: "100vh", margin: 0 }}>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "1rem 2rem", display: "flex", alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(to bottom, rgba(10,14,39,0.95), transparent)",
      }}>
        <a href="/home" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.02em" }}>
            <span style={{ color: "#ffffff" }}>MENTE</span>
            <span style={{ color: "#E50914" }}>.AI</span>
          </span>
        </a>
        <nav style={{ display: "flex", gap: "1.5rem" }}>
          {navItems.map((item) => (
            <a key={item.label} href={item.href} style={{
              color: pathname === item.href ? "#ffffff" : "rgba(255,255,255,0.6)",
              textDecoration: "none",
              fontSize: "0.95rem",
              fontWeight: pathname === item.href ? 700 : 500,
              borderBottom: pathname === item.href ? "2px solid #E50914" : "2px solid transparent",
              paddingBottom: "2px",
              transition: "all 0.2s",
            }}>{item.label}</a>
          ))}
        </nav>
      </header>
      <div style={{ paddingTop: "70px" }}>
        {children}
      </div>
    </div>
  );
}