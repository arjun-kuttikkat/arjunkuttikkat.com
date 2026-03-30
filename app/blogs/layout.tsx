import type { ReactNode } from "react";

export default function BlogsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="blog-area min-h-screen bg-[#040406] text-[#ececf1]">
      {children}
    </div>
  );
}
