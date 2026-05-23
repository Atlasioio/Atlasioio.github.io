import { NextResponse } from "next/server";
import OpenAI from "openai";

// Hard block list — slurs and severely degrading content only.
// Mild expletives (shit, fuck, damn, etc.) flow through to the AI which can
// map them to fury or punk if context warrants.
const PROFANITY = new Set([
  "faggot", "faggots", "fag", "fags",
  "retard", "retards", "retarded",
  "cunt", "cunts",
  "tranny", "trannies",
]);

function isInappropriate(input: string): boolean {
  const tokens = input.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/);
  return tokens.some((t) => PROFANITY.has(t));
}

const VIBE_IDS = [
  "refinement",
  "punk",
  "space",
  "dread",
  "tender",
  "joy",
  "strength",
  "fury",
  "calm",
  "vintage",
  "glitch",
  "romance",
  "playful",
  "mystery",
  "dreamy",
  "techno",
  "rustic",
  "minimal",
  "cosmic",
  "neutral",
] as const;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ vibe: "neutral" });
  }

  const input =
    typeof body === "object" && body !== null && "input" in body
      ? String((body as { input: unknown }).input ?? "")
      : "";

  const trimmed = input.trim();
  if (!trimmed) return NextResponse.json({ vibe: "neutral" });

  // Hard gate: profanity, slurs, insults, NSFW → neutral, no API call.
  if (isInappropriate(trimmed)) {
    return NextResponse.json({ vibe: "neutral" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ vibe: null, fallback: true });
  }

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
`You map a word, phrase, or short sentence to ONE typographic mood that best fits its feeling.

Respond with ONLY ONE word from this list (lowercase, no punctuation, no quotes, no explanation):
${VIBE_IDS.join(", ")}

Mood meanings:
- refinement: elegant, luxurious, fine, polished, couture, sophisticated
- punk: aggressive, rebellious, loud, gritty, raw, chaotic
- space: cosmic, vast, distant, sci-fi (NASA, planets, satellites)
- dread: scary, grim, ominous, doomed, horror, eerie
- tender: soft, warm, kind, intimate, caring, gentle
- joy: happy, sunny, upbeat, cheerful, bright, lively
- strength: powerful, solid, mighty, durable, tough
- fury: angry, raging, hostile, vengeful, livid (more visceral than punk's chaotic rebellion)
- calm: peaceful, still, quiet, restful, balanced, zen
- vintage: old-school, retro, antique, nostalgic, sepia
- glitch: broken, digital error, scrambled, corrupted
- romance: love, passion, kissing, hearts, longing
- playful: childlike, silly, toys, games, candy, fun-cute
- mystery: enigmatic, hidden, noir, occult, secrets
- dreamy: floaty, ethereal, sleepy, hazy, surreal
- techno: digital, robotic, synthetic, computer, futuristic-cold
- rustic: woody, farm, handmade, earthy, raw natural
- minimal: spare, clean, swiss, less-is-more, white-space, plain, ordinary, simple, everyday, abstract concepts, ordinary objects, books/writing/literature, intellectual/scholarly, completion/done/finished, casual acknowledgments — minimal is the DEFAULT for any word that doesn't strongly evoke another mood
- cosmic: transcendent, infinite, universe, deep-purple, mystical
- neutral: ONLY use for slurs, hate speech, sexually exploitative content, or genuinely harmful input — NEVER for ordinary words. Mild profanity ("shit", "fuck", "damn") still maps to fury/punk if context fits.

CRITICAL RULES:
1. NEVER return "neutral" for an ordinary word, even if abstract, mundane, or hard to classify. Pick the closest mood; default to "minimal" when truly ambiguous.
2. Examples of words that should NOT be neutral: "novel" → vintage, "write" → minimal, "okay" → minimal, "finished" → minimal, "chair" → minimal, "monday" → minimal, "library" → vintage, "essay" → minimal, "thought" → minimal, "math" → techno or minimal.
3. Always pick the closest fit even when imperfect. If a word feels happy → joy. If grand or majestic → cosmic. Unsure between two → pick the one whose connotation matches better.`,
        },
        { role: "user", content: 'luxury watch' },
        { role: "assistant", content: 'refinement' },
        { role: "user", content: 'smash' },
        { role: "assistant", content: 'punk' },
        { role: "user", content: 'midnight' },
        { role: "assistant", content: 'mystery' },
        { role: "user", content: 'spring meadow' },
        { role: "assistant", content: 'joy' },
        { role: "user", content: 'haunted' },
        { role: "assistant", content: 'dread' },
        { role: "user", content: 'first kiss' },
        { role: "assistant", content: 'romance' },
        { role: "user", content: 'meditation' },
        { role: "assistant", content: 'calm' },
        { role: "user", content: 'farmhouse' },
        { role: "assistant", content: 'rustic' },
        { role: "user", content: 'server crash' },
        { role: "assistant", content: 'glitch' },
        { role: "user", content: 'floating clouds' },
        { role: "assistant", content: 'dreamy' },
        { role: "user", content: 'nebula' },
        { role: "assistant", content: 'cosmic' },
        { role: "user", content: 'swiss design' },
        { role: "assistant", content: 'minimal' },
        { role: "user", content: 'i hate everything' },
        { role: "assistant", content: 'fury' },
        { role: "user", content: 'novel' },
        { role: "assistant", content: 'vintage' },
        { role: "user", content: 'write' },
        { role: "assistant", content: 'minimal' },
        { role: "user", content: 'okay' },
        { role: "assistant", content: 'minimal' },
        { role: "user", content: 'finished' },
        { role: "assistant", content: 'minimal' },
        { role: "user", content: 'library' },
        { role: "assistant", content: 'vintage' },
        { role: "user", content: 'thought' },
        { role: "assistant", content: 'minimal' },
        { role: "user", content: 'monday morning' },
        { role: "assistant", content: 'calm' },
        { role: "user", content: 'art' },
        { role: "assistant", content: 'refinement' },
        { role: "user", content: trimmed },
      ],
      max_tokens: 6,
      temperature: 0.15,
    });

    const raw = (completion.choices[0]?.message?.content ?? "")
      .toLowerCase()
      .replace(/[^a-z]/g, "");
    const vibe = (VIBE_IDS as readonly string[]).includes(raw) ? raw : "neutral";
    return NextResponse.json({ vibe });
  } catch {
    return NextResponse.json({ vibe: null, error: "classify_failed" }, { status: 500 });
  }
}
