import { socialLinks } from "../data";
import { EDGAZE_URL, edgazeLinks, edgazeState } from "../edgaze";
import {
  absoluteImageUrl,
  absoluteUrl,
  contactEmail,
  defaultOgImage,
  defaultOgImagePath,
  siteDescription,
  siteName,
  siteUrl
} from "../site";

/**
 * The site's entity graph — one source of truth for the schema.org nodes that
 * describe who this site is about.
 *
 * Everything here is stated somewhere on the site (about page, project data,
 * lib/edgaze.ts). Nothing is inferred: no birth date, no nationality, and no
 * `alumniOf` for a degree still in progress (`affiliation` is used instead,
 * which is what the relationship actually is).
 *
 * Stable `@id` URIs let every other JSON-LD block on the site reference these
 * entities instead of restating them, which is how Google consolidates a
 * person/brand into a single understood entity.
 */

export const personId = absoluteUrl("/#person");
export const websiteId = absoluteUrl("/#website");
export const organizationId = absoluteUrl("/#organization");
export const edgazeId = `${EDGAZE_URL}/#organization`;
export const universityId = absoluteUrl("/#university");
export const primaryImageId = absoluteUrl("/#primaryimage");
export const logoId = absoluteUrl("/#logo");

/** Topics the site actually covers. Used for `knowsAbout` on the Person. */
export const personKnowsAbout = [
  "AI workflows",
  "AI infrastructure",
  "Workflow automation",
  "Product engineering",
  "Marketplaces",
  "Distribution and discoverability",
  "Next.js",
  "TypeScript",
  "Startups"
] as const;

/** The Person's portrait as an ImageObject. Google prefers this over a bare URL. */
export function personImageNode() {
  return {
    "@type": "ImageObject",
    "@id": primaryImageId,
    url: absoluteImageUrl(defaultOgImagePath),
    contentUrl: absoluteImageUrl(defaultOgImagePath),
    width: defaultOgImage.width,
    height: defaultOgImage.height,
    caption: siteName
  };
}

/**
 * The Person node. This is the entity a personal site is trying to get Google
 * to recognise, so it carries every verifiable attribute the site states.
 */
export function personNode() {
  return {
    "@type": "Person",
    "@id": personId,
    name: siteName,
    givenName: "Arjun",
    familyName: "Kuttikkat",
    url: siteUrl,
    mainEntityOfPage: { "@id": absoluteUrl("/about") },
    image: { "@id": primaryImageId },
    description: siteDescription,
    disambiguatingDescription:
      "Founder of Edgaze, a marketplace and hosted runtime for AI workflows, built by Edge Platforms, Inc.",
    jobTitle: "Founder",
    email: `mailto:${contactEmail}`,
    knowsAbout: [...personKnowsAbout],
    worksFor: { "@id": organizationId },
    // No `founder` here: schema.org scopes `founder` to Organization, so the
    // founding relationship is expressed once as Organization.founder -> Person.
    affiliation: { "@id": universityId },
    homeLocation: {
      "@type": "Place",
      name: "Dubai, United Arab Emirates",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dubai",
        addressCountry: "AE"
      }
    },
    // Links the entity to its external profiles so Google can consolidate them
    // into one person and support a knowledge panel.
    sameAs: socialLinks.map((link) => link.href)
  };
}

/** Edge Platforms, Inc. — the company that builds Edgaze. */
export function organizationNode() {
  return {
    "@type": "Organization",
    "@id": organizationId,
    name: edgazeState.company,
    legalName: edgazeState.company,
    // Deliberately no `url`: Edge Platforms has no site of its own. Claiming
    // this personal site (or edgaze.ai, which is the product) would misidentify
    // the entity. It is resolved by @id and by its link to the Edgaze brand.
    founder: { "@id": personId },
    employee: { "@id": personId },
    description: `${edgazeState.company} builds Edgaze, a marketplace and hosted runtime for AI workflows.`,
    brand: { "@id": edgazeId },
    subOrganization: { "@id": edgazeId }
  };
}

/** Edgaze — the product/brand, a separate entity from the company. */
export function edgazeNode() {
  return {
    "@type": "Organization",
    "@id": edgazeId,
    name: "Edgaze",
    url: EDGAZE_URL,
    description:
      "A marketplace and hosted runtime where AI workflows are built on a canvas, published with a price per run, and executed by people, backends, and agents.",
    parentOrganization: { "@id": organizationId },
    founder: { "@id": personId },
    sameAs: [edgazeLinks.docs, edgazeLinks.status]
  };
}

/** University of Birmingham Dubai — current affiliation, not `alumniOf`. */
export function universityNode() {
  return {
    "@type": "CollegeOrUniversity",
    "@id": universityId,
    name: "University of Birmingham Dubai",
    sameAs: "https://www.birmingham.ac.uk/dubai"
  };
}

/** The WebSite node, published by the Person. */
export function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: siteUrl,
    name: siteName,
    description: siteDescription,
    inLanguage: "en-US",
    publisher: { "@id": personId },
    author: { "@id": personId },
    about: { "@id": personId },
    copyrightHolder: { "@id": organizationId }
  };
}
