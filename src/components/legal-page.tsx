import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  const t = await getTranslations("legal");
  return <main className="site-shell py-12"><article className="mx-auto max-w-3xl"><Link href="/" className="text-sm font-bold text-primary">{t("backToHome")}</Link><h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1><p className="mt-3 text-sm text-muted-foreground">{t("lastUpdated", { date: updated })}</p><div className="mt-10 space-y-8 text-muted-foreground">{children}</div></article></main>;
}
