export function Section({ title, eyebrow, children }: { title: string; eyebrow?: string; children: React.ReactNode }) {
  return (
    <section className="my-10 border-t border-border pt-7">
      {eyebrow && <p className="eyebrow m-0">{eyebrow}</p>}
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
