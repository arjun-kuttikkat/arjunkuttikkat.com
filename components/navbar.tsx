"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks } from "../lib/data";

const springTransition = {
  type: "spring",
  stiffness: 240,
  damping: 24
} as const;

type NavbarProps = {
  projectNav?: {
    title: string;
  };
};

function navLinkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar({ projectNav }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-[90] px-4 pt-4 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <nav
          className={`relative flex h-[4rem] items-center justify-between rounded-xl px-4 transition-all duration-300 sm:px-5 ${
            isScrolled
              ? "bg-black/72 shadow-[0_16px_42px_rgba(0,0,0,0.45)] backdrop-blur-xl"
              : "bg-black/46 backdrop-blur-lg"
          }`}
        >
          {projectNav ? (
            <>
              <Link
                href="/projects"
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-zinc-200 transition-colors hover:text-white"
              >
                <span aria-hidden>←</span>
                <span className="hidden sm:inline">Projects</span>
                <span className="sm:hidden">Back</span>
              </Link>

              <div className="min-w-0 flex-1 px-4 text-center">
                <p className="truncate text-sm font-semibold tracking-[-0.02em] text-white sm:text-[0.95rem]">
                  {projectNav.title}
                </p>
              </div>

              <Link
                href="/"
                className="shrink-0 text-sm font-medium text-zinc-200 transition-colors hover:text-white"
              >
                Home
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/"
                className="group inline-flex items-center gap-3.5 text-white transition-opacity hover:opacity-95"
              >
                <Image
                  src="/logo.png"
                  alt="Arjun Kuttikkat logo"
                  width={48}
                  height={48}
                  className="h-11 w-11 shrink-0 object-contain transition-transform duration-300 group-hover:scale-[1.02] sm:h-[3.125rem] sm:w-[3.125rem]"
                />
                <span className="text-[1.05rem] font-medium tracking-[-0.02em] text-zinc-100 sm:text-[1.12rem]">
                  Arjun Kuttikkat
                </span>
              </Link>

              <div className="hidden items-center gap-7 md:flex">
                {navLinks.map((link) => {
                  const active = navLinkActive(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-[0.8125rem] tracking-[-0.01em] transition-colors duration-200 ${
                        active ? "font-semibold text-white" : "font-medium text-zinc-400 hover:text-zinc-100"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/projects/edgaze"
                  className="hidden rounded-lg border border-white/18 bg-[linear-gradient(130deg,rgba(34,211,238,0.14),rgba(232,121,249,0.12))] px-4 py-2.5 text-[0.8125rem] font-medium text-white transition-all duration-300 hover:border-white/30 md:inline-flex"
                >
                  Explore Edgaze
                </Link>

                <button
                  type="button"
                  aria-label="Open navigation menu"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center md:hidden"
                >
                  <span className="flex w-[22px] flex-col gap-[5px]" aria-hidden>
                    <span className="block h-0.5 w-full rounded-full bg-zinc-100" />
                    <span className="block h-0.5 w-full rounded-full bg-zinc-100" />
                    <span className="block h-0.5 w-full rounded-full bg-zinc-100" />
                  </span>
                </button>
              </div>
            </>
          )}
        </nav>

        <AnimatePresence>
          {menuOpen && !projectNav ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={springTransition}
              className="mt-2 rounded-xl border border-white/14 bg-black/86 p-4 backdrop-blur-xl md:hidden"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => {
                  const active = navLinkActive(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`text-sm tracking-[-0.01em] transition-colors hover:text-white ${
                        active ? "font-semibold text-white" : "font-medium text-zinc-300"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <Link
                  href="/projects/edgaze"
                  onClick={() => setMenuOpen(false)}
                  className="mt-1 inline-flex w-fit rounded-lg border border-white/18 bg-[linear-gradient(130deg,rgba(34,211,238,0.14),rgba(232,121,249,0.12))] px-4 py-2.5 text-[0.8125rem] font-medium text-white transition-all hover:border-white/30"
                >
                  Explore Edgaze
                </Link>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}
