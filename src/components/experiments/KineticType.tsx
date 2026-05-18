"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CircleNotch, Eye, EyeSlash } from "@phosphor-icons/react/dist/ssr";
import {
  FullscreenButton,
  GlitchOverlay,
  useExperimentTakeover,
} from "./_shared";

type Vibe = {
  id: string;
  label: string;
  description: string;
  keywords: string[];
  className?: string;
  style: CSSProperties;
  bg: string;
  isDark?: boolean;
};

const VIBES: Vibe[] = [
  {
    id: "refinement",
    label: "refinement",
    description: "elegant serif · airy",
    keywords: ["refinement", "refined", "elegant", "elegance", "luxury", "luxurious", "fine", "pristine", "classic", "polished", "polish", "graceful", "sophisticated", "couture", "opulent", "exquisite", "premium", "gourmet", "tuxedo", "gala", "marble", "silk", "gold", "chandelier", "ballet", "opera", "mansion", "diamond", "pearl", "regal", "royal", "majesty", "elite", "noble", "prestige", "masterpiece", "fancy", "posh", "boutique"],
    className: "italic",
    style: { fontFamily: "var(--font-playfair)", fontWeight: 400, letterSpacing: "0.05em", color: "#1a1a1a" },
    bg: "linear-gradient(135deg, #f5efe6 0%, #ece4d4 100%)",
  },
  {
    id: "punk",
    label: "punk",
    description: "bold condensed · skewed",
    keywords: ["punk", "rebel", "rebellion", "riot", "chaos", "anarchy", "fight", "wild", "loud", "raw", "smash", "gritty", "rock", "metal", "hardcore", "mosh", "graffiti", "spike", "leather", "mohawk", "scream", "shout", "slam", "brawl", "savage", "revolt", "protest", "shred", "crush", "thrash", "vandal", "punkrock", "skate", "skateboard", "street", "rough", "noisy"],
    className: "uppercase",
    style: { fontFamily: "var(--font-bebas)", fontWeight: 400, letterSpacing: "-0.01em", color: "#fdf3e7", transform: "skewX(-6deg)" },
    bg: "linear-gradient(140deg, #1d0f0c 0%, #4a0e0a 100%)",
    isDark: true,
  },
  {
    id: "space",
    label: "space",
    description: "monospaced · wide",
    keywords: ["space", "rocket", "astronaut", "nasa", "alien", "ufo", "planet", "mars", "saturn", "venus", "jupiter", "mercury", "neptune", "uranus", "pluto", "comet", "asteroid", "moon", "orbit", "satellite", "lightyear", "telescope", "gravity", "weightless", "spacewalk", "spaceship", "lunar", "solar", "galaxy", "earth", "shuttle"],
    className: "uppercase",
    style: { fontFamily: "var(--font-mono)", fontWeight: 400, letterSpacing: "0.32em", color: "#cfd6e6" },
    bg: "linear-gradient(160deg, #0a0d1a 0%, #131b34 100%)",
    isDark: true,
  },
  {
    id: "dread",
    label: "dread",
    description: "heavy · ominous",
    keywords: ["dread", "fear", "death", "doom", "dark", "terror", "horror", "monster", "shadow", "ghost", "haunted", "grave", "nightmare", "scary", "creepy", "eerie", "ominous", "sinister", "evil", "demon", "devil", "vampire", "zombie", "skeleton", "witch", "curse", "hex", "abyss", "doomed", "despair", "tomb", "coffin", "spider", "bat", "halloween", "macabre", "grim", "menace", "dreadful"],
    className: "uppercase",
    style: { fontFamily: "var(--font-bebas)", fontWeight: 400, letterSpacing: "-0.02em", color: "#bababa", filter: "blur(0.6px)" },
    bg: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)",
    isDark: true,
  },
  {
    id: "fury",
    label: "fury",
    description: "stark heavy · burning",
    keywords: ["fury", "furious", "angry", "anger", "rage", "wrath", "hate", "hostile", "scorn", "vengeance", "burn", "blood", "boil", "livid", "war", "battle", "conflict", "kill", "destroy", "violent", "violence", "brutal", "savage", "ferocious", "vendetta", "betray", "betrayal", "scorch", "torch", "inferno", "hellfire", "ravage", "slaughter", "massacre", "carnage", "fist", "punch", "attack", "strike", "ambush", "ruin", "damned", "malice", "cruel", "cruelty", "vicious", "mad", "pissed", "argue", "argument"],
    className: "uppercase",
    style: { fontFamily: "var(--font-sans)", fontWeight: 900, letterSpacing: "0", color: "#ffd9c0" },
    bg: "linear-gradient(180deg, #6a0a0a 0%, #2a0505 100%)",
    isDark: true,
  },
  {
    id: "tender",
    label: "tender",
    description: "light italic · warm",
    keywords: ["tender", "soft", "gentle", "sweet", "warm", "kind", "hush", "cuddle", "hug", "baby", "mother", "mom", "mum", "dad", "father", "parent", "blanket", "cotton", "feather", "comfort", "embrace", "lullaby", "kindness", "compassion", "sweetness", "intimacy", "family", "friend", "friendship", "bond", "snug", "cozy", "tenderness", "caring", "softness", "nurture", "hold", "shelter"],
    className: "italic",
    style: { fontFamily: "var(--font-playfair)", fontWeight: 400, letterSpacing: "0.02em", color: "#6a2818" },
    bg: "linear-gradient(135deg, #fbe9e0 0%, #f5d4c4 100%)",
  },
  {
    id: "joy",
    label: "joy",
    description: "playful display · airy",
    keywords: ["joy", "joyful", "happy", "happiness", "fun", "play", "wonder", "bright", "sun", "sunny", "sunshine", "dance", "smile", "laugh", "delight", "glee", "cheer", "cheerful", "beam", "sparkle", "party", "celebration", "celebrate", "festival", "holiday", "birthday", "summer", "vacation", "picnic", "icecream", "rainbow", "butterfly", "flower", "bloom", "blossom", "sing", "song", "thrill", "excited", "exciting", "yay", "hooray", "woohoo", "cheers", "alive", "yes", "wonderful", "amazing", "awesome", "love"],
    style: { fontFamily: "var(--font-display)", fontWeight: 500, letterSpacing: "-0.015em", color: "#2a1a08" },
    bg: "linear-gradient(135deg, #fff0c8 0%, #ffd486 100%)",
  },
  {
    id: "strength",
    label: "strength",
    description: "bold sans · uppercase",
    keywords: ["strength", "strong", "power", "powerful", "force", "mighty", "solid", "iron", "steel", "hard", "bold", "fortress", "muscle", "athlete", "hero", "warrior", "titan", "giant", "beast", "lion", "tiger", "gorilla", "elephant", "mountain", "granite", "hammer", "anchor", "foundation", "durable", "sturdy", "robust", "tough", "fierce", "victorious", "champion", "legend", "legendary", "stand", "stance", "concrete"],
    className: "uppercase",
    style: { fontFamily: "var(--font-sans)", fontWeight: 900, letterSpacing: "-0.01em", color: "#1c1c1c" },
    bg: "linear-gradient(180deg, #d2cec4 0%, #a8a39a 100%)",
  },
  {
    id: "calm",
    label: "calm",
    description: "light sans · airy",
    keywords: ["calm", "peace", "peaceful", "still", "quiet", "rest", "breathe", "breath", "lake", "morning", "balance", "zen", "meditation", "meditate", "mindful", "serenity", "serene", "tranquil", "silence", "soothing", "harmony", "garden", "sunset", "sunrise", "dawn", "dusk", "twilight", "breeze", "willow", "lavender", "jasmine", "tea", "yoga", "sleep", "nap", "reflection", "sanctuary", "river", "pond", "moss", "fog", "mist"],
    style: { fontFamily: "var(--font-display)", fontWeight: 300, letterSpacing: "0.04em", color: "#2a3a4a" },
    bg: "linear-gradient(160deg, #d8e2e6 0%, #c2d2d8 100%)",
  },
  {
    id: "vintage",
    label: "vintage",
    description: "old serif · sepia",
    keywords: ["vintage", "old", "retro", "antique", "memory", "history", "nostalgia", "yesteryear", "faded", "sepia", "polaroid", "jukebox", "vinyl", "gramophone", "cassette", "tape", "victorian", "artdeco", "deco", "era", "grandparent", "grandma", "grandpa", "postcard", "telegram", "typewriter", "record", "heritage", "traditional", "clock", "pocketwatch", "attic", "dusty", "archive", "archival", "ancient", "diary", "journal", "newspaper", "lp", "bygone"],
    style: { fontFamily: "var(--font-playfair)", fontWeight: 700, letterSpacing: "0.01em", color: "#3d2914" },
    bg: "linear-gradient(135deg, #e9d8b8 0%, #c8a878 100%)",
  },
  {
    id: "glitch",
    label: "glitch",
    description: "monospaced · broken",
    keywords: ["glitch", "broken", "error", "bug", "crash", "static", "noise", "404", "scramble", "corrupted", "virus", "hack", "hacked", "malware", "frozen", "lag", "pixelated", "distorted", "scrambled", "fault", "defect", "bsod", "fatal", "exception", "shattered", "fragmented", "sysfail", "kernel", "panic"],
    className: "uppercase",
    style: { fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: "0.04em", color: "#00ffaa", textShadow: "2px 0 #ff0066, -2px 0 #00aaff" },
    bg: "linear-gradient(180deg, #050505 0%, #0a0a14 100%)",
    isDark: true,
  },
  {
    id: "romance",
    label: "romance",
    description: "italic display · warm",
    keywords: ["romance", "romantic", "kiss", "valentine", "heart", "lover", "passion", "rose", "amore", "yearn", "yearning", "devotion", "infatuation", "crush", "sweetheart", "darling", "honey", "beloved", "soulmate", "courtship", "propose", "wedding", "marriage", "intimate", "candle", "slowdance", "paris", "venice", "longing", "desire", "affection", "adore", "swoon", "blush", "cupid"],
    className: "italic",
    style: { fontFamily: "var(--font-playfair)", fontWeight: 500, letterSpacing: "0.01em", color: "#7a0e3a" },
    bg: "linear-gradient(140deg, #fce0e8 0%, #f5b0c8 100%)",
  },
  {
    id: "playful",
    label: "playful",
    description: "playful display · airy",
    keywords: ["playful", "kid", "child", "toy", "game", "candy", "balloon", "silly", "cartoon", "bubble", "doodle", "sketchbook", "crayon", "sandbox", "slide", "swing", "sticker", "lollipop", "gummy", "plush", "teddy", "jumprope", "bouncy", "hopscotch", "peekaboo", "recess", "lemonade", "glitter", "cupcake", "donut", "sprinkles", "mascot", "mickey", "disney", "pixar", "lego", "hopscotch", "jellybean", "marshmallow"],
    style: { fontFamily: "var(--font-display)", fontWeight: 500, letterSpacing: "-0.015em", color: "#0e2a6a" },
    bg: "linear-gradient(135deg, #ffe5d4 0%, #ffb8c8 50%, #c4d8ff 100%)",
  },
  {
    id: "mystery",
    label: "mystery",
    description: "serif · enigmatic",
    keywords: ["mystery", "secret", "hidden", "puzzle", "enigma", "noir", "crypt", "occult", "veil", "detective", "sleuth", "riddle", "cipher", "clue", "mask", "hood", "alley", "lantern", "key", "lock", "cellar", "basement", "code", "sherlock", "whodunit", "suspense", "twist", "conspiracy", "tarot", "oracle", "omen", "fortune", "smoke", "shroud"],
    style: { fontFamily: "var(--font-playfair)", fontWeight: 500, letterSpacing: "0.06em", color: "#a89070" },
    bg: "linear-gradient(180deg, #1a1530 0%, #0e0a1a 100%)",
    isDark: true,
  },
  {
    id: "dreamy",
    label: "dreamy",
    description: "light italic · soft",
    keywords: ["dreamy", "dream", "float", "cloud", "haze", "drift", "ethereal", "lucid", "surreal", "hallucinate", "mirage", "fantasy", "imagine", "imagination", "daydream", "reverie", "vapor", "halo", "glow", "gossamer", "fairy", "pixie", "unicorn", "faraway", "yonder", "hover", "phantasm", "otherworldly", "wisp", "wistful", "pastel", "dusk"],
    className: "italic",
    style: { fontFamily: "var(--font-playfair)", fontWeight: 300, letterSpacing: "0.04em", color: "#3a2a6a", filter: "blur(0.3px)" },
    bg: "linear-gradient(160deg, #e8dcfa 0%, #d4c0f0 50%, #c4e0fa 100%)",
  },
  {
    id: "techno",
    label: "techno",
    description: "monospaced · cold",
    keywords: ["techno", "tech", "digital", "code", "computer", "robot", "robotic", "machine", "binary", "circuit", "synth", "server", "gpu", "cpu", "ram", "ssd", "fiber", "ethernet", "modem", "router", "blockchain", "ai", "ml", "neural", "quantum", "microchip", "processor", "motherboard", "cyberpunk", "cybernetic", "android", "drone", "lab", "hologram", "vr", "ar", "virtual", "matrix", "encrypted", "algorithm", "datacenter", "wifi"],
    className: "uppercase",
    style: { fontFamily: "var(--font-mono)", fontWeight: 600, letterSpacing: "0.18em", color: "#9be4ff" },
    bg: "linear-gradient(135deg, #050a14 0%, #0e1a2a 100%)",
    isDark: true,
  },
  {
    id: "rustic",
    label: "rustic",
    description: "serif heavy · earthy",
    keywords: ["rustic", "wood", "farm", "barn", "country", "homemade", "honest", "earth", "earthy", "rough", "handmade", "cabin", "log", "lumberjack", "axe", "fireplace", "hearth", "masonjar", "denim", "flannel", "linen", "oak", "pine", "cedar", "hickory", "harvest", "field", "prairie", "orchard", "vineyard", "cottage", "ranch", "cowboy", "horse", "cattle", "sheep", "dirt", "mud", "canvas", "rope", "twine", "burlap"],
    style: { fontFamily: "var(--font-playfair)", fontWeight: 900, letterSpacing: "0", color: "#3d2814" },
    bg: "linear-gradient(135deg, #d8c4a4 0%, #b8a070 100%)",
  },
  {
    id: "minimal",
    label: "minimal",
    description: "thin sans · spacious",
    keywords: ["minimal", "minimalist", "clean", "simple", "less", "white", "essence", "swiss", "spare", "muji", "blank", "lean", "sparse", "austere", "monochrome", "monolith", "geometric", "grid", "modular", "plain", "naked", "bare", "whitespace", "restraint", "stripped", "elemental", "basic", "fundamental", "distilled", "japan", "japanese", "scandinavian", "danish", "finnish", "ikea", "bauhaus", "helvetica"],
    style: { fontFamily: "var(--font-sans)", fontWeight: 200, letterSpacing: "0.02em", color: "#1a1a1a" },
    bg: "linear-gradient(180deg, #f8f6f0 0%, #ece8df 100%)",
  },
  {
    id: "cosmic",
    label: "cosmic",
    description: "wide display · purple",
    keywords: ["cosmic", "universe", "nebula", "stardust", "infinite", "transcend", "supernova", "deep", "void", "starlight", "cosmos", "multiverse", "dimension", "eternal", "eternity", "infinity", "vortex", "portal", "wormhole", "transcendent", "divine", "celestial", "godlike", "omniscient", "sublime", "awe", "vast", "immense", "magnificent", "profound", "primordial", "deity", "spirit", "soul"],
    className: "uppercase",
    style: { fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.18em", color: "#e0c4ff" },
    bg: "linear-gradient(135deg, #1a0a3a 0%, #3a0a5a 50%, #0a0a30 100%)",
    isDark: true,
  },
];

