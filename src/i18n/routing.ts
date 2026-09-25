import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de", "es-es", "fr", "ja", "ko", "pl", "pt-br"],
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: true
});

export type Locale = (typeof routing.locales)[number];
