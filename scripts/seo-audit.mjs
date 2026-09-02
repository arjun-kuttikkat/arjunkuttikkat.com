/**
 * SEO / structured-data validation harness.
 *
 * Fetches every route from a running server, parses every JSON-LD block, and
 * asserts the things that actually matter for sitelinks, knowledge panels and
 * indexing. Run with:  node scripts/seo-audit.mjs http://localhost:3142
 */

const BASE = process.argv[2] ?? "http://localhost:3000";
const SITE = "https://arjunkuttikkat.com";

let pass = 0;
let fail = 0;
const failures = [];

function check(name, condition, detail = "") {
  if (condition) {
    pass += 1;
    console.log(`  \x1b[32m✓\x1b[0m ${name}`);
  } else {
    fail += 1;
    failures.push(name + (detail ? ` — ${detail}` : ""));
    console.log(`  \x1b[31m✗\x1b[0m ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

async function get(path) {
  const res = await fetch(BASE + path, { redirect: "manual" });
  const body = await res.text();
  return { res, body, status: res.status, headers: res.headers };
}

/** Extract and JSON.parse every ld+json block. Throws on malformed JSON. */
function jsonLdBlocks(html) {
  const blocks = [];
  const re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    blocks.push(JSON.parse(m[1]));
  }
  return blocks;
}

/** Flatten @graph containers so we can search all nodes by @type. */
function nodes(blocks) {
  const out = [];
  for (const b of blocks) {
    if (Array.isArray(b["@graph"])) out.push(...b["@graph"]);
    else out.push(b);
  }
  return out;
}

const typeOf = (n) => (Array.isArray(n["@type"]) ? n["@type"] : [n["@type"]]);
const findType = (ns, t) => ns.find((n) => typeOf(n).includes(t));
const allIds = (ns) => new Set(ns.map((n) => n["@id"]).filter(Boolean));

/** Collect every {"@id": ...} reference so we can detect dangling pointers. */
function refs(value, acc = []) {
  if (Array.isArray(value)) value.forEach((v) => refs(v, acc));
  else if (value && typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length === 1 && keys[0] === "@id") acc.push(value["@id"]);
    else for (const k of keys) if (k !== "@id") refs(value[k], acc);
  }
  return acc;
}

console.log(`\n\x1b[1mSEO audit → ${BASE}\x1b[0m`);

// ---------------------------------------------------------------- homepage
console.log("\n\x1b[1m/ (homepage — entity graph)\x1b[0m");
{
  const { body, status } = await get("/");
  check("200 OK", status === 200, `got ${status}`);
  let ns = [];
  try {
    ns = nodes(jsonLdBlocks(body));
    check("all JSON-LD parses", true);
  } catch (e) {
    check("all JSON-LD parses", false, e.message);
  }

  const person = findType(ns, "Person");
  check("Person node present", !!person);
  check("Person @id is canonical", person?.["@id"] === `${SITE}/#person`, person?.["@id"]);
  check("Person has givenName/familyName", !!person?.givenName && !!person?.familyName);
  check("Person has jobTitle", !!person?.jobTitle);
  check("Person sameAs >= 4 profiles", (person?.sameAs?.length ?? 0) >= 4, `${person?.sameAs?.length}`);
  check("Person knowsAbout populated", (person?.knowsAbout?.length ?? 0) >= 3);
  check("Person worksFor -> org", !!person?.worksFor?.["@id"]);
  check("Person affiliation -> university", !!person?.affiliation?.["@id"]);
  check("Person homeLocation set", !!person?.homeLocation);
  check("Person mainEntityOfPage -> /about", person?.mainEntityOfPage?.["@id"] === `${SITE}/about`);

  const org = findType(ns, "Organization");
  check("Organization node present", !!org);
  check("Organization founder -> Person", org?.founder?.["@id"] === `${SITE}/#person`);

  const website = findType(ns, "WebSite");
  check("WebSite node present", !!website);
  check("WebSite publisher -> Person", website?.publisher?.["@id"] === `${SITE}/#person`);
  check("WebSite inLanguage set", !!website?.inLanguage);

  const img = findType(ns, "ImageObject");
  check("Person ImageObject with dimensions", !!img?.width && !!img?.height);

  const uni = findType(ns, "CollegeOrUniversity");
  check("University node present", !!uni);

  // Every @id reference should resolve to a node on this page, except for
  // deliberate cross-page entity links: Person.mainEntityOfPage points at the
  // ProfilePage defined on /about, and the Edgaze brand lives on edgaze.ai.
  // Google merges entities across URLs, so these are the intended pattern.
  const crossPage = new Set([`${SITE}/about`]);
  const ids = allIds(ns);
  const dangling = [...new Set(refs(ns))].filter(
    (r) => !ids.has(r) && !r.startsWith("https://edgaze.ai") && !crossPage.has(r)
  );
  check("no unintended dangling @id references", dangling.length === 0, dangling.join(", "));

  check("manifest linked", body.includes("manifest.webmanifest"));
  check("llms.txt discoverable", body.includes('rel="llms-txt"'));
  check("canonical present", body.includes(`rel="canonical"`));
  check("no 1200x1200 stale OG claim", !body.includes("arjun.png"));
}

// ---------------------------------------------------------------- about
console.log("\n\x1b[1m/about (ProfilePage)\x1b[0m");
{
  const { body, status } = await get("/about");
  check("200 OK", status === 200, `got ${status}`);
  const ns = nodes(jsonLdBlocks(body));
  const profile = findType(ns, "ProfilePage");
  check("ProfilePage node present", !!profile);
  check("ProfilePage mainEntity -> Person", profile?.mainEntity?.["@id"] === `${SITE}/#person`);
  check("ProfilePage isPartOf WebSite", !!profile?.isPartOf?.["@id"]);
  const bc = findType(ns, "BreadcrumbList");
  check("BreadcrumbList present", !!bc);
  check("breadcrumb starts at Home", bc?.itemListElement?.[0]?.name === "Home");
  check("og:type=profile", body.includes('property="og:type" content="profile"'));
}

// ---------------------------------------------------------------- blog index
console.log("\n\x1b[1m/blogs (hub / sitelink candidate)\x1b[0m");
{
  const { body, status } = await get("/blogs");
  check("200 OK", status === 200, `got ${status}`);
  const ns = nodes(jsonLdBlocks(body));
  const coll = ns.find((n) => typeOf(n).includes("CollectionPage"));
  check("CollectionPage present", !!coll);
  check("also typed as Blog", typeOf(coll ?? {}).includes("Blog"));
  check("hasPart lists posts", (coll?.hasPart?.length ?? 0) >= 2, `${coll?.hasPart?.length}`);
  check("publisher -> Organization", coll?.publisher?.["@id"] === `${SITE}/#organization`);
  const bc = findType(ns, "BreadcrumbList");
  check("BreadcrumbList present", !!bc);
  check("breadcrumb depth 2", bc?.itemListElement?.length === 2);
}

// ---------------------------------------------------------------- projects index
console.log("\n\x1b[1m/projects (hub / sitelink candidate)\x1b[0m");
{
  const { body, status } = await get("/projects");
  check("200 OK", status === 200, `got ${status}`);
  const ns = nodes(jsonLdBlocks(body));
  const coll = findType(ns, "CollectionPage");
  check("CollectionPage present", !!coll);
  check("hasPart lists all 5 projects", coll?.hasPart?.length === 5, `${coll?.hasPart?.length}`);
  check("BreadcrumbList present", !!findType(ns, "BreadcrumbList"));
}

// ---------------------------------------------------------------- blog post
console.log("\n\x1b[1m/blogs/why-im-building-edgaze (BlogPosting)\x1b[0m");
{
  const { body, status } = await get("/blogs/why-im-building-edgaze");
  check("200 OK", status === 200, `got ${status}`);
  const ns = nodes(jsonLdBlocks(body));
  const post = findType(ns, "BlogPosting");
  check("BlogPosting (not generic Article)", !!post);
  check("headline set", !!post?.headline);
  check("datePublished + dateModified", !!post?.datePublished && !!post?.dateModified);
  check("author -> Person @id", post?.author?.["@id"] === `${SITE}/#person`);
  check("publisher -> Organization @id", post?.publisher?.["@id"] === `${SITE}/#organization`);
  check("wordCount > 100", (post?.wordCount ?? 0) > 100, `${post?.wordCount}`);
  check("timeRequired ISO8601", /^PT\d+M$/.test(post?.timeRequired ?? ""), post?.timeRequired);
  check("articleSection set", !!post?.articleSection);
  check("keywords set", !!post?.keywords);
  check("inLanguage set", !!post?.inLanguage);
  check("isAccessibleForFree", post?.isAccessibleForFree === true);
  check("image is ImageObject w/ dims", !!post?.image?.width && !!post?.image?.height,
    JSON.stringify(post?.image?.width) + "x" + JSON.stringify(post?.image?.height));

  const wp = findType(ns, "WebPage");
  check("WebPage node present", !!wp);
  check("WebPage mainEntity -> article", wp?.mainEntity?.["@id"]?.endsWith("#article"));

  const bc = findType(ns, "BreadcrumbList");
  check("breadcrumb depth 3", bc?.itemListElement?.length === 3, `${bc?.itemListElement?.length}`);
  check("last crumb has no item URL", !bc?.itemListElement?.at(-1)?.item);

  check("visible breadcrumb nav", body.includes('aria-label="Breadcrumb"'));
  check("author links to /about", /rel="author"|href="\/about"/.test(body));
  check("markdown alternate declared", body.includes("/blogs/why-im-building-edgaze/md"));
  check("cover is optimized .jpg", body.includes("blog-1.jpg") || !body.includes("blog-1.png"));
}

// ---------------------------------------------------------------- project page
console.log("\n\x1b[1m/projects/edgaze (CreativeWork + cross-links)\x1b[0m");
{
  const { body, status } = await get("/projects/edgaze");
  check("200 OK", status === 200, `got ${status}`);
  const ns = nodes(jsonLdBlocks(body));
  const cw = findType(ns, "CreativeWork");
  check("CreativeWork present", !!cw);
  check("creator -> Person @id", cw?.creator?.["@id"] === `${SITE}/#person`);
  check("image ImageObject w/ dims", !!cw?.image?.width);
  check("WebPage node present", !!findType(ns, "WebPage"));
  check("breadcrumb depth 3", findType(ns, "BreadcrumbList")?.itemListElement?.length === 3);
  check("cross-links to blog posts", body.includes("/blogs/why-im-building-edgaze"));
  check("Related writing section", body.includes("Related writing"));
}

// ---------------------------------------------------------------- machine files
console.log("\n\x1b[1mMachine-readable surfaces\x1b[0m");
{
  const r = await get("/robots.txt");
  check("robots.txt 200", r.status === 200);
  for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "CCBot", "Google-Extended", "OAI-SearchBot"]) {
    check(`robots allows ${bot}`, r.body.includes(bot));
  }
  check("robots has sitemap", r.body.includes("Sitemap:"));

  const s = await get("/sitemap.xml");
  check("sitemap 200", s.status === 200);
  check("sitemap has all 6 static pages",
    ["/about", "/blogs", "/projects", "/newsletter", "/terminal"].every((p) => s.body.includes(SITE + p)));
  check("sitemap has blog posts", s.body.includes("/blogs/why-im-building-edgaze"));
  check("sitemap has project pages", s.body.includes("/projects/edgaze"));
  check("sitemap has image entries", s.body.includes("image:loc"));
  const lastmods = [...s.body.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
  const today = new Date().toISOString().slice(0, 10);
  check("lastmod is content-derived, not build time",
    !lastmods.some((d) => d.startsWith(today)), lastmods[0]);
  check("sitemap excludes noindex md routes", !s.body.includes("/md<"));

  const l = await get("/llms.txt");
  check("llms.txt 200", l.status === 200);
  check("llms.txt is text/markdown", (l.headers.get("content-type") ?? "").includes("text/markdown"));
  check("llms.txt noindex", (l.headers.get("x-robots-tag") ?? "").includes("noindex"));
  check("llms.txt lists projects + writing", l.body.includes("## Projects") && l.body.includes("## Writing"));

  const lf = await get("/llms-full.txt");
  check("llms-full.txt 200", lf.status === 200);
  check("llms-full.txt has post bodies", lf.body.length > 8000, `${lf.body.length} chars`);

  const md = await get("/blogs/why-im-building-edgaze/md");
  check("per-post .md 200", md.status === 200);
  check("per-post .md is markdown", (md.headers.get("content-type") ?? "").includes("text/markdown"));

  const mf = await get("/manifest.webmanifest");
  check("manifest 200", mf.status === 200);
  const manifest = JSON.parse(mf.body);
  check("manifest has icons", (manifest.icons?.length ?? 0) >= 2);
  check("manifest has name + start_url", !!manifest.name && !!manifest.start_url);

  const feed = await get("/feed.xml");
  check("feed.xml 200", feed.status === 200);
  check("feed has items", (feed.body.match(/<item>/g) ?? []).length >= 2);
}

// ---------------------------------------------------------------- assets
console.log("\n\x1b[1mAsset weight (Core Web Vitals + social previews)\x1b[0m");
{
  const budget = [
    ["/arjun-og.jpg", 250],
    ["/icon-192.png", 40],
    ["/icon-512.png", 150],
    ["/apple-touch-icon.png", 40],
    ["/blog-1.jpg", 300],
    ["/blog-2.jpg", 400],
    ["/edgaze-mark.png", 250],
    ["/logo.png", 60]
  ];
  for (const [path, maxKb] of budget) {
    const r = await fetch(BASE + path);
    const kb = Math.round((await r.arrayBuffer()).byteLength / 1024);
    check(`${path} ${kb}KB <= ${maxKb}KB`, r.status === 200 && kb <= maxKb, `status ${r.status}`);
  }
}

// ---------------------------------------------------------------- canonicals
console.log("\n\x1b[1mCanonical + robots meta on every page\x1b[0m");
let homeCanonical;
for (const p of ["/", "/about", "/blogs", "/projects", "/newsletter", "/terminal",
                 "/blogs/why-im-building-edgaze", "/projects/edgaze"]) {
  const { body, status } = await get(p);
  const canonical = body.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  // The root canonicalises to the bare origin (no trailing slash).
  const expected = p === "/" ? SITE : SITE + p;
  if (p === "/") homeCanonical = canonical;
  check(`${p} canonical -> ${expected}`, canonical === expected, `got ${canonical} (status ${status})`);
}

// The homepage must be spelled identically in the canonical, the sitemap and
// every breadcrumb, or Google sees two URLs for one page.
{
  const s = await get("/sitemap.xml");
  const sitemapRoot = s.body.match(/<loc>([^<]*arjunkuttikkat\.com[^</]*)<\/loc>/)?.[1];
  const about = await get("/about");
  const bcHome = nodes(jsonLdBlocks(about.body))
    .find((n) => typeOf(n).includes("BreadcrumbList"))
    ?.itemListElement?.[0]?.item;
  check("homepage URL identical in canonical + sitemap", homeCanonical === sitemapRoot,
    `canonical=${homeCanonical} sitemap=${sitemapRoot}`);
  check("homepage URL identical in canonical + breadcrumb", homeCanonical === bcHome,
    `canonical=${homeCanonical} breadcrumb=${bcHome}`);
}

console.log(`\n\x1b[1mResult: ${pass} passed, ${fail} failed\x1b[0m`);
if (fail) {
  console.log("\n\x1b[31mFailures:\x1b[0m");
  failures.forEach((f) => console.log("  - " + f));
  process.exit(1);
}
