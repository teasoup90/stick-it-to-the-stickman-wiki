import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, ChevronRight, Swords } from "lucide-react";
import { getMessages } from "next-intl/server";
import { JsonLd } from "@/components/json-ld";
import { routing, type Locale } from "@/i18n/routing";
import { getAllContent, getAllContentPaths, getContent, getContentCategories, getContentNavigation, getRelatedContent, type ContentNavigationCategory } from "@/lib/content";
import en from "@/locales/en.json";
import { BRAND_ASSETS, SITE_URL, absoluteUrl } from "@/config/site";
import { compactGameTitle } from "@/lib/utils";
import { composeDocumentTitle } from "@/lib/seo";
import { AD_CONFIG } from "@/config/ads";
import { AdsterraBanner, DesktopSidebarAds, DismissibleStickyBanner } from "@/components/ads";
type Messages = typeof en;

function localizeHref(pathname: string, locale: string) {
  return locale === "en" ? pathname : `/${locale}${pathname === "/" ? "" : pathname}`;
}

async function languageAlternates(contentType: string, slug: string[]) {
  const available = (await Promise.all(routing.locales.map(async (locale) => (
    await getContent(contentType, slug, locale) ? locale : null
  )))).filter((locale): locale is Locale => Boolean(locale));
  return Object.fromEntries(available.map((locale) => [locale, localizeHref(`/${contentType}/${slug.join("/")}`, locale)]));
}

export async function generateStaticParams() {
  const contentPaths = await getAllContentPaths("en");
  const categories = await getContentCategories("en");
  const listings = categories.map((category) => ({ slug: [category.slug] }));
  return [...listings, ...contentPaths.map((item) => ({ slug: [item.contentType, ...item.slug] }))];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string[] }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const messages = await getMessages({ locale }) as Messages;
  const siteName = messages.site.wikiName;
  const categories = await getContentCategories(locale);
  const category = categories.find((candidate) => candidate.slug === slug[0]);
  if (slug.length === 1 && category) {
    const contentType = slug[0];
    const title = category.title;
    const description = category.description;
    const fullTitle = composeDocumentTitle(title, siteName);
    const pathname = localizeHref(`/${contentType}`, locale);
    const image = absoluteUrl(contentType === "bosses" ? BRAND_ASSETS.bosses : BRAND_ASSETS.hero);
    return {
      title: { absolute: fullTitle },
      description,
      alternates: { canonical: pathname, languages: Object.fromEntries(routing.locales.map((item) => [item, localizeHref(`/${contentType}`, item)])) },
      openGraph: { type: "website", title: fullTitle, description, url: absoluteUrl(pathname), siteName, images: [image] },
      twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] }
    };
  }

  const [contentType, ...articleSlug] = slug;
  const item = await getContent(contentType, articleSlug, locale);
  if (!item) return { title: messages.shared.notFoundTitle };
  const pathname = `/${contentType}/${articleSlug.join("/")}`;
  const localizedPathname = localizeHref(pathname, locale);
  const image = item.metadata.image?.startsWith("http") ? item.metadata.image : absoluteUrl(item.metadata.image ?? BRAND_ASSETS.hero);
  const fullTitle = composeDocumentTitle(item.metadata.title, siteName);
  return {
    title: { absolute: fullTitle },
    description: item.metadata.description,
    alternates: { canonical: localizedPathname, languages: await languageAlternates(contentType, articleSlug) },
    openGraph: { type: "article", title: fullTitle, description: item.metadata.description, url: absoluteUrl(localizedPathname), siteName, images: [image], publishedTime: item.metadata.date, modifiedTime: item.metadata.lastModified ?? item.metadata.date },
    twitter: { card: "summary_large_image", title: fullTitle, description: item.metadata.description, images: [image] }
  };
}

export default async function SlugPage({ params }: { params: Promise<{ locale: Locale; slug: string[] }> }) {
  const { locale, slug } = await params;
  if (slug.length === 1) return <NavigationPage locale={locale} contentType={slug[0]} />;
  return <DetailPage locale={locale} contentType={slug[0]} slug={slug.slice(1)} />;
}

function Breadcrumbs({ items, label }: { items: { label: string; href?: string }[]; label: string }) {
  return <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label={label}>{items.map((item, index) => <span key={`${item.label}-${index}`} className="flex items-center gap-2">{index > 0 && <ChevronRight className="size-3.5" />}{item.href ? <Link href={item.href} className="hover:text-foreground">{item.label}</Link> : <span className="text-foreground">{item.label}</span>}</span>)}</nav>;
}

