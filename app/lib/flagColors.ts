// Primary (and secondary) flag colours per team, keyed by the 2-letter ISO
// codes used in lib/vancouver.ts. Used to paint per-match gradient borders so
// every fixture reads in its own national colours. Server-side, no "use client".

export const FLAG_COLORS: Record<
  string,
  { primary: string; secondary?: string }
> = {
  ca: { primary: "#FF0000", secondary: "#FFFFFF" }, // Canada
  ba: { primary: "#0033A0", secondary: "#FFD500" }, // Bosnia & Herzegovina
  au: { primary: "#012169", secondary: "#FF0000" }, // Australia
  tr: { primary: "#E30A17", secondary: "#FFFFFF" }, // Türkiye
  qa: { primary: "#8A1538", secondary: "#FFFFFF" }, // Qatar
  ch: { primary: "#FF0000", secondary: "#FFFFFF" }, // Switzerland
  nz: { primary: "#012169", secondary: "#FF0000" }, // New Zealand
  eg: { primary: "#CE1126", secondary: "#000000" }, // Egypt
  be: { primary: "#000000", secondary: "#FFD700" }, // Belgium
  gh: { primary: "#CE1126", secondary: "#FCD116" }, // Ghana
  pa: { primary: "#005AAA", secondary: "#DA121A" }, // Panama
  de: { primary: "#000000", secondary: "#FFCE00" }, // Germany
  ci: { primary: "#F77F00", secondary: "#009E60" }, // Côte d'Ivoire
  hr: { primary: "#171796", secondary: "#FF0000" }, // Croatia
  sn: { primary: "#00853F", secondary: "#FDEF42" }, // Senegal
  iq: { primary: "#CE1126", secondary: "#FFFFFF" }, // Iraq
  un: { primary: "#FFB627", secondary: "#FF6B35" }, // TBD knockout — warm gold gradient
};

/** A 90° gradient that splits the card border between the two teams' colours. */
export function getMatchBorderGradient(
  homeCode: string,
  awayCode: string
): string {
  const home = FLAG_COLORS[homeCode] ?? FLAG_COLORS.un;
  const away = FLAG_COLORS[awayCode] ?? FLAG_COLORS.un;
  return `linear-gradient(90deg, ${home.primary} 0%, ${home.primary} 45%, ${away.primary} 55%, ${away.primary} 100%)`;
}

/** A soft glow (~20% alpha) in the home team's primary colour, for emphasis. */
export function getMatchGlow(homeCode: string): string {
  const home = FLAG_COLORS[homeCode] ?? FLAG_COLORS.un;
  return `0 0 24px 0 ${home.primary}33`; // 0x33 ≈ 20% alpha
}
