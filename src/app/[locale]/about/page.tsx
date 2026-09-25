import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BRAND_ASSETS } from "@/config/site";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const paragraphs = t.raw("legal.about.paragraphs") as string[];
  return <main className="site-shell py-12"><div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]"><article><p className="eyebrow">{t("legal.about.eyebrow")}</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">{t("legal.about.title")}</h1>{paragraphs.map((paragraph, index) => <p key={paragraph} className={index === 0 ? "mt-6 max-w-3xl text-lg leading-8 text-muted-foreground" : "mt-5 max-w-3xl leading-8 text-muted-foreground"}>{paragraph}</p>)}</article><div className="relative aspect-square overflow-hidden rounded-3xl border border-border"><Image src={BRAND_ASSETS.logo} alt={t("site.logoAlt")} fill sizes="360px" className="object-cover" priority /></div></div></main>;
}
