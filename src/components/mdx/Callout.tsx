import { AlertTriangle, CheckCircle2, CircleAlert, Info } from "lucide-react";

const variants = {
  info: { icon: Info, className: "border-primary/35 bg-primary/10" },
  success: { icon: CheckCircle2, className: "border-emerald-500/35 bg-emerald-500/10" },
  warning: { icon: AlertTriangle, className: "border-amber-500/35 bg-amber-500/10" },
  danger: { icon: CircleAlert, className: "border-red-500/35 bg-red-500/10" }
} as const;

export type CalloutType = keyof typeof variants;

export function Callout({ children, title, type = "info" }: { children: React.ReactNode; title?: string; type?: CalloutType }) {
  const variant = variants[type];
  const Icon = variant.icon;
  return (
    <aside role="note" className={`my-6 grid grid-cols-[auto_1fr] gap-3 rounded-xl border p-4 ${variant.className}`}>
      <Icon className="mt-0.5 size-5 text-foreground" aria-hidden />
      <div className="min-w-0 text-sm leading-7 text-muted-foreground">
        {title && <p className="m-0 font-bold text-foreground">{title}</p>}
        <div className={title ? "mt-1" : ""}>{children}</div>
      </div>
    </aside>
  );
}
