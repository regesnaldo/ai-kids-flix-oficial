"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { shouldShowOnboarding } from "@/lib/onboarding/types";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const blocked =
      pathname.startsWith("/login") ||
      pathname.startsWith("/planos") ||
      pathname.startsWith("/sucesso") ||
      pathname.startsWith("/conta");
    if (blocked) return;
    if (shouldShowOnboarding()) router.push("/onboarding");
  }, [pathname, router]);

  return (
    <div style={{ backgroundColor: "#0a0e27", minHeight: "100vh", margin: 0 }}>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background:
            "linear-gradient(to bottom, rgba(10,14,39,0.95), transparent)",
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.02em" }}>
            <span style={{ color: "#ffffff" }}>MENTE</span>
            <span style={{ color: "#E50914" }}>.AI</span>
          </span>
        </Link>
        <Navigation />
      </header>
      <main style={{ paddingTop: "70px" }}>{children}</main>
    </div>
  );
}

