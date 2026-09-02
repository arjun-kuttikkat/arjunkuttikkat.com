import {
  edgazeNode,
  organizationNode,
  personImageNode,
  personNode,
  universityNode,
  websiteNode
} from "../../lib/seo/entity";

export {
  personId,
  websiteId,
  organizationId,
  edgazeId
} from "../../lib/seo/entity";

/**
 * The site-wide entity graph, emitted once from the root layout.
 *
 * One `@graph` with stable `@id`s means Google sees a single connected entity
 * (person → company → product → university) rather than repeated, unlinked
 * copies on every page. Page-level JSON-LD elsewhere references these by `@id`.
 */
export function SiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      personNode(),
      personImageNode(),
      organizationNode(),
      edgazeNode(),
      universityNode(),
      websiteNode()
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
