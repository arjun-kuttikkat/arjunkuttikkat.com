import Link from "next/link";
import type { ComponentPropsWithoutRef, ImgHTMLAttributes } from "react";
import { BlogCallout } from "./blog-callout";
import { BlogCodeFigure } from "./blog-code-figure";
import { BlogImage } from "./blog-image";

function MdxLink({
  href,
  children,
  className,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href?.startsWith("/")) {
    return (
      <Link
        href={href}
        className={`text-cyan-300/95 underline decoration-white/15 underline-offset-[0.22em] transition-colors hover:text-cyan-200 hover:decoration-cyan-400/35 ${className ?? ""}`}
        {...rest}
      >
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={`text-cyan-300/95 underline decoration-white/15 underline-offset-[0.22em] transition-colors hover:text-cyan-200 hover:decoration-cyan-400/35 ${className ?? ""}`}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      {children}
    </a>
  );
}

function MdxImg(props: ImgHTMLAttributes<HTMLImageElement>) {
  const { src, alt, width, height } = props;
  if (!src || typeof src !== "string") return null;
  const w = typeof width === "number" && width > 0 ? width : 1200;
  const h = typeof height === "number" && height > 0 ? height : Math.max(1, Math.round((w * 9) / 16));
  return <BlogImage src={src} alt={alt ?? ""} width={w} height={h} />;
}

export function getBlogMdxComponents() {
  return {
    h1: ({ className, id, children, ...rest }: ComponentPropsWithoutRef<"h1">) => (
      <h1
        id={id}
        className={`mt-10 scroll-mt-28 font-[family-name:var(--font-blog-serif)] text-[1.75rem] font-medium leading-tight tracking-[-0.03em] text-white sm:text-[2rem] ${className ?? ""}`}
        {...rest}
      >
        {children}
      </h1>
    ),
    h2: ({ className, id, children, ...rest }: ComponentPropsWithoutRef<"h2">) => (
      <h2
        id={id}
        className={`blog-h2 mt-14 scroll-mt-28 font-[family-name:var(--font-blog-serif)] text-[1.35rem] font-medium tracking-[-0.02em] text-white sm:text-[1.5rem] ${className ?? ""}`}
        {...rest}
      >
        {children}
      </h2>
    ),
    h3: ({ className, id, children, ...rest }: ComponentPropsWithoutRef<"h3">) => (
      <h3
        id={id}
        className={`blog-h3 mt-10 scroll-mt-28 font-[family-name:var(--font-blog-serif)] text-[1.12rem] font-semibold tracking-[-0.02em] text-zinc-100 sm:text-[1.2rem] ${className ?? ""}`}
        {...rest}
      >
        {children}
      </h3>
    ),
    h4: ({ className, id, children, ...rest }: ComponentPropsWithoutRef<"h4">) => (
      <h4
        id={id}
        className={`mt-8 scroll-mt-28 text-base font-semibold tracking-[-0.01em] text-zinc-100 ${className ?? ""}`}
        {...rest}
      >
        {children}
      </h4>
    ),
    p: ({ className, children, ...rest }: ComponentPropsWithoutRef<"p">) => (
      <p
        className={`my-5 text-[1.05rem] leading-[1.75] text-zinc-300/95 sm:text-[1.0625rem] sm:leading-[1.78] ${className ?? ""}`}
        {...rest}
      >
        {children}
      </p>
    ),
    a: MdxLink,
    ul: ({ className, children, ...rest }: ComponentPropsWithoutRef<"ul">) => (
      <ul
        className={`my-6 list-disc space-y-2 pl-6 text-[1.02rem] leading-relaxed text-zinc-300/95 marker:text-zinc-500 sm:text-[1.05rem] ${className ?? ""}`}
        {...rest}
      >
        {children}
      </ul>
    ),
    ol: ({ className, children, ...rest }: ComponentPropsWithoutRef<"ol">) => (
      <ol
        className={`my-6 list-decimal space-y-2 pl-6 text-[1.02rem] leading-relaxed text-zinc-300/95 marker:text-zinc-500 sm:text-[1.05rem] ${className ?? ""}`}
        {...rest}
      >
        {children}
      </ol>
    ),
    li: ({ className, children, ...rest }: ComponentPropsWithoutRef<"li">) => (
      <li className={`my-1.5 pl-1 ${className ?? ""}`} {...rest}>
        {children}
      </li>
    ),
    blockquote: ({ className, children, ...rest }: ComponentPropsWithoutRef<"blockquote">) => (
      <blockquote
        className={`my-8 border-l-2 border-cyan-400/35 pl-5 text-[1.02rem] italic leading-relaxed text-zinc-400 ${className ?? ""}`}
        {...rest}
      >
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-14 border-0 border-t border-white/10" />,
    code: ({ className, children, ...rest }: ComponentPropsWithoutRef<"code">) => {
      const isBlock = typeof className === "string" && className.includes("language-");
      if (isBlock) {
        return (
          <code className={className} {...rest}>
            {children}
          </code>
        );
      }
      return (
        <code
          className="rounded-md border border-white/12 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.88em] text-cyan-100/95"
          {...rest}
        >
          {children}
        </code>
      );
    },
    pre: ({ children, ...rest }: ComponentPropsWithoutRef<"pre">) => (
      <pre
        className="overflow-x-auto rounded-xl border border-white/10 bg-[#070708] p-0 text-[0.8125rem] leading-relaxed"
        {...rest}
      >
        {children}
      </pre>
    ),
    figure: BlogCodeFigure,
    img: MdxImg,
    table: ({ children, className, ...rest }: ComponentPropsWithoutRef<"table">) => (
      <div className="my-8 overflow-x-auto rounded-xl border border-white/10 bg-[#08080a]/80">
        <table
          className={`w-full min-w-[28rem] border-collapse text-left text-sm text-zinc-200 ${className ?? ""}`}
          {...rest}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...rest }: ComponentPropsWithoutRef<"thead">) => (
      <thead className="border-b border-white/12 bg-white/[0.04]" {...rest}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...rest }: ComponentPropsWithoutRef<"tbody">) => (
      <tbody {...rest}>{children}</tbody>
    ),
    tr: ({ children, ...rest }: ComponentPropsWithoutRef<"tr">) => (
      <tr className="border-b border-white/[0.06] last:border-0" {...rest}>
        {children}
      </tr>
    ),
    th: ({ children, ...rest }: ComponentPropsWithoutRef<"th">) => (
      <th className="px-4 py-3 text-[0.68rem] font-semibold tracking-[0.12em] text-zinc-400" {...rest}>
        {children}
      </th>
    ),
    td: ({ children, ...rest }: ComponentPropsWithoutRef<"td">) => (
      <td className="px-4 py-3 text-[0.9rem] text-zinc-300/95" {...rest}>
        {children}
      </td>
    ),
    Callout: BlogCallout,
    BlogImage
  };
}
