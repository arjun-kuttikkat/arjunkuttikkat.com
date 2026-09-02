type BlogCalloutProps = {
  variant?: "note" | "tip" | "warning";
  title?: string;
  children: React.ReactNode;
};

const styles: Record<NonNullable<BlogCalloutProps["variant"]>, string> = {
  note: "border-cyan-400/25 bg-cyan-400/[0.06]",
  tip: "border-emerald-400/25 bg-emerald-400/[0.05]",
  warning: "border-amber-400/30 bg-amber-400/[0.06]"
};

export function BlogCallout({ variant = "note", title, children }: BlogCalloutProps) {
  return (
    <aside
      className={`my-8 rounded-xl border px-5 py-4 ${styles[variant]}`}
      role="note"
    >
      {title ? (
        <p className="mb-2 text-[0.72rem] font-semibold tracking-[0.16em] text-zinc-200">
          {title}
        </p>
      ) : null}
      <div className="blog-callout-inner text-[0.98rem] leading-relaxed text-zinc-200/95 [&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0">
        {children}
      </div>
    </aside>
  );
}
