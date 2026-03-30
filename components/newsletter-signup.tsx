"use client";

import { useCallback, useEffect, useId, useState } from "react";

export type NewsletterSignupVariant = "full" | "premium" | "footer";

type UiState = "idle" | "loading" | "success_new" | "success_existing" | "error";

type ApiOk = {
  ok: true;
  state: "subscribed" | "already_subscribed";
  message?: string;
};

type ApiErr = {
  ok: false;
  code?: string;
  error?: string;
};

export type NewsletterSignupProps = {
  variant: NewsletterSignupVariant;
  signupLocation: "footer" | "newsletter_page";
  className?: string;
};

const inputInner =
  "w-full min-w-0 flex-1 bg-transparent text-zinc-100 outline-none placeholder:text-zinc-500";

const shellFocus =
  "rounded-xl border border-white/[0.1] bg-black/40 backdrop-blur-md transition-[border-color,box-shadow] duration-300 focus-within:border-cyan-300/30 focus-within:shadow-[0_0_0_1px_rgba(34,211,238,0.1),0_12px_40px_rgba(0,0,0,0.35)]";

const premiumShell =
  "group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-white/[0.14] bg-[linear-gradient(168deg,rgba(255,255,255,0.1)_0%,rgba(34,211,238,0.05)_18%,rgba(244,114,182,0.04)_32%,rgba(255,255,255,0.02)_48%,rgba(0,0,0,0.5)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.35),0_0_0_1px_rgba(34,211,238,0.07),0_32px_100px_rgba(0,0,0,0.55),0_0_50px_rgba(34,211,238,0.08),0_0_70px_rgba(244,114,182,0.05)] backdrop-blur-2xl transition-[border-color,box-shadow] duration-500 focus-within:border-cyan-200/35 focus-within:shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_0_0_1px_rgba(34,211,238,0.28),0_0_80px_rgba(34,211,238,0.14),0_0_90px_rgba(244,114,182,0.1),0_32px_100px_rgba(0,0,0,0.55)] lg:flex-row lg:items-stretch lg:rounded-[1.75rem]";

const premiumInput =
  "min-h-[3.85rem] w-full min-w-0 flex-1 border-0 bg-transparent px-6 py-5 text-lg leading-snug tracking-[-0.025em] text-zinc-50 outline-none placeholder:text-zinc-500/90 sm:min-h-[4.1rem] sm:px-7 sm:text-[1.125rem] lg:min-h-[4.65rem] lg:px-9 lg:py-6 lg:text-xl lg:tracking-[-0.03em] lg:border-r lg:border-white/[0.12]";

const premiumButton =
  "relative inline-flex min-h-[3.85rem] w-full shrink-0 items-center justify-center overflow-hidden rounded-b-[1.45rem] border-t border-white/[0.14] bg-[linear-gradient(168deg,rgba(165,243,252,0.42)_0%,rgba(34,211,238,0.48)_30%,rgba(244,114,182,0.44)_70%,rgba(236,72,153,0.38)_100%)] px-8 text-lg font-semibold tracking-[-0.025em] text-zinc-950 shadow-[inset_0_2px_0_rgba(255,255,255,0.45),inset_0_-12px_28px_rgba(15,23,42,0.22),0_12px_40px_rgba(34,211,238,0.3),0_0_32px_rgba(244,114,182,0.18),0_4px_0_rgba(15,23,42,0.35)] transition-[transform,filter,box-shadow] duration-300 hover:brightness-[1.05] hover:shadow-[inset_0_2px_0_rgba(255,255,255,0.55),inset_0_-12px_28px_rgba(15,23,42,0.18),0_16px_56px_rgba(34,211,238,0.36),0_0_52px_rgba(244,114,182,0.28)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45 sm:min-h-[4.1rem] sm:text-[1.125rem] lg:min-h-0 lg:w-auto lg:min-w-[15rem] lg:rounded-none lg:rounded-r-[1.75rem] lg:border-l lg:border-t-0 lg:border-white/[0.14] lg:px-11 lg:text-xl";

