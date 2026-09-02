import { NextResponse } from "next/server";
import { z } from "zod";
import { getNewsletterClientKey, newsletterRateLimitOk } from "../../../../lib/newsletter/rate-limit";

const BREVO_BASE = "https://api.brevo.com/v3";

const bodySchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(320)
    .email("Enter a valid email"),
  signupLocation: z.enum(["footer", "newsletter_page"]).default("newsletter_page")
});

function brevoEnabled(): boolean {
  const flag = process.env.BREVO_NEWSLETTER_ENABLED;
  if (flag === undefined || flag === "") return true;
  return flag === "true" || flag === "1";
}

function listId(): number | null {
  const raw = process.env.BREVO_LIST_ID?.trim();
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

type BrevoErrorBody = { code?: string; message?: string };

async function brevoGetContact(apiKey: string, email: string): Promise<boolean> {
  const url = `${BREVO_BASE}/contacts/${encodeURIComponent(email)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      "api-key": apiKey
    },
    next: { revalidate: 0 }
  });
  if (res.status === 200) return true;
  if (res.status === 404) return false;
  // If lookup fails unexpectedly, treat as unknown — POST may still succeed
  return false;
}

async function brevoCreateOrUpdateContact(
  apiKey: string,
  email: string,
  listIds: number[],
  signupLocation: string
): Promise<{ ok: true } | { ok: false; status: number; body: BrevoErrorBody | null }> {
  const payload: Record<string, unknown> = {
    email,
    listIds,
    updateEnabled: true
  };

  const attrs: Record<string, string> = {
    SOURCE: "arjunkuttikkat.com",
    SIGNUP_LOCATION: signupLocation
  };
  payload.attributes = attrs;

  const res = await fetch(`${BREVO_BASE}/contacts`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey
    },
    body: JSON.stringify(payload),
    next: { revalidate: 0 }
  });

  if (res.ok) return { ok: true };

  let parsed: BrevoErrorBody | null = null;
  try {
    parsed = (await res.json()) as BrevoErrorBody;
  } catch {
    parsed = null;
  }

  // Unknown contact attributes: retry once without attributes (Brevo requires attributes to exist on the account)
  if (
    res.status === 400 &&
    parsed?.message &&
    /attribute/i.test(parsed.message) &&
    payload.attributes
  ) {
    const retry = await fetch(`${BREVO_BASE}/contacts`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify({
        email,
        listIds,
        updateEnabled: true
      }),
      next: { revalidate: 0 }
    });
    if (retry.ok) return { ok: true };
    try {
      parsed = (await retry.json()) as BrevoErrorBody;
    } catch {
      parsed = null;
    }
    return { ok: false, status: retry.status, body: parsed };
  }

  return { ok: false, status: res.status, body: parsed };
}

export async function POST(request: Request) {
  if (!brevoEnabled()) {
    return NextResponse.json(
      { ok: false, code: "disabled" as const, error: "Newsletter signup is paused right now." },
      { status: 503 }
    );
  }

  const apiKey = process.env.BREVO_API_KEY?.trim();
  const lid = listId();
  if (!apiKey || !lid) {
    return NextResponse.json(
      { ok: false, code: "config" as const, error: "Newsletter is not configured." },
      { status: 503 }
    );
  }

  const ip = getNewsletterClientKey(request);
  if (!newsletterRateLimitOk(ip)) {
    return NextResponse.json(
      { ok: false, code: "rate_limit" as const, error: "Too many attempts. Try again in a few minutes." },
      { status: 429 }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "validation" as const, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid input";
    return NextResponse.json({ ok: false, code: "validation" as const, error: msg }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const signupLocation = parsed.data.signupLocation;

  const existed = await brevoGetContact(apiKey, email);
  const result = await brevoCreateOrUpdateContact(apiKey, email, [lid], signupLocation);

  if (!result.ok) {
    const code = result.body?.code;
    if (code === "duplicate_parameter") {
      return NextResponse.json(
        {
          ok: true,
          state: "already_subscribed" as const,
          message: "You are already on the list."
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        ok: false,
        code: "upstream" as const,
        error: "Could not save your email. Try again in a moment."
      },
      { status: 502 }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      state: existed ? ("already_subscribed" as const) : ("subscribed" as const),
      message: existed
        ? "You are already subscribed. List updated."
        : "You are in. Watch your inbox."
    },
    { status: 200 }
  );
}
