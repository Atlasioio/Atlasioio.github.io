"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import * as Tone from "tone";
import {
  ArrowsOut,
  Clock,
  CrosshairSimple,
  MapPin,
  SpeakerHigh,
  SpeakerSlash,
  X,
} from "@phosphor-icons/react/dist/ssr";

type WeatherKind = "clear" | "cloudy" | "fog" | "rain" | "snow" | "storm";

type EraId =
  | "ancient"
  | "dark"
  | "medieval"
  | "vintage"
  | "now"
  | "near"
  | "cyber"
  | "alien"
  | "echo";

type Era = {
  id: EraId;
  name: string;
  range: [number, number];
  palette: { bg: string; fg: string; accent: string };
  font: {
    family: string;
    weight: number;
    letterSpacing: string;
    italic?: boolean;
    upper?: boolean;
    transform?: string;
    textShadow?: string;
  };
  description: string;
  motion: { duration: number; ease: [number, number, number, number] };
  audio: {
    chord: string[];
    osc: "sine" | "triangle" | "sawtooth" | "square";
    reverbRoom: number;
    reverbDamp: number;
    reverbWet: number;
    filterFreq: number;
    filterQ: number;
    volumeDb: number;
    chorusDepth: number;
  };
  atmosphere: WeatherKind | "sparkles" | "glitch" | "aurora";
};

const ERAS: Era[] = [
  {
    id: "ancient",
    name: "ancient",
    range: [-1500, -1100],
    palette: { bg: "#3a2a1c", fg: "#e6c894", accent: "#d4a258" },
    font: {
      family: "var(--font-cinzel-deco)",
      weight: 900,
      letterSpacing: "0.16em",
      upper: true,
    },
    description: "stone, smoke, the long dark",
    motion: { duration: 1.2, ease: [0.65, 0, 0.35, 1] },
    audio: {
      chord: ["A1", "C2", "E2", "A2"],
      osc: "sawtooth",
      reverbRoom: 0.92,
      reverbDamp: 1500,
      reverbWet: 0.75,
      filterFreq: 500,
      filterQ: 2,
      volumeDb: -18,
      chorusDepth: 0.4,
    },
    atmosphere: "sparkles",
  },
  {
    id: "dark",
    name: "dark ages",
    range: [-1100, -700],
    palette: { bg: "#13100c", fg: "#d8c8a4", accent: "#a8743a" },
    font: {
      family: "var(--font-unifraktur)",
      weight: 400,
      letterSpacing: "0.02em",
    },
    description: "candle, vellum, plague",
    motion: { duration: 1.1, ease: [0.65, 0, 0.35, 1] },
    audio: {
      chord: ["D2", "F2", "A2", "D3"],
      osc: "sine",
      reverbRoom: 0.92,
      reverbDamp: 1500,
      reverbWet: 0.75,
      filterFreq: 600,
      filterQ: 1.5,
      volumeDb: -16,
      chorusDepth: 0.3,
    },
    atmosphere: "fog",
  },
  {
    id: "medieval",
    name: "medieval",
    range: [-700, -300],
    palette: { bg: "#2a1810", fg: "#e8d4a0", accent: "#c8915f" },
    font: {
      family: "var(--font-medieval)",
      weight: 400,
      letterSpacing: "0.02em",
    },
    description: "parchment, candlelight, ink",
    motion: { duration: 1.0, ease: [0.65, 0, 0.35, 1] },
    audio: {
      chord: ["F2", "A2", "C3", "F3"],
      osc: "triangle",
      reverbRoom: 0.88,
      reverbDamp: 2500,
      reverbWet: 0.65,
      filterFreq: 900,
      filterQ: 1,
      volumeDb: -16,
      chorusDepth: 0.3,
    },
    atmosphere: "fog",
  },
  {
    id: "vintage",
    name: "vintage",
    range: [-300, -10],
    palette: { bg: "#e9d8b8", fg: "#3d2914", accent: "#a83824" },
    font: {
      family: "var(--font-playfair)",
      weight: 500,
      letterSpacing: "0.02em",
      italic: true,
    },
    description: "sepia hours, slow film",
    motion: { duration: 0.8, ease: [0.65, 0, 0.35, 1] },
    audio: {
      chord: ["C3", "E3", "G3", "C4"],
      osc: "sine",
      reverbRoom: 0.78,
      reverbDamp: 3500,
      reverbWet: 0.45,
      filterFreq: 1400,
      filterQ: 0.6,
      volumeDb: -20,
      chorusDepth: 0.2,
    },
    atmosphere: "sparkles",
  },
  {
    id: "now",
    name: "now",
    range: [-10, 30],
    palette: { bg: "#faf7f0", fg: "#1a1a1a", accent: "#c45e2d" },
    font: {
      family: "var(--font-display)",
      weight: 500,
      letterSpacing: "-0.01em",
    },
    description: "live · real time + place",
    motion: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    audio: {
      chord: ["C3", "E3", "G3", "B3"],
      osc: "triangle",
      reverbRoom: 0.7,
      reverbDamp: 4000,
      reverbWet: 0.4,
      filterFreq: 1800,
      filterQ: 0.5,
      volumeDb: -18,
      chorusDepth: 0.25,
    },
    atmosphere: "clear",
  },
  {
    id: "near",
    name: "near future",
    range: [30, 300],
    palette: { bg: "#d6e2e8", fg: "#0e2238", accent: "#3a6db4" },
    font: {
      family: "var(--font-mono)",
      weight: 600,
      letterSpacing: "0.18em",
      upper: true,
    },
    description: "calibrated, quiet, optimised",
    motion: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    audio: {
      chord: ["D3", "F#3", "A3", "C#4"],
      osc: "sine",
      reverbRoom: 0.75,
      reverbDamp: 5000,
      reverbWet: 0.5,
      filterFreq: 2400,
      filterQ: 1,
      volumeDb: -20,
      chorusDepth: 0.4,
    },
    atmosphere: "clear",
  },
  {
    id: "cyber",
    name: "cyber",
    range: [300, 700],
    palette: { bg: "#0a0612", fg: "#e0c4ff", accent: "#ff4dc8" },
    font: {
      family: "var(--font-audiowide)",
      weight: 400,
      letterSpacing: "0.14em",
      upper: true,
      textShadow:
        "0 0 14px currentColor, 0 0 32px currentColor, 2px 0 #ff0088, -2px 0 #00ddff",
    },
    description: "neon · glitch · cities up high",
    motion: { duration: 0.35, ease: [0.4, 0, 0.6, 1] },
    audio: {
      chord: ["G2", "A#2", "D3", "F3"],
      osc: "sawtooth",
      reverbRoom: 0.85,
      reverbDamp: 1800,
      reverbWet: 0.55,
      filterFreq: 1100,
      filterQ: 5,
      volumeDb: -20,
      chorusDepth: 0.6,
    },
    atmosphere: "glitch",
  },
  {
    id: "alien",
    name: "alien",
    range: [700, 1100],
    palette: { bg: "#0a1a0c", fg: "#a8ffe2", accent: "#ff4ddd" },
    font: {
      family: "var(--font-codystar)",
      weight: 400,
      letterSpacing: "0.16em",
      upper: true,
      textShadow: "0 0 18px currentColor, 0 0 38px currentColor",
    },
    description: "▲ ◇ ▷ light bends ◇ ▲",
    motion: { duration: 0.25, ease: [0.4, 0, 0.6, 1] },
    audio: {
      chord: ["C#3", "F3", "G3", "B3"],
      osc: "square",
      reverbRoom: 0.95,
      reverbDamp: 800,
      reverbWet: 0.85,
      filterFreq: 700,
      filterQ: 7,
      volumeDb: -24,
      chorusDepth: 0.8,
    },
    atmosphere: "aurora",
  },
  {
    id: "echo",
    name: "echo",
    range: [1100, 1500],
    palette: { bg: "#020308", fg: "#e0f2ff", accent: "#6df0e8" },
    font: {
      family: "var(--font-major-mono)",
      weight: 400,
      letterSpacing: "0.32em",
      upper: true,
      textShadow: "0 0 24px currentColor",
    },
    description: "after time, only the wave",
    motion: { duration: 0.4, ease: [0.4, 0, 0.6, 1] },
    audio: {
      chord: ["E3", "G#3", "B3", "D#4"],
      osc: "sine",
      reverbRoom: 0.97,
      reverbDamp: 6000,
      reverbWet: 0.9,
      filterFreq: 1800,
      filterQ: 0.5,
      volumeDb: -22,
      chorusDepth: 0.7,
    },
    atmosphere: "sparkles",
  },
];

