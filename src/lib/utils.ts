import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Keeps the full article title for the document's SEO title and H1, while
 * avoiding needless game-name repetition in navigation and content cards.
 * `navTitle` is preferred when an article supplies one; existing MDX files
 * remain compatible because the game-name prefix is removed as a fallback.
 */
export function compactGameTitle(title: string, gameName: string, navTitle?: string) {
  const preferred = navTitle?.trim();
  if (preferred) return preferred;

  const normalizedGameName = gameName.trim();
  if (!normalizedGameName) return title;

  const withoutPrefix = title
    .replace(new RegExp(`^\\s*${escapeRegExp(normalizedGameName)}\\s*(?:Wiki\\s*)?(?:[-–—:|]\\s*)?`, "i"), "")
    .trim();

  return withoutPrefix || title;
}
