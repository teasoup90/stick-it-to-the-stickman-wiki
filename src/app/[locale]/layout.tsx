import "geist/font/sans";
import "geist/font/mono";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { SiteIntegrations } from "@/components/site-integrations";
import { routing, type Locale } from "@/i18n/routing";
import { getContentCategories } from "@/lib/content";
import { BRAND_ASSETS, SITE_URL, absoluteUrl } from "@/config/site";
import en from "@/locales/en.json";
import { NAVIGATION_CONFIG } from "@/config/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale }) as typeof en;
  const image = absoluteUrl(BRAND_ASSETS.hero);
  const adsensePublisherId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID?.trim();
  const validAdsensePublisherId = /^ca-pub-\d{16}$/.test(adsensePublisherId ?? "")
    ? adsensePublisherId
    : null;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: messages.site.wikiName || "Stick It to the Stickman Wiki", template: `%s — ${messages.site.wikiName || "Stick It to the Stickman Wiki"}` },
    description: messages.site.description,
    manifest: "/manifest.webmanifest",
    icons: { icon: [{ url: "/favicon.ico" }, { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }], apple: "/apple-touch-icon.png" },
    openGraph: { type: "website", locale, title: messages.site.wikiName, description: messages.site.description, siteName: messages.site.wikiName, url: SITE_URL, images: [{ url: image, width: 1280, height: 720, alt: messages.site.wikiName }] },
    twitter: { card: "summary_large_image", title: messages.site.wikiName, description: messages.site.description, images: [image] },
    ...(validAdsensePublisherId ? { other: { "google-adsense-account": validAdsensePublisherId } } : {})
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  const typedMessages = messages as unknown as typeof en;
  const categories = await getContentCategories(locale as Locale);
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: typedMessages.site.wikiName,
    url: SITE_URL,
    "logo": absoluteUrl(BRAND_ASSETS.logo),
    "image": absoluteUrl(BRAND_ASSETS.hero)
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <SiteIntegrations />
        <Providers locale={locale} messages={messages}>
          <JsonLd data={organization} />
          <SiteHeader locale={locale as Locale} navigation={NAVIGATION_CONFIG.map((item) => ({ title: typedMessages.nav[item.key as keyof typeof typedMessages.nav], href: item.path, count: categories.find((category) => category.slug === item.key)?.count ?? 0 }))} />
          {children}
          <SiteFooter locale={locale} />
        </Providers>
      </body>
    </html>
  );
}
