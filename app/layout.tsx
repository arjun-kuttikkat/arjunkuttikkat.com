import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { BfcacheRefresh } from "../components/bfcache-refresh";
import { SiteJsonLd } from "../components/seo/site-json-ld";
import {
  defaultIconPath,
  defaultOgImage,
  siteDescription,
  siteKeywords,
  siteName,
  siteTitle,
  siteUrl
} from "../lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Arjun Kuttikkat"
  },
  description: siteDescription,
  keywords: siteKeywords,
  icons: {
    icon: defaultIconPath,
    shortcut: defaultIconPath,
    apple: defaultIconPath
  },
  alternates: {
    canonical: siteUrl,
    types: {
      "application/rss+xml": `${siteUrl}/feed.xml`
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName,
    locale: "en_US",
    type: "website",
    images: [defaultOgImage]
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [defaultOgImage.url]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${inter.variable} antialiased`}>
        <BfcacheRefresh />
        <SiteJsonLd />
        {children}
      </body>
    </html>
  );
}
