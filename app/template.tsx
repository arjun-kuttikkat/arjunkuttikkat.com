import { ModePageTransition } from "../components/mode-page-transition";

export default function Template({ children }: { children: React.ReactNode }) {
  return <ModePageTransition>{children}</ModePageTransition>;
}
