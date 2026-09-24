import { Check } from "lucide-react";

export function Checklist({ children }: { children: React.ReactNode }) {
  return <ul className="my-6 grid list-none gap-2 p-0">{children}</ul>;
}

export function CheckItem({ children }: { children: React.ReactNode }) {
  return <li className="grid grid-cols-[auto_1fr] gap-2 rounded-lg bg-muted/60 px-3 py-2 text-sm leading-6 text-muted-foreground"><Check className="mt-1 size-4 text-primary" aria-hidden /><span>{children}</span></li>;
}
