import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { HomePageClient } from "./HomePageClient";
import { JsonLd } from "@/components/json-ld";
import { BRAND_ASSETS, SITE_URL, absoluteUrl } from "@/config/site";
import { getContentNavigation, getPopularContent, getRecentContent } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  const site = await getTranslations({ locale, namespace: "site" });
  const title = t("title");
  const description = t("description");
  const image = absoluteUrl(BRAND_ASSETS.hero);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/${locale}`, languages: Object.fromEntries(routing.locales.map((item) => [item, `/${item}`])) },
    openGraph: { type: "website", title, description, url: `${SITE_URL}/${locale}`, siteName: site("wikiName"), images: [{ url: image, width: 1280, height: 720, alt: site("wikiName") }] },
    twitter: { card: "summary_large_image", title, description, images: [image] }
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const home = t.raw("home") as Parameters<typeof HomePageClient>[0]["home"];
  const [categories, recent, popular] = await Promise.all([
    getContentNavigation(locale as Locale),
    getRecentContent(locale as Locale, 4),
    getPopularContent(locale as Locale, 4)
  ]);
  const serializeArticle = (item: (typeof recent)[number]) => ({
    title: item.metadata.title,
    navTitle: item.metadata.navTitle,
    description: item.metadata.description,
    badge: item.metadata.badge,
    image: item.metadata.image,
    href: item.href,
    date: item.metadata.lastModified ?? item.metadata.date
  });
  const website = { "@context": "https://schema.org", "@type": "WebSite", name: t("site.wikiName"), url: SITE_URL, inLanguage: locale };
  return <><JsonLd data={website} /><HomePageClient home={home} locale={locale} categories={categories} recent={recent.map(serializeArticle)} popular={popular.map(serializeArticle)} /></>;
}
