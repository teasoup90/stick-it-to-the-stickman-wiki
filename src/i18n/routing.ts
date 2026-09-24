import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de", "es-es", "fr", "ja", "ko", "pl", "pt-br"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: true
});

export type Locale = (typeof routing.locales)[number];
