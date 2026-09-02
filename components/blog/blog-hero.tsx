export function BlogHero() {
  return (
    <header className="relative border-b border-white/[0.07] pb-14 pt-4 sm:pb-16">
      <p className="mb-4 text-[0.6875rem] font-medium tracking-wide text-zinc-500">
        Arjun Kuttikkat
      </p>
      <h1 className="font-[family-name:var(--font-blog-serif)] text-[clamp(2.35rem,5vw,3.35rem)] font-medium leading-[1.08] tracking-[-0.035em] text-white">
        Blogs
      </h1>
      <p className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-zinc-400 sm:text-[1.12rem] sm:leading-[1.72]">
        Notes from building Edgaze and getting it used: product decisions, distribution, and what
        broke along the way.
      </p>
    </header>
  );
}
