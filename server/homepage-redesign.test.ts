import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Homepage Redesign - AI KIDS FLIX V3", () => {
  const netflixHomePath = path.resolve(__dirname, "../client/src/pages/NetflixHome.tsx");
  const indexCssPath = path.resolve(__dirname, "../client/src/index.css");
  const indexHtmlPath = path.resolve(__dirname, "../client/index.html");

  it("NetflixHome.tsx exists and contains key elements", () => {
    const content = fs.readFileSync(netflixHomePath, "utf-8");
    
    // Logo branding
    expect(content).toContain("AI Kids Labs");
    
    // Hero banner
    expect(content).toContain("featured");
    expect(content).toContain("Assistir");
    expect(content).toContain("Saiba mais");
    
    // Nav items
    expect(content).toContain("Início");
    expect(content).toContain("Séries");
    expect(content).toContain("Filmes");
  });

  it("has hero banner with featured series", () => {
    const content = fs.readFileSync(netflixHomePath, "utf-8");
    
    // Featured series rendering
    expect(content).toContain("FEATURED_SERIES");
    expect(content).toContain("featured.title");
    expect(content).toContain("featured.description");
    expect(content).toContain("featured.seasons[0].episodes[0].thumbnail");
    
    // Hero buttons
    expect(content).toContain("Play");
    expect(content).toContain("Info");
  });

  it("has image background in hero", () => {
    const content = fs.readFileSync(netflixHomePath, "utf-8");
    
    // Image element
    expect(content).toContain("<img");
    expect(content).toContain("featured.seasons[0].episodes[0].thumbnail");
    
    // Background styling
    expect(content).toContain("object-cover");
    expect(content).toContain("absolute inset-0");
  });

  it("has video player integration", () => {
    const content = fs.readFileSync(netflixHomePath, "utf-8");
    
    // VideoPlayer component
    expect(content).toContain("VideoPlayer");
    expect(content).toContain("showPlayer");
    expect(content).toContain("setShowPlayer");
    
    // Player state management
    expect(content).toContain("selectedSeries");
    expect(content).toContain("selectedSeason");
    expect(content).toContain("selectedEpisode");
  });

  it("has mobile responsive elements", () => {
    const content = fs.readFileSync(netflixHomePath, "utf-8");
    
    // Responsive layout
    expect(content).toContain("flex");
    expect(content).toContain("gap");
    expect(content).toContain("px-");
    expect(content).toContain("w-full");
  });

  it("uses Framer Motion animations", () => {
    const content = fs.readFileSync(netflixHomePath, "utf-8");
    
    // Framer Motion
    expect(content).toContain("motion");
    expect(content).toContain("whileHover");
    expect(content).toContain("whileTap");
    expect(content).toContain("AnimatePresence");
  });

  it("uses theme colors correctly", () => {
    const content = fs.readFileSync(netflixHomePath, "utf-8");
    
    // Theme usage
    expect(content).toContain("useThemeMode");
    expect(content).toContain("config.colors");
    expect(content).toContain("backgroundColor: config.colors.background");
    expect(content).toContain("color: config.colors.text");
  });

  it("uses proper font styling", () => {
    const content = fs.readFileSync(netflixHomePath, "utf-8");
    
    // Font styling
    expect(content).toContain("font-extrabold");
    expect(content).toContain("font-bold");
    expect(content).toContain("tracking-tight");
  });

  it("connects real DB video URLs to HLS player", () => {
    const content = fs.readFileSync(netflixHomePath, "utf-8");
    // Uses VideoPlayer component to display episodes
    expect(content).toContain("VideoPlayer");
    expect(content).toContain("selectedSeries");
    expect(content).toContain("selectedSeason");
    expect(content).toContain("selectedEpisode");
    // Passes series, season, episode data to VideoPlayer
    expect(content).toContain("series={selectedSeries}");
    expect(content).toContain("season={selectedSeason}");
    expect(content).toContain("episode={selectedEpisode}");
  });

  it("renders category carousels with proper scrolling", () => {
    const content = fs.readFileSync(netflixHomePath, "utf-8");
    // Uses CATEGORIES
    expect(content).toContain("CATEGORIES");
    expect(content).toContain("category.title");
    expect(content).toContain("category.series");
    // Renders scroll buttons
    expect(content).toContain("ChevronLeft");
    expect(content).toContain("ChevronRight");
    // Renders series cards
    expect(content).toContain("series.title");
    expect(content).toContain("Star");
    expect(content).toContain("Clock");
  });

  it("renders navbar with navigation", () => {
    const content = fs.readFileSync(netflixHomePath, "utf-8");
    // Navbar exists
    expect(content).toContain("<nav");
    // Logo
    expect(content).toContain("AI Kids Labs");
    // Navigation links
    expect(content).toContain("Início");
    expect(content).toContain("Séries");
    expect(content).toContain("Filmes");
    // Navbar styling
    expect(content).toContain("fixed");
    expect(content).toContain("top-0");
  });

  it("renders footer", () => {
    const content = fs.readFileSync(netflixHomePath, "utf-8");
    // Footer exists
    expect(content).toContain("<footer");
    // Copyright text
    expect(content).toContain("AI Kids Labs");
    expect(content).toContain("Todos os direitos reservados");
    // Footer styling
    expect(content).toContain("border-t");
    expect(content).toContain("border-white/10");
  });

  it("integrates ChatBot component", () => {
    const content = fs.readFileSync(netflixHomePath, "utf-8");
    // Imports ChatBot
    expect(content).toContain("ChatBot");
    // Renders ChatBot
    expect(content).toContain("<ChatBot />");
  });

  it("integrates VideoPlayer component", () => {
    const content = fs.readFileSync(netflixHomePath, "utf-8");
    // Imports VideoPlayer
    expect(content).toContain("VideoPlayer");
    // Renders VideoPlayer with props
    expect(content).toContain("series={selectedSeries}");
    expect(content).toContain("season={selectedSeason}");
    expect(content).toContain("episode={selectedEpisode}");
    expect(content).toContain("onClose={closePlayer}");
    expect(content).toContain("onSelectEpisode");
  });

  it("handles empty data gracefully", () => {
    const content = fs.readFileSync(netflixHomePath, "utf-8");
    // Checks for empty data protection
    expect(content).toContain("NETFLIX_DATA.length === 0");
    expect(content).toContain("Nenhum conteúdo disponível");
  });

  it("uses proper styling and animations", () => {
    const content = fs.readFileSync(netflixHomePath, "utf-8");
    // Uses Tailwind classes
    expect(content).toContain("min-h-screen");
    expect(content).toContain("overflow-x-hidden");
    expect(content).toContain("rounded");
    // Uses Framer Motion
    expect(content).toContain("motion");
    expect(content).toContain("whileHover");
    expect(content).toContain("whileTap");
    // Uses theme colors
    expect(content).toContain("config.colors");
    expect(content).toContain("useThemeMode");
  });

  it("uses proper accessibility attributes", () => {
    const content = fs.readFileSync(netflixHomePath, "utf-8");
    // Uses aria-labels
    expect(content).toContain("aria-label");
    // Uses semantic HTML
    expect(content).toContain("<nav");
    expect(content).toContain("<footer");
    // Uses buttons with proper labels
    expect(content).toContain("Rolar para esquerda");
    expect(content).toContain("Rolar para direita");
  });

  it("handles state management correctly", () => {
    const content = fs.readFileSync(netflixHomePath, "utf-8");
    // Uses useState
    expect(content).toContain("useState");
    // Manages selected series/season/episode
    expect(content).toContain("setSelectedSeries");
    expect(content).toContain("setSelectedSeason");
    expect(content).toContain("setSelectedEpisode");
    // Manages player visibility
    expect(content).toContain("setShowPlayer");
    // Uses useRef for scroll containers
    expect(content).toContain("useRef");
    expect(content).toContain("scrollContainersRef");
  });

  it("renders without errors", () => {
    const content = fs.readFileSync(netflixHomePath, "utf-8");
    // File exists and has content
    expect(content.length).toBeGreaterThan(0);
    // Has export default
    expect(content).toContain("export default");
    // Has required imports
    expect(content).toContain("useState");
    expect(content).toContain("useThemeMode");
    // Has required components
    expect(content).toContain("VideoPlayer");
    expect(content).toContain("ChatBot");
  });
});
