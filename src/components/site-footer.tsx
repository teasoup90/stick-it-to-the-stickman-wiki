import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { BRAND_ASSETS } from "@/config/site";
import { getContentCategories } from "@/lib/content";
import type { Locale } from "@/i18n/routing";

export async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });
  const categories = await getContentCategories(locale as Locale);
  const localize = (path: string) => locale === "en" ? path : `/${locale}${path}`;

  return (
    <footer className="mt-20 border-t border-border bg-card/50">
      <div className="site-shell grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div><div className="flex items-center gap-3"><Image src={BRAND_ASSETS.logo} alt={t("site.logoAlt")} width={44} height={44} className="rounded-full" /><p className="font-bold">{t("site.wikiName")}</p></div><p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">{t("footer.description")}</p></div>
        <div><p className="text-sm font-bold">{t("footer.guidesTitle")}</p><div className="mt-3 grid gap-2 text-sm text-muted-foreground">{categories.map((category) => <Link key={category.href} href={localize(category.href)}>{category.title} <span className="text-xs">({category.count})</span></Link>)}</div></div>
        <div><p className="text-sm font-bold">{t("footer.legalTitle")}</p><div className="mt-3 grid gap-2 text-sm text-muted-foreground"><Link href={localize("/about")}>{t("legal.about.title")}</Link><Link href={localize("/privacy-policy")}>{t("legal.privacy.title")}</Link><Link href={localize("/terms-of-service")}>{t("legal.terms.title")}</Link><Link href={localize("/copyright")}>{t("legal.copyright.title")}</Link></div></div>
        <p className="border-t border-border pt-6 text-xs text-muted-foreground md:col-span-3">{t("footer.copyright")}</p>
      </div>
    </footer>
  );
}