const DEFAULT_VIBE: Vibe = {
  id: "neutral",
  label: "neutral",
  description: "default display",
  keywords: [],
  style: { fontFamily: "var(--font-display)", fontWeight: 500, letterSpacing: "-0.005em", color: "#3a3530" },
  bg: "linear-gradient(135deg, #faf7f0 0%, #efeae0 100%)",
};

const VIBE_BY_ID: Record<string, Vibe> = Object.fromEntries(
  [DEFAULT_VIBE, ...VIBES].map((v) => [v.id, v]),
);

// Tiny English stemmer — strips common inflections so "laughing", "laughs", "laughed" all map to "laugh"
function stemWord(word: string): string[] {
  const out = new Set<string>([word]);
  if (word.length > 4) {
    if (word.endsWith("ing")) {
      out.add(word.slice(0, -3));
      out.add(word.slice(0, -3) + "e");
      // doubled consonant: running → run
      const w = word.slice(0, -3);
      if (w.length > 2 && w[w.length - 1] === w[w.length - 2]) {
        out.add(w.slice(0, -1));
      }
    }
    if (word.endsWith("ed")) {
      out.add(word.slice(0, -2));
      out.add(word.slice(0, -1));
    }
    if (word.endsWith("ly")) out.add(word.slice(0, -2));
    if (word.endsWith("er")) out.add(word.slice(0, -2));
    if (word.endsWith("est")) out.add(word.slice(0, -3));
    if (word.endsWith("ies")) out.add(word.slice(0, -3) + "y");
    if (word.endsWith("es")) out.add(word.slice(0, -2));
    if (word.endsWith("s") && !word.endsWith("ss")) out.add(word.slice(0, -1));
    if (word.endsWith("iness")) out.add(word.slice(0, -5) + "y");
    if (word.endsWith("ful")) out.add(word.slice(0, -3));
    if (word.endsWith("ness")) out.add(word.slice(0, -4));
  }
  return Array.from(out);
}

