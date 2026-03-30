import { BlogHero } from "../../components/blog/blog-hero";
import { BlogIndexClient } from "../../components/blog/blog-index-client";
import { BlogPromoCard } from "../../components/blog/blog-promo-card";
import { FeaturedPost } from "../../components/blog/featured-post";
import { Footer } from "../../components/footer";
import { Navbar } from "../../components/navbar";
import { pickFeaturedPost } from "../../lib/blogs/featured";
import { getPublishedPostsMeta } from "../../lib/blogs/meta";
import type { Metadata } from "next";
import { defaultOgImage, siteName } from "../../lib/site";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Posts and notes on building products, AI, leverage, and execution—by Arjun Kuttikkat.",
  alternates: { canonical: "/blogs" },
  openGraph: {
    title: `Blogs | ${siteName}`,
    description:
      "Posts and notes on building products, AI, leverage, and execution—by Arjun Kuttikkat.",
    url: "/blogs",
    type: "website",
    images: [defaultOgImage]
  },
  twitter: {
    card: "summary_large_image",
    title: `Blogs | ${siteName}`,
    description:
      "Posts and notes on building products, AI, leverage, and execution—by Arjun Kuttikkat.",
    images: [defaultOgImage.url]
  }
};

export default function BlogsIndexPage() {
  const published = getPublishedPostsMeta();
  const featured = pickFeaturedPost(published);
  const list = featured
    ? published.filter((p) => p.slug !== featured.slug)
    : published;

  return (
    <main className="relative min-h-screen pt-20 sm:pt-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(34,211,238,0.07),transparent_60%)]" />
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <BlogHero />
        {featured ? <FeaturedPost post={featured} /> : null}
        <BlogPromoCard />
        {list.length === 0 ? (
          <p className="mt-2 text-[0.92rem] text-zinc-500">
            The archive begins with the featured piece above. More notes land here as they are ready.
          </p>
        ) : (
          <BlogIndexClient posts={list} />
        )}
      </div>
      <Footer />
    </main>
  );
}
