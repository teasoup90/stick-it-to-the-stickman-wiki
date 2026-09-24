export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, "");

/** Must match the VERSION file at the template root (the launch validator checks this). */
export const TEMPLATE_VERSION = "2";

export const BRAND_ASSETS = {
  logo: "/images/logo.png",
  hero: "/images/hero.webp",
  bosses: "/images/hero.webp"
} as const;

export const EXTERNAL_LINKS = {
  youtube: "",
  officialGame: "",
  discord: ""
} as const;

export function absoluteUrl(pathname: string) {
  return `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}
