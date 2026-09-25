"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, CircleDot, Flame, Map, Play, ScrollText, Shield, Swords, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";
import { BRAND_ASSETS, EXTERNAL_LINKS } from "@/config/site";
import { AD_CONFIG } from "@/config/ads";
import { AdsterraBanner, AdsterraNativeBanner } from "@/components/ads";
import { compactGameTitle } from "@/lib/utils";

/** Official reveal trailer (Stick It to the Stickman), from game-dev-info-v2 official_sources.official-reveal-trailer. */
const YOUTUBE_VIDEO_ID = "SNSIB_4V0EA";

type HomeCopy = {
  hero: { title: string; eyebrow: string; description: string; stats: string[]; media: { asset: keyof typeof BRAND_ASSETS; externalLink?: keyof typeof EXTERNAL_LINKS; label: string }; actions: HomeAction[] };
  updates: { title: string; all: string; href?: string };
  start: { eyebrow: string; title: string; cards: { number: string; title: string; description: string }[] };
  popular: { eyebrow: string; title: string };
  about: { title: string; artworkAsset: keyof typeof BRAND_ASSETS; paragraphs: string[]; facts: { label: string; value: string }[] };
  explore: { eyebrow: string; title: string; description: string; modules: ExploreModule[] };
  faq: { title: string; items: { question: string; answer: string }[] };
  finalCta: { title: string; description: string; actions: HomeAction[] };
  sidebarFeature: { title: string; badge: string; description: string; linkLabel: string; href?: string; asset: keyof typeof BRAND_ASSETS };
};

type ExploreModule = {
  order: number;
  name: string;
  description: string;
  href: string;
  displayType: "code-cards" | "step-by-step" | "tier-grid" | "card-list";
  highlights: { label: string; detail: string; badge?: string }[];
  references: string[];
};

type HomeAction = { label: string; href?: string; externalLink?: keyof typeof EXTERNAL_LINKS; variant?: "primary" | "secondary" };

type CategoryItem = { slug: string; title: string; description: string; href: string; count: number; articles: { title: string; navTitle?: string; href: string }[]; hasMoreArticles: boolean };
type ArticleItem = { title: string; navTitle?: string; description: string; badge?: string; image?: string; href: string; date: string };

function ConfiguredAction({ action, locale }: { action: HomeAction; locale: string }) {
  const href = action.externalLink ? EXTERNAL_LINKS[action.externalLink] : action.href ? `/${locale}${action.href === "/" ? "" : action.href}` : undefined;
  const className = action.variant === "primary"
    ? "inline-flex h-9 items-center rounded-lg border border-border bg-card px-4 text-xs font-semibold transition hover:bg-muted"
    : "inline-flex h-9 items-center rounded-lg px-4 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground";
  const content = <>{action.label}{action.variant === "primary" && <ArrowRight className="ml-2 size-3.5" />}</>;
  if (!href) return <span className={className}>{content}</span>;
  if (action.externalLink) return <a href={href} target="_blank" rel="noreferrer" className={className}>{content}</a>;
  return <Link href={href} className={className}>{content}</Link>;
}

