export function CardGrid({ children, columns = 2 }: { children: React.ReactNode; columns?: 2 | 3 }) {
  return <div className={columns === 3 ? "my-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "my-6 grid gap-4 sm:grid-cols-2"}>{children}</div>;
}

export function Card({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <section className="surface p-5">
      {title && <h3 className="m-0 text-base font-bold text-foreground">{title}</h3>}
      <div className={title ? "mt-2 text-sm leading-6 text-muted-foreground" : "text-sm leading-6 text-muted-foreground"}>{children}</div>
    </section>
  );
}
