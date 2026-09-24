import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: true
});

export type Locale = (typeof routing.locales)[number];

export const localeLabels: Record<Locale, string> = { en: "English" };