/** No outer card: underline field + glossy CTA, aligned to site cyan/pink */
const footerFieldWrap =
  "relative min-w-0 flex-1 transition-[box-shadow] duration-300 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:rounded-full after:bg-gradient-to-r after:from-cyan-400/50 after:via-cyan-300/35 after:to-pink-400/45 after:opacity-0 after:transition-opacity after:duration-300 focus-within:after:opacity-100 sm:border-b-0 sm:border-r sm:border-white/[0.08] sm:pr-4 sm:after:hidden";

const footerInputClass =
  "w-full min-w-0 border-0 bg-transparent py-3.5 pl-0 pr-2 text-[0.9375rem] font-medium tracking-[-0.02em] text-zinc-100 outline-none placeholder:text-zinc-500 placeholder:font-normal sm:py-4 sm:pr-3 sm:text-base";

const footerButtonClass =
  "group/footer-cta relative inline-flex min-h-[2.875rem] w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[linear-gradient(168deg,rgba(165,243,252,0.4)_0%,rgba(34,211,238,0.46)_38%,rgba(244,114,182,0.42)_100%)] px-6 text-[0.8125rem] font-semibold tracking-[-0.02em] text-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.42),0_6px_22px_rgba(34,211,238,0.2),0_0_20px_rgba(244,114,182,0.12)] transition-[filter,transform,box-shadow] duration-300 hover:brightness-[1.06] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.52),0_10px_32px_rgba(34,211,238,0.26),0_0_28px_rgba(244,114,182,0.18)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45 sm:min-h-[3.125rem] sm:w-auto sm:min-w-[9.25rem] sm:rounded-lg sm:px-7 sm:text-sm";

