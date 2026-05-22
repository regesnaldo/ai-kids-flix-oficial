"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { UserHud } from "./UserHud";
import { ConquestNotification } from "./ConquestNotification";
import { generateUsername } from "@/lib/username-generator";
import { REWARD_LEVELS, type RewardLevel } from "@/lib/xp-engine";

interface XpData {
  total: number;
  today: number;
  streak: number;
  dailyCeiling: number;
}

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

  // Sci-fi username
  const username = typeof window !== "undefined"
    ? (() => {
        try {
          const stored = localStorage.getItem("mente_ai_username");
          if (stored) return stored;
        } catch {}
        const name = generateUsername(String(userId || "anon") + (email || ""));
        try { localStorage.setItem("mente_ai_username", name); } catch {}
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
    } catch {}
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
        levels={REWARD_LEVELS as RewardLevel[]}
        episodeCount={episodeCount}
        validReferrals={validReferrals}
        referralLink={referralLink}
        hidden={playbackActive || !userId}
        onClose={() => {}}
        onPanelOpenChange={setPanelOpen}
      />

      {/* Conquest — suppressed when panel is open */}
      <ConquestNotification suppressed={panelOpen} />
    </GamificationContext.Provider>
  );
}
