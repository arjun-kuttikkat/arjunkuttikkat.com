"use client";

import { useCallback, useState } from "react";
import {
  FaCheck,
  FaEnvelope,
  FaFacebookF,
  FaHackerNews,
  FaLinkedinIn,
  FaLink,
  FaRedditAlien,
  FaTelegram,
  FaWhatsapp,
  FaXTwitter
} from "react-icons/fa6";

type BlogShareBarProps = {
  url: string;
  title: string;
};

export function BlogShareBar({ url, title }: BlogShareBarProps) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [url]);

  const enc = encodeURIComponent;
  const shareText = `${title} ${url}`;

  const items = [
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`,
      Icon: FaXTwitter
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
      Icon: FaLinkedinIn
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
      Icon: FaFacebookF
    },
    {
      label: "Reddit",
      href: `https://www.reddit.com/submit?url=${enc(url)}&title=${enc(title)}`,
      Icon: FaRedditAlien
    },
    {
      label: "Hacker News",
      href: `https://news.ycombinator.com/submitlink?u=${enc(url)}&t=${enc(title)}`,
      Icon: FaHackerNews
    },
    {
      label: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${enc(shareText)}`,
      Icon: FaWhatsapp
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${enc(url)}&text=${enc(title)}`,
      Icon: FaTelegram
    },
    {
      label: "Email",
      href: `mailto:?subject=${enc(title)}&body=${enc(shareText)}`,
      Icon: FaEnvelope
    }
  ] as const;

  const buttonClass =
    "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-zinc-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.06] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45";
  const iconClass = "h-[1.05rem] w-[1.05rem]";

  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.08] pt-8">
      <span className="mr-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Share
      </span>
      <button
        type="button"
        onClick={() => void copy()}
        aria-label={copied ? "Link copied" : "Copy link"}
        title={copied ? "Link copied" : "Copy link"}
        className={buttonClass}
      >
        {copied ? (
          <FaCheck className={iconClass} aria-hidden="true" />
        ) : (
          <FaLink className={iconClass} aria-hidden="true" />
        )}
      </button>
      <div className="flex flex-wrap items-center gap-2">
        {items.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target={label === "Email" ? undefined : "_blank"}
            rel={label === "Email" ? undefined : "noopener noreferrer"}
            aria-label={`Share on ${label}`}
            title={`Share on ${label}`}
            className={buttonClass}
          >
            <Icon className={iconClass} aria-hidden="true" />
          </a>
        ))}
      </div>
    </div>
  );
}
