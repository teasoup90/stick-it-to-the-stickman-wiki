export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://stickittothestickmanwiki.space").replace(/\/$/, "");

/** Must match the VERSION file at the template root (the launch validator checks this). */
export const TEMPLATE_VERSION = "2";

export const BRAND_ASSETS = {
  logo: "/images/logo.png",
  hero: "/images/hero.webp",
  bosses: "/images/hero.webp"
} as const;

export const EXTERNAL_LINKS = {
  youtube: "https://www.youtube.com/watch?v=SNSIB_4V0EA",
  officialGame: "https://www.stickittothestickman.com/",
  steam: "https://store.steampowered.com/app/2085540/Stick_It_to_the_Stickman/",
  devolver: "https://www.devolverdigital.com/games/stick-it-to-the-stickman",
  discord: ""
} as const;

export function absoluteUrl(pathname: string) {
  return `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}
