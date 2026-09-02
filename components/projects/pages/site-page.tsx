import type { Project } from "../../../lib/projects";
import { P, Pull, Read, Section } from "../detail/primitives";
import { ProjectPageShell } from "../detail/project-page-shell";
import { Reveal } from "../detail/reveal";
import { TechStack } from "../detail/tech-stack";

const decisions = [
  {
    title: "Let type do most of the work",
    body: "The site uses Inter everywhere. Scale, weight, spacing, and contrast create the hierarchy; borders appear only when one piece of information needs to be separated from another.",
  },
  {
    title: "Keep colour at the edges",
    body: "Cyan and magenta appear as low-contrast light around the black surface. The work stays readable in white and zinc rather than competing with a different gradient in every section.",
  },
  {
    title: "Use motion to move attention",
    body: "Sections reveal once as they enter. Project backgrounds drift with scroll. The terminal and projects index can be explored, but nothing animates simply because the page is idle.",
  },
  {
    title: "Show the artifact when one exists",
    body: "The Edgaze page uses the actual Studio, marketplace, and product interface. Engineering sections use the real system and the real services instead of decorative code or invented diagrams.",
  },
];

export function SitePage({ project }: { project: Project }) {
  return (
    <ProjectPageShell project={project}>
      <Section
        eyebrow="Open source"
        title="If you did not know, this site is open source."
      >
        <P>
          The complete implementation is public under the MIT License, including the
          project-page system, MDX publishing pipeline, terminal, analytics integration,
          and SEO infrastructure. You can inspect the decisions, follow the history, or
          reuse parts of the system in your own work on{" "}
          <a
            href="https://github.com/arjun-kuttikkat/arjunkuttikkat.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-200 underline decoration-white/25 underline-offset-[5px] transition-colors hover:text-white"
          >
            GitHub
          </a>
          .
        </P>
      </Section>

      <Section
        eyebrow="Why it exists"
        title="I was rebuilding the same context in every conversation."
      >
        <P>
          What I was working on lived across links, messages, old project descriptions,
          and explanations written for a particular person. Someone could see one piece
          without understanding how it connected to the rest. The work was real; the
          record of it was fragmented.
        </P>
        <P className="mt-6">
          I built this site to become the link that replaces that conversation. It should
          tell someone what I am building now, show enough evidence to understand the
          work, and let them go deeper without needing me to guide them through it.
        </P>
        <Pull>
          The site is not meant to make the work look impressive. It is meant to make the
          work legible.
        </Pull>
      </Section>

      <Section
        eyebrow="What changed"
        title="Project pages became records instead of summaries."
      >
        <P>
          The first version treated every project the same: a title, a description, a
          stack, and a few repeated sections. That was efficient, but it flattened the
          difference between a platform I have spent months building and a prototype made
          over a weekend.
        </P>
        <P className="mt-6">
          The current system gives each project its own story and length. Edgaze can
          explain the product, execution system, money flow, and difficult decisions. A
          hackathon project can show one idea, the path through it, and where the
          prototype stopped. Shared components keep the typography and spacing consistent
          without forcing the content into the same template.
        </P>
      </Section>

      <Section eyebrow="Design" title="The rules are intentionally few.">
        <Read>
          <div className="space-y-12">
            {decisions.map((decision, index) => (
              <Reveal key={decision.title}>
                <p className="text-[0.8125rem] font-medium tabular-nums tracking-[0.12em] text-zinc-600">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-[1.3rem] font-semibold leading-[1.3] tracking-[-0.025em] text-white">
                  {decision.title}
                </h3>
                <p className="mt-4 text-pretty text-[1.0625rem] leading-[1.85] text-zinc-400">
                  {decision.body}
                </p>
              </Reveal>
            ))}
          </div>
        </Read>
      </Section>

      <Section
        eyebrow="Engineering"
        title="Static where possible, structured where it helps."
      >
        <P>
          The site runs on the Next.js App Router. Pages are prerendered at build time;
          the newsletter subscription is the only dynamic endpoint. Projects live as typed
          data, blog posts live as MDX, and a technology registry maps each stack entry to
          one logo and one source instead of repeating that information across pages.
        </P>
        <P className="mt-6">
          The publishing path is intentionally small. Frontmatter is validated with Zod
          before a post can build. The same metadata produces reading time, related posts,
          the RSS feed, sitemap, and article metadata. That keeps the public surfaces in
          agreement without adding a CMS for a site maintained by one person.
        </P>
        <P className="mt-6">
          JavaScript is reserved for things that need interaction: the terminal, project
          index, blog filters, newsletter form, and restrained reveal motion. Everything
          else is ordinary server-rendered HTML.
        </P>
      </Section>

      <Section eyebrow="Stack">
        <TechStack groups={project.stack} />
      </Section>

      <Section
        eyebrow="Where it stands"
        title="Live, and changed whenever the work changes."
      >
        <P>
          The site deploys continuously from the repository and is MIT licensed. Projects
          are rewritten, archived, or shortened as their real status changes. That is the
          point of keeping it as a public record rather than a finished portfolio frozen
          around one moment.
        </P>
      </Section>
    </ProjectPageShell>
  );
}
