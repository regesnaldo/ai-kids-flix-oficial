"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import CognitiveGPS from "@/components/journey/CognitiveGPS";
import LogosOracle from "@/components/logos/LogosOracle";
import { shouldShowOnboarding } from "@/lib/onboarding/types";
import { OasisProvider } from "@/providers/OasisProvider";
import { SessionProvider } from "@/providers/SessionProvider";
import { JourneyProvider } from "@/providers/JourneyProvider";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const blocked =
      pathname.startsWith("/login") ||
      pathname.startsWith("/planos") ||
      pathname.startsWith("/sucesso") ||
      pathname.startsWith("/conta") ||
      pathname.startsWith("/onboarding") ||
      pathname.startsWith("/home") ||
      pathname.startsWith("/universo") ||
      pathname.startsWith("/lab");
    if (blocked) return;
    if (shouldShowOnboarding()) router.push("/onboarding");
  }, [pathname, router]);

  return (
    <SessionProvider>
      <OasisProvider>
        <JourneyProvider>
        <div style={{ backgroundColor: "#0a0e27", minHeight: "100vh", margin: 0 }}>
      <Navigation />
      <CognitiveGPS />
      <main style={{ paddingTop: "70px" }}>{children}</main>
      {pathname !== "/logos" && <LogosOracle />}
    </div>
    </JourneyProvider>
    </OasisProvider>
    </SessionProvider>
  );
}
