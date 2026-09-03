import type { Project } from "../../../lib/projects";
import { buttonPrimary, buttonSecondary } from "../../ui/button-styles";
import { Architecture, Figure, Lead, P, Pull, Read, Section, Sequence } from "../detail/primitives";
import { ProjectPageShell } from "../detail/project-page-shell";
import { Reveal } from "../detail/reveal";
import { TechStack } from "../detail/tech-stack";

const screenshots = {
  map: { width: 3456, height: 1900 },
  file: { width: 3456, height: 1898 },
  ask: { width: 3456, height: 1900 }
};

const productPath = [
  {
    title: "Open",
    detail:
      "Select a project from the computer. Compass filters generated and vendor directories, then reads supported source files locally."
  },
  {
    title: "Map",
    detail:
      "The analyzer extracts symbols and imports, resolves internal dependencies, and builds the repository graph."
  },
  {
    title: "Explore",
    detail:
      "Navigate files visually, inspect incoming and outgoing relationships, find isolated files, follow a recommended reading order, and trace transitive change impact."
  },
  {
    title: "Ask",
    detail:
      "Ask about the whole codebase or focus the assistant on one file. Shared notes and presence let teammates explore the same mapped project together."
  }
];

const architecture = [
  {
    title: "Browser",
    note: "Where the repository is analysed",
    nodes: [
      { name: "Local analyzer", detail: "Parses source files, symbols, and imports" },
      { name: "Dependency graph", detail: "Maps internal file relationships" },
      { name: "D3", detail: "Renders and navigates the graph" },
      { name: "Web Worker", detail: "Keeps repository analysis off the main UI thread" }
    ]
  },
  {
    title: "Realtime + AI",
    note: "What makes the map collaborative and easier to understand",
    nodes: [
      {
        name: "Convex",
        detail: "Stores derived graph state, notes, presence, and cached results"
      },
      {
        name: "Project taxonomy",
        detail: "Derives architecture categories for each repository"
      },
      {
        name: "Codebase assistant",
        detail: "Answers questions using known structural context"
      },
      {
        name: "File summaries",
        detail: "Explains individual files and caches the result"
      }
    ]
  },
  {
    title: "Dependency intelligence",
    note: "What sits outside the repository itself",
    nodes: [
      { name: "Context.dev", detail: "Provides migration and dependency guidance" },
      {
        name: "npm / PyPI / OSV",
        detail: "Provide package and vulnerability information"
      },
      {
        name: "Cached refreshes",
        detail: "Avoid repeating external lookups unnecessarily"
      }
    ]
  }
];

