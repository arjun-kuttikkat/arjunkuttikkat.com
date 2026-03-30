"use client";

type BlogDateProps = {
  date: string;
  updatedAt?: string;
};

function formatBlogDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(d);
}

export function BlogDateLine({ date, updatedAt }: BlogDateProps) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.78rem] text-zinc-500">
      <time dateTime={date}>{formatBlogDate(date)}</time>
      {updatedAt ? (
        <>
          <span className="text-zinc-600" aria-hidden>
            ·
          </span>
          <span>
            Updated <time dateTime={updatedAt}>{formatBlogDate(updatedAt)}</time>
          </span>
        </>
      ) : null}
    </p>
  );
}
