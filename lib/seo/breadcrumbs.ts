import { absoluteUrl } from "../site";

export type BreadcrumbItem = {
  name: string;
  /** Site-relative path, e.g. "/blogs". Omit `path` for the current page. */
  path?: string;
};

/**
 * Build a schema.org BreadcrumbList. The last item is the current page and has
 * no outgoing `item` URL in the trailing position convention Google accepts.
 *
 * BreadcrumbList is the primary structured-data signal Google uses to derive
 * sitelinks and to understand site hierarchy, so every interior page should
 * emit one that starts at Home and walks down to the page itself.
 */
export function buildBreadcrumb(items: BreadcrumbItem[]): object {
  const itemListElement = items.map((item, index) => {
    const listItem: {
      "@type": string;
      position: number;
      name: string;
      item?: string;
    } = {
      "@type": "ListItem",
      position: index + 1,
      name: item.name
    };

    // Every element except the final (current) page gets an `item` URL.
    // Google allows the last item to omit `item`.
    if (index < items.length - 1 && item.path != null) {
      listItem.item = absoluteUrl(item.path);
    }

    return listItem;
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement
  };
}

/** Convenience: Home is always the first crumb. */
export function homeCrumb(): BreadcrumbItem {
  return { name: "Home", path: "/" };
}
