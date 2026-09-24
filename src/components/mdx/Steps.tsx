export function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="my-6 grid list-none gap-4 p-0 [counter-reset:step]">{children}</ol>;
}

export function Step({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <li className="grid grid-cols-[2rem_1fr] gap-3 [counter-increment:step]">
      <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground before:content-[counter(step)]" aria-hidden />
      <div className="min-w-0 text-sm leading-7 text-muted-foreground">
        {title && <p className="m-0 font-bold text-foreground">{title}</p>}
        <div className={title ? "mt-1" : ""}>{children}</div>
      </div>
    </li>
  );
}
