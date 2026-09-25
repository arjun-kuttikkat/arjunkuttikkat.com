# arjunkuttikkat.com — notes for agents

## Verify
- `npm run typecheck` — tsc, no emit
- `npm run lint` — eslint
- `npm run build` — Next.js production build (all routes are static except `/api/newsletter/subscribe` and `/feed.xml`)
- `npm run dev` then open http://localhost:3000 for visual checks
- `npm run build && npx next start -p 3144`, then `npm run seo:audit http://localhost:3144` — 117 assertions over structured data, canonicals, sitemap, robots, llms.txt, and asset weight budgets. Must stay at 0 failures.

## Content model
- Projects: `lib/projects.ts` (data) + `components/projects/pages/<slug>-page.tsx` (composition) + registry in `components/projects/pages/index.ts`.
- Project page primitives live in `components/projects/detail/`. Reuse them; do not add card/pill patterns.
- Every project has a `tldr: string[]` in `lib/projects.ts` — one line per chapter of its page. `ProjectPageShell` renders it as a black `Tldr` box under the hero, and `lib/seo/llms.ts` repeats it in `/llms-full.txt`. Keep it in sync when a page's chapters change.
- Project pages are one centred column: `Read` (42rem) for text, `Wide` (64rem) for figures. Chapters are `<Section eyebrow title>` with prose, then at most one structured block (`Sequence`, `Facts`, `Numbered`, `Architecture`, `Reference`, `Timeline`, `TechStack`).
- Background is `ProjectBackdrop`: black with two edge gradients that drift on scroll. Do not reintroduce a fixed aurora, grid, or noise layer.
- Inter is the only typeface on the site. The terminal and MDX code blocks are the only monospace, because they render code. Never add `font-mono` elsewhere.
- Technologies and logos: `lib/technologies.ts`. Add a tech there once, then reference its id from a project's `stack`.
- Edgaze facts: `lib/edgaze.ts`. Everything in it is sourced from edgaze.ai/docs, status.edgaze.ai, or the Edgaze MCP server. Do not add unverified infrastructure claims.
- Screenshots of Edgaze surfaces: `public/projects/edgaze/*.webp` (1800px wide, captured from the public product).

## Copy rules
- CTAs use plain labels: Visit Edgaze, View project, View projects, View all posts, Read post, Subscribe, Book a call, View documentation, View API docs, Back to home.
- CTA hierarchy classes: `components/ui/button-styles.ts` (primary / secondary / text).
- Prefer concrete engineering facts over adjectives. No invented metrics.
- Write chapters as prose. Bullet fragments scattered around a page are the pattern this revamp removed.

## SEO and structured data
- `lib/seo/entity.ts` is the single source of truth for the entity graph: Person, its portrait `ImageObject`, Edge Platforms, Inc. (`Organization`), Edgaze (`Organization`, `parentOrganization` Edge Platforms), University of Birmingham Dubai (`CollegeOrUniversity`), and `WebSite`. `components/seo/site-json-ld.tsx` emits it once from the root layout as one `@graph`. Every other JSON-LD block references these by exported `@id` (`personId`, `organizationId`, `websiteId`, `primaryImageId`) — never restate them inline.
- Only put verifiable facts in the entity graph. The university is `affiliation`, not `alumniOf` (degree in progress). No birth date, no nationality. `founder` lives on Organization only (schema.org scopes it there), and Edge Platforms deliberately has no `url` because it has no site of its own.
- Every interior page emits a `BreadcrumbList` via `buildBreadcrumb` + `homeCrumb` in `lib/seo/breadcrumbs.ts`, rendered with `<JsonLd>` from `components/seo/json-ld.tsx`. New pages must add one that walks Home → section → page.
- Index pages (`/blogs`, `/projects`) emit a `CollectionPage` with a `hasPart` ItemList so Google treats them as hub pages and sitelink candidates. `/about` emits `ProfilePage` with `mainEntity` → Person, which marks it as the canonical page for the person entity.
- Blog posts are `BlogPosting` (not generic `Article`) with `wordCount`, `keywords`, `articleSection`, `timeRequired`, `inLanguage`, `isAccessibleForFree`, and an `ImageObject` cover. Detail pages also emit a `WebPage` node whose `mainEntity` points at the `#article` / `#project` node.
- `app/sitemap.ts` uses real content dates for `lastModified`, never `new Date()`. Static/index/project pages share the newest blog-post date as a site-freshness proxy; blog posts use their frontmatter date and include their cover image in `images`.
- Blog posts show a visible `aria-label="Breadcrumb"` nav plus an author byline linking to `/about` with `rel="author"`. Project pages rely on the navbar back link + breadcrumb JSON-LD (no visible crumbs, to keep the hero clean).
- Project pages cross-link to matching blog posts via `getRelatedPostsForProject` (`lib/blogs/related.ts`) + `RelatedPosts` in `components/projects/detail/project-page-shell.tsx`. It renders only when a post tag matches the project name, so hackathon pages with no matching writing show nothing.
- `absoluteUrl("/")` normalises to the bare origin so the homepage is spelled identically in canonicals, the sitemap and breadcrumbs. Do not reintroduce a trailing-slash variant.
- Open Graph image dimensions are read from the real file by `getPublicImageSize` (`lib/seo/image-size.ts`, dependency-free header parser). Never hardcode `1200x630` — a wrong size makes scrapers mis-render or drop the preview.

