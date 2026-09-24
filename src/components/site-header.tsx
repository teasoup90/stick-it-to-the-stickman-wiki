"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { BRAND_ASSETS } from "@/config/site";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import type { Locale } from "@/i18n/routing";

type NavigationItem = { title: string; href: string; count: number };

export function SiteHeader({ locale, navigation }: { locale: Locale; navigation: NavigationItem[] }) {
  const t = useTranslations("nav");
  const site = useTranslations("site");
  const [open, setOpen] = useState(false);
  const localize = (path: string) => locale === "en" ? path : `/${locale}${path}`;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="site-shell flex h-16 items-center justify-between gap-4">
        <Link href={localize("/")} className="flex items-center gap-3 font-extrabold tracking-tight">
          <span className="relative size-9 overflow-hidden rounded-lg border border-border bg-muted"><Image src={BRAND_ASSETS.logo} alt={site("logoAlt")} fill sizes="36px" className="object-cover" priority /></span>
          <span className="text-sm font-semibold tracking-[0.16em] sm:text-base">{site("name")}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={localize(item.href)} className="rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} label={t("language")} />
          <ThemeToggle label={t("toggleTheme")} />
          <button type="button" aria-label={t("menu")} aria-expanded={open} className="grid size-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground md:hidden" onClick={() => setOpen((value) => !value)}>
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="site-shell grid gap-1 border-t border-border py-3 md:hidden" aria-label="Mobile navigation">
          {navigation.map((item) => <Link key={item.href} href={localize(item.href)} onClick={() => setOpen(false)} className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"><span>{item.title}</span><span className="text-xs">{item.count}</span></Link>)}
        </nav>
      )}
    </header>
  );
}
