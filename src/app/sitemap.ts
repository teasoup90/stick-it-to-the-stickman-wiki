import type { MetadataRoute } from "next";
import { getAllContentPaths } from "@/lib/content";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/config/site";
import { CONTENT_TYPES } from "@/config/navigation";

export const dynamic = "force-static";

/**
 * Content types whose entries change often enough to hint weekly recrawls.
 * Keyed by content-type semantics — never hardcode a game-specific category.
 */
const WEEKLY_CONTENT_TYPES = new Set(["updates", "news"]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const validContentTypes = new Set<string>(CONTENT_TYPES);
  const staticPaths = ["", "/about", "/privacy-policy", "/terms-of-service", "/copyright"];
  return (await Promise.all(routing.locales.map(async (locale) => {
    const articlePaths = (await getAllContentPaths(locale)).filter((item) => validContentTypes.has(item.contentType));
    const sourcePaths = [
      ...staticPaths,
      ...CONTENT_TYPES.map((contentType) => `/${contentType}`),
      ...articlePaths.map((item) => `/${item.contentType}/${item.slug.join("/")}`)
    ];
    const articleModified = new Map(articlePaths.map((item) => [`/${item.contentType}/${item.slug.join("/")}`, item.lastModified]));
    /**
     * Static pages must not claim a fresh modification at every deploy.
     * They inherit the newest real article modification instead; with no
     * articles yet, lastModified is simply omitted.
     */
    const latestArticleModified = articlePaths
      .map((item) => item.lastModified)
      .filter((date): date is Date => date instanceof Date)
      .sort((a, b) => b.getTime() - a.getTime())[0];
    return Array.from(new Set(sourcePaths)).map((pathname) => {
      const topSegment = pathname.split("/")[1] ?? "";
      return {
        url: `${SITE_URL}/${locale}${pathname}`,
        lastModified: articleModified.get(pathname) ?? latestArticleModified,
        changeFrequency: WEEKLY_CONTENT_TYPES.has(topSegment) ? "weekly" as const : "monthly" as const,
        priority: pathname === "" ? 1 : pathname.split("/").length <= 2 ? 0.8 : 0.7
      };
    });
  }))).flat();
}