function WikiSidebar({ locale, currentType, currentHref, messages, categories }: { locale: string; currentType: string; currentHref?: string; messages: Messages; categories: ContentNavigationCategory[] }) {
  return <aside className="hidden h-fit lg:sticky lg:top-20 lg:block"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{messages.shared.wikiNavigation}</p><div className="mt-3 grid gap-1 text-sm">{categories.map((item) => <div key={item.href}><Link href={localizeHref(item.href, locale)} className={item.slug === currentType ? "wiki-link bg-muted font-semibold text-foreground" : "wiki-link"}><span>{item.title}</span><span className="text-[10px] text-muted-foreground">{item.count}</span></Link>{item.articles.length > 0 && <div className="ml-3 border-l border-border pl-2">{item.articles.map((article) => <Link key={article.href} href={localizeHref(article.href, locale)} aria-current={article.href === currentHref ? "page" : undefined} className={article.href === currentHref ? "block truncate px-2 py-1.5 text-[11px] font-semibold text-primary" : "block truncate px-2 py-1.5 text-[11px] text-muted-foreground hover:text-primary"}>{compactGameTitle(article.title, messages.site.shortName, article.navTitle)}</Link>)}{item.hasMoreArticles && <Link href={localizeHref(item.href, locale)} className="block px-2 py-1.5 text-[11px] font-semibold text-primary hover:text-primary/80">{messages.shared.viewAll}</Link>}</div>}</div>)}</div></aside>;
}

async function NavigationPage({ locale, contentType }: { locale: Locale; contentType: string }) {
  const messages = await getMessages({ locale }) as Messages;
  const categories = await getContentNavigation(locale);
  const category = categories.find((candidate) => candidate.slug === contentType);
  if (!category) notFound();
  const items = await getAllContent(contentType, locale);
  const title = category.title;
  const description = category.description;
  const listData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.metadata.title, url: absoluteUrl(localizeHref(item.href, locale)) }))
  };
  const listPathname = localizeHref(`/${contentType}`, locale);
  const breadcrumbData = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: messages.shared.home, item: absoluteUrl(localizeHref("/", locale)) },
      { "@type": "ListItem", position: 2, name: title, item: absoluteUrl(listPathname) }
    ]
  };

  return (
    <main className="site-shell py-8">
      <JsonLd data={listData} /><JsonLd data={breadcrumbData} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,936px)_264px]">
        <article>
          <Breadcrumbs label={messages.shared.breadcrumb} items={[{ label: messages.shared.home, href: localizeHref("/", locale) }, { label: title }]} />
          {contentType === "bosses" && <div className="relative mb-4 aspect-[2.48/1] overflow-hidden rounded-xl border border-border"><Image src={BRAND_ASSETS.bosses} alt={messages.site.bossesArtworkAlt} fill sizes="(max-width: 1024px) 100vw, 936px" className="object-cover" priority /><span className="absolute bottom-3 right-3 rounded bg-background/80 px-2 py-1 text-[10px] font-semibold backdrop-blur">{messages.shared.officialMedia}</span></div>}
          <h1 className="text-4xl font-normal capitalize tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{description}</p>
          {category.intro && <p className="mt-5 max-w-3xl leading-8 text-muted-foreground">{category.intro}</p>}
          <h2 className="mt-10 text-2xl font-bold">{category.guidesTitle ?? messages.shared.availableGuides}</h2>
          {items.length > 0 ? <div className="mt-5 grid gap-3 sm:grid-cols-2">{items.map((item) => <Link key={item.href} href={localizeHref(item.href, locale)} className="surface interactive-card group p-5"><div className="flex items-center justify-between"><span className="grid size-9 place-items-center rounded-lg bg-muted text-primary"><Swords className="size-4" /></span>{item.metadata.badge && <span className="rounded-full bg-muted px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">{item.metadata.badge}</span>}</div><h3 className="mt-4 text-base font-bold group-hover:text-primary">{compactGameTitle(item.metadata.title, messages.site.shortName, item.metadata.navTitle)}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.metadata.description}</p><span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">{messages.shared.readMore}<ChevronRight className="ml-1 size-4" /></span></Link>)}</div> : <div className="surface mt-6 p-8 text-muted-foreground"><BookOpen className="size-6 text-primary" /><p className="mt-4">{messages.shared.emptySection}</p></div>}
          <AdsterraBanner adKey={AD_CONFIG.banner300x250} width={300} height={250} label={messages.shared.advertisement} />
        </article>
        <WikiSidebar locale={locale} currentType={contentType} messages={messages} categories={categories} />
      </div>
    </main>
  );
}

