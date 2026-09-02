import { edgazeLinks, edgazeState, edgazeTimeline } from "../../../lib/edgaze";
import type { Project } from "../../../lib/projects";
import { LeavingSiteLink } from "../../leaving-site-link";
import { buttonPrimary, buttonSecondary, textLink } from "../../ui/button-styles";
import {
  Architecture,
  Figure,
  Lead,
  P,
  Pull,
  Read,
  Section,
  Sequence,
  Timeline,
} from "../detail/primitives";
import { ProjectPageShell } from "../detail/project-page-shell";
import { Reveal } from "../detail/reveal";
import { SupportedBy } from "../detail/supported-by";
import { TechStack } from "../detail/tech-stack";

const SHOT = { w: 1800, h: 1125 };

const productPath = [
  {
    title: "Build",
    detail:
      "The creator lays out the workflow in Studio: what the customer provides, which models or tools run, how data moves between steps, and what the final result should look like.",
  },
  {
    title: "Publish",
    detail:
      "They test it, choose a price, and publish. Edgaze turns the graph into a product page with its own input form, description, price, and run button.",
  },
  {
    title: "Run",
    detail:
      "A buyer provides the input and pays for one run. Edgaze executes the workflow, keeps its progress and result, and pays the creator when it succeeds.",
  },
  {
    title: "Distribute",
    detail:
      "The same published workflow can be shared as a page, called from a backend through the API, or used by an AI agent through MCP. It is still one product in every place.",
  },
];

const architecture = [
  {
    title: "Product",
    note: "What people use",
    nodes: [
      { name: "Workflow Studio", detail: "Build and test the graph" },
      { name: "Marketplace", detail: "Discover and buy workflows" },
      { name: "Product pages", detail: "Collect input and show the result" },
      { name: "API and MCP", detail: "Run the same workflow from software and agents" },
    ],
  },
  {
    title: "Platform",
    note: "What makes publishing possible",
    nodes: [
      { name: "Supabase", detail: "Accounts, Postgres data, storage" },
      { name: "Workflow catalog", detail: "Published products and immutable versions" },
      { name: "Stripe", detail: "Buyer payments, wallet funding, creator payouts" },
      { name: "API Vault", detail: "Encrypted model-provider keys" },
    ],
  },
  {
    title: "Runtime",
    note: "What runs after the button is pressed",
    nodes: [
      { name: "Execution engine", detail: "Reads the graph and schedules each step" },
      {
        name: "Execution workers",
        detail: "Call models, APIs, scrapers, and transformations",
      },
      { name: "Redis Streams", detail: "Carry progress events while the run is active" },
      {
        name: "Run record",
        detail: "Keeps status, outputs, usage, and billing together",
      },
    ],
  },
  {
    title: "Providers",
    note: "Where model work happens",
    nodes: [
      { name: "OpenAI", detail: "GPT, image, and embedding models" },
      { name: "Anthropic", detail: "Claude models" },
      { name: "Google", detail: "Gemini text and image models" },
      { name: "Azure", detail: "Managed capacity for selected hosted models" },
    ],
  },
];