// Pre-compute stemmed keyword sets per vibe
const VIBE_KEYWORD_STEMS = VIBES.map((v) => ({
  vibe: v,
  stems: new Set(v.keywords.flatMap(stemWord)),
}));

function classifyKeyword(input: string): Vibe {
  const lower = input.toLowerCase().trim();
  if (!lower) return DEFAULT_VIBE;
  const inputStems = new Set(lower.split(/\s+/).flatMap(stemWord));

  for (const { vibe, stems } of VIBE_KEYWORD_STEMS) {
    for (const s of inputStems) {
      if (stems.has(s)) return vibe;
    }
  }
  return DEFAULT_VIBE;
}

export function KineticTypePreview() {
  const cycle = [VIBES[0], VIBES[1], VIBES[5], VIBES[2]];
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % cycle.length), 2200);
    return () => clearInterval(t);
  }, [cycle.length]);

  const vibe = cycle[i];

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={vibe.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={`text-3xl md:text-4xl text-center ${vibe.className ?? ""}`}
          style={vibe.style}
        >
          {vibe.label}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

const SUGGESTIONS = [
  "refinement",
  "calm",
  "minimal",
  "vintage",
  "tender",
  "romance",
  "joy",
  "playful",
  "rustic",
  "dreamy",
  "mystery",
  "cosmic",
  "space",
  "techno",
  "glitch",
  "strength",
  "punk",
  "fury",
  "dread",
];
const ROTATING_PLACEHOLDERS = [
  "type 'refinement'",
  "type 'punk'",
  "type 'glitch'",
  "type 'dreamy'",
  "type a vibe — or any word",
];

export function KineticTypeFull() {
  const [input, setInput] = useState("");
  const [placeholder, setPlaceholder] = useState(ROTATING_PLACEHOLDERS[0]);
  const [aiVibe, setAiVibe] = useState<Vibe | null>(null);
  const [classifying, setClassifying] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const {
    takenOver: ktTakenOver,
    glitching: ktGlitching,
    enter: enterKtFullscreen,
    exit: exitKtFullscreen,
  } = useExperimentTakeover();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestId = useRef(0);

  // Vibe stays on the last AI-classified result (or DEFAULT_VIBE on first load)
  // while the next classification is in flight — avoids the "flash wrong vibe"
  // jankiness that the instant keyword guess used to cause.
  const vibe = aiVibe ?? DEFAULT_VIBE;
  const display = input.trim() || "type a word";

  // Rotate placeholder when input is empty
  useEffect(() => {
    if (input.length > 0) return;
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % ROTATING_PLACEHOLDERS.length;
      setPlaceholder(ROTATING_PLACEHOLDERS[i]);
    }, 2400);
    return () => clearInterval(t);
  }, [input.length]);

  // Debounced AI classification
  useEffect(() => {
    const trimmed = input.trim();
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!trimmed) {
      setAiVibe(null);
      setClassifying(false);
      return;
    }

    setClassifying(true);
    const myId = ++requestId.current;

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/classify-vibe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: trimmed }),
        });
        if (!res.ok) throw new Error("classify_failed");
        const json = (await res.json()) as { vibe: string | null };
        if (myId !== requestId.current) return; // stale
        if (json.vibe && VIBE_BY_ID[json.vibe]) {
          setAiVibe(VIBE_BY_ID[json.vibe]);
        } else {
          // API returned null (no key / fallback flag) — use keyword as recovery
          setAiVibe(classifyKeyword(trimmed));
        }
      } catch {
        // Network or server error — fall back to keyword classifier
        if (myId === requestId.current) {
          setAiVibe(classifyKeyword(trimmed));
        }
      } finally {
        if (myId === requestId.current) setClassifying(false);
      }
    }, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input]);

  // Intensity: ALL CAPS or ! adds weight + size within the same vibe
  const isUpper =
    input.length > 1 && input === input.toUpperCase() && /[A-Z]/.test(input);
  const exclaims = (input.match(/!/g) || []).length;
  const intensity = Math.min(1 + (isUpper ? 0.18 : 0) + exclaims * 0.06, 1.45);
  const baseWeight = (vibe.style.fontWeight as number) || 500;
  const adjustedWeight = Math.min(baseWeight + (isUpper ? 200 : 0) + exclaims * 80, 900);

  return (
    <>
    <div
      className={
        ktTakenOver
          ? "fixed inset-0 z-[60] isolate overflow-hidden transition-colors duration-700"
          : "relative isolate overflow-hidden rounded-[inherit] transition-colors duration-700"
      }
      style={
        {
          "--ui-text": vibe.isDark ? "#ffffff" : "#1a1a1a",
          "--ui-muted": vibe.isDark ? "rgba(255,255,255,0.65)" : "rgba(20,20,20,0.55)",
          "--ui-glass": vibe.isDark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.45)",
          "--ui-glass-strong": vibe.isDark ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.75)",
          "--ui-border": vibe.isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.16)",
          "--ui-border-strong": vibe.isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
        } as CSSProperties
      }
    >
      {/* Animated background */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10"
        initial={false}
        animate={{ background: vibe.bg }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="flex flex-col min-h-[60vh] md:min-h-[68vh]">
        {/* Merged display + input */}
        <div className="flex-1 flex items-center justify-center px-6 md:px-10 py-10 md:py-16">
          <div className="relative w-full flex items-center justify-center">
            {/* Hidden input — captures keystrokes */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder=""
              spellCheck={false}
              autoComplete="off"
              maxLength={40}
              autoFocus
              aria-label="Type a word"
              className={`display-tight text-center w-full bg-transparent border-0 outline-none break-words ${
                vibe.className ?? ""
              }`}
              style={{
                fontFamily: vibe.style.fontFamily,
                fontWeight: adjustedWeight,
                letterSpacing: vibe.style.letterSpacing,
                color: "transparent",
                transform: vibe.style.transform,
                filter: vibe.style.filter,
                textShadow: vibe.style.textShadow as string | undefined,
                opacity: vibe.style.opacity,
                fontSize: `clamp(2.25rem, ${8 * intensity}vw, ${6 * intensity}rem)`,
                caretColor: "transparent",
              }}
            />
            {/* Visible overlay — text + custom caret */}
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-0 flex items-center justify-center break-words transition-all duration-500 ease-out ${
                vibe.className ?? ""
              }`}
              style={{
                fontFamily: vibe.style.fontFamily,
                fontWeight: adjustedWeight,
                letterSpacing: vibe.style.letterSpacing,
                color: input ? vibe.style.color : "var(--ui-muted)",
                transform: vibe.style.transform,
                filter: vibe.style.filter,
                textShadow: vibe.style.textShadow as string | undefined,
                opacity: vibe.style.opacity,
                fontSize: `clamp(2.25rem, ${8 * intensity}vw, ${6 * intensity}rem)`,
              }}
            >
              <span>{input || placeholder}</span>
              <span
                className="caret-blink"
                style={{
                  display: "inline-block",
                  width: "0.045em",
                  height: "1.05em",
                  background: vibe.style.color as string | undefined,
                  marginLeft: "0.04em",
                  verticalAlign: "text-bottom",
                  transform: "translateY(-0.05em)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Mood readout slot — always present, switches between thinking ↔ mood label */}
        <div className="flex justify-center px-6 min-h-[18px]">
          <AnimatePresence mode="wait" initial={false}>
            {classifying ? (
              <motion.p
                key="thinking"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-center inline-flex items-center gap-2 transition-colors duration-500 text-[var(--ui-muted)]"
              >
                <CircleNotch
                  weight="bold"
                  className="size-3.5 animate-spin text-accent"
                />
                thinking
                <span className="inline-flex">
                  <span className="thinking-dot">.</span>
                  <span className="thinking-dot">.</span>
                  <span className="thinking-dot">.</span>
                </span>
              </motion.p>
            ) : showLabel ? (
              <motion.p
                key="mood"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-center inline-flex items-center gap-2 transition-colors duration-500 text-[var(--ui-muted)]"
              >
                mood ·{" "}
                <span className="transition-colors duration-500 text-[var(--ui-text)]">
                  {vibe.label}
                </span>{" "}
                — {vibe.description}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Suggestion chips — gated by toggle */}
        <AnimatePresence>
          {showLabel && (
            <motion.div
              key="chips"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto px-6 pt-3"
            >
              {SUGGESTIONS.map((s) => {
                const active = input.toLowerCase() === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setInput(s)}
                    className="px-3 py-1.5 rounded-full border backdrop-blur-md text-[12px] transition-colors duration-300"
                    style={{
                      background: active
                        ? "var(--ui-glass-strong)"
                        : "var(--ui-glass)",
                      borderColor: active
                        ? "var(--ui-border-strong)"
                        : "var(--ui-border)",
                      color: active ? "var(--ui-text)" : "var(--ui-muted)",
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom toggle — filled when hints are on, ghost-faded when off */}
        <div className="flex justify-center pb-8 md:pb-10 pt-6">
          <button
            type="button"
            onClick={() => setShowLabel((s) => !s)}
            aria-label={showLabel ? "Hide hints" : "Show hints"}
            className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full backdrop-blur-md transition-all duration-500 border font-mono text-[11px] uppercase tracking-[0.18em]"
            style={{
              background: showLabel ? "var(--ui-glass-strong)" : "transparent",
              borderColor: showLabel
                ? "var(--ui-border-strong)"
                : "var(--ui-border)",
              color: showLabel ? "var(--ui-text)" : "var(--ui-muted)",
            }}
            onMouseEnter={(e) => {
              if (!showLabel) {
                e.currentTarget.style.background = "var(--ui-glass)";
                e.currentTarget.style.color = "var(--ui-text)";
              }
            }}
            onMouseLeave={(e) => {
              if (!showLabel) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--ui-muted)";
              }
            }}
          >
            {showLabel ? (
              <EyeSlash weight="regular" className="size-3.5" />
            ) : (
              <Eye weight="regular" className="size-3.5" />
            )}
            {showLabel ? "hide hints" : "show hints"}
          </button>
        </div>
      </div>

      {/* Fullscreen button (top-right) — site accent so it stays consistent across all vibes */}
      <FullscreenButton
        takenOver={ktTakenOver}
        onEnter={enterKtFullscreen}
        onExit={exitKtFullscreen}
        fg={vibe.isDark ? "#ffffff" : "#1a1a1a"}
        accent="#c45e2d"
        bg={vibe.isDark ? "#0a0a0a" : "#ffffff"}
      />
    </div>
    {ktGlitching &&
      typeof document !== "undefined" &&
      createPortal(<GlitchOverlay />, document.body)}
    </>
  );
}