async function DetailPage({ locale, contentType, slug }: { locale: Locale; contentType: string; slug: string[] }) {
  const messages = await getMessages({ locale }) as Messages;
  const categories = await getContentNavigation(locale);
  const category = categories.find((candidate) => candidate.slug === contentType);
  if (!category) notFound();
  const item = await getContent(contentType, slug, locale);
  if (!item) notFound();
  const categoryLabel = category.title;
  const related = await getRelatedContent(item, locale, 3);
  const pathname = item.href;
  const image = item.metadata.image ?? BRAND_ASSETS.hero;
  const articleImage = image.startsWith("http") ? image : absoluteUrl(image);
  const articleData = {
    "@context": "https://schema.org", "@type": "Article",
    headline: item.metadata.title, name: `${item.metadata.title} — ${messages.site.wikiName}`, description: item.metadata.description, image: [articleImage],
    datePublished: item.metadata.date, dateModified: item.metadata.lastModified ?? item.metadata.date,
    url: absoluteUrl(localizeHref(pathname, locale)), inLanguage: locale,
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(localizeHref(pathname, locale)) },
    author: { "@type": "Organization", name: messages.site.wikiName, url: SITE_URL },
    publisher: { "@type": "Organization", name: messages.site.wikiName, url: SITE_URL, logo: { "@type": "ImageObject", url: absoluteUrl(BRAND_ASSETS.logo) } }
  };
  const breadcrumbData = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: messages.shared.home, item: absoluteUrl(localizeHref("/", locale)) },
      { "@type": "ListItem", position: 2, name: categoryLabel, item: absoluteUrl(localizeHref(`/${contentType}`, locale)) },
      { "@type": "ListItem", position: 3, name: item.metadata.title, item: absoluteUrl(localizeHref(pathname, locale)) }
    ]
  };

  return (
    <main className="site-shell py-8">
      <JsonLd data={articleData} /><JsonLd data={breadcrumbData} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,936px)_264px]">
        <article className="min-w-0">
          <Breadcrumbs label={messages.shared.breadcrumb} items={[{ label: messages.shared.home, href: localizeHref("/", locale) }, { label: categoryLabel, href: localizeHref(`/${contentType}`, locale) }, { label: item.metadata.title }]} />
          <h1 className="text-4xl font-normal tracking-tight sm:text-5xl">{item.metadata.title}</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{item.metadata.summary ?? item.metadata.description}</p>
          <DismissibleStickyBanner adKey={AD_CONFIG.mobile320x50} label={messages.shared.advertisement} />
          {item.fallback && <p className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm text-muted-foreground">{messages.shared.translationFallback}</p>}
          <div className="max-w-none"><item.MDXContent /></div>
          <AdsterraBanner adKey={AD_CONFIG.banner728x90} width={728} height={90} label={messages.shared.advertisement} />
          {related.length > 0 && <section className="mt-12 border-t border-border pt-8"><p className="eyebrow">{messages.shared.relatedArticles}</p><h2 className="mt-1 text-2xl font-bold">{messages.shared.continueReading}</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{related.map((relatedItem) => <Link key={relatedItem.href} href={localizeHref(relatedItem.href, locale)} className="surface interactive-card p-5"><span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{categories.find((candidate) => candidate.slug === relatedItem.contentType)?.title ?? relatedItem.contentType}</span><h3 className="mt-2 font-bold">{compactGameTitle(relatedItem.metadata.title, messages.site.shortName, relatedItem.metadata.navTitle)}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{relatedItem.metadata.description}</p></Link>)}</div></section>}
        </article>
        <div className="space-y-8">
          <WikiSidebar locale={locale} currentType={contentType} currentHref={item.href} messages={messages} categories={categories} />
          <aside className="hidden border-t border-border pt-5 lg:block"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{messages.shared.tableOfContents}</p><nav className="mt-3 grid gap-2 text-sm text-muted-foreground">{item.headings.map((heading) => <a key={heading.id} href={`#${heading.id}`} className={heading.level === 3 ? "pl-3 hover:text-primary" : "font-medium hover:text-primary"}>{heading.text}</a>)}</nav></aside>
        </div>
      </div>
      <DesktopSidebarAds leftAdKey={AD_CONFIG.sidebar160x600} rightAdKey={AD_CONFIG.sidebar160x300} label={messages.shared.advertisement} />
    </main>
  );
}