// Era-specific weekday/month names — empty falls back to English
const ERA_DATETIME: Partial<Record<EraId, { weekdays: string[]; months: string[] }>> = {
  ancient: {
    weekdays: [
      "solis",
      "lunae",
      "martis",
      "mercurii",
      "iovis",
      "veneris",
      "saturni",
    ],
    months: [
      "ianuarius",
      "februarius",
      "martius",
      "aprilis",
      "maius",
      "iunius",
      "iulius",
      "augustus",
      "september",
      "october",
      "november",
      "december",
    ],
  },
  dark: {
    weekdays: [
      "sunnandæg",
      "monandæg",
      "tiwesdæg",
      "wodnesdæg",
      "þunresdæg",
      "frigedæg",
      "sæterndæg",
    ],
    months: [
      "ærra geola",
      "solmonað",
      "hreþmonað",
      "eastermonað",
      "þrimilcemonað",
      "liða",
      "mæðmonað",
      "weodmonað",
      "hærfestmonað",
      "winterfylleþ",
      "blotmonað",
      "æfterra geola",
    ],
  },
  alien: {
    weekdays: [
      "vega",
      "lyra",
      "orion",
      "cetus",
      "hydra",
      "eridanus",
      "polaris",
    ],
    months: [
      "sigma.01",
      "sigma.02",
      "sigma.03",
      "sigma.04",
      "sigma.05",
      "sigma.06",
      "sigma.07",
      "sigma.08",
      "sigma.09",
      "sigma.10",
      "sigma.11",
      "sigma.12",
    ],
  },
  echo: {
    weekdays: ["ζ.1", "ζ.2", "ζ.3", "ζ.4", "ζ.5", "ζ.6", "ζ.7"],
    months: [
      "η.01",
      "η.02",
      "η.03",
      "η.04",
      "η.05",
      "η.06",
      "η.07",
      "η.08",
      "η.09",
      "η.10",
      "η.11",
      "η.12",
    ],
  },
};

function getEra(yearOffset: number): Era {
  for (const era of ERAS) {
    if (yearOffset >= era.range[0] && yearOffset < era.range[1]) return era;
  }
  return ERAS[ERAS.length - 1];
}

