"use client";

import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import { ThemeProvider } from "next-themes";

export function Providers({ children, messages, locale }: { children: React.ReactNode; messages: AbstractIntlMessages; locale: string }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">{children}</NextIntlClientProvider>
    </ThemeProvider>
  );
}
