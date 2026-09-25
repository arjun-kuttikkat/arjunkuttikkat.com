import { BlogArticleReadingLayout } from "../../../components/blog/blog-article-reading-layout";
import { BlogDateLine } from "../../../components/blog/blog-date";
import { BlogPostNav } from "../../../components/blog/blog-post-nav";
import { BlogProgressBar } from "../../../components/blog/blog-progress-bar";
import { BlogPromoArticleFooter } from "../../../components/blog/blog-promo-article-footer";
import { BlogShareBar } from "../../../components/blog/blog-share-bar";
import { BlogTocDesktopPanel } from "../../../components/blog/blog-toc-panels";
import { Footer } from "../../../components/footer";
import { Navbar } from "../../../components/navbar";
import { RelatedPosts } from "../../../components/blog/related-posts";
import { JsonLd } from "../../../components/seo/json-ld";
import { buildBreadcrumb, homeCrumb } from "../../../lib/seo/breadcrumbs";
import { organizationId, personId, websiteId } from "../../../lib/seo/entity";
import { getPublicImageSize } from "../../../lib/seo/image-size";
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
import Link from "next/link";
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
  // Declare the cover's real pixel size. A wrong width/height makes scrapers
  // lay out the preview incorrectly or skip the image entirely.
  const coverSize = meta.coverImage ? getPublicImageSize(meta.coverImage) : undefined;
  return {
    title: meta.title,
    description: meta.description,
    keywords: [...meta.tags, meta.category, meta.author],
    authors: [{ name: meta.author, url: absoluteUrl("/about") }],
    creator: meta.author,
    publisher: siteName,
    alternates: {
      canonical,
      types: { "text/markdown": absoluteUrl(`/blogs/${slug}/md`) }
    },
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
        ? [
            {
              url: meta.coverImage,
              ...(coverSize ?? {}),
              alt: meta.title
            }
          ]
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
  const { next } = getAdjacentPublishedPosts(slug);
  const url = absoluteUrl(`/blogs/${slug}`);

  const absoluteImage =
    post.coverImage != null
      ? post.coverImage.startsWith("http")
        ? post.coverImage
        : absoluteImageUrl(
            post.coverImage.startsWith("/") ? post.coverImage : `/${post.coverImage}`
          )
      : undefined;

  const coverSize = post.coverImage ? getPublicImageSize(post.coverImage) : undefined;
  const wordCount = post.rawBody.trim().split(/\s+/).filter(Boolean).length;

  const jsonLd = {
    "@context": "https://schema.org",
    // BlogPosting is more specific than Article and is what Google expects for
    // a post that belongs to a Blog.
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    name: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    // Reference the site's Person entity by @id so Google consolidates the
    // author/publisher with the homepage Person (sameAs, knowledge panel).
    author: { "@id": personId },
    publisher: { "@id": organizationId },
    copyrightHolder: { "@id": organizationId },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    isPartOf: { "@id": absoluteUrl("/blogs") },
    inLanguage: "en-US",
    articleSection: post.category,
    keywords: post.tags.join(", "),
    wordCount,
    // ISO 8601 duration — Google reads this for the "min read" style annotation.
    timeRequired: `PT${post.readTimeMinutes}M`,
    isAccessibleForFree: true,
    ...(absoluteImage
      ? {
          image: {
            "@type": "ImageObject",
            url: absoluteImage,
            contentUrl: absoluteImage,
            ...(coverSize ?? {})
          }
        }
      : {})
  };

  /** Ties the post URL itself to the site and its breadcrumb trail. */
  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url,
    name: post.title,
    description: post.description,
    isPartOf: { "@id": websiteId },
    inLanguage: "en-US",
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    about: { "@id": personId },
    mainEntity: { "@id": `${url}#article` }
  };

  const breadcrumb = buildBreadcrumb([
    homeCrumb(),
    { name: "Blogs", path: "/blogs" },
    { name: post.title }
  ]);

  const cover = post.coverImage;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JsonLd data={breadcrumb} />
      <JsonLd data={webPage} />
      <main className="relative min-h-screen pt-20 sm:pt-24">
        <BlogProgressBar />
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(ellipse_at_50%_-30%,rgba(232,121,249,0.06),transparent_58%)]" />
        <Navbar blogNav={{ title: post.title }} />
        <article className="hyphens-none mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
          <header className="mx-auto max-w-[46rem] border-b border-white/[0.07] pb-10 pt-4">
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex flex-wrap items-center gap-1.5 text-[0.68rem] text-zinc-500">
                <li>
                  <Link href="/" className="transition-colors hover:text-zinc-300">
                    Home
                  </Link>
                </li>
                <li aria-hidden className="text-zinc-600">/</li>
                <li>
                  <Link href="/blogs" className="transition-colors hover:text-zinc-300">
                    Blogs
                  </Link>
                </li>
                <li aria-hidden className="text-zinc-600">/</li>
                <li aria-current="page" className="text-zinc-400">
                  {post.title}
                </li>
              </ol>
            </nav>
            <p className="text-[0.62rem] font-semibold tracking-[0.08em] text-zinc-500">
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
              <Link
                href="/about"
                rel="author"
                className="text-zinc-400 underline decoration-white/15 underline-offset-[0.25em] transition-colors hover:text-zinc-200 hover:decoration-cyan-400/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
              >
                {post.author}
              </Link>
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
                  <span className="rounded-md border border-white/10 px-2 py-0.5 text-[0.62rem] tracking-[0.12em] text-zinc-400">
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
                    className="rounded-full border border-white/[0.08] px-3 py-1 text-[0.68rem] tracking-[0.1em] text-zinc-500"
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

          <div className="relative mx-auto mt-12 max-w-[46rem]">
            <BlogTocDesktopPanel items={post.toc} />
            <BlogArticleReadingLayout toc={post.toc} article={post.content} />

            <BlogShareBar url={url} title={post.title} />
            <RelatedPosts posts={related} />
            <BlogPostNav next={next} />
            <BlogPromoArticleFooter />
          </div>
        </article>
        <Footer />
      </main>
    </>
  );
}
