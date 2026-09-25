import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalPage } from "@/components/legal-page";

type Section = { title: string; body: string };

export default async function CopyrightPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal.copyright" });
  const sections = t.raw("sections") as Section[];
  return <LegalPage title={t("title")} updated={t("updated")}>
    {sections.map((section) => <section key={section.title}><h2 className="text-xl font-bold text-foreground">{section.title}</h2><p className="mt-3 leading-8">{section.body}</p></section>)}
    <section>
      <h2 className="text-xl font-bold text-foreground">Rights-holder contact and takedown requests</h2>
      <p className="mt-3 leading-8">
        Rights holders may request correction, attribution, or removal by emailing{" "}
        <a className="font-semibold text-primary underline underline-offset-4" href="mailto:copyright@stickittothestickmanwiki.space">
          copyright@stickittothestickmanwiki.space
        </a>.
        {" "}Please identify the protected work, the affected URL, your relationship to the rights holder, and the requested action. We review complete requests promptly.
      </p>
    </section>
  </LegalPage>;
}
