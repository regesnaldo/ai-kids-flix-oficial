/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: "#0a0a1a",
          dark: "#0f0f2d",
          panel: "#141432",
          surface: "#1a1a3e",
          border: "#2a2a5a",
        },
        neon: {
          cyan: "#00f0ff",
          purple: "#a855f7",
          pink: "#ec4899",
          blue: "#3b82f6",
          orange: "#f97316",
          green: "#10b981",
        },
        match: {
          high: "#10b981",
          mid: "#f59e0b",
          low: "#ef4444",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        card: "10px",
        "card-hover": "14px",
        modal: "16px",
      },
      boxShadow: {
        "glow-cyan": "0 0 8px rgba(0,240,255,0.3), 0 0 24px rgba(0,240,255,0.15)",
        "glow-purple": "0 0 8px rgba(168,85,247,0.3), 0 0 24px rgba(168,85,247,0.15)",
        "glow-pink": "0 0 8px rgba(236,72,153,0.3), 0 0 24px rgba(236,72,153,0.15)",
        "neon-cyan": "0 0 4px rgba(0,240,255,0.6), 0 0 12px rgba(0,240,255,0.4)",
        "neon-purple": "0 0 4px rgba(168,85,247,0.6), 0 0 12px rgba(168,85,247,0.4)",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "card-shine": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) translateX(0)", opacity: "0.2" },
          "50%": { transform: "translateY(-20px) translateX(10px)", opacity: "0.5" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "card-shine": "card-shine 1.5s ease-in-out",
        fadeIn: "fadeIn 0.5s ease-out forwards",
        float: "float 3s ease-in-out infinite",
        pulseGlow: "pulseGlow 2s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
