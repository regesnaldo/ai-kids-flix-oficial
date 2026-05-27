"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { UserHud } from "./UserHud";
import { ConquestNotification } from "./ConquestNotification";
import { generateUsername } from "@/lib/username-generator";

const HIDE_HUD_ROUTES = ["/blog"];

interface XpData {
  total: number;
  today: number;
  streak: number;
  dailyCeiling: number;
}

interface RewardLevel {
  level: number;
  label: string;
  xpRequired: number;
  referralsRequired: number;
  daysRequired: number;
  reward: string;
}

/** Inline copy of xp-engine REWARD_LEVELS — avoids DB import in client component */
const REWARD_LEVELS: RewardLevel[] = [
  { level: 1, label: "Explorador Iniciante", xpRequired: 500, referralsRequired: 3, daysRequired: 7, reward: "10% de desconto" },
  { level: 2, label: "Navegador Cósmico", xpRequired: 1500, referralsRequired: 7, daysRequired: 21, reward: "20% de desconto" },
  { level: 3, label: "Arquiteto Neural", xpRequired: 3000, referralsRequired: 15, daysRequired: 45, reward: "1 mês ChatGPT grátis" },
  { level: 4, label: "Mestre do Metaverso", xpRequired: 6000, referralsRequired: 25, daysRequired: 90, reward: "Distintivo + Acesso Antecipado" },
  { level: 5, label: "Lenda Viva", xpRequired: 10000, referralsRequired: 40, daysRequired: 180, reward: "Hall da Fama + Surpresa" },
];

interface GamificationContextType {
  /** True when holographic panel is open */
  panelOpen: boolean;
  /** True during episode playback */
  playbackActive: boolean;
  setPlaybackActive: (active: boolean) => void;
}

const GamificationContext = createContext<GamificationContextType>({
  panelOpen: false,
  playbackActive: false,
  setPlaybackActive: () => {},
});

export function useGamification() {
  return useContext(GamificationContext);
}

export function GamificationProvider({ children, userId, email }: { children: React.ReactNode; userId?: number; email?: string | null }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [playbackActive, setPlaybackActive] = useState(false);
  const [xpData, setXpData] = useState<XpData | null>(null);
  const [episodeCount, setEpisodeCount] = useState(0);
  const [validReferrals, setValidReferrals] = useState(0);

  // Hide HUD completely on blog pages
  const pathname = usePathname();
  const hideOnRoute = HIDE_HUD_ROUTES.some((route) => pathname.startsWith(route));

  // Sci-fi username
  const username = typeof window !== "undefined"
    ? (() => {
        try {
          const stored = localStorage.getItem("mente_ai_username");
          if (stored) return stored;
        } catch (error) { console.error('[MENTE.AI] Error in GamificationProvider.tsx:', error); }
        const name = generateUsername(String(userId) || "anon" + (email || ""));
        try { localStorage.setItem("mente_ai_username", name); } catch (error) { console.error('[MENTE.AI] Error in GamificationProvider.tsx:', error); }
        return name;
      })()
    : "EXPLORADOR";

  // Referral link
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const referralLink = userId ? `${siteUrl}/cadastro?ref=${userId}` : "";

  // Fetch XP data
  const fetchXpData = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/xp/award?userId=${userId}`);
      if (!res.ok) return;
      const data = await res.json();
      setXpData({
        total: data.total ?? 0,
        today: data.today ?? 0,
        streak: data.streak ?? 0,
        dailyCeiling: data.dailyCeiling ?? 100,
      });
      setEpisodeCount(data.episodeCount ?? 0);
      setValidReferrals(data.validReferrals ?? 0);
    } catch (error) { console.error('[MENTE.AI] Error in GamificationProvider.tsx:', error); }
  }, [userId]);

  useEffect(() => {
    fetchXpData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchXpData, 30000);
    return () => clearInterval(interval);
  }, [fetchXpData]);

  // Listen for conquest events to refresh XP data
  useEffect(() => {
    const handler = () => fetchXpData();
    window.addEventListener("mente_ai_conquest", handler);
    return () => window.removeEventListener("mente_ai_conquest", handler);
  }, [fetchXpData]);

  return (
    <GamificationContext.Provider value={{ panelOpen, playbackActive, setPlaybackActive }}>
      {children}

      {/* HUD — hidden during playback */}
      <UserHud
        username={username}
        xpData={xpData}
        levels={REWARD_LEVELS}
        episodeCount={episodeCount}
        validReferrals={validReferrals}
        referralLink={referralLink}
        hidden={hideOnRoute || playbackActive || !userId}
        onClose={() => {}}
        onPanelOpenChange={setPanelOpen}
      />

      {/* Conquest — suppressed when panel is open */}
      <ConquestNotification suppressed={panelOpen} />
    </GamificationContext.Provider>
  );
}
