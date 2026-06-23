import { Resend } from "resend";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lazy-init: instantiating at module scope throws during Vercel's static
// analysis of route handlers when env vars aren't injected yet.
let resendClient: Resend | null = null;
function getResend(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

// Per-IP rate limit (in-memory — fine for low-traffic portfolio, resets on cold start).
// Stricter than /api/chat since the form is an easier abuse target.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const ipRequests = new Map<string, { count: number; resetAt: number }>();

const MAX_NAME = 100;
const MAX_EMAIL = 200;
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = ipRequests.get(ip);
  if (!entry || entry.resetAt < now) {
    ipRequests.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }
  entry.count += 1;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count };
}

if (
  typeof globalThis !== "undefined" &&
  !(globalThis as { __contactCleanupStarted?: boolean }).__contactCleanupStarted
) {
  (globalThis as { __contactCleanupStarted?: boolean }).__contactCleanupStarted = true;
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of ipRequests.entries()) {
      if (entry.resetAt < now) ipRequests.delete(ip);
    }
  }, 10 * 60 * 1000);
}

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function jsonOk() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return jsonError("Too many messages. Try again in a few minutes.", 429);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON.", 400);
  }
  if (!body || typeof body !== "object") {
    return jsonError("Invalid request body.", 400);
  }

  const { name, email, subject, message, website } = body as Record<string, unknown>;

  // Honeypot: bots fill every field, real users never see this.
  // Pretend success so the bot doesn't learn to bypass it.
  if (typeof website === "string" && website.length > 0) {
    return jsonOk();
  }

  if (typeof name !== "string" || !name.trim() || name.length > MAX_NAME) {
    return jsonError("Name is required.", 400);
  }
  if (typeof email !== "string" || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
    return jsonError("Valid email is required.", 400);
  }
  if (typeof message !== "string" || !message.trim() || message.length > MAX_MESSAGE) {
    return jsonError("Message is required.", 400);
  }
  const subj =
    typeof subject === "string" ? subject.slice(0, MAX_SUBJECT).trim() : "";

  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;
  if (!to || !from || !process.env.RESEND_API_KEY) {
    console.error("Contact route misconfigured — missing env vars");
    return jsonError("Email service unavailable.", 500);
  }

  try {
    const { error } = await getResend().emails.send({
      from: `Portfolio <${from}>`,
      to,
      replyTo: email,
      subject: subj
        ? `[Portfolio] ${subj}`
        : `[Portfolio] Message from ${name}`,
      text: `From: ${name} <${email}>\nSubject: ${subj || "(none)"}\n\n${message}`,
    });
    if (error) {
      console.error("Resend error:", error);
      return jsonError("Couldn't send. Try emailing directly?", 502);
    }
    return jsonOk();
  } catch (err) {
    console.error("Contact route error:", err);
    return jsonError("Something went wrong. Try again shortly.", 500);
  }
}
