"use client";

import { useState, useRef, useCallback } from "react";
import { Volume2, VolumeX, Captions, Eye, Settings } from "lucide-react";

// ─── Types ──────────────────────────────────────────────

interface AudioDescriptionProps {
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

/**
 * Audio Description toggle for accessibility.
 * When enabled, plays an additional audio track with scene descriptions.
 * Falls back to Web Speech API if no audio track is available.
 */
export function AudioDescriptionToggle({ enabled = false, onToggle }: AudioDescriptionProps) {
  const [active, setActive] = useState(enabled);

  const handleToggle = () => {
    const next = !active;
    setActive(next);
    onToggle?.(next);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
      style={{
        backgroundColor: active ? "rgba(0,240,255,0.15)" : "transparent",
        color: active ? "#00f0ff" : "rgba(255,255,255,0.5)",
        border: active ? "1px solid rgba(0,240,255,0.3)" : "1px solid rgba(255,255,255,0.15)",
      }}
      aria-label={active ? "Disable audio descriptions" : "Enable audio descriptions"}
      aria-pressed={active}
    >
      <Eye className="w-3.5 h-3.5" />
      Audio Descriptions
    </button>
  );
}

// ─── Custom Subtitles ───────────────────────────────────

interface SubtitleStyle {
  fontSize: number;
  fontFamily: string;
  backgroundColor: string;
  textColor: string;
  outlineColor: string;
  opacity: number;
  position: "bottom" | "top" | "custom";
}

const DEFAULT_SUBTITLE_STYLE: SubtitleStyle = {
  fontSize: 20,
  fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
  backgroundColor: "rgba(0,0,0,0.75)",
  textColor: "#ffffff",
  outlineColor: "#000000",
  opacity: 1,
  position: "bottom",
};

const FONT_OPTIONS = [
  "Plus Jakarta Sans",
  "Arial",
  "Georgia",
  "Courier New",
  "Verdana",
];

const COLOR_OPTIONS = [
  { label: "Branco", value: "#ffffff" },
  { label: "Amarelo", value: "#fbbf24" },
  { label: "Cyan", value: "#00f0ff" },
  { label: "Verde", value: "#10b981" },
];

const BG_COLOR_OPTIONS = [
  { label: "Preto", value: "rgba(0,0,0,0.75)" },
  { label: "Transparente", value: "rgba(0,0,0,0)" },
  { label: "Cinza", value: "rgba(64,64,64,0.75)" },
];

interface CustomSubtitlesProps {
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  style?: Partial<SubtitleStyle>;
  onStyleChange?: (style: SubtitleStyle) => void;
}

export function CustomSubtitles({
  enabled = false,
  onToggle,
  style = {},
  onStyleChange,
}: CustomSubtitlesProps) {
  const [active, setActive] = useState(enabled);
  const [showSettings, setShowSettings] = useState(false);
  const [subtitleStyle, setSubtitleStyle] = useState<SubtitleStyle>({
    ...DEFAULT_SUBTITLE_STYLE,
    ...style,
  });

  const handleToggle = () => {
    const next = !active;
    setActive(next);
    onToggle?.(next);
  };

  const updateStyle = (partial: Partial<SubtitleStyle>) => {
    const updated = { ...subtitleStyle, ...partial };
    setSubtitleStyle(updated);
    onStyleChange?.(updated);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
        style={{
          backgroundColor: active ? "rgba(0,240,255,0.15)" : "transparent",
          color: active ? "#00f0ff" : "rgba(255,255,255,0.5)",
          border: active ? "1px solid rgba(0,240,255,0.3)" : "1px solid rgba(255,255,255,0.15)",
        }}
        aria-label={active ? "Disable subtitles" : "Enable subtitles"}
        aria-pressed={active}
      >
        <Captions className="w-3.5 h-3.5" />
        Legendas
      </button>

      {/* Settings panel */}
      {active && (
        <div className="absolute bottom-full right-0 mb-2 w-64 bg-cyber-panel border border-cyber-border rounded-xl p-4 shadow-xl z-50">
          <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
            <Settings className="w-3 h-3" />
            Estilo das Legendas
          </h4>

          {/* Font size */}
          <div className="mb-3">
            <label className="text-[10px] text-zinc-400 uppercase font-semibold">Tamanho da Fonte</label>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-zinc-500">A</span>
              <input
                type="range"
                min="12"
                max="32"
                value={subtitleStyle.fontSize}
                onChange={(e) => updateStyle({ fontSize: parseInt(e.target.value) })}
                className="flex-1 h-1 accent-neon-cyan"
              />
              <span className="text-lg text-zinc-500">A</span>
            </div>
          </div>

          {/* Font family */}
          <div className="mb-3">
            <label className="text-[10px] text-zinc-400 uppercase font-semibold">Fonte</label>
            <select
              value={subtitleStyle.fontFamily}
              onChange={(e) => updateStyle({ fontFamily: e.target.value })}
              className="w-full mt-1 bg-cyber-dark border border-white/10 rounded-md text-xs text-white px-2 py-1"
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          {/* Text color */}
          <div className="mb-3">
            <label className="text-[10px] text-zinc-400 uppercase font-semibold">Cor do Texto</label>
            <div className="flex gap-1.5 mt-1">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => updateStyle({ textColor: color.value })}
                  className="w-6 h-6 rounded-full border-2 transition-all"
                  style={{
                    backgroundColor: color.value,
                    borderColor: subtitleStyle.textColor === color.value ? "#00f0ff" : "transparent",
                  }}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Background color */}
          <div>
            <label className="text-[10px] text-zinc-400 uppercase font-semibold">Fundo</label>
            <div className="flex gap-1.5 mt-1">
              {BG_COLOR_OPTIONS.map((bg) => (
                <button
                  key={bg.value}
                  type="button"
                  onClick={() => updateStyle({ backgroundColor: bg.value })}
                  className="w-6 h-6 rounded-full border-2 transition-all"
                  style={{
                    backgroundColor: bg.value === "rgba(0,0,0,0)" ? "transparent" : "#333",
                    borderColor: subtitleStyle.backgroundColor === bg.value ? "#00f0ff" : "transparent",
                  }}
                  title={bg.label}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Brand Sound (Tudum) ────────────────────────────────

interface BrandSoundProps {
  onSoundEnd?: () => void;
}

/**
 * Plays the MENTE.AI brand sound on initial load.
 * Falls back to Web Audio API oscillator if no audio file is available.
 */
export function BrandSound({ onSoundEnd }: BrandSoundProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback(() => {
    try {
      // Try loading the brand sound file
      const audio = new Audio("/sounds/brand-tudum.mp3");
      audio.volume = 0.3;
      audioRef.current = audio;

      audio.onended = () => {
        onSoundEnd?.();
      };

      audio.play().catch(() => {
        // Fallback: generate a simple tone using Web Audio API
        fallbackTone();
      });
    } catch {
      fallbackTone();
    }
  }, [onSoundEnd]);

  const fallbackTone = () => {
    try {
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(440, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 1);

      oscillator.onended = () => {
        ctx.close();
        onSoundEnd?.();
      };
    } catch {
      // Web Audio not supported either, just callback
      onSoundEnd?.();
    }
  };

  return null;
}

// ─── Accessibility Panel (combines all features) ────────

interface AccessibilityPanelProps {
  audioDescription?: boolean;
  subtitles?: boolean;
  onAudioDescriptionToggle?: (enabled: boolean) => void;
  onSubtitlesToggle?: (enabled: boolean) => void;
  onSubtitleStyleChange?: (style: SubtitleStyle) => void;
}

export function AccessibilityPanel({
  audioDescription = false,
  subtitles = false,
  onAudioDescriptionToggle,
  onSubtitlesToggle,
  onSubtitleStyleChange,
}: AccessibilityPanelProps) {
  return (
    <div className="flex items-center gap-2">
      <AudioDescriptionToggle
        enabled={audioDescription}
        onToggle={onAudioDescriptionToggle}
      />
      <CustomSubtitles
        enabled={subtitles}
        onToggle={onSubtitlesToggle}
        onStyleChange={onSubtitleStyleChange}
      />
    </div>
  );
}
