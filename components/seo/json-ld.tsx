/**
 * Generic JSON-LD script renderer. Pass any schema.org object (or array) and it
 * serializes it into a `<script type="application/ld+json" />` tag that Google
 * can read for rich results, sitelinks, and entity linking.
 *
 * Multiple `<JsonLd>` components on a page are fine — Google merges `@graph`s
 * and links entities by `@id`.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