export function CompassPage({ project }: { project: Project }) {
  const live = project.links.find((link) => link.kind === "primary");
  const source = project.links.find((link) => link.kind === "source");

  return (
    <ProjectPageShell project={project}>
      <Section eyebrow="Origin" title="From an IDE plugin to a browser-first codebase explorer.">
        <Lead>
          Huaicheng Su had previously built a JetBrains plugin around visualising dependencies inside a codebase.
        </Lead>
        <P className="mt-8">
          For the Collabute × TheBlock hackathon, Huaicheng and I took that starting point and pushed it further: move
          the experience into the browser, redesign the interface around exploration rather than the IDE, expand
          analysis across multiple languages, and add change impact, architecture discovery, codebase questions,
          collaboration, and dependency intelligence.
        </P>
        <Pull>The result became Compass.</Pull>
      </Section>

      <Section eyebrow="The product" title="Most unfamiliar repositories give you files. Compass gives you a map.">
        <P>
          Opening a large codebase normally means jumping between folders, imports, and search results until a mental
          model starts forming. Compass builds that model first.
        </P>
        <P className="mt-6">
          Choose a local project and it parses the source files, resolves internal imports, and renders the repository
          as an interactive dependency graph. The analyzer supports Java, Kotlin, JavaScript, TypeScript, and Python,
          with internal relationships resolved locally in the browser.
        </P>
        <Figure
          src="/projects/compass/dependency-map.webp"
          alt="Compass showing the dependency map for a React and Redux codebase, with files grouped by architecture role and connected by import relationships."
          width={screenshots.map.width}
          height={screenshots.map.height}
          caption="The whole-codebase view turns 38 source files into a navigable dependency map. Colour identifies architecture roles; edges show internal relationships; the assistant remains available beside the graph."
          priority
        />
      </Section>

      <Section eyebrow="How it works" title="One path from opening a repository to understanding how it fits together.">
        <Sequence steps={productPath} />
      </Section>

      <Section eyebrow="Change impact" title="Selecting one file reveals why it matters to the rest of the repository.">
        <P>
          A selected node opens the file view: its path, language, architectural role, direct relationships, and an
          explanation grounded in the graph. That turns a dependency map into an answer to the practical question
          developers usually have first: what could this change affect?
        </P>
        <P className="mt-6">
          The same context gives the file assistant a narrower scope. It can summarise the file, explain why it has many
          dependents, walk through a reading order, or identify likely breakage without treating the file as an isolated
          snippet.
        </P>
        <Figure
          src="/projects/compass/file-impact.webp"
          alt="Compass with actionTypes.js selected, showing its dependency connections, architecture role, explanation, and AI file summary."
          width={screenshots.file.width}
          height={screenshots.file.height}
          caption="The selected actionTypes.js node is consumed by 24 files. Compass keeps the graph visible while the detail panel explains that structural impact and grounds follow-up questions in the selected file."
        />
      </Section>

      <Section
        eyebrow="The main constraint"
        title="AI was useful only if the source code did not have to leave the machine."
      >
        <P>
          Uploading an unfamiliar private repository just to understand it defeats a major reason developers would want
          a tool like Compass. The parsing and dependency analysis therefore happen locally.
        </P>
        <P className="mt-6">
          When collaboration is enabled, Compass publishes a derived digest containing paths, identifiers, architecture
          roles, dependency edges, and package names. The shared Convex representation does not store the
          repository&apos;s source contents. That digest is enough to support shared structure, taxonomy, notes,
          presence, and dependency intelligence.
        </P>
        <P className="mt-6">
          The exception is explicit: if someone attaches an external file to an assistant question, that file can be
          sent for that question rather than being silently included with the project.
        </P>
        <Figure
          src="/projects/compass/codebase-assistant.webp"
          alt="Compass codebase assistant dialog offering grounded questions about a repository, including upgrade impact, reading order, and risky files."
          width={screenshots.ask.width}
          height={screenshots.ask.height}
          caption="Codebase-wide questions start from the mapped project structure and dependency findings. The dialog makes that grounding explicit before a developer asks about upgrade impact, reading order, or risky files."
        />
      </Section>

      <Section eyebrow="Architecture" title="Three layers support the experience.">
        <P>
          The taxonomy system runs in two passes. It first derives a small architecture vocabulary for the specific
          repository, then assigns files against that fixed vocabulary. The implementation uses openai/gpt-oss-120b
          through Groq and caches the result per project.
        </P>
        <div className="mt-10">
          <Architecture layers={architecture} />
        </div>
      </Section>

      <Section eyebrow="Stack">
        <TechStack groups={project.stack} />
      </Section>

      <Section
        eyebrow="Where it stands"
        title="Built for Collabute × TheBlock and released as an open-source hackathon project."
      >
        <P>
          Compass was built during the Collabute × TheBlock hackathon in August 2026. It is functional and publicly
          available, but remains a hackathon build rather than a product currently being operated or commercialised.
        </P>
        <P className="mt-6">
          The repository includes the browser analyzer, Convex backend, dependency-intelligence integration, automated
          analyzer tests, and an MIT licence.
        </P>
        <Read className="mt-9">
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              {live ? (
                <a href={live.href} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                  Open Compass
                </a>
              ) : null}
              {source ? (
                <a href={source.href} target="_blank" rel="noopener noreferrer" className={buttonSecondary}>
                  View GitHub
                </a>
              ) : null}
            </div>
          </Reveal>
        </Read>
      </Section>
    </ProjectPageShell>
  );
}
