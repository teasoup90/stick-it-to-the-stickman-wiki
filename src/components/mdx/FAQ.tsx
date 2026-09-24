import { ChevronRight } from "lucide-react";

export function FAQ({ question, children, open = false }: { question: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details className="group my-3 rounded-xl border border-border bg-card" open={open}>
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-bold text-foreground marker:hidden">
        {question}<ChevronRight className="float-right mt-0.5 size-4 transition-transform group-open:rotate-90" aria-hidden />
      </summary>
      <div className="border-t border-border px-4 py-3 text-sm leading-7 text-muted-foreground">{children}</div>
    </details>
  );
}
