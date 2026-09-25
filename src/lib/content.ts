import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";
import { routing, type Locale } from "@/i18n/routing";
import { CONTENT_TYPES, NAVIGATION_CONFIG, type ContentType } from "@/config/navigation";
import en from "@/locales/en.json";

const CONTENT_ROOT = path.join(process.cwd(), "content");

const CATEGORY_IMAGES: Record<string, string> = {};

export type ContentMetadata = {
  title: string;
  navTitle?: string;
  description: string;
  category: string;
  date: string;
  lastModified?: string;
  image?: string;
  badge?: string;
  summary?: string;
  featured?: boolean;
  popularity?: number;
  /** A stable search-intent group, such as "release-status". */
  cluster?: string;
  /** Pillar pages are preferred when related pages share a cluster. */
  role?: "pillar" | "supporting";
  /** Explicit related article paths, for example "/guide/how-to-play". */
  related?: string[];
};

type CategoryMetadata = {
  title: string;
  description: string;
  intro?: string;
  guidesTitle?: string;
  order?: number;
};

type ContentGroupConfig = {
  titles: Record<Locale, string>;
  order: number;
};

/**
 * Content group titles keyed by content type slug. Slugs must match the
 * NAVIGATION_CONFIG keys and the article subdirectories under content/<locale>/
 * one-to-one. The order field drives sidebar and listing order.
 */
export const GROUP_TITLES: Record<ContentType, ContentGroupConfig> = {
  characters: { titles: { en: "Characters", de: "Charaktere", "es-es": "Personajes", fr: "Personnages", ja: "キャラクター", ko: "캐릭터", pl: "Postacie", "pt-br": "Personagens" }, order: 1 },
  community: { titles: { en: "Community", de: "Community", "es-es": "Comunidad", fr: "Communauté", ja: "コミュニティ", ko: "커뮤니티", pl: "Społeczność", "pt-br": "Comunidade" }, order: 2 },
  guide: { titles: { en: "Guides", de: "Anleitungen", "es-es": "Guías", fr: "Guides", ja: "ガイド", ko: "가이드", pl: "Poradniki", "pt-br": "Guias" }, order: 3 },
  multiplayer: { titles: { en: "Multiplayer", de: "Mehrspieler", "es-es": "Multijugador", fr: "Multijoueur", ja: "マルチプレイ", ko: "멀티플레이", pl: "Multiplayer", "pt-br": "Multijogador" }, order: 4 },
  platforms: { titles: { en: "Platforms", de: "Plattformen", "es-es": "Plataformas", fr: "Plateformes", ja: "プラットフォーム", ko: "플랫폼", pl: "Platformy", "pt-br": "Plataformas" }, order: 5 },
  progression: { titles: { en: "Progression", de: "Fortschritt", "es-es": "Progresión", fr: "Progression", ja: "進行", ko: "진행", pl: "Postęp", "pt-br": "Progressão" }, order: 6 },
  resources: { titles: { en: "Resources", de: "Ressourcen", "es-es": "Recursos", fr: "Ressources", ja: "リソース", ko: "리소스", pl: "Zasoby", "pt-br": "Recursos" }, order: 7 },
  updates: { titles: { en: "Updates", de: "Updates", "es-es": "Actualizaciones", fr: "Mises à jour", ja: "アップデート", ko: "업데이트", pl: "Aktualizacje", "pt-br": "Atualizações" }, order: 8 }
};

/** Content type slugs in display order; mirrors NAVIGATION_CONFIG ordering. */
export const GROUP_ORDER: ContentType[] = (Object.keys(GROUP_TITLES) as ContentType[]).sort(
  (a, b) => (GROUP_TITLES[a].order ?? Number.MAX_SAFE_INTEGER) - (GROUP_TITLES[b].order ?? Number.MAX_SAFE_INTEGER)
);

/** Locale-first sidebar titles derived from GROUP_TITLES, falling back to English. */
export const GROUP_TITLES_BY_LOCALE: Record<Locale, Record<ContentType, string>> = Object.fromEntries(
  routing.locales.map((locale) => [
    locale,
    Object.fromEntries(GROUP_ORDER.map((slug) => [slug, GROUP_TITLES[slug].titles[locale] ?? GROUP_TITLES[slug].titles.en]))
  ])
) as Record<Locale, Record<ContentType, string>>;

/** English copy is the source of truth; non-English locales deep-merge over it at runtime. */
const MESSAGES: Record<Locale, typeof en> = { en, de: en, "es-es": en, fr: en, ja: en, ko: en, pl: en, "pt-br": en };

type MdxModule = {
  default: ComponentType;
  metadata: ContentMetadata;
};

