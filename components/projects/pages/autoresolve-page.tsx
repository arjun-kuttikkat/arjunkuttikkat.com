import type { Project } from "../../../lib/projects";
import { Architecture, P, Pull, Section, Sequence } from "../detail/primitives";
import { ProjectPageShell } from "../detail/project-page-shell";
import { TechStack } from "../detail/tech-stack";

const caseLoop = [
  {
    title: "Give it the case",
    detail:
      "The user connects Gmail and explains what happened, what outcome they want, and what the agent is never allowed to agree to."
  },
  {
    title: "Let it watch the thread",
    detail:
      "A worker follows new replies and maintains a case record: what has been said, what was promised, what remains unresolved, and when a follow-up is due."
  },
  {
    title: "Respond when the answer is safe",
    detail:
      "For routine turns the agent writes from the full thread and the user's objective, sends the reply, and schedules the next check."
  },
  {
    title: "Stop when judgment matters",
    detail:
      "Refund terms, account access, money, and policy decisions are handed back to the user. Their decision becomes part of the case and the agent continues from there."
  }
];

const architecture = [
  {
    title: "Case setup",
    nodes: [{ name: "Next.js", detail: "Connect Gmail, define the objective, and review anything the agent pauses" }]
  },
  {
    title: "Case loop",
    nodes: [
      { name: "Node.js workers", detail: "Read the thread, decide what happens next, draft, and send" },
      { name: "Redis", detail: "Schedule inbox checks and follow-ups without holding a request open" }
    ]
  },
  {
    title: "Case memory",
    nodes: [
      { name: "PostgreSQL", detail: "Keep the objective, thread state, decisions, and alerts together" },
      { name: "Gmail API", detail: "Read and reply inside the existing support conversation" }
    ]
  }
];

export function AutoresolvePage({ project }: { project: Project }) {
  return (
    <ProjectPageShell project={project}>
      <Section eyebrow="Where it started" title="A simple support issue took a week because nobody owned the follow-through.">
        <P>
          I spent a week going back and forth with OpenAI support over something that was not difficult to resolve.
          The work was checking for replies, repeating context, sending another follow-up, and making sure the thread
          did not quietly die. The company had a system for its queue. I was still managing the case by hand from my
          inbox.
        </P>
        <Pull>AutoResolve gives the customer their own agent on the other side of the support queue.</Pull>
      </Section>

      <Section eyebrow="The product" title="It stays with the case so the customer does not have to.">
        <P>
          The user connects Gmail, explains the dispute once, and defines the result they are trying to reach. From
          there the agent watches the existing support thread. It remembers what has already happened, sends routine
          replies and follow-ups, and brings the user back only when the next move requires an actual decision.
        </P>
        <P className="mt-6">
          It is not a chatbot window and it does not ask the support company to use a new tool. It works inside the
          email conversation that already exists, which lets it carry the repetitive operational part without changing
          how either side communicates.
        </P>
      </Section>

      <Section eyebrow="How a case moves" title="One loop, with a clear boundary between persistence and judgment.">
        <Sequence steps={caseLoop} />
      </Section>

      <Section eyebrow="What was difficult" title="The useful agent is the one that knows when not to send.">
        <P>
          An ordinary autoresponder is dangerous here. A support thread can involve refunds, access to an account,
          policy language, or an offer the user should read before accepting. The agent therefore works from an
          explicit case objective and checks every action against a sensitivity boundary. When a reply crosses it,
          doing nothing is the correct automated action.
        </P>
        <P className="mt-6">
          The second problem was memory. A long support thread contains repeated templates, partial answers, and
          promises made days earlier. Keeping a structured case record next to the raw email thread is what stops the
          agent from treating every new message as a fresh conversation.
        </P>
      </Section>

      <Section eyebrow="How it was built" title="A small event-driven system behind an ordinary inbox.">
        <Architecture layers={architecture} />
        <P className="mt-10">
          Everything ran locally in Docker for the hackathon. Redis handled the delayed work, PostgreSQL held the case,
          and Gmail remained the source of truth for the conversation.
        </P>
      </Section>

      <Section eyebrow="Stack">
        <TechStack groups={project.stack} />
      </Section>

      <Section eyebrow="Where it stands" title="Third place in 48 hours, and a useful product direction.">
        <P>
          I built AutoResolve with Huaicheng Su at the AI Agent Innovation Hackathon. It was a working demo, not a
          deployed service, and it has not been run on anyone else&apos;s inbox. What stayed with me was the inversion:
          companies already use agents to manage customers, but customers still do the work of managing companies.
        </P>
      </Section>
    </ProjectPageShell>
  );
}