## Images and assets
- `public/arjun-og.jpg` (1200×1200) is the social/OG portrait and the Person `image`. It is JPEG on purpose: the source is fully opaque and JPEG is the only format every scraper handles. Keep it under ~250KB.
- Favicons are `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` (declared with explicit `sizes` in `app/layout.tsx`, plus `app/manifest.ts`). Never point the favicon at a full-resolution portrait.
- Photos belong in JPEG/WebP, not PNG. Logo marks stay PNG for alpha but must be palette-quantised. `npm run seo:audit` enforces a per-asset KB budget, so re-run it after touching `public/`.

## LLM crawlability
- `/llms.txt` (llmstxt.org discovery file) and `/llms-full.txt` (entire site as one Markdown doc) are dynamic routes built by `lib/seo/llms.ts`. They auto-include every published post and project, so never hand-edit a static `public/llms.txt` — there is none by design.
- Each post is also served as clean Markdown at `/blogs/[slug]/md` via `app/blogs/[slug]/md/route.ts` (frontmatter stripped, metadata block prepended). New posts get a `.md` route automatically through `generateStaticParams`.
- The markdown/full-text routes send `X-Robots-Tag: noindex, follow` so they stay out of Google's search index (canonical HTML wins there) while remaining fully fetchable by LLM crawlers.
- `app/robots.ts` explicitly `Allow: /` the well-known LLM crawlers (GPTBot, ClaudeBot, PerplexityBot, CCBot, Google-Extended, etc.) in addition to `*`. Adding a new LLM bot means appending its user-agent to `llmCrawlers`.
- The root layout emits `<link rel="llms-txt" href="/llms.txt" />` in `<head>` for discovery. `getPostRawBody` in `lib/blogs/meta.ts` (re-exported from `lib/blogs/load.ts`) returns a post's Markdown body without compiling MDX — use it for any new text/markdown export.

## Analytics
- Vercel Web Analytics + Speed Insights mount once via `components/site-analytics.tsx` in `app/layout.tsx`. Page views and Web Vitals are automatic on every route; `beforeSend` strips `email`/`token`/`code`/`state` query params before the beacon leaves.
- Custom events go through `trackEvent` in `lib/analytics.ts`, which is a typed union of event names and props. Add a new member to `AnalyticsEvent` before calling it; never send emails, free text, or terminal arguments (Vercel drops PII and caps values at 255 chars).
- Tracked today: `newsletter_subscribe` (form + terminal, with result), `outbound_click` (LeavingSiteLink + terminal `open` effect), `book_call` (Calendly), `blog_share` / `blog_copy_link`, `terminal_command` (command name only), `terminal_window` (minimize/close/zoom/reopen).
- Locally `/_vercel/insights/script.js` 404s and logs a warning; that is expected. The scripts are only served on Vercel deployments with Analytics and Speed Insights enabled in the project dashboard.

