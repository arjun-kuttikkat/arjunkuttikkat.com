import { BlogArticleReadingLayout } from "../../../components/blog/blog-article-reading-layout";
import { BlogDateLine } from "../../../components/blog/blog-date";
import { BlogPostNav } from "../../../components/blog/blog-post-nav";
import { BlogProgressBar } from "../../../components/blog/blog-progress-bar";
import { BlogPromoArticleFooter } from "../../../components/blog/blog-promo-article-footer";
import { BlogShareBar } from "../../../components/blog/blog-share-bar";
import { Footer } from "../../../components/footer";
import { Navbar } from "../../../components/navbar";
import { RelatedPosts } from "../../../components/blog/related-posts";
import {
  getAdjacentPublishedPosts,
  getCompiledPostBySlug,
  getPostMetaBySlug,
  getPublishedPostsMeta,
  getPublishedSlugs
} from "../../../lib/blogs/load";
import { getRelatedPosts } from "../../../lib/blogs/related";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  absoluteImageUrl,
  absoluteUrl,
  defaultOgImage,
  siteName
} from "../../../lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = getPostMetaBySlug(slug);
  if (!meta || !meta.published) {
    return { title: "Post" };
  }
  const canonical = absoluteUrl(`/blogs/${slug}`);
  return {
    title: meta.title,
    description: meta.description,
    keywords: [...meta.tags, meta.category, meta.author],
    authors: [{ name: meta.author }],
    alternates: { canonical },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      publishedTime: meta.date,
      modifiedTime: meta.updatedAt ?? meta.date,
      authors: [meta.author],
      tags: meta.tags,
      section: meta.category,
      url: canonical,
      siteName,
      images: meta.coverImage
        ? [{ url: meta.coverImage, width: 1200, height: 630, alt: meta.title }]
        : [defaultOgImage]
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: meta.coverImage ? [meta.coverImage] : [defaultOgImage.url]
    }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getCompiledPostBySlug(slug);
  if (!post || !post.published) notFound();

  const allMeta = getPublishedPostsMeta();
  const related = getRelatedPosts(post, allMeta, 3);
  const { prev, next } = getAdjacentPublishedPosts(slug);
  const url = absoluteUrl(`/blogs/${slug}`);

  const absoluteImage =
    post.coverImage != null
      ? post.coverImage.startsWith("http")
        ? post.coverImage
        : absoluteImageUrl(
            post.coverImage.startsWith("/") ? post.coverImage : `/${post.coverImage}`
          )
      : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    author: {
      "@type": "Person",
      name: post.author,
      ...(post.authorRole ? { jobTitle: post.authorRole } : {})
    },
    publisher: {
      "@type": "Person",
      name: siteName
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    },
    ...(absoluteImage ? { image: [absoluteImage] } : {})
  };

  const cover = post.coverImage;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="relative min-h-screen pt-20 sm:pt-24">
        <BlogProgressBar />
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(ellipse_at_50%_-30%,rgba(232,121,249,0.06),transparent_58%)]" />
        <Navbar />
        <article className="hyphens-none mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
          <header className="mx-auto max-w-[46rem] border-b border-white/[0.07] pb-10 pt-4">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              {post.category}
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-blog-serif)] text-[clamp(1.85rem,4vw,2.65rem)] font-medium leading-[1.12] tracking-[-0.035em] text-white">
              {post.title}
            </h1>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-zinc-400 sm:text-[1.08rem]">
              {post.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-[0.78rem] text-zinc-500">
              <BlogDateLine date={post.date} updatedAt={post.updatedAt} />
              <span className="text-zinc-600" aria-hidden>
                ·
              </span>
              <span>{post.readTimeMinutes} min read</span>
              <span className="text-zinc-600" aria-hidden>
                ·
              </span>
              <span>{post.author}</span>
              {post.authorRole ? (
                <>
                  <span className="text-zinc-600" aria-hidden>
                    ·
                  </span>
                  <span className="text-zinc-500">{post.authorRole}</span>
                </>
              ) : null}
              {post.readingBadge ? (
                <>
                  <span className="text-zinc-600" aria-hidden>
                    ·
                  </span>
                  <span className="rounded-md border border-white/10 px-2 py-0.5 text-[0.62rem] uppercase tracking-[0.12em] text-zinc-400">
                    {post.readingBadge}
                  </span>
                </>
              ) : null}
            </div>
            {post.tags.length ? (
              <ul className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-white/[0.08] px-3 py-1 text-[0.68rem] uppercase tracking-[0.1em] text-zinc-500"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            ) : null}
          </header>

          {cover ? (
            <div className="relative mx-auto mt-10 aspect-[16/9] max-w-[46rem] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0c]">
              <Image
                src={cover}
                alt={`Cover image for ${post.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 720px"
                priority
              />
            </div>
          ) : null}

          <div className="mx-auto mt-12 max-w-[46rem]">
            <BlogArticleReadingLayout toc={post.toc} article={post.content} />

            <BlogShareBar url={url} title={post.title} />
            <RelatedPosts posts={related} />
            <BlogPostNav prev={prev} next={next} />
            <BlogPromoArticleFooter />
          </div>
        </article>
        <Footer />
      </main>
    </>
  );
}
