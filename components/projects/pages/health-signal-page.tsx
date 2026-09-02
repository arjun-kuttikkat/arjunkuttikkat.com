import type { Project } from "../../../lib/projects";
import { P, Pull, Section, Sequence } from "../detail/primitives";
import { ProjectPageShell } from "../detail/project-page-shell";
import { TechStack } from "../detail/tech-stack";

const recoveryFlow = [
  {
    title: "A small daily check-in",
    detail:
      "The patient records pain, temperature, medication, and symptoms from their phone. The interaction stays short enough to repeat during recovery."
  },
  {
    title: "One recovery timeline",
    detail:
      "Instead of treating each answer as an isolated reading, the system keeps them as a continuous history of how the patient is changing."
  },
  {
    title: "Comparison with expected recovery",
    detail:
      "The timeline is compared with the shape recovery should take after the procedure. That gives the same reading different meaning on day one and day six."
  },
  {
    title: "A signal people can understand",
    detail:
      "Meaningful deviation is surfaced in a short summary. The underlying readings stay available, but the patient is not asked to interpret a dashboard."
  }
];

export function HealthSignalPage({ project }: { project: Project }) {
  return (
    <ProjectPageShell project={project}>
      <Section eyebrow="Where it started" title="Leaving hospital does not end the monitoring. It ends the interpretation.">
        <P>
          After surgery, patients go home with a list of symptoms to watch and broad advice about when to worry. They
          continue producing useful information: pain, temperature, medication timing, changes in how they feel. But
          no longer have someone turning those observations into a picture of how recovery is going.
        </P>
        <P className="mt-6">
          A single reading rarely answers that question. A small change can be expected early in recovery and
          concerning several days later. Without the surrounding timeline, patients either dismiss something that is
          changing or become anxious about normal variation.
        </P>
        <Pull>Health Signal was an attempt to show the meaning of the data, not simply collect more of it.</Pull>
      </Section>

      <Section eyebrow="The product" title="A calm recovery timeline between the patient and the clinician.">
        <P>
          The patient answers a short check-in from their phone. Health Signal builds those reports into a continuous
          view of recovery, compares the direction of change with what is expected, and brings forward the deviations
          that may deserve attention.
        </P>
        <P className="mt-6">
          The first thing on screen is a summary in ordinary language. The detailed readings and timeline are there
          when someone needs them, but they do not lead the experience. That matters because the person reading it may
          be tired, in pain, or already worried.
        </P>
      </Section>

      <Section eyebrow="How it works" title="The value comes from the timeline, not any single reading.">
        <Sequence steps={recoveryFlow} />
      </Section>

      <Section eyebrow="What was difficult" title="An alert can be harmful even when it is technically correct.">
        <P>
          Flag every unusual value and people learn to ignore the product. Filter too aggressively and an early change
          disappears into the noise. The central design problem was therefore not how to draw a chart; it was where to
          place the boundary between normal variation and a meaningful change for each stage of recovery.
        </P>
        <P className="mt-6">
          The interface had the same trade-off. More detail can make a clinical system look capable while making it
          harder for the patient to understand. We kept the summary first and the evidence behind it, so the system
          could explain a signal without turning recovery into another dashboard to manage.
        </P>
      </Section>

      <Section eyebrow="How it was built" title="A deliberately small prototype.">
        <P>
          The patient-facing surface was built with Next.js, React, and TypeScript, with mobile use treated as the
          default. Python handled the time-series processing and the comparison against expected recovery. There was no
          production infrastructure because the purpose of the project was to test the signal and its presentation,
          not to deploy a clinical service.
        </P>
      </Section>

      <Section eyebrow="Stack">
        <TechStack groups={project.stack} />
      </Section>

      <Section eyebrow="Where it stands" title="A research prototype, not a medical product.">
        <P>
          Health Signal was developed at Future Hack in Dubai Knowledge Park / DIAC, with Smart Salem and Mediclinic
          involved in the event. It was not deployed and it does not replace medical judgment. The useful conclusion
          was narrower: post-surgery monitoring is as much a communication problem as a data problem. What matters is
          deciding what to show, when to show it, and how to explain why it matters.
        </P>
      </Section>
    </ProjectPageShell>
  );
}