## Terminal
- Command engine is UI-free in `lib/terminal/`: `commands.ts` (registry, `execute`, `complete`, `bootBlocks`), `fs.ts` (read-only FS rooted at `~` with `projects/`, `blogs/`, and text files built from `lib/projects.ts`, `lib/about-content.ts`, `lib/data.ts`, `lib/edgaze.ts`), `types.ts` (`TERMINAL_VERSION`, block/effect types). Commands return blocks plus effects (`clear`, `cwd`, `navigate`, `open`, `prompt_email`, `exit`); the component applies effects, so new commands never touch React state directly.
- Blog metadata reaches the client through `lib/terminal/posts.ts` (`server-only`), passed as `posts` from `app/page.tsx` and `app/terminal/page.tsx`. Do not import `lib/blogs/*` into the terminal components.
- `components/ak-terminal-window.tsx` is the macOS window: `TrafficLights` (`components/terminal/traffic-lights.tsx`) reproduce hover glyphs, grey inactive state, and pressed darkening; the title reads `visitor — -zsh — cols×rows` from real cell measurement; the block cursor is solid when focused and hollow when inactive. Never render a title-bar button other than the three lights.
- Home window state lives in `components/home-terminal-section.tsx`: minimize flies the window to the Dock and keeps its session, close unmounts it (fresh session on reopen), green zooms to `/terminal`. `components/terminal/terminal-dock.tsx` is fixed bottom-left and renders only while the window is minimized or closed.
- `/terminal` is chrome-less (`chrome={false}`, no navbar/footer); `exit`, `quit`, or Ctrl+D return to the page the visitor came from (the `?from=` entry, else `readLastWebPath()` from `components/mode-toggle.tsx`).
- Every web page has a terminal twin. `ModeToggle` links to `/terminal?from=<pathname>`; `components/terminal/terminal-route.tsx` reads it with `useSearchParams` (inside a Suspense boundary so the route stays static) and `lib/terminal/entry.ts` maps the path to a `TermEntry` — starting `cwd` plus the command to auto-run (`/` → `home`, `/about` → `about`, `/projects` → `projects`, `/projects/x` → `project x`, `/blogs` → `blogs`, `/blogs/x` → `read x`, `/newsletter` → `newsletter`). Unknown slugs fall back to a plain boot. Add new pages to `entryFor` and give them a command.
- Page-style commands print a block-letter heading (`kind: "figlet"`, font in `lib/terminal/figlet.ts`, same ANSI Shadow face as the banner) that degrades to a bold text heading when the glyph rows would wrap. Use the `page()` helper in `commands.ts` for anything that mirrors a web page.
- Navigation is forgiving on purpose: `findDir`/`findFile` in `fs.ts` resolve relative to cwd, then from `~`, then by bare file name, so `cd projects`, `cat about.txt` and `ls blogs` work from any directory. `cd -` uses `env.prevCwd`. An unknown command that is a directory, project slug, post slug or file name jumps to it (zsh AUTO_CD; see `autoJump`), otherwise "did you mean" via edit distance. Never reintroduce strict cwd-relative resolution.
- Inside a picker, Enter on text that matches no rows, or whose first word is a command (`isCommand`), cancels the picker and runs the text as a command. Easter eggs are hidden commands (`fortune`, `cowsay`, `sl`, `yes`, `finger`, `coffee`, `zuck`) plus dotfiles `.plan` and `.zshrc` shown by `ls -a`; `figlet <text>` is visible.
- `projects` and `blogs` return a `menu` block (`items: MenuItem[]`, each with a `command`). While it is the active block the window owns the keyboard: ↑/↓/Tab/j/k move, printable keys filter (fzf-style), Enter runs the item's command, Esc/Ctrl+C cancel; hover moves the cursor and click/tap chooses, so touch works without keys. The prompt line is hidden while a menu is active. Any command can return a menu; keep items to names plus a short hint.
- Colour is deliberate and small: zsh prompt (green `user@host`, blue path), cyan→violet gradient on `figlet` headings, near-white gradient on the banner, cyan labelled rules, and `TermLine.label` for key columns (`state`, link names). Body text stays `#d6d6d6`; do not colour whole paragraphs.
- `read <slug>` returns a `read_post` effect; the window fetches `/blogs/<slug>/md` and renders it through `lib/terminal/markdown.ts` (`articleLines`) as an `article` block. The renderer understands headings, quotes, lists, code fences, links (listed under the line as `↗ url`), `<BlogImage>` (as a captioned `▣` line) and `<Callout>`. Long output opened from a page is scrolled to its top (`scrollTargetRef`), not to the prompt.
- Bump `TERMINAL_VERSION` in `lib/terminal/types.ts` when commands change; `help` groups are hand-ordered in `commands.ts`, so add new visible commands to a group there.
