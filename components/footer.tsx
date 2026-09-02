import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { FaGithub, FaLinkedinIn, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { navLinks, socialLinks } from "../lib/data";
import { edgazeFooterLinks } from "../lib/edgaze";
import { getProjectsSorted } from "../lib/projects";
import { NewsletterSignup } from "./newsletter-signup";

const footerLinkClass =
  "text-[0.9375rem] text-zinc-400 transition-colors duration-200 hover:text-zinc-100 sm:text-sm";

const sectionTitleClass = "text-[0.6875rem] font-medium tracking-wide text-zinc-500";
const socialButtonClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-zinc-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.06] hover:text-zinc-100";
const socialIconClass = "h-[1.15rem] w-[1.15rem]";

const socialIcons = {
  YouTube: <FaYoutube className={socialIconClass} aria-hidden="true" />,
  GitHub: <FaGithub className={socialIconClass} aria-hidden="true" />,
  LinkedIn: <FaLinkedinIn className={socialIconClass} aria-hidden="true" />,
  Edgaze: (
    <Image
      src="/edgaze-mark.png"
      alt=""
      width={26}
      height={26}
      className="h-[1.35rem] w-[1.35rem] object-contain grayscale brightness-150 opacity-80"
      aria-hidden="true"
    />
  ),
  X: <FaXTwitter className={socialIconClass} aria-hidden="true" />
} satisfies Record<(typeof socialLinks)[number]["label"], ReactNode>;

export function Footer() {
  const projects = getProjectsSorted();

  return (
    <footer className="border-t border-white/[0.08] bg-black/20 px-5 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-14 lg:px-10 lg:pb-16 lg:pt-20">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-6 border-b border-white/[0.07] pb-8 sm:flex-row sm:items-center sm:gap-10 sm:pb-12">
          <Link
            href="/"
            className="group inline-flex items-center gap-3.5 text-white transition-opacity hover:opacity-90 sm:gap-4"
          >
            <Image
              src="/logo.png"
              alt="Arjun Kuttikkat"
              width={84}
              height={84}
              className="h-[3.75rem] w-[3.75rem] shrink-0 object-contain transition-transform duration-300 group-hover:scale-[1.02] sm:h-[4.5rem] sm:w-[4.5rem] lg:h-[5.25rem] lg:w-[5.25rem]"
            />
            <span className="text-[1.2rem] font-medium tracking-[-0.03em] text-zinc-100 sm:text-[1.35rem] lg:text-[1.5rem]">
              Arjun Kuttikkat
            </span>
          </Link>
          <p className="max-w-md text-[0.9375rem] leading-[1.65] text-zinc-500 sm:ml-auto sm:text-right sm:text-sm lg:max-w-sm">
            Founder of Edgaze. Project records, writing, and a newsletter when there is something to report.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 sm:py-14 lg:grid-cols-12 lg:gap-10 lg:py-16">
          <div className="col-span-1 sm:col-span-1 lg:col-span-2">
            <p className={sectionTitleClass}>Navigate</p>
            <ul className="mt-3 space-y-2 sm:mt-5 sm:space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={footerLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 sm:col-span-1 lg:col-span-3">
            <p className={sectionTitleClass}>Projects</p>
            <ul className="mt-3 space-y-2 sm:mt-5 sm:space-y-3">
              {projects.map((p) => (
                <li key={p.slug}>
                  <Link href={`/projects/${p.slug}`} className={footerLinkClass}>
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-2 lg:col-span-3">
            <p className={sectionTitleClass}>Edgaze</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:mt-5 sm:block sm:space-y-3">
              {edgazeFooterLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={footerLinkClass}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 border-t border-white/[0.06] pt-8 sm:col-span-2 sm:border-t-0 sm:pt-0 lg:col-span-4">
            <h2 className="text-[1.2rem] font-medium tracking-[-0.03em] text-white sm:text-[1.35rem]">
              Newsletter
            </h2>
            <p className="mt-3 max-w-md text-[0.9375rem] leading-[1.7] text-zinc-400 sm:mt-5 sm:text-[0.9rem] sm:leading-relaxed">
              Infrequent notes on building Edgaze: what shipped, what broke, what changed.
            </p>
            <div className="mt-6">
              <NewsletterSignup variant="footer" signupLocation="footer" />
            </div>
            <Link
              href="/newsletter"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-zinc-400 underline decoration-cyan-400/25 underline-offset-[6px] transition-colors hover:text-zinc-200 hover:decoration-pink-400/45 sm:mt-6"
            >
              About the newsletter
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-7 border-t border-white/[0.07] pt-8 sm:gap-6 sm:pt-9 lg:flex-row lg:items-center lg:justify-between lg:pt-10">
          <p className="text-center text-[0.8125rem] leading-relaxed text-zinc-500 lg:max-w-[28rem] lg:text-left">
            © {new Date().getFullYear()} Edge Platforms, Inc. All rights Reserved Worldwide.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 sm:gap-x-6 lg:justify-end">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                title={link.label}
                className={socialButtonClass}
              >
                {socialIcons[link.label]}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
