import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/mdx/Callout";
import { Card, CardGrid } from "@/components/mdx/CardGrid";
import { CheckItem, Checklist } from "@/components/mdx/Checklist";
import { FAQ } from "@/components/mdx/FAQ";
import { Section } from "@/components/mdx/Section";
import { Step, Steps } from "@/components/mdx/Steps";
import { YouTubeEmbed } from "@/components/mdx/YouTubeEmbed";
import { AdsterraBanner } from "@/components/ads";
import { AD_CONFIG } from "@/config/ads";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props) => <h2 className="mt-10 scroll-mt-24 text-2xl font-bold tracking-tight text-foreground" {...props} />,
    h3: (props) => <h3 className="mt-7 scroll-mt-24 text-lg font-bold text-foreground" {...props} />,
    p: (props) => <p className="mt-4 leading-7 text-muted-foreground" {...props} />,
    ul: (props) => <ul className="mt-4 grid list-disc gap-2 pl-6 text-muted-foreground" {...props} />,
    ol: (props) => <ol className="mt-4 grid list-decimal gap-2 pl-6 text-muted-foreground" {...props} />,
    li: (props) => <li className="leading-7 marker:text-muted-foreground" {...props} />,
    strong: (props) => <strong className="font-bold text-foreground" {...props} />,
    a: (props) => <a className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary" {...props} />,
    table: (props) => <div className="mt-6 overflow-x-auto border border-border"><table className="w-full border-collapse text-left text-sm" {...props} /></div>,
    th: (props) => <th className="bg-muted px-4 py-3 font-bold text-foreground" {...props} />,
    td: (props) => <td className="border-t border-border px-4 py-3 text-muted-foreground" {...props} />,
    blockquote: (props) => <blockquote className="mt-6 border-l-2 border-primary bg-muted/50 px-5 py-4 text-muted-foreground" {...props} />,
    Callout,
    CardGrid,
    Card,
    Checklist,
    CheckItem,
    FAQ,
    Section,
    Steps,
    Step,
    YouTubeEmbed,
    ArticleAd: () => <AdsterraBanner adKey={AD_CONFIG.banner300x250} width={300} height={250} />,
    ...components
  };
}