function weatherFromCode(code: number): { kind: WeatherKind; label: string } {
  if (code === 0) return { kind: "clear", label: "clear" };
  if (code <= 3) return { kind: "cloudy", label: "cloudy" };
  if (code === 45 || code === 48) return { kind: "fog", label: "fog" };
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82))
    return { kind: "rain", label: "rain" };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86)
    return { kind: "snow", label: "snow" };
  if (code >= 95) return { kind: "storm", label: "storm" };
  return { kind: "cloudy", label: "overcast" };
}

function dayPhase(hour: number): "dawn" | "day" | "dusk" | "night" {
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "dusk";
  return "night";
}

function nowPalette(weather: WeatherKind, hour: number): Era["palette"] {
  const phase = dayPhase(hour);
  if (phase === "night") {
    return weather === "clear"
      ? { bg: "#0c1230", fg: "#e0d6ff", accent: "#ffac6e" }
      : weather === "snow"
      ? { bg: "#15203a", fg: "#e8efff", accent: "#9ec0ff" }
      : { bg: "#0a0e1f", fg: "#bcc6e0", accent: "#7a93c8" };
  }
  if (phase === "dawn") {
    return { bg: "#fbe5d2", fg: "#3a1a14", accent: "#d6431a" };
  }
  if (phase === "dusk") {
    return { bg: "#fbcaa6", fg: "#3a1a14", accent: "#a83824" };
  }
  if (weather === "rain")
    return { bg: "#cdd6df", fg: "#1a2a3a", accent: "#3a6db4" };
  if (weather === "snow")
    return { bg: "#eef3f7", fg: "#1a2a3a", accent: "#5a78a8" };
  if (weather === "fog")
    return { bg: "#dbd8d2", fg: "#262320", accent: "#7a6e5e" };
  if (weather === "storm")
    return { bg: "#1f242c", fg: "#dde4f0", accent: "#ffd060" };
  if (weather === "cloudy")
    return { bg: "#dee0e2", fg: "#1a1a1a", accent: "#7a6e5e" };
  return { bg: "#fff5dd", fg: "#1a1a1a", accent: "#c45e2d" };
}

const FALLBACK_LOCATION = {
  lat: 55.605,
  lon: 13.0,
  city: "Malmö",
  country: "Sweden",
};

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

const WEEKDAYS = [
  "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday",
];

// ─── Preview ──────────────────────────────────────────────────────────────
const PREVIEW_FONTS: { family: string; className?: string }[] = [
  { family: "var(--font-mono)" },
  { family: "var(--font-cinzel-deco)" },
  { family: "var(--font-unifraktur)" },
  { family: "var(--font-medieval)" },
  { family: "var(--font-playfair)" },
  { family: "var(--font-audiowide)" },
  { family: "var(--font-codystar)" },
  { family: "var(--font-major-mono)" },
];