export type ContentItem = {
  contentType: string;
  slug: string[];
  href: string;
  metadata: ContentMetadata;
  headings: { id: string; text: string; level: 2 | 3 }[];
  MDXContent: ComponentType;
  fallback: boolean;
};

export type ContentCategory = CategoryMetadata & {
  slug: string;
  href: string;
  count: number;
};

export type ContentNavigationCategory = ContentCategory & {
  articles: { title: string; navTitle?: string; href: string }[];
  hasMoreArticles: boolean;
};

export const MAX_SIDEBAR_ARTICLES_PER_CATEGORY = 8;

function slugifyPart(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

async function exists(target: string) {
  try { await fs.access(target); return true; } catch { return false; }
}

async function walkMdx(directory: string): Promise<string[]> {
  if (!(await exists(directory))) return [];
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return walkMdx(target);
    return entry.isFile() && entry.name.endsWith(".mdx") ? [target] : [];
  }));
  return nested.flat();
}

export function validateContentConfiguration() {
  const navigationKeys = NAVIGATION_CONFIG.filter((item) => item.isContentType).map((item) => item.key);
  const groupKeys = Object.keys(GROUP_TITLES);
  for (const key of navigationKeys) {
    const navigation = NAVIGATION_CONFIG.find((item) => item.key === key);
    if (navigation?.path !== `/${key}`) throw new Error(`Navigation path mismatch for content type: ${key}`);
    if (!(key in en.nav)) throw new Error(`Missing nav translation for content type: ${key}`);
    if (!(key in en)) throw new Error(`Missing top-level translation config for content type: ${key}`);
    if (!(key in GROUP_TITLES)) throw new Error(`Missing content group mapping for content type: ${key}`);
    const copy = en[key as keyof typeof en] as { title?: string };
    if (copy.title !== GROUP_TITLES[key].titles.en) throw new Error(`Content title mismatch for content type: ${key}`);
  }
  if (navigationKeys.length !== groupKeys.length || groupKeys.some((key) => !navigationKeys.includes(key as ContentType))) {
    throw new Error("Navigation content types and content group mappings are not synchronized");
  }
}

validateContentConfiguration();

function sourceToSlug(base: string, source: string) {
  const relative = path.relative(base, source).replace(/\\/g, "/").replace(/\.mdx$/i, "");
  return relative.split("/").map(slugifyPart);
}

function headingId(text: string) {
  return slugifyPart(text.replace(/[`*_]/g, ""));
}

async function extractHeadings(source: string) {
  const raw = await fs.readFile(source, "utf8");
  return Array.from(raw.matchAll(/^(##|###)\s+(.+)$/gm)).map((match) => ({
    level: match[1].length as 2 | 3,
    text: match[2].replace(/[`*_]/g, "").trim(),
    id: headingId(match[2])
  }));
}

async function resolveSource(contentType: string, slug: string[], locale: string) {
  const base = path.join(CONTENT_ROOT, locale, contentType);
  for (const source of await walkMdx(base)) {
    if (sourceToSlug(base, source).join("/") === slug.join("/")) return { source, language: locale, base };
  }
  return null;
}

async function importMdx(language: string, contentType: string, source: string, base: string): Promise<MdxModule> {
  const relative = path.relative(base, source).replace(/\\/g, "/").replace(/\.mdx$/i, "");
  return import(`../../content/${language}/${contentType}/${relative}.mdx`) as Promise<MdxModule>;
}

export async function getContent(contentType: string, slug: string[], locale: Locale): Promise<ContentItem | null> {
  const resolved = await resolveSource(contentType, slug, locale);
  if (!resolved) return null;
  const module = await importMdx(resolved.language, contentType, resolved.source, resolved.base);
  return {
    contentType,
    slug,
    href: `/${contentType}/${slug.join("/")}`,
    metadata: { ...module.metadata, image: module.metadata.image ?? CATEGORY_IMAGES[contentType] },
    headings: await extractHeadings(resolved.source),
    MDXContent: module.default,
    fallback: false
  };
}

export async function getAllContent(contentType: string, locale: Locale): Promise<ContentItem[]> {
  const englishBase = path.join(CONTENT_ROOT, "en", contentType);
  const sources = await walkMdx(englishBase);
  const items = await Promise.all(sources.map((source) => getContent(contentType, sourceToSlug(englishBase, source), locale)));
  return items.filter((item): item is ContentItem => Boolean(item)).sort((a, b) => b.metadata.date.localeCompare(a.metadata.date));
}

