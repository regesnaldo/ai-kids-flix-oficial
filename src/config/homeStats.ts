export interface StatCard {
  label: string;
  value: string;
  sub: string;
  accent: string;
  primary: boolean;
  href: string;
  image: string;
}

export function buildHomeStats(completedCount: number): StatCard[] {
  return [
    {
      label: "UNIVERSOS",
      value: `${completedCount}/12`,
      sub: completedCount === 0 ? "Próximo: NEXUS" : `${completedCount} desbloqueados`,
      accent: "#00FFFF",
      primary: true,
      href: "/universo",
      image: "/images/storyboard/universe-entry.jpg",
    },
    {
      label: "MÓDULOS",
      value: "—",
      sub: "Sincronizando",
      accent: "#00FF88",
      primary: false,
      href: "/series",
      image: "/images/storyboard/episode-circle-v1.jpg",
    },
    {
      label: "DECISÕES",
      value: "—",
      sub: "Sincronizando",
      accent: "#FFB347",
      primary: false,
      href: "/aulas",
      image: "/images/storyboard/episode-logos.jpg",
    },
    {
      label: "XP",
      value: "—",
      sub: "Sincronizando",
      accent: "#C084FC",
      primary: false,
      href: "/blog/como-funciona-o-sistema-de-recompensas",
      image: "/images/storyboard/xp-reward.jpg",
    },
  ];
}
