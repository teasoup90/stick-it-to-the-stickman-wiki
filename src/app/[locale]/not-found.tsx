import Link from "next/link";
import { SearchX } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function NotFoundPage() {
  const t = await getTranslations("notFound");
  return <main className="site-shell grid min-h-[60vh] place-items-center py-16 text-center"><div><SearchX className="mx-auto size-10 text-primary" /><p className="eyebrow mt-6">{t("eyebrow")}</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight">{t("title")}</h1><p className="mx-auto mt-4 max-w-lg text-muted-foreground">{t("description")}</p><Link href="/" className="mt-7 inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground">{t("returnHome")}</Link></div></main>;
}