export async function getContentCategories(locale: Locale): Promise<ContentCategory[]> {
  const messages = MESSAGES[locale];
  const categories = await Promise.all(CONTENT_TYPES.map(async (contentType) => {
    const copy = (messages as Record<string, unknown>)[contentType] as CategoryMetadata;
    const group = GROUP_TITLES[contentType];
    const items = await getAllContent(contentType, locale);
    return {
      ...copy,
      title: group.titles[locale] ?? group.titles.en,
      order: group.order,
      slug: contentType,
      href: `/${contentType}`,
      count: items.length
    };
  }));
  return categories
    .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER) || a.title.localeCompare(b.title));
}

export async function getContentNavigation(locale: Locale, limit = MAX_SIDEBAR_ARTICLES_PER_CATEGORY): Promise<ContentNavigationCategory[]> {
  const categories = await getContentCategories(locale);
  return Promise.all(categories.map(async (category) => {
    const articles = await getAllContent(category.slug, locale);
    return {
      ...category,
      articles: articles.slice(0, limit).map((item) => ({
        title: item.metadata.title,
        navTitle: item.metadata.navTitle,
        href: item.href
      })),
      hasMoreArticles: articles.length > limit
    };
  }));
}

/**
 * Wiki Navigation sidebar: dynamically scans the MDX content library and
 * returns categories ordered by GROUP_ORDER. Articles inside a category are
 * date-ordered by getAllContent; recent updates across categories are served
 * by getAllPublishedContent (date/lastModified descending).
 */
export async function getDynamicNavigation(locale: Locale, limit = MAX_SIDEBAR_ARTICLES_PER_CATEGORY): Promise<ContentNavigationCategory[]> {
  const navigation = await getContentNavigation(locale, limit);
  const order = new Map(GROUP_ORDER.map((slug, index) => [slug, index]));
  return [...navigation].sort((a, b) => (order.get(a.slug as ContentType) ?? Number.MAX_SAFE_INTEGER) - (order.get(b.slug as ContentType) ?? Number.MAX_SAFE_INTEGER));
}

export async function getAllPublishedContent(locale: Locale): Promise<ContentItem[]> {
  const categories = await getContentCategories(locale);
  const groups = await Promise.all(categories.map((category) => getAllContent(category.slug, locale)));
  return groups.flat().sort((a, b) => {
    const aDate = a.metadata.lastModified ?? a.metadata.date;
    const bDate = b.metadata.lastModified ?? b.metadata.date;
    return bDate.localeCompare(aDate);
  });
}

export async function getRecentContent(locale: Locale, limit = 4): Promise<ContentItem[]> {
  return (await getAllPublishedContent(locale)).slice(0, limit);
}

export async function getPopularContent(locale: Locale, limit = 4): Promise<ContentItem[]> {
  const items = await getAllPublishedContent(locale);
  return items
    .sort((a, b) => (b.metadata.popularity ?? 0) - (a.metadata.popularity ?? 0) || Number(Boolean(b.metadata.featured)) - Number(Boolean(a.metadata.featured)) || (b.metadata.lastModified ?? b.metadata.date).localeCompare(a.metadata.lastModified ?? a.metadata.date))
    .slice(0, limit);
}

export async function getRelatedContent(item: ContentItem, locale: Locale, limit = 3): Promise<ContentItem[]> {
  const all = (await getAllPublishedContent(locale)).filter((candidate) => candidate.href !== item.href);
  const byHref = new Map(all.map((candidate) => [candidate.href, candidate]));
  const explicit = (item.metadata.related ?? []).map((href) => byHref.get(href)).filter((candidate): candidate is ContentItem => Boolean(candidate));
  const reciprocal = all.filter((candidate) => candidate.metadata.related?.includes(item.href));
  const sameCluster = item.metadata.cluster
    ? all.filter((candidate) => candidate.metadata.cluster === item.metadata.cluster)
    : [];
  const sameCategory = all.filter((candidate) => candidate.contentType === item.contentType);
  const ordered = [...explicit, ...reciprocal, ...sameCluster, ...sameCategory, ...all];
  return Array.from(new Map(ordered.map((candidate) => [candidate.href, candidate])).values())
    .sort((a, b) => {
      const aPillar = a.metadata.role === "pillar" ? 1 : 0;
      const bPillar = b.metadata.role === "pillar" ? 1 : 0;
      return bPillar - aPillar || (b.metadata.lastModified ?? b.metadata.date).localeCompare(a.metadata.lastModified ?? a.metadata.date);
    })
    .slice(0, limit);
}

export async function getAllContentPaths(language: string = "en") {
  const paths = await Promise.all(CONTENT_TYPES.map(async (contentType) => {
    const base = path.join(CONTENT_ROOT, language, contentType);
    return Promise.all((await walkMdx(base)).map(async (source) => ({
      contentType,
      slug: sourceToSlug(base, source),
      lastModified: (await fs.stat(source)).mtime
    })));
  }));
  return paths.flat();
}