export function HomePageClient({ home, locale, categories, recent, popular }: { home: HomeCopy; locale: string; categories: CategoryItem[]; recent: ArticleItem[]; popular: ArticleItem[] }) {
  const localize = (path: string) => `/${locale}${path === "/" ? "" : path}`;
  const t = useTranslations();
  const gameName = t("site.shortName");
  const exploreIcons = [Shield, Swords, Map, ScrollText, Trophy, Flame];
  const heroMediaHref = home.hero.media.externalLink && EXTERNAL_LINKS[home.hero.media.externalLink] ? EXTERNAL_LINKS[home.hero.media.externalLink] : `https://www.youtube.com/watch?v=${YOUTUBE_VIDEO_ID}`;
  const heroMedia = <><Image src={BRAND_ASSETS[home.hero.media.asset]} alt={t("site.heroAlt")} fill sizes="(max-width: 768px) 100vw, 600px" className="object-cover transition duration-300 group-hover:scale-[1.015] group-hover:brightness-75" priority /><span className="absolute inset-0 grid place-items-center"><span className="grid size-16 place-items-center rounded-full bg-background/75 text-foreground backdrop-blur"><Play className="ml-1 size-6 fill-current" /></span></span><span className="absolute bottom-3 right-3 rounded bg-background/80 px-2 py-1 text-[10px] font-semibold backdrop-blur">{home.hero.media.label}</span></>;

  return (
    <main className="site-shell grid gap-8 py-8 lg:grid-cols-[minmax(0,936px)_264px]">
      <article className="min-w-0">
        <section className="text-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <h1 className="text-4xl font-normal tracking-tight sm:text-5xl">{home.hero.title}</h1>
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{home.hero.eyebrow}</span>
          </div>
          {heroMediaHref ? <a href={heroMediaHref} target="_blank" rel="noreferrer" className="group relative mx-auto mt-4 block aspect-video max-w-[820px] overflow-hidden rounded-xl border border-border bg-card">{heroMedia}</a> : <div className="group relative mx-auto mt-4 block aspect-video max-w-[820px] overflow-hidden rounded-xl border border-border bg-card">{heroMedia}</div>}
          <p className="mx-auto mt-5 max-w-[760px] text-sm leading-6 text-muted-foreground">{home.hero.description}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">{home.hero.stats.map((stat) => <span key={stat} className="rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">{stat}</span>)}</div>
          <div className="mt-5 flex flex-wrap justify-center gap-2">{home.hero.actions.map((action) => <ConfiguredAction key={action.label} action={action} locale={locale} />)}</div>
        </section>
        <AdsterraNativeBanner adKey={AD_CONFIG.nativeBanner} label={t("shared.advertisement")} />

        <section className="mt-10 grid gap-8 border-t border-border pt-8 md:grid-cols-2">
          <div><div className="flex items-center justify-between"><h2 className="text-xs font-bold uppercase tracking-[0.14em]">{home.updates.title}</h2>{home.updates.href && <Link href={localize(home.updates.href)} className="text-[10px] text-muted-foreground hover:text-foreground">{home.updates.all}</Link>}</div><div className="mt-4 grid gap-3">{recent.length > 0 ? recent.map((item) => <Link key={item.href} href={localize(item.href)} className="flex items-start gap-3 text-xs leading-5 text-muted-foreground hover:text-foreground"><CircleDot className="mt-0.5 size-3.5 shrink-0 text-primary" /><span><strong className="block font-semibold text-foreground">{compactGameTitle(item.title, gameName, item.navTitle)}</strong><time className="text-[10px]">{item.date}</time></span></Link>) : <p className="text-xs text-muted-foreground">{t("shared.emptySection")}</p>}</div></div>
          <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{home.start.eyebrow}</p><h2 className="mt-1 text-sm font-bold">{home.start.title}</h2><div className="mt-4 grid gap-3">{home.start.cards.map((card) => <div key={card.number} className="grid grid-cols-[20px_1fr] gap-2 text-xs"><span className="grid size-5 place-items-center rounded-full border border-border text-[9px] text-muted-foreground">{Number(card.number)}</span><span><strong className="block text-foreground">{card.title}</strong><span className="mt-1 block leading-5 text-muted-foreground">{card.description}</span></span></div>)}</div></div>
        </section>
        <AdsterraBanner adKey={AD_CONFIG.banner300x250} width={300} height={250} label={t("shared.advertisement")} />


        <section className="py-4"><p className="eyebrow">{home.popular.eyebrow}</p><h2 className="mt-1 text-3xl font-normal tracking-tight">{home.popular.title}</h2>{popular.length > 0 ? <><div className="mt-5 grid gap-4 sm:grid-cols-2">{popular.slice(0, 2).map((card) => <Link key={card.href} href={localize(card.href)} className="group relative aspect-[2/1] overflow-hidden rounded-xl border border-border"><Image src={card.image ?? BRAND_ASSETS.hero} alt="" fill sizes="(max-width: 640px) 100vw, 450px" className="object-cover transition group-hover:scale-[1.02]" /><span className="absolute inset-0 bg-gradient-to-t from-media via-media/20 to-transparent" /><span className="absolute inset-x-0 bottom-0 p-4 text-left text-media-foreground">{card.badge && <span className="rounded bg-media-foreground px-2 py-0.5 text-[9px] font-bold text-media">{card.badge}</span>}<strong className="mt-2 block text-base">{compactGameTitle(card.title, gameName, card.navTitle)}</strong><span className="mt-1 block text-xs leading-5 text-media-foreground/70">{card.description}</span></span></Link>)}</div><div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">{popular.map((card) => <Link key={card.href} href={localize(card.href)} className="text-xs text-muted-foreground hover:text-foreground">{compactGameTitle(card.title, gameName, card.navTitle)} <span aria-hidden>→</span></Link>)}</div></> : <p className="mt-5 text-sm text-muted-foreground">{t("shared.emptySection")}</p>}</section>

        <section className="mt-12 grid gap-8 border-t border-border pt-10 md:grid-cols-[1.05fr_.95fr] md:items-start"><div><h2 className="text-3xl font-normal tracking-tight">{home.about.title}</h2>{home.about.paragraphs.map((paragraph) => <p key={paragraph} className="mt-5 text-sm leading-7 text-muted-foreground">{paragraph}</p>)}</div><div><div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border"><Image src={BRAND_ASSETS[home.about.artworkAsset]} alt={t("site.artworkAlt")} fill sizes="420px" className="object-cover" /></div><div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4">{home.about.facts.map((fact) => <div key={fact.label} className="border-t border-border pt-2"><p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{fact.label}</p><p className="mt-1 text-xs font-semibold">{fact.value}</p></div>)}</div></div></section>

        <section className="mt-12 border-t border-border pt-10"><p className="eyebrow">{home.explore.eyebrow}</p><h2 className="mt-1 text-3xl font-normal tracking-tight">{home.explore.title}</h2><p className="mt-3 max-w-2xl text-sm text-muted-foreground">{home.explore.description}</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{home.explore.modules.map((module, index) => { const Icon = exploreIcons[index % exploreIcons.length]; return <Link key={module.href} href={localize(module.href)} className="group rounded-xl border border-border p-4 transition hover:bg-card"><Icon className="size-4 text-primary" /><h3 className="mt-4 text-sm font-semibold group-hover:text-primary">{module.name}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{module.description}</p><div className="mt-4 grid gap-2">{module.displayType === "tier-grid" ? <div className="grid grid-cols-4 gap-1">{module.highlights.map((item) => <span key={item.label} className="rounded border border-border px-2 py-1 text-center text-[10px] font-semibold">{item.label}</span>)}</div> : module.displayType === "step-by-step" ? module.highlights.map((item) => <div key={item.label} className="grid grid-cols-[18px_1fr] gap-2 text-[10px] leading-4 text-muted-foreground"><span className="grid size-[18px] place-items-center rounded-full border border-border text-[9px] font-semibold text-foreground">{item.label}</span><span>{item.detail}</span></div>) : module.displayType === "code-cards" ? module.highlights.map((item) => <div key={item.label} className="flex items-center justify-between gap-2 rounded border border-border px-2 py-1.5 text-[10px]"><strong>{item.label}</strong>{item.badge && <span className="text-muted-foreground">{item.badge}</span>}</div>) : module.highlights.map((item) => <div key={item.label} className="flex gap-2 text-[10px] leading-4 text-muted-foreground"><strong className="shrink-0 text-foreground">{item.label}</strong><span>{item.detail}</span></div>)}</div></Link>; })}</div></section>

        <AdsterraBanner adKey={AD_CONFIG.banner728x90} width={728} height={90} label={t("shared.advertisement")} />

        <section className="mt-12 border-t border-border pt-10"><h2 className="text-3xl font-normal tracking-tight">{home.faq.title}</h2><div className="mt-5 divide-y divide-border border-y border-border">{home.faq.items.map((item) => <details key={item.question} className="group py-4"><summary className="cursor-pointer list-none text-sm font-semibold marker:hidden">{item.question}<ChevronRight className="float-right size-4 transition group-open:rotate-90" /></summary><p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{item.answer}</p></details>)}</div></section>

        <section className="mt-12 rounded-2xl border border-border bg-card p-7 text-center"><h2 className="text-3xl font-normal tracking-tight">{home.finalCta.title}</h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{home.finalCta.description}</p><div className="mt-5 flex flex-wrap justify-center gap-2">{home.finalCta.actions.map((action) => <ConfiguredAction key={action.label} action={action} locale={locale} />)}</div></section>
      </article>

      <aside className="hidden lg:block">
        <div className="sticky top-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{t("shared.wikiNavigation")}</p>
          <nav className="mt-3 grid gap-1">{categories.map((item) => <div key={item.href}><Link href={localize(item.href)} className="wiki-link"><span>{item.title}</span><span className="text-[10px] text-muted-foreground">{item.count}</span></Link>{item.articles.length > 0 && <div className="ml-3 border-l border-border pl-2">{item.articles.map((article) => <Link key={article.href} href={localize(article.href)} className="block truncate px-2 py-1.5 text-[11px] text-muted-foreground hover:text-primary">{compactGameTitle(article.title, gameName, article.navTitle)}</Link>)}{item.hasMoreArticles && <Link href={localize(item.href)} className="block px-2 py-1.5 text-[11px] font-semibold text-primary hover:text-primary/80">{t("shared.viewAll")}</Link>}</div>}</div>)}</nav>
          <div className="mt-8 border-t border-border pt-5"><div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.16em]">{home.sidebarFeature.title}</p><span className="rounded-full border border-border px-2 py-0.5 text-[9px] text-muted-foreground">{home.sidebarFeature.badge}</span></div><p className="mt-3 text-xs leading-5 text-muted-foreground">{home.sidebarFeature.description}</p>{home.sidebarFeature.href && <Link href={localize(home.sidebarFeature.href)} className="mt-4 inline-flex items-center text-xs font-semibold text-primary hover:text-primary/80">{home.sidebarFeature.linkLabel}<ArrowRight className="ml-1 size-3" /></Link>}</div>
        </div>
      </aside>
    </main>
  );
}