export function EdgazePage({ project }: { project: Project }) {
  return (
    <ProjectPageShell project={project}>
      <SupportedBy />
      <Section
        eyebrow="Why I started it"
        title="People were sharing useful AI workflows in a form nobody could really use."
      >
        <Lead>
          I kept seeing the same thing: someone had worked out a genuinely useful process,
          but the only way they could share it was as a thread, a screenshot, a prompt
          pack, or a long page of instructions.
        </Lead>
        <P className="mt-8">
          That put all the work back on the person buying it. They still had to copy the
          prompts, find the right tools, connect the steps, and figure out what the
          original creator had left unsaid. Most people never made it that far. The
          workflow could be good and still fail as a product because using it felt like
          rebuilding it.
        </P>
        <P className="mt-6">
          It also left creators with a weak way to make money. They could sell access to a
          document, but not the result the workflow produced. I wanted to close that gap.
        </P>
        <Pull>
          Edgaze began with a simple idea: if someone wants the outcome, they should be
          able to run the workflow, not reconstruct it.
        </Pull>
      </Section>

      <Section
        eyebrow="The product"
        title="A place to build the workflow, publish it, and get paid when it runs."
      >
        <P>
          Edgaze combines a visual builder, a marketplace, and the execution system
          underneath both. A creator builds the workflow once. When they publish it,
          Edgaze turns it into a product that another person can open, pay for, and run
          without seeing or rebuilding the graph behind it.
        </P>
        <P className="mt-6">
          The buyer sees a straightforward page: what the workflow does, what it needs
          from them, what one run costs, and what they will receive. They provide the
          input and Edgaze handles everything between that moment and the finished result.
        </P>

        <Figure
          src="/projects/edgaze/marketplace.webp"
          alt="The Edgaze marketplace showing published AI workflows, their creators, and their price per run."
          width={SHOT.w}
          height={SHOT.h}
          caption="The marketplace. Each listing is a workflow someone can run, not a file they have to reassemble."
        />

        <Figure
          src="/projects/edgaze/product.webp"
          alt="An Edgaze workflow product page showing the workflow input, price, run action, and related products."
          width={SHOT.w}
          height={SHOT.h}
          caption="A workflow product page. The input form comes from the workflow itself; the buyer never has to open the builder."
        />
      </Section>

      <Section
        eyebrow="How it comes together"
        title="One path from an idea on the canvas to a result in someone else's hands."
      >
        <Sequence steps={productPath} />

        <Figure
          src="/projects/edgaze/studio.webp"
          alt="Edgaze Workflow Studio with a simple workflow connected across three blocks on the canvas."
          width={SHOT.w}
          height={SHOT.h}
          caption="Workflow Studio. This example takes an input, sends it through a model, and returns a defined output. Larger workflows can branch, loop, call APIs, scrape pages, transform data, and run other workflows."
        />
      </Section>

      <Section
        eyebrow="What had to be built"
        title="Publishing is the visible part. The difficult part starts after someone presses Run."
      >
        <P>
          A workflow can call several models and outside services, wait between steps,
          branch on a result, or take long enough for the person who started it to close
          the page. Edgaze has to keep that run alive, preserve what has already happened,
          and make the final result available when they return.
        </P>
        <P className="mt-6">
          That is why every run is stored as its own record. It knows which version of the
          workflow was used, what stage it reached, what each step produced, and whether
          the buyer should be charged. The marketplace, API, and MCP server all read that
          same record instead of maintaining three different versions of the truth.
        </P>
        <P className="mt-6">
          Model providers fail too. The runtime can move a run to a compatible fallback
          without changing the price the buyer saw. If a run still fails, the
          creator&apos;s margin is released and the buyer is not charged for a result they
          never received.
        </P>
      </Section>

      <Section
        eyebrow="The hardest decisions"
        title="The product only works if execution, money, and ownership agree."
      >
        <Read>
          <div className="space-y-14">
            <Reveal>
              <h3 className="text-[1.35rem] font-semibold tracking-[-0.025em] text-white">
                A successful run has to mean one thing everywhere.
              </h3>
              <p className="mt-4 text-pretty text-[1.0625rem] leading-[1.85] text-zinc-400 sm:text-[1.125rem]">
                The result shown to the buyer, the amount removed from their wallet, the
                creator&apos;s earnings, and the run status all have to describe the same
                event. I ended up treating run integrity and money integrity as separate
                systems to monitor because a workflow completing while its payment fails,
                or the reverse, is worse than an ordinary error.
              </p>
            </Reveal>
            <Reveal>
              <h3 className="text-[1.35rem] font-semibold tracking-[-0.025em] text-white">
                A creator can improve a product without changing what someone already
                bought.
              </h3>
              <p className="mt-4 text-pretty text-[1.0625rem] leading-[1.85] text-zinc-400 sm:text-[1.125rem]">
                Every publish creates an immutable version. Existing runs and bundles stay
                tied to the version they were purchased against, while new buyers see the
                current one. That made updates safer and stopped a change in the builder
                from silently changing an old purchase.
              </p>
            </Reveal>
            <Reveal>
              <h3 className="text-[1.35rem] font-semibold tracking-[-0.025em] text-white">
                The workflow should remain one product wherever it is used.
              </h3>
              <p className="mt-4 text-pretty text-[1.0625rem] leading-[1.85] text-zinc-400 sm:text-[1.125rem]">
                A person on the marketplace, a developer using the API, and an agent
                connected through MCP should not need separate builds. They all discover
                the same product, provide the same kind of input, pay the same price, and
                receive the result from the same execution system.
              </p>
            </Reveal>
          </div>
        </Read>
      </Section>

      <Section eyebrow="The system" title="Four layers support that experience.">
        <Architecture layers={architecture} />
        <P className="mt-10">
          The product currently exposes eleven independently monitored services, including
          the web app, public API, MCP server, execution engine, workers, marketplace,
          payments, and the checks that keep runs and money in agreement. Their current
          state and incident history are public on{" "}
          <a
            href={edgazeLinks.status}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-200 underline decoration-white/25 underline-offset-[5px] transition-colors hover:text-white"
          >
            status.edgaze.ai
          </a>
          .
        </P>
      </Section>

      <Section eyebrow="Stack">
        <TechStack groups={project.stack} />
      </Section>

      <Section
        eyebrow="Where it stands"
        title="Live and operating in production, with the platform acquiring users."
      >
        <P>
          Edgaze is live and operating in production, while still in public beta. Per-run
          billing, wallets, bundles, and Stripe Connect payouts have been active since
          March 2026. The API, MCP server, resumable run streaming, provider-key modes,
          and the current runtime contract followed as the product grew beyond the
          marketplace itself.
        </P>
        <P className="mt-6">
          The current focus is user acquisition: bringing more creators into Studio,
          helping them publish workflows worth paying for, and reaching buyers through the
          marketplace, API, and MCP. Each surface serves a different way of discovering
          and running the same product, from a person on the web to a backend or an AI
          agent.
        </P>

        <div className="mt-12">
          <Timeline items={edgazeTimeline} />
        </div>

        <Read className="mt-10">
          <Reveal>
            <p className="text-[0.95rem] leading-[1.7] text-zinc-500">
              Built and operated by {edgazeState.company}, which I incorporated at 18.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <LeavingSiteLink href={edgazeLinks.home} className={buttonPrimary}>
                Visit Edgaze
              </LeavingSiteLink>
              <a
                href={edgazeLinks.docs}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonSecondary}
              >
                View documentation
              </a>
              <a
                href={edgazeLinks.changelog}
                target="_blank"
                rel="noopener noreferrer"
                className={textLink}
              >
                View changelog <span aria-hidden>↗</span>
              </a>
            </div>
          </Reveal>
        </Read>
      </Section>
    </ProjectPageShell>
  );
}