export function NewsletterSignup({ variant, signupLocation, className = "" }: NewsletterSignupProps) {
  const inputId = useId();
  const statusId = useId();
  const [email, setEmail] = useState("");
  const [ui, setUi] = useState<UiState>("idle");
  const [errorText, setErrorText] = useState<string | null>(null);

  const loading = ui === "loading";
  const locked = loading || ui === "success_new" || ui === "success_existing";
  const showSuccessModal = ui === "success_new" || ui === "success_existing";

  const resetIdle = useCallback(() => {
    setUi("idle");
    setErrorText(null);
  }, []);

  const closeSuccessModal = useCallback(() => {
    setUi("idle");
    setEmail("");
  }, []);

  useEffect(() => {
    if (!showSuccessModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showSuccessModal]);

  useEffect(() => {
    if (!showSuccessModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSuccessModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showSuccessModal, closeSuccessModal]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setErrorText(
        variant === "premium" || variant === "footer"
          ? "Add your email and I will take it from there."
          : "Please enter your email."
      );
      setUi("error");
      return;
    }

    setUi("loading");
    setErrorText(null);

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: trimmed, signupLocation })
      });

      const data = (await res.json()) as ApiOk | ApiErr;

      if (!res.ok || !data.ok) {
        const err = data as ApiErr;
        setErrorText(err.error ?? "Something went wrong.");
        setUi("error");
        return;
      }

      const ok = data as ApiOk;
      if (ok.state === "already_subscribed") {
        setUi("success_existing");
      } else {
        setUi("success_new");
      }
    } catch {
      setErrorText("Network error. Try again.");
      setUi("error");
    }
  };

  const isPremium = variant === "premium";
  const isFooter = variant === "footer";

  const inputClass = `min-h-12 ${inputInner} px-4 py-3 text-base sm:text-[0.95rem]`;

  const buttonClass =
    "inline-flex w-full shrink-0 items-center justify-center rounded-xl border border-cyan-300/45 bg-[linear-gradient(130deg,rgba(34,211,238,0.22),rgba(244,114,182,0.2))] px-6 py-3.5 text-sm font-medium text-white shadow-[0_16px_48px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-cyan-200/70 hover:from-cyan-300/32 hover:to-pink-300/28 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:min-w-[9.5rem]";

  const statusColor =
    ui === "error"
      ? "text-rose-300/95"
      : ui === "success_new" || ui === "success_existing"
        ? "text-emerald-300/95"
        : "text-zinc-500";

  const statusMessage = (() => {
    if (showSuccessModal) return "";
    if (ui === "error" && errorText) return errorText;
    if (loading) return isPremium ? "Locking this in…" : isFooter ? "Sending…" : "Sending…";
    if (isPremium && email.trim().length > 0)
      return "Subscribe when it looks right. You will get a real confirmation.";
    if (isPremium)
      return "No spam. No schedule. I only send when there is something worth reading.";
    if (isFooter)
      return "No spam. One click to leave. Only when it is worth your inbox.";
    return "No spam. Unsubscribe anytime.";
  })();

  const onNewsletterPage = signupLocation === "newsletter_page";

  const successModalCopy =
    onNewsletterPage && ui === "success_existing"
      ? {
          title: "You are already on the list",
          body: "Same rules apply: you will only hear from me when there is real signal, not a calendar."
        }
      : onNewsletterPage && ui === "success_new"
        ? {
            title: "You are in",
            body: "Confirm the note in your inbox. After that, silence until I have something that earned its place there."
          }
        : ui === "success_existing"
          ? {
              title: "You are already subscribed",
              body: "No action needed. You will keep receiving updates when they go out."
            }
          : {
              title: "You are subscribed",
              body: "Thank you. Watch your inbox for a confirmation and future notes."
            };

  const statusTextClass = isPremium
    ? `text-sm leading-relaxed text-center sm:text-[0.9375rem] ${statusColor}`
    : isFooter
      ? `text-[0.6875rem] leading-relaxed tracking-wide text-zinc-500 sm:text-xs ${statusColor}`
      : `text-xs ${statusColor}`;

  const formBlockFooter = (
    <form onSubmit={onSubmit} className="space-y-2.5" aria-busy={loading} noValidate>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-0">
        <div className={`${footerFieldWrap} border-b border-white/[0.1] pb-px sm:pb-0`}>
          <label htmlFor={inputId} className="sr-only">
            Email address
          </label>
          <input
            id={inputId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Email address"
            value={email}
            disabled={locked}
            onChange={(ev) => {
              setEmail(ev.target.value);
              if (ui === "error") resetIdle();
            }}
            className={footerInputClass}
            aria-invalid={ui === "error"}
            aria-describedby={statusId}
          />
        </div>
        <div className="flex shrink-0 sm:items-end sm:pl-3">
          <button type="submit" disabled={locked} className={footerButtonClass}>
            <span
              className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.18] transition-opacity duration-500 group-hover/footer-cta:opacity-[0.28]"
              aria-hidden
            >
              <span className="newsletter-cta-shimmer-track absolute -inset-y-2 left-0 w-[55%] max-w-[9rem] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </span>
            <span className="relative z-10">{loading ? "Sending…" : locked ? "Done" : "Subscribe"}</span>
          </button>
        </div>
      </div>
      <p id={statusId} className={`transition-colors duration-200 ${statusTextClass}`} role="status" aria-live="polite">
        {statusMessage}
      </p>
    </form>
  );

  const formBlockPremium = (
    <form onSubmit={onSubmit} className="space-y-3" aria-busy={loading} noValidate>
      <div className={premiumShell}>
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Enter your email"
          value={email}
          disabled={locked}
          onChange={(ev) => {
            setEmail(ev.target.value);
            if (ui === "error") resetIdle();
          }}
          className={premiumInput}
          aria-invalid={ui === "error"}
          aria-describedby={statusId}
        />
        <button type="submit" disabled={locked} className={premiumButton}>
          <span
            className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.2] transition-opacity duration-500 group-hover:opacity-[0.32]"
            aria-hidden
          >
            <span className="newsletter-cta-shimmer-track absolute -inset-y-3 left-0 w-[55%] max-w-[12rem] bg-gradient-to-r from-transparent via-white/35 to-transparent" />
          </span>
          <span className="relative z-10">{loading ? "Sending…" : locked ? "Done" : "Subscribe"}</span>
        </button>
      </div>

      <p id={statusId} className={`transition-colors duration-200 ${statusTextClass}`} role="status" aria-live="polite">
        {statusMessage}
      </p>
    </form>
  );

  const formBlockFull = (
    <form onSubmit={onSubmit} className="space-y-3" aria-busy={loading} noValidate>
      <div className={`flex flex-col gap-2 p-1 sm:flex-row sm:items-stretch ${shellFocus} focus-within:shadow-[0_0_0_1px_rgba(34,211,238,0.12),0_16px_48px_rgba(0,0,0,0.38)]`}>
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email address"
          value={email}
          disabled={locked}
          onChange={(ev) => {
            setEmail(ev.target.value);
            if (ui === "error") resetIdle();
          }}
          className={inputClass}
          aria-invalid={ui === "error"}
          aria-describedby={statusId}
        />
        <div className="flex sm:shrink-0 sm:items-center sm:p-1">
          <button type="submit" disabled={locked} className={buttonClass}>
            {loading ? "Sending…" : locked ? "Done" : "Subscribe"}
          </button>
        </div>
      </div>

      <p id={statusId} className={`transition-colors duration-200 ${statusTextClass}`} role="status" aria-live="polite">
        {statusMessage}
      </p>
    </form>
  );

  return (
    <div className={className}>
      {showSuccessModal ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={closeSuccessModal}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="newsletter-success-title"
            className={`relative w-full max-w-md rounded-[1.35rem] bg-zinc-950/95 p-7 shadow-[0_28px_100px_rgba(0,0,0,0.72)] sm:p-8 ${
              onNewsletterPage
                ? "border border-white/[0.1] ring-1 ring-cyan-400/15 ring-offset-0 [box-shadow:0_0_0_1px_rgba(34,211,238,0.08),0_28px_100px_rgba(0,0,0,0.72),inset_0_1px_0_rgba(255,255,255,0.06)]"
                : isFooter
                  ? "border border-white/[0.1] [box-shadow:0_0_0_1px_rgba(34,211,238,0.07),0_0_48px_rgba(244,114,182,0.08),0_28px_100px_rgba(0,0,0,0.72),inset_0_1px_0_rgba(255,255,255,0.05)]"
                  : "border border-white/[0.12] ring-1 ring-white/[0.06]"
            }`}
          >
            <div
              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ring-1 ${
                onNewsletterPage ? "bg-emerald-500/12 ring-emerald-400/30" : "bg-emerald-500/15 ring-emerald-400/25"
              }`}
            >
              <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2
              id="newsletter-success-title"
              className={`mt-6 text-center tracking-[-0.02em] text-white sm:text-xl ${
                onNewsletterPage ? "text-2xl font-semibold tracking-tight" : isFooter ? "text-lg font-semibold tracking-tight" : "text-lg font-medium"
              }`}
            >
              {successModalCopy.title}
            </h2>
            <p className="mt-3 text-center text-sm leading-relaxed text-zinc-400">{successModalCopy.body}</p>
            <button
              type="button"
              onClick={closeSuccessModal}
              className="mt-7 w-full rounded-xl border border-white/15 bg-white/[0.06] py-3 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/[0.1] sm:mt-8"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      {isPremium ? (
        formBlockPremium
      ) : isFooter ? (
        formBlockFooter
      ) : (
        <>
          <div className="mb-6 space-y-2">
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-white sm:text-xl">Get the newsletter</h2>
            <p className="max-w-md text-sm leading-relaxed text-zinc-400">
              Occasional notes on building, distribution, and what is working in the wild.
            </p>
          </div>
          {formBlockFull}
          <p className="mt-4 text-sm text-zinc-500">
            From <span className="text-zinc-300">newsletters@arjunkuttikkat.com</span> when there is something worth your time.
          </p>
        </>
      )}
    </div>
  );
}
