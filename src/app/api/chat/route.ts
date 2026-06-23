import Anthropic from "@anthropic-ai/sdk";
import type { NextRequest } from "next/server";
import { buildSystemPrompt } from "@/lib/chat-context";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lazy-init: instantiating at module scope throws during Vercel's static
// analysis when ANTHROPIC_API_KEY isn't injected yet at build time.
let anthropicClient: Anthropic | null = null;
function getClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic(); // reads ANTHROPIC_API_KEY from env
  }
  return anthropicClient;
}

// Per-IP rate limit (in-memory — fine for low-traffic portfolio, resets on cold start)
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const ipRequests = new Map<string, { count: number; resetAt: number }>();

// Validation caps
const MAX_MESSAGE_LENGTH = 1500;
// Hard ceiling on incoming history — anything past this is silently dropped
// from the *front* (oldest first) rather than rejected. Keeps costs bounded
// without surfacing a "conversation too long" error to the visitor.
const MAX_HISTORY = 40;
const MAX_OUTPUT_TOKENS = 512;

type IncomingMessage = { role: "user" | "assistant"; content: string };

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

// Periodically prune expired entries so the Map doesn't grow unboundedly.
if (typeof globalThis !== "undefined" && !(globalThis as { __chatCleanupStarted?: boolean }).__chatCleanupStarted) {
  (globalThis as { __chatCleanupStarted?: boolean }).__chatCleanupStarted = true;
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

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed, remaining } = checkRateLimit(ip);
  if (!allowed) {
    return jsonError(
      "You're sending messages a bit too quickly. Try again in a few minutes.",
      429,
    );
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

  const {
    messages: rawMessages,
    currentSlug,
  } = body as { messages?: unknown; currentSlug?: unknown };

  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return jsonError("messages array is required.", 400);
  }
  // Trim oldest turns instead of rejecting — keeps the most recent context
  // intact, which is what matters for the model's next reply.
  let trimmedRaw =
    rawMessages.length > MAX_HISTORY
      ? rawMessages.slice(-MAX_HISTORY)
      : rawMessages;
  // Anthropic requires the first message to be from `user`. If trimming
  // started us on an assistant turn, drop leading assistants.
  while (
    trimmedRaw.length > 0 &&
    (trimmedRaw[0] as { role?: unknown })?.role === "assistant"
  ) {
    trimmedRaw = trimmedRaw.slice(1);
  }

  const messages: IncomingMessage[] = [];
  for (const m of trimmedRaw) {
    if (
      !m ||
      typeof m !== "object" ||
      typeof (m as { content?: unknown }).content !== "string" ||
      typeof (m as { role?: unknown }).role !== "string"
    ) {
      return jsonError("Invalid message format.", 400);
    }
    const msg = m as { role: string; content: string };
    if (msg.role !== "user" && msg.role !== "assistant") {
      return jsonError("Invalid message role.", 400);
    }
    if (msg.content.length > MAX_MESSAGE_LENGTH) {
      return jsonError("Message too long.", 400);
    }
    if (msg.content.trim().length === 0) {
      return jsonError("Message cannot be empty.", 400);
    }
    messages.push({ role: msg.role, content: msg.content });
  }

  const slug = typeof currentSlug === "string" ? currentSlug : null;
  const { cached, pageContext } = buildSystemPrompt(slug);

  try {
    const stream = getClient().messages.stream({
      model: "claude-haiku-4-5",
      max_tokens: MAX_OUTPUT_TOKENS,
      system: [
        // Cached prefix — bio + all project context. Stable across requests
        // for the 5-minute TTL window.
        {
          type: "text",
          text: cached,
          cache_control: { type: "ephemeral" },
        },
        // Volatile tail — page context changes per request, not cached.
        {
          type: "text",
          text: pageContext,
        },
      ],
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream<Uint8Array>({
      start(controller) {
        stream.on("text", (delta: string) => {
          controller.enqueue(encoder.encode(delta));
        });
        stream
          .finalMessage()
          .then(() => controller.close())
          .catch((err) => {
            console.error("Stream finalization error:", err);
            try {
              controller.close();
            } catch {
              /* already closed */
            }
          });
      },
      cancel() {
        stream.controller?.abort();
      },
    });

    return new Response(readable, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-cache, no-transform",
        "x-ratelimit-remaining": String(remaining),
      },
    });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return jsonError("Service is busy right now — try again in a moment.", 429);
    }
    if (err instanceof Anthropic.AuthenticationError) {
      console.error("Anthropic auth error — check ANTHROPIC_API_KEY");
      return jsonError("AI service is unavailable.", 500);
    }
    if (err instanceof Anthropic.APIError) {
      console.error("Anthropic API error:", err.status, err.message);
      return jsonError("AI service error. Try again shortly.", 502);
    }
    console.error("Unexpected chat route error:", err);
    return jsonError("Something went wrong.", 500);
  }
}
