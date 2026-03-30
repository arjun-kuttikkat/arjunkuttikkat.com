# SEO Growth Playbook

## Core Web Vitals Checklist

- Measure live URLs in PageSpeed Insights before and after major homepage or blog layout changes.
- Keep the real LCP image on each route as the only `priority` image.
- Avoid adding new above-the-fold client components without a strong reason.
- Prefer code-splitting for below-the-fold motion-heavy sections.
- Reserve space for images and embeds to protect CLS.

## Current Audit Notes

- Public PageSpeed API was quota-blocked during this implementation pass, so the baseline below comes from local production Lighthouse runs against the built app.
- Home route (`/`): performance score `0.75`, LCP `15.2s`, CLS `0`, TBT `50ms`, Speed Index `1.2s`.
- Featured blog route (`/blogs/why-im-building-edgaze`): performance score `0.94`, LCP `3.0s`, CLS `0`, TBT `20ms`, Speed Index `1.2s`.
- Current takeaway: the homepage LCP is still the biggest performance risk. The metadata/crawlability work is complete, and the main technical mitigation shipped here was reducing initial homepage JS by code-splitting below-the-fold client sections, removing a non-critical priority image in the navbar, and switching the on-page portrait to a lighter WebP asset.
- Additional Lighthouse hint from the local run: render-blocking CSS is still showing up on the homepage and is the next place to investigate if the home route needs another performance pass.

## Content Pillars

### 1. Edgaze and AI workflow execution

- What Edgaze is building
- Why workflow products fail in practice
- Execution infrastructure, monetization, and reliability

### 2. Distribution and discoverability

- Outreach systems
- Founder-led distribution
- What actually creates traction

### 3. Product building notes

- Case studies from projects on this site
- Architecture and design trade-offs
- What shipped, what failed, and what changed

### 4. Founder operating system

- Decision-making
- Speed versus quality
- Systems for focus, experimentation, and follow-through

## Publishing Cadence

- Publish 1 or 2 substantial posts per month.
- Prefer durable, specific posts over short reactive updates.
- Refresh evergreen posts when the underlying facts or lessons change.

## Internal Linking Map

- Every new post should link to at least one relevant project page.
- Every new post should link to the newsletter when the topic has continuing value.
- High-authority pages to reinforce frequently: `/`, `/about`, `/projects`, `/projects/edgaze`, `/blogs`.
- Add contextual MDX links inside paragraphs, not only cards and footer navigation.

## Post Brief Template

- Primary query: What exact question should this page answer?
- Audience: Founder, builder, creator, operator, or technical reader?
- Unique insight: What can only Arjun explain here?
- Supporting links: Which existing project and blog pages should this connect to?
- Conversion path: Newsletter, project page, or direct contact?

## Backlink Strategy

- Turn the strongest project pages and essays into linkable assets.
- Publish posts with original insight, not generic summaries.
- Use podcast show notes, guest posts, launch pages, GitHub READMEs, and founder profiles to earn relevant links back to the site.
- Prioritize links that strengthen topical authority around AI workflows, product execution, and founder-led distribution.
- Avoid paid link schemes, spammy directories, and low-quality reciprocal exchanges.

## Tracking

- Review Google Search Console weekly for impressions, clicks, top queries, and links.
- Watch which posts attract links and extend those topics into follow-up pieces.
- Track referring domains over time, not just raw backlink counts.
