import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/legal-page";

type Section = { title: string; body: string };

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("legal.privacy");
  const sections = t.raw("sections") as Section[];
  return <LegalPage title={t("title")} updated={t("updated")}>{sections.map((section) => <section key={section.title}><h2 className="text-xl font-bold text-foreground">{section.title}</h2><p className="mt-3 leading-8">{section.body}</p></section>)}</LegalPage>;
}
