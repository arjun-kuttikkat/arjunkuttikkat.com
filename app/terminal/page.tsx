import { AKTerminalWindow } from "../../components/ak-terminal-window";
import { JsonLd } from "../../components/seo/json-ld";
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
        <AKTerminalWindow
          context="route"
          posts={posts}
          chrome={false}
          autoFocus
          className="flex-1"
        />
      </main>
    </>
  );
}
