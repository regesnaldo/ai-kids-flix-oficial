import React, { createContext, useContext, useState } from "react";

export type ThemeMode = "kids" | "teens" | "adults";

interface ThemeConfig {
  mode: ThemeMode;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    cardBg: string;
  };
  typography: {
    fontFamily: string;
    headingFont: string;
  };
  animations: {
    cardHover: string;
    transition: string;
  };
}

const THEME_CONFIGS: Record<ThemeMode, ThemeConfig> = {
  kids: {
    mode: "kids",
    colors: {
      primary: "#FFD700", // Amarelo vibrante
      secondary: "#FF6B9D", // Rosa
      accent: "#00D4FF", // Cyan
      background: "#1a1a2e",
      text: "#FFFFFF",
      cardBg: "rgba(255, 107, 157, 0.1)",
    },
    typography: {
      fontFamily: "Inter, sans-serif",
      headingFont: "Comic Sans MS, cursive",
    },
    animations: {
      cardHover: "bounce",
      transition: "0.3s ease-out",
    },
  },
  teens: {
    mode: "teens",
    colors: {
      primary: "#00D4FF", // Cyan
      secondary: "#FF006E", // Magenta
      accent: "#FFBE0B", // Amarelo
      background: "#0a0e27",
      text: "#E0E0E0",
      cardBg: "rgba(0, 212, 255, 0.05)",
    },
    typography: {
      fontFamily: "Inter, sans-serif",
      headingFont: "Space Grotesk, sans-serif",
    },
    animations: {
      cardHover: "tilt",
      transition: "0.4s cubic-bezier(0.23, 1, 0.320, 1)",
    },
  },
  adults: {
    mode: "adults",
    colors: {
      primary: "#00D4FF", // Cyan neon
      secondary: "#FF006E", // Magenta neon
      accent: "#FFBE0B", // Amarelo neon
      background: "#050812",
      text: "#F5F5F5",
      cardBg: "rgba(0, 212, 255, 0.08)",
    },
    typography: {
      fontFamily: "Inter, sans-serif",
      headingFont: "Space Grotesk, sans-serif",
    },
    animations: {
      cardHover: "holographic",
      transition: "0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
};

interface ThemeModeContextType {
  mode: ThemeMode;
  config: ThemeConfig;
  setMode: (mode: ThemeMode) => void;
}

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(
  undefined
);

export function ThemeModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<ThemeMode>("kids");

  const config = THEME_CONFIGS[mode];

  return (
    <ThemeModeContext.Provider value={{ mode, config, setMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within ThemeModeProvider");
  }
  return context;
}
