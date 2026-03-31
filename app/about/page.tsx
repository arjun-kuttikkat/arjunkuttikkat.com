import { Footer } from "../../components/footer";
import { Navbar } from "../../components/navbar";
import { AboutPageClientLoader } from "../../components/about/about-page-client-loader";
import { getPublishedPostsMeta } from "../../lib/blogs/meta";
import type { Metadata } from "next";
import { defaultOgImage, siteName } from "../../lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Background, principles, and what Arjun Kuttikkat is building with Edgaze: execution, infrastructure, and real usage.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About | ${siteName}`,
    description:
      "Background, principles, and what Arjun Kuttikkat is building with Edgaze: execution, infrastructure, and real usage.",
    url: "/about",
    type: "profile",
    images: [defaultOgImage]
  },
  twitter: {
    card: "summary_large_image",
    title: `About | ${siteName}`,
    description:
      "Background, principles, and what Arjun Kuttikkat is building with Edgaze: execution, infrastructure, and real usage.",
    images: [defaultOgImage.url]
  }
};

export default function AboutPage() {
  const published = getPublishedPostsMeta();
  const recentPosts = published.slice(0, 3);

  return (
    <main className="relative min-h-screen overflow-x-hidden pt-28 sm:pt-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_50%_-10%,rgba(34,211,238,0.09),transparent_58%)]" />
      </div>
      <Navbar />
      <AboutPageClientLoader recentPosts={recentPosts} />
      <Footer />
    </main>
  );
}
