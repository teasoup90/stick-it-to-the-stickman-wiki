"use client";

import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { localeLabels, routing, type Locale } from "@/i18n/routing";

function pathWithoutLocale(pathname: string) {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  }
  return pathname;
}

export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(nextLocale: Locale) {
    const basePath = pathWithoutLocale(pathname);
    const localizedPath = nextLocale === routing.defaultLocale ? basePath : `/${nextLocale}${basePath === "/" ? "" : basePath}`;
    router.push(localizedPath);
  }

  return (
    <label className="relative flex h-10 items-center gap-1.5 rounded-xl border border-border bg-card px-2 text-xs text-muted-foreground">
      <Languages className="size-4" />
      <span className="sr-only">{label}</span>
      <select aria-label={label} value={locale} onChange={(event) => switchLocale(event.target.value as Locale)} className="max-w-20 appearance-none bg-transparent pr-1 text-xs font-medium outline-none">
        {routing.locales.map((item) => <option key={item} value={item}>{localeLabels[item]}</option>)}
      </select>
    </label>
  );
}
