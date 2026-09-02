import type { Project } from "../../../lib/projects";
import { Architecture, P, Pull, Section, Sequence } from "../detail/primitives";
import { ProjectPageShell } from "../detail/project-page-shell";
import { TechStack } from "../detail/tech-stack";

const transaction = [
  {
    title: "The seller records the item",
    detail:
      "The listing is tied to a specific physical object. It is more than a photo and a price: it becomes the reference the item will be checked against later."
  },
  {
    title: "The buyer commits the money",
    detail:
      "Before anyone meets, the buyer moves the agreed amount into an Anchor escrow program. The seller knows the money exists; the buyer knows it cannot be released yet."
  },
  {
    title: "Both people and the item are checked",
    detail:
      "At the meetup the devices confirm that buyer and seller are together, then the item is checked against the record created when it was listed."
  },
  {
    title: "The handover unlocks settlement",
    detail:
      "An NTAG 424 DNA tag attached to the item signs a fresh message when it is tapped. Once the backend verifies that proof, escrow releases and an on-chain receipt records the exchange."
  }
];

const architecture = [
  {
    title: "The Android app",
    note: "What buyer and seller touch",
    nodes: [
      { name: "Kotlin and Compose", detail: "Listing, discovery, wallet connection, and the meetup flow" },
      { name: "NFC and ML Kit", detail: "Read the secure tag and help check the physical item" }
    ]
  },
  {
    title: "The Solana programs",
    note: "What neither person controls",
    nodes: [
      { name: "Anchor escrow", detail: "Holds the money and enforces when it can move" },
      { name: "Metaplex receipt", detail: "Records the completed exchange" },
      { name: "Helius", detail: "Provides the RPC connection to Solana" }
    ]
  },
  {
    title: "The backend",
    note: "What verifies the real world",
    nodes: [
      { name: "Supabase", detail: "Listings, accounts, and exchange history" },
      { name: "Edge Functions", detail: "Verify NFC proofs and coordinate settlement without putting secrets on the phone" }
    ]
  }
];

export function AuraPage({ project }: { project: Project }) {
  return (
    <ProjectPageShell project={project}>
      <Section eyebrow="Where it started" title="The riskiest part of a marketplace sale happens after the app has done its job.">
        <P>
          A buyer finds an item, messages the seller, and agrees on a price. Then both of them leave the marketplace
          and meet in person. At that point the software has almost no idea what happens next. The item may not match
          the listing. The buyer may arrive without the money. Either person can walk away with a different account of
          what happened.
        </P>
        <Pull>Aura was an attempt to keep the transaction enforceable all the way through the physical handover.</Pull>
      </Section>

      <Section eyebrow="The idea" title="Split trust across the phone, the blockchain, and the object itself.">
        <P>
          The phone is good at guiding the people through the exchange, but it should not be trusted with the money.
          Solana can hold and release the money, but it cannot see whether a real object changed hands. A secure NFC
          tag can prove that someone touched the right object at the meetup, but it cannot settle a transaction on its
          own.
        </P>
        <P className="mt-6">
          Aura combines those three pieces. None of them is enough by itself. Together they let the next step happen
          only after the previous one has been verified.
        </P>
      </Section>

      <Section eyebrow="The transaction" title="From listing to receipt, in four connected steps.">
        <Sequence steps={transaction} />
      </Section>

      <Section eyebrow="What was difficult" title="The handover had to become something software could prove.">
        <P>
          Releasing escrow on a button press would have moved the trust problem rather than solved it. The important
          part of the prototype was the NFC proof. The tag generates a different signed message on each tap, and the
          verification happens on the backend so the secret never sits inside the Android app. A copied screenshot or
          a replayed message cannot stand in for the physical tap.
        </P>
        <P className="mt-6">
          The other constraint was making sure no single layer could finish the sale alone. The app handles the
          experience. The chain controls the funds. The backend checks the evidence from the real world. Compromising
          one should not be enough to fake the whole exchange.
        </P>
      </Section>

      <Section eyebrow="How it was built" title="Three layers, each responsible for one kind of truth.">
        <Architecture layers={architecture} />
      </Section>

      <Section eyebrow="Stack">
        <TechStack groups={project.stack} />
      </Section>

      <Section eyebrow="Where it stands" title="A complete hackathon prototype, not a consumer product.">
        <P>
          I built Aura with Wasif Waseem and Huaicheng Su for the Monolith Solana Mobile Hackathon. We chose to make
          the entire exchange work: listing, escrow, handover proof, settlement, and receipt, instead of polishing
          one part for the demo. It showed that the model was technically possible. It was not deployed, has no users,
          and is not presented here as more than the prototype it was.
        </P>
      </Section>
    </ProjectPageShell>
  );
}