export function LiveTimePreview() {
  const [time, setTime] = useState<Date | null>(null);
  const [fontIdx, setFontIdx] = useState(0);

  // Autonomous loop — slow time advance + font cycle, smooth transitions
  useEffect(() => {
    const start = new Date();
    setTime(start);
    let t = start;
    const id = setInterval(() => {
      t = new Date(t.getTime() + 7 * 60_000);
      setTime(new Date(t));
      setFontIdx((i) => (i + 1) % PREVIEW_FONTS.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const display = time
    ? time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
  const font = PREVIEW_FONTS[fontIdx];

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={`${display}-${fontIdx}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-2xl md:text-3xl tracking-tight text-fg/80 tabular-nums"
          style={{ fontFamily: font.family }}
        >
          {display}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

// ─── Full experiment ──────────────────────────────────────────────────────
export function LiveTimeFull() {
  const [position, setPosition] = useState<{
    lat: number;
    lon: number;
    city: string;
    country: string;
  } | null>(null);
  const [weather, setWeather] = useState<{
    kind: WeatherKind;
    label: string;
    temp: number;
  } | null>(null);
  const [now, setNow] = useState(() => new Date());
  const [yearOffset, setYearOffset] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(70);
  const [takenOver, setTakenOver] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const triggeredOnceRef = useRef(false);

  // Tick local time every minute
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Geolocate + reverse-geocode + weather (one shot on mount)
  useEffect(() => {
    let cancelled = false;
    const fetchAll = async (lat: number, lon: number) => {
      try {
        const [revRes, wxRes] = await Promise.all([
          fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
          ).then((r) => r.json()),
          fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
          ).then((r) => r.json()),
        ]);
        if (cancelled) return;
        setPosition({
          lat,
          lon,
          city:
            revRes?.city ||
            revRes?.locality ||
            revRes?.principalSubdivision ||
            "your area",
          country: revRes?.countryName || "",
        });
        const cw = wxRes?.current_weather;
        if (cw) {
          const w = weatherFromCode(cw.weathercode);
          setWeather({ kind: w.kind, label: w.label, temp: cw.temperature });
        }
      } catch {
        if (!cancelled) {
          setPosition({ ...FALLBACK_LOCATION });
          setWeather({ kind: "clear", label: "clear", temp: 12 });
        }
      }
    };

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchAll(pos.coords.latitude, pos.coords.longitude),
        () => fetchAll(FALLBACK_LOCATION.lat, FALLBACK_LOCATION.lon),
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 60_000 },
      );
    } else {
      fetchAll(FALLBACK_LOCATION.lat, FALLBACK_LOCATION.lon);
    }
    return () => {
      cancelled = true;
    };
  }, []);

  const era = getEra(yearOffset);
  const realHour = now.getHours();
  const realWeather = weather?.kind ?? "clear";
  const livePalette =
    era.id === "now" ? nowPalette(realWeather, realHour) : era.palette;

  // ─── Tone.js ambient synthesis ────────────────────────────────────────
  // Persistent user-volume node (survives era changes)
  const userVolRef = useRef<Tone.Volume | null>(null);
  // Refs to current chain so we can dispose / replace per era
  const chainRef = useRef<{
    synth: Tone.PolySynth;
    filter: Tone.Filter;
    chorus: Tone.Chorus;
    reverb: Tone.Freeverb;
  } | null>(null);

  // Set up the chain on era change. Always runs (no on/off toggle — use muted/volume instead).
  useEffect(() => {
    let disposed = false;
    const setup = async () => {
      try {
        await Tone.start();
        if (disposed) return;
        if (!userVolRef.current) {
          userVolRef.current = new Tone.Volume(0).toDestination();
        }
        const cfg = era.audio;
        const reverb = new Tone.Freeverb({
          roomSize: cfg.reverbRoom,
          dampening: cfg.reverbDamp,
          wet: cfg.reverbWet,
        }).connect(userVolRef.current);
        const chorus = new Tone.Chorus({
          frequency: 0.5,
          depth: cfg.chorusDepth,
          spread: 180,
        })
          .connect(reverb)
          .start();
        const filter = new Tone.Filter({
          type: "lowpass",
          frequency: cfg.filterFreq,
          Q: cfg.filterQ,
        }).connect(chorus);
        const synth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: cfg.osc },
          envelope: { attack: 2.4, decay: 0.5, sustain: 0.85, release: 3.5 },
          volume: cfg.volumeDb,
        }).connect(filter);

        synth.triggerAttack(cfg.chord);
        chainRef.current = { synth, filter, chorus, reverb };
      } catch {
        // audio context may be blocked until first user gesture
      }
    };
    setup();
    return () => {
      disposed = true;
      const c = chainRef.current;
      chainRef.current = null;
      if (c) {
        c.synth.releaseAll();
        window.setTimeout(() => {
          c.synth.dispose();
          c.filter.dispose();
          c.chorus.dispose();
          c.reverb.dispose();
        }, 4000);
      }
    };
  }, [era.id, era.audio]);

  // Volume + mute control on the persistent userVolume node
  useEffect(() => {
    if (!userVolRef.current) return;
    const target =
      muted || volume === 0 ? -60 : 20 * Math.log10(Math.max(volume, 1) / 100);
    userVolRef.current.volume.rampTo(target, 0.15);
  }, [muted, volume]);

  // Cleanup userVolume on unmount
  useEffect(
    () => () => {
      userVolRef.current?.dispose();
      userVolRef.current = null;
    },
    [],
  );

  // Glitch helpers
  const enterTakeover = useCallback(() => {
    triggeredOnceRef.current = true;
    setGlitching(true);
    window.setTimeout(() => setTakenOver(true), 380);
    window.setTimeout(() => setGlitching(false), 800);
  }, []);

  const exitTakeover = useCallback(() => {
    triggeredOnceRef.current = true;
    setGlitching(true);
    window.setTimeout(() => setTakenOver(false), 240);
    window.setTimeout(() => setGlitching(false), 500);
  }, []);

  // Lock body scroll + hide site chrome (nav + footer) + ESC handler while taken over
  useEffect(() => {
    if (!takenOver) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("experiment-takeover");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitTakeover();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove("experiment-takeover");
      window.removeEventListener("keydown", onKey);
    };
  }, [takenOver, exitTakeover]);


  const displayedYear = now.getFullYear() + yearOffset;
  const displayedTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const eraDt = ERA_DATETIME[era.id];
  const eraWeekdays = eraDt?.weekdays ?? WEEKDAYS;
  const eraMonths = eraDt?.months ?? MONTHS;
  const displayedDate = `${eraWeekdays[now.getDay()]} · ${eraMonths[now.getMonth()]} ${now.getDate()}`;
  const displayedWeather =
    era.id === "now" && weather
      ? `${weather.label} · ${Math.round(weather.temp)}°c`
      : era.description;
  const displayedPlace =
    era.id === "now" && position
      ? `${position.city}${position.country ? ", " + position.country : ""}`
      : era.id === "now"
      ? "your area"
      : era.id === "echo"
      ? "ζ · faded coordinates"
      : era.id === "alien"
      ? "▲ unknown sector ◇"
      : era.id === "cyber"
      ? "neo-malmö"
      : era.id === "near"
      ? "malmö, sweden"
      : era.id === "vintage"
      ? "malmö"
      : era.id === "medieval"
      ? "the burg by the sea"
      : era.id === "dark"
      ? "the abbey grounds"
      : "the great cold north";

  const displayWord =
    era.id === "echo"
      ? "drift"
      : era.id === "alien"
      ? "Y E A R"
      : era.id === "ancient" ||
        era.id === "dark" ||
        era.id === "medieval"
      ? "year of"
      : "year";

  const fontStyle: CSSProperties = useMemo(
    () => ({
      fontFamily: era.font.family,
      fontWeight: era.font.weight,
      letterSpacing: era.font.letterSpacing,
      fontStyle: era.font.italic ? "italic" : "normal",
      textTransform: era.font.upper ? "uppercase" : "none",
      transform: era.font.transform,
      textShadow: era.font.textShadow,
    }),
    [era],
  );

  // Reusable content (rendered identically in contained or fixed wrapper)
  const content = (
    <>
      {/* Animated background */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10"
        initial={false}
        animate={{
          background: `linear-gradient(140deg, ${livePalette.bg} 0%, color-mix(in oklab, ${livePalette.bg} 80%, ${livePalette.accent}) 100%)`,
        }}
        transition={{ duration: era.motion.duration, ease: era.motion.ease }}
      />

      {/* Atmosphere */}
      <Atmosphere
        kind={era.id === "now" ? realWeather : era.atmosphere}
        fg={livePalette.fg}
      />

      {/* Scan-line overlay */}
      {(era.id === "cyber" || era.id === "alien") && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none -z-[5] opacity-40 mix-blend-overlay"
          style={{
            background:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0) 0px, rgba(255,255,255,0) 2px, rgba(255,255,255,0.06) 2px, rgba(255,255,255,0.06) 3px)",
          }}
        />
      )}

      {/* Top-left: audio panel (mute + volume) */}
      <div
        className="absolute top-4 left-4 md:top-5 md:left-5 z-30 inline-flex items-center gap-2.5 pl-2.5 pr-3.5 py-2 rounded-full backdrop-blur-md transition-colors duration-500"
        style={{
          background: `color-mix(in oklab, ${livePalette.bg} 55%, transparent)`,
          border: `1px solid color-mix(in oklab, ${livePalette.fg} 22%, transparent)`,
          boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
        }}
      >
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute ambient" : "Mute ambient"}
          className="flex size-7 items-center justify-center rounded-full transition-colors duration-200 hover:scale-110"
          style={{
            color: livePalette.fg,
            background: muted
              ? "transparent"
              : `color-mix(in oklab, ${livePalette.accent} 30%, transparent)`,
          }}
        >
          {muted ? (
            <SpeakerSlash weight="regular" className="size-3.5" />
          ) : (
            <SpeakerHigh weight="regular" className="size-3.5" />
          )}
        </button>
        <VolumeSlider
          value={volume}
          onChange={(v) => {
            setVolume(v);
            if (v > 0 && muted) setMuted(false);
          }}
          accent={livePalette.accent}
          fg={livePalette.fg}
          muted={muted}
        />
      </div>

      {/* Top-right: fullscreen toggle (state-aware) */}
      <button
        type="button"
        onClick={takenOver ? exitTakeover : enterTakeover}
        aria-label={takenOver ? "Exit fullscreen" : "Enter fullscreen"}
        className="absolute top-4 right-4 md:top-5 md:right-5 z-30 inline-flex items-center gap-2.5 px-4 py-2 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 font-mono text-[11px] uppercase tracking-[0.18em]"
        style={{
          background: takenOver
            ? `color-mix(in oklab, ${livePalette.bg} 55%, transparent)`
            : `color-mix(in oklab, ${livePalette.accent} 35%, transparent)`,
          color: livePalette.fg,
          border: `1px solid color-mix(in oklab, ${
            takenOver ? livePalette.fg : livePalette.accent
          } ${takenOver ? 30 : 70}%, transparent)`,
          boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
        }}
      >
        {takenOver ? (
          <>
            <X weight="bold" className="size-3.5" />
            exit · esc
          </>
        ) : (
          <>
            <ArrowsOut weight="regular" className="size-3.5" />
            fullscreen
          </>
        )}
      </button>

      <div
        className={`relative flex flex-col ${
          takenOver ? "min-h-screen" : "min-h-[60vh] md:min-h-[68vh]"
        } py-12 md:py-20 px-6 md:px-10`}
      >
        {/* Display */}
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={era.id}
              initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
              transition={{
                duration: era.motion.duration,
                ease: era.motion.ease,
              }}
              className="text-center max-w-full"
              style={{ color: livePalette.fg }}
            >
              <p
                className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.24em] mb-4 md:mb-6 opacity-70"
                style={{ color: livePalette.accent }}
              >
                {era.name}
              </p>
              <h1
                className={`leading-[0.95] mb-6 ${
                  takenOver
                    ? "text-6xl md:text-8xl lg:text-9xl"
                    : "text-5xl md:text-7xl lg:text-8xl"
                }`}
                style={fontStyle}
              >
                {displayWord} {displayedYear}
              </h1>
              <p
                className="text-base md:text-lg mb-1 opacity-90"
                style={fontStyle}
              >
                {displayedPlace}
              </p>
              <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] opacity-70">
                {displayedWeather} · {displayedTime} · {displayedDate}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-10 md:mt-14 flex flex-col items-center gap-4">
          <TimeSlider
            value={yearOffset}
            onChange={setYearOffset}
            eras={ERAS}
            currentEraId={era.id}
            palette={livePalette}
          />

          <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
            <button
              type="button"
              onClick={() => setYearOffset(0)}
              className="group inline-flex items-center gap-2.5 pl-4 pr-5 py-2.5 rounded-full font-mono text-[11px] uppercase tracking-[0.18em] transition-all duration-300 backdrop-blur-md hover:-translate-y-0.5"
              style={{
                background: `color-mix(in oklab, ${livePalette.bg} 60%, transparent)`,
                color: livePalette.fg,
                border: `1px solid color-mix(in oklab, ${livePalette.accent} 55%, transparent)`,
                boxShadow: "0 4px 14px rgba(0,0,0,0.16)",
              }}
            >
              <CrosshairSimple
                weight="bold"
                className="size-3.5 transition-transform duration-500 ease-out group-hover:rotate-90"
                style={{ color: livePalette.accent }}
              />
              snap to now
            </button>
            <span
              className="font-mono text-[10px] uppercase tracking-[0.18em] inline-flex items-center gap-1.5"
              style={{ color: livePalette.fg, opacity: 0.55 }}
            >
              {position ? (
                <>
                  <MapPin weight="regular" className="size-3" />
                  {position.city}
                </>
              ) : (
                <>
                  <Clock weight="regular" className="size-3" />
                  locating…
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  // The contained-mode wrapper
  const contained = (
    <div
      className="relative isolate overflow-hidden rounded-[inherit]"
      style={{
        ["--lt-bg" as string]: livePalette.bg,
        ["--lt-fg" as string]: livePalette.fg,
        ["--lt-accent" as string]: livePalette.accent,
      }}
    >
      {!takenOver && content}
      {takenOver && (
        <div
          className="flex flex-col items-center justify-center min-h-[40vh] py-16 px-6"
          style={{ background: livePalette.bg, color: livePalette.fg }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-70 mb-3">
            this experiment has taken over the page
          </p>
          <button
            type="button"
            onClick={exitTakeover}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300"
            style={{
              background: `color-mix(in oklab, ${livePalette.fg} 12%, transparent)`,
              color: livePalette.fg,
              border: `1px solid color-mix(in oklab, ${livePalette.fg} 30%, transparent)`,
            }}
          >
            <X weight="regular" className="size-3.5" />
            release (esc)
          </button>
        </div>
      )}
    </div>
  );

  // Portal target only available client-side
  const portalTarget =
    typeof document !== "undefined" ? document.body : null;

  return (
    <>
      {contained}
      {takenOver &&
        portalTarget &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] isolate overflow-hidden"
            style={{
              ["--lt-bg" as string]: livePalette.bg,
              ["--lt-fg" as string]: livePalette.fg,
              ["--lt-accent" as string]: livePalette.accent,
            }}
          >
            {content}
          </div>,
          portalTarget,
        )}
      {glitching && portalTarget && createPortal(<GlitchOverlay />, portalTarget)}
    </>
  );
}

// ─── Compact volume slider ────────────────────────────────────────────────
function VolumeSlider({
  value,
  onChange,
  accent,
  fg,
  muted,
}: {
  value: number;
  onChange: (v: number) => void;
  accent: string;
  fg: string;
  muted: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const setFromPointer = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    onChange(Math.round((x / rect.width) * 100));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setFromPointer(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setFromPointer(e.clientX);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    setDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const fill = muted ? 0 : value;

  return (
    <div
      ref={trackRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      role="slider"
      aria-label="Volume"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className="relative w-20 md:w-24 h-5 cursor-pointer touch-none flex items-center select-none"
    >
      <div
        className="absolute inset-x-0 h-[3px] rounded-full"
        style={{
          background: `color-mix(in oklab, ${fg} 22%, transparent)`,
        }}
      />
      <motion.div
        className="absolute h-[3px] rounded-full"
        style={{ background: accent, left: 0 }}
        animate={{ width: `${fill}%` }}
        transition={{ type: "spring", stiffness: 360, damping: 28 }}
      />
      <motion.div
        className="absolute size-3 rounded-full"
        style={{
          background: accent,
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          x: "-50%",
          opacity: muted ? 0.5 : 1,
        }}
        animate={{
          left: `${fill}%`,
          scale: dragging ? 1.25 : 1,
        }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
      />
    </div>
  );
}

// ─── Custom time slider ───────────────────────────────────────────────────
function TimeSlider({
  value,
  onChange,
  eras,
  currentEraId,
  palette,
}: {
  value: number;
  onChange: (v: number) => void;
  eras: Era[];
  currentEraId: EraId;
  palette: Era["palette"];
}) {
  const min = -1500;
  const max = 1500;
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState(false);

  const percent = ((value - min) / (max - min)) * 100;
  const nowPct = ((0 - min) / (max - min)) * 100;
  const fromNow = percent < nowPct ? percent : nowPct;
  const toNow = percent > nowPct ? percent : nowPct;
  const atNow = value === 0;

  const setFromPointer = useCallback(
    (clientX: number) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const ratio = x / rect.width;
      let next = Math.round(min + ratio * (max - min));
      // Snap to now within 25 years
      if (Math.abs(next) < 25) next = 0;
      onChange(next);
    },
    [onChange],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setFromPointer(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setFromPointer(e.clientX);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    setDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const big = e.shiftKey ? 50 : e.altKey ? 100 : 1;
    let next = value;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = value - big;
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") next = value + big;
    else if (e.key === "Home") next = min;
    else if (e.key === "End") next = max;
    else if (e.key === "n" || e.key === "0") next = 0;
    else return;
    e.preventDefault();
    onChange(Math.max(min, Math.min(max, next)));
  };

  const yearLabel =
    value === 0 ? "now" : value > 0 ? `+${value}y` : `${value}y`;

  return (
    <div className="w-full max-w-2xl select-none">
      {/* Era labels (clickable jumps) */}
      <div
        className="flex justify-between font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] mb-3 px-1"
        style={{ color: palette.fg }}
      >
        {eras.map((e) => {
          const active = e.id === currentEraId;
          return (
            <button
              key={e.id}
              type="button"
              onClick={() => onChange(Math.round((e.range[0] + e.range[1]) / 2))}
              className="transition-all duration-300 hover:scale-110"
              style={{
                opacity: active ? 1 : 0.45,
                fontWeight: active ? 700 : 400,
              }}
            >
              {e.id}
            </button>
          );
        })}
      </div>

      {/* Track */}
      <div
        className="relative h-12 mb-8 cursor-pointer touch-none"
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => setHover(false)}
        onPointerEnter={() => setHover(true)}
      >
        {/* Era zone bands (subtle background) */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full overflow-hidden flex">
          {eras.map((e) => {
            const w = ((e.range[1] - e.range[0]) / (max - min)) * 100;
            return (
              <div
                key={e.id}
                style={{
                  width: `${w}%`,
                  background: `color-mix(in oklab, ${e.palette.bg} 70%, ${e.palette.accent})`,
                  opacity: e.id === currentEraId ? 0.9 : 0.45,
                  transition: "opacity 400ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              />
            );
          })}
        </div>

        {/* Filled section between thumb and now */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full pointer-events-none"
          style={{
            background: palette.accent,
            boxShadow: `0 0 12px ${palette.accent}`,
          }}
          animate={{
            left: `${fromNow}%`,
            width: `${toNow - fromNow}%`,
          }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
        />

        {/* "now" marker — vertical breathing line at center */}
        <div
          aria-hidden
          className="absolute -top-1 -bottom-1 pointer-events-none"
          style={{ left: `${nowPct}%`, transform: "translateX(-50%)" }}
        >
          <span
            className="block h-full mx-auto rounded-full"
            style={{
              width: "3px",
              background: palette.accent,
              boxShadow: `0 0 16px ${palette.accent}, 0 0 32px ${palette.accent}`,
              animation: "lt-now-line 2.4s ease-in-out infinite",
            }}
          />
        </div>

        {/* "now" label below the marker */}
        <span
          className="absolute font-mono text-[10px] uppercase tracking-[0.22em] pointer-events-none"
          style={{
            left: `${nowPct}%`,
            top: "calc(100% + 8px)",
            transform: "translateX(-50%)",
            color: palette.accent,
            textShadow: `0 0 8px ${palette.accent}`,
          }}
        >
          now
        </span>

        {/* Thumb (animated, pulses softly when at "now" and idle) */}
        <motion.div
          tabIndex={0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label="Time scrubber"
          aria-valuetext={yearLabel}
          onKeyDown={onKeyDown}
          className="absolute top-1/2 size-6 rounded-full cursor-grab active:cursor-grabbing focus:outline-none"
          style={{
            left: `${percent}%`,
            x: "-50%",
            y: "-50%",
            background: palette.fg,
            border: `2px solid ${palette.accent}`,
          }}
          animate={
            dragging
              ? {
                  scale: 1.25,
                  boxShadow: `0 6px 20px rgba(0,0,0,0.35), 0 0 0 8px color-mix(in oklab, ${palette.accent} 25%, transparent)`,
                }
              : hover
              ? {
                  scale: 1.1,
                  boxShadow: `0 5px 16px rgba(0,0,0,0.3), 0 0 0 4px color-mix(in oklab, ${palette.accent} 20%, transparent)`,
                }
              : atNow
              ? {
                  scale: [1, 1.14, 1],
                  boxShadow: [
                    `0 4px 14px rgba(0,0,0,0.25), 0 0 0 0px ${palette.accent}`,
                    `0 4px 14px rgba(0,0,0,0.25), 0 0 0 6px color-mix(in oklab, ${palette.accent} 25%, transparent)`,
                    `0 4px 14px rgba(0,0,0,0.25), 0 0 0 0px ${palette.accent}`,
                  ],
                }
              : {
                  scale: 1,
                  boxShadow: `0 4px 14px rgba(0,0,0,0.25), 0 0 0 0px ${palette.accent}`,
                }
          }
          transition={
            atNow && !dragging && !hover
              ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
              : { type: "spring", stiffness: 380, damping: 28 }
          }
        />


        {/* Year tooltip on drag/hover */}
        <AnimatePresence>
          {(dragging || hover) && (
            <motion.div
              key="tooltip"
              initial={{ opacity: 0, y: 4, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.9 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-full mb-3 -translate-x-1/2 px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-[0.2em] tabular-nums whitespace-nowrap pointer-events-none"
              style={{
                left: `${percent}%`,
                background: palette.fg,
                color: palette.bg,
                boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
              }}
            >
              {yearLabel}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes lt-now-line {
          0%, 100% { opacity: 0.7; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.06); }
        }
        @keyframes lt-now-pulse {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.4); }
        }
      `}</style>
    </div>
  );
}

// ─── Glitch transition overlay ────────────────────────────────────────────
function GlitchOverlay() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[200] pointer-events-none"
      style={{
        animation: "lt-glitch-fade 800ms ease-out forwards",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(45deg, rgba(255,77,200,0.35), rgba(0,221,255,0.35))",
          mixBlendMode: "difference",
          animation: "lt-glitch-slide 800ms steps(8) forwards",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent 0, transparent 4px, rgba(0,0,0,0.55) 4px, rgba(0,0,0,0.55) 5px)",
          animation: "lt-glitch-bars 800ms steps(20) forwards",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(255,255,255,0.7)",
          animation: "lt-glitch-flash 800ms ease-out forwards",
        }}
      />
      <style>{`
        @keyframes lt-glitch-fade {
          0% { opacity: 0; }
          10% { opacity: 1; }
          85% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes lt-glitch-slide {
          0% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(6px); }
          45% { transform: translateX(-12px); }
          60% { transform: translateX(4px); }
          80% { transform: translateX(-3px); }
          100% { transform: translateX(0); }
        }
        @keyframes lt-glitch-bars {
          0% { transform: translateY(0) scaleY(1); opacity: 0.6; }
          50% { transform: translateY(-12px) scaleY(0.9); opacity: 0.85; }
          100% { transform: translateY(0) scaleY(1); opacity: 0; }
        }
        @keyframes lt-glitch-flash {
          0% { opacity: 0; }
          12% { opacity: 0.85; }
          18% { opacity: 0; }
          26% { opacity: 0.55; }
          32% { opacity: 0; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Atmosphere effects ───────────────────────────────────────────────────
function Atmosphere({
  kind,
  fg,
}: {
  kind: WeatherKind | "sparkles" | "glitch" | "aurora";
  fg: string;
}) {
  if (kind === "rain") return <RainAtmosphere fg={fg} />;
  if (kind === "snow") return <SnowAtmosphere fg={fg} />;
  if (kind === "fog") return <FogAtmosphere />;
  if (kind === "storm") return <StormAtmosphere fg={fg} />;
  if (kind === "sparkles") return <SparklesAtmosphere fg={fg} />;
  if (kind === "glitch") return <GlitchAtmosphere />;
  if (kind === "aurora") return <AuroraAtmosphere />;
  return null;
}

function RainAtmosphere({ fg }: { fg: string }) {
  const drops = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        x: (i * 17 + 7) % 100,
        delay: (i * 0.13) % 1.4,
        duration: 0.8 + ((i * 7) % 6) / 10,
      })),
    [],
  );
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none -z-[5] overflow-hidden">
      {drops.map((d, i) => (
        <span
          key={i}
          className="absolute top-0 w-px h-8 opacity-25"
          style={{
            left: `${d.x}%`,
            background: fg,
            animation: `lt-rain ${d.duration}s linear ${d.delay}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes lt-rain { from { transform: translateY(-10vh); opacity: 0; } 10% { opacity: 0.3; } to { transform: translateY(110vh); opacity: 0; } }`}</style>
    </div>
  );
}

function SnowAtmosphere({ fg }: { fg: string }) {
  const flakes = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        x: (i * 23 + 13) % 100,
        size: 2 + ((i * 5) % 4),
        delay: (i * 0.3) % 6,
        duration: 6 + ((i * 11) % 8),
      })),
    [],
  );
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none -z-[5] overflow-hidden">
      {flakes.map((f, i) => (
        <span
          key={i}
          className="absolute top-0 rounded-full opacity-50"
          style={{
            left: `${f.x}%`,
            width: f.size,
            height: f.size,
            background: fg,
            animation: `lt-snow ${f.duration}s linear ${f.delay}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes lt-snow { from { transform: translate(0, -10vh); } 50% { transform: translate(20px, 50vh); } to { transform: translate(0, 110vh); } }`}</style>
    </div>
  );
}

function FogAtmosphere() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none -z-[5]"
      style={{
        background:
          "radial-gradient(circle at 40% 60%, rgba(255,255,255,0.18) 0%, transparent 55%), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.12) 0%, transparent 50%)",
        animation: "lt-fog 18s ease-in-out infinite",
      }}
    >
      <style>{`@keyframes lt-fog { 0%, 100% { opacity: 0.9; transform: translateX(0); } 50% { opacity: 1; transform: translateX(40px); } }`}</style>
    </div>
  );
}

function StormAtmosphere({ fg }: { fg: string }) {
  return (
    <>
      <RainAtmosphere fg={fg} />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none -z-[5]"
        style={{
          background: "rgba(255,255,255,0.4)",
          animation: "lt-flash 6s ease-in-out infinite",
        }}
      >
        <style>{`@keyframes lt-flash { 0%, 92%, 100% { opacity: 0; } 93% { opacity: 0.6; } 94% { opacity: 0.1; } 95% { opacity: 0.7; } 96%, 99% { opacity: 0; } }`}</style>
      </div>
    </>
  );
}

function SparklesAtmosphere({ fg }: { fg: string }) {
  const sparks = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        x: (i * 19 + 5) % 100,
        y: (i * 31 + 11) % 100,
        size: 2 + ((i * 3) % 4),
        delay: (i * 0.21) % 5,
        duration: 3 + ((i * 7) % 5),
      })),
    [],
  );
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none -z-[5] overflow-hidden">
      {sparks.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full opacity-60"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: fg,
            animation: `lt-spark ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes lt-spark { 0%, 100% { opacity: 0; transform: scale(0.8); } 50% { opacity: 0.7; transform: scale(1.2); } }`}</style>
    </div>
  );
}

function GlitchAtmosphere() {
  const bands = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        y: (i * 13 + 5) % 100,
        height: 1 + ((i * 3) % 4),
        delay: (i * 0.4) % 4,
      })),
    [],
  );
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none -z-[5] overflow-hidden">
      {bands.map((b, i) => (
        <span
          key={i}
          className="absolute left-0 right-0"
          style={{
            top: `${b.y}%`,
            height: b.height,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,77,200,0.5) 30%, rgba(0,221,255,0.5) 60%, transparent 100%)",
            animation: `lt-glitch ${1.5 + (i % 4) * 0.5}s ease-in-out ${b.delay}s infinite`,
            mixBlendMode: "screen",
          }}
        />
      ))}
      <style>{`@keyframes lt-glitch { 0%, 100% { opacity: 0; transform: translateX(-30%); } 40% { opacity: 0.4; transform: translateX(0); } 60% { opacity: 0.2; } 100% { transform: translateX(30%); } }`}</style>
    </div>
  );
}

function AuroraAtmosphere() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none -z-[5]"
      style={{
        background:
          "conic-gradient(from 180deg at 50% 50%, #00f0c8 0deg, #ff4ddd 120deg, #6dffe2 240deg, #00f0c8 360deg)",
        opacity: 0.18,
        filter: "blur(80px)",
        animation: "lt-aurora 14s linear infinite",
      }}
    >
      <style>{`@keyframes lt-aurora { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
