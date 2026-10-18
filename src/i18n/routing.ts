import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de", "es-es", "fr", "ja", "ko", "pl", "pt-br"],
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: true
});

export type Locale = (typeof routing.locales)[number];

/**
 * Locales Google may index (2026-10-18, owner decision after the sitewide demotion): the others stay reachable for
 * readers but carry noindex and are left out of the sitemap and hreflang.
 */
export const INDEXED_LOCALES: readonly Locale[] = ["en", "es-es", "pt-br"];
export const isIndexedLocale = (locale: string) => (INDEXED_LOCALES as readonly string[]).includes(locale);
