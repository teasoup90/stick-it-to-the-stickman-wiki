import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import en from "@/locales/en.json";

const messages = { en } as const;

export function deepMerge<T extends Record<string, unknown>>(fallback: T, localized: Partial<T>): T {
  const result = { ...fallback } as Record<string, unknown>;
  for (const [key, value] of Object.entries(localized)) {
    const fallbackValue = result[key];
    result[key] = value && typeof value === "object" && !Array.isArray(value) && fallbackValue && typeof fallbackValue === "object" && !Array.isArray(fallbackValue)
      ? deepMerge(fallbackValue as Record<string, unknown>, value as Record<string, unknown>)
      : value;
  }
  return result as T;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const localized = messages[locale];
  return { locale, timeZone: "UTC", messages: locale === "en" ? en : deepMerge(en, localized) };
});
