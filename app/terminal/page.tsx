import { Suspense } from "react";
import { AKTerminalWindow } from "../../components/ak-terminal-window";
import { ModeToggle } from "../../components/mode-toggle";
import { JsonLd } from "../../components/seo/json-ld";
import { TerminalRoute } from "../../components/terminal/terminal-route";
import { buildBreadcrumb, homeCrumb } from "../../lib/seo/breadcrumbs";
import type { Metadata } from "next";
import { defaultOgImage, siteName, siteKeywords } from "../../lib/site";
import { getTerminalPosts } from "../../lib/terminal/posts";

const description =
  "A full-screen zsh-style terminal for arjunkuttikkat.com: browse projects and posts as files, read Edgaze facts, open links, and subscribe to the newsletter from the command line.";

export const metadata: Metadata = {
  title: "Terminal",
  description,
  alternates: {
    canonical: "/terminal",
  },
  keywords: [...siteKeywords, "terminal", "interactive terminal", "command surface"],
  openGraph: {
    title: `Terminal | ${siteName}`,
    description,
    url: "/terminal",
    type: "website",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `Terminal | ${siteName}`,
    description,
    images: [defaultOgImage.url],
  },
};

export default function TerminalPage() {
  const breadcrumb = buildBreadcrumb([
    homeCrumb(),
    { name: "Terminal", path: "/terminal" },
  ]);
  const posts = getTerminalPosts();

  return (
    <>
      <JsonLd data={breadcrumb} />
      <main className="fixed inset-0 flex flex-col bg-[#101010]">
        <h1 className="sr-only">Terminal</h1>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[90] flex justify-end px-4 pt-4 sm:px-6">
          <div className="pointer-events-auto">
            <ModeToggle />
          </div>
        </div>
        {/* useSearchParams needs a boundary on a static route; the fallback is the same
            window without an entry, so the prerendered HTML still shows a booted shell. */}
        <Suspense
          fallback={
            <AKTerminalWindow context="route" posts={posts} chrome={false} className="flex-1" />
          }
        >
          <TerminalRoute posts={posts} />
        </Suspense>
      </main>
    </>
  );
}
