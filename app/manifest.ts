import type { MetadataRoute } from "next";
import { iconPaths, siteDescription, siteName } from "../lib/site";

export const dynamic = "force-static";

/**
 * Web app manifest. Gives the site a proper installable identity (name, icons,
 * theme) instead of the browser guessing, and is one of the signals Google uses
 * to treat a site as a well-formed, high-quality property.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteName} — Founder, Edgaze`,
    short_name: siteName,
    description: siteDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: iconPaths.icon192, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: iconPaths.icon512, sizes: "512x512", type: "image/png", purpose: "any" }
    ]
  };
}
