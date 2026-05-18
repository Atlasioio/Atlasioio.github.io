"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { WalkAudio } from "./walkAudio";
import {
  AudioPanel,
  FullscreenButton,
  GlitchOverlay,
  useExperimentTakeover,
} from "./_shared";

// ===== World =====
const WORLD_WIDTH = 6700;
const VIEWPORT_W = 1600;
const VIEWPORT_H = 900;
const GROUND_Y = 720;
const HOME_X = 6080;
const HOME_DOOR_X = 6260;

// ===== Streetlights =====
const STREETLIGHT_X = [400, 1200, 2200, 3450, 4400, 5100, 5700];
const BROKEN_LIGHT_INDEX = 2;
const BROKEN_LIGHT_X = STREETLIGHT_X[BROKEN_LIGHT_INDEX];
const FIX_RANGE = 130;
const FIX_FILL_TIME = 1.4;
const FIX_DECAY = 1.5;
const FIX_SWEET_LO = 0.7;
const FIX_SWEET_HI = 0.92;

// ===== Cat =====
const CAT_HOME_X = 2880;
const CAT_FAR = 360;
const CAT_CAUTIOUS = 240;
const CAT_INVITE = 160; // generous: easier to enter the invite state
const CAT_FAST = 110;
const CAT_VERY_FAST = 150;
const CAT_SLOW = 50;
const CAT_INVITE_DELAY = 0.55;
const CAT_INVITE_TIMEOUT = 6.0; // accommodates the 2.5s pet hold mechanic
// ===== Pet hold mechanic =====
const PET_HOLD_MIN = 1.8; // release before this = too short
const PET_HOLD_MAX = 3.0; // release after this = too long
const PET_BAR_DURATION = 4.0; // bar visualizes 0..4s of hold

// ===== Bench (easter egg) =====
const BENCH_X = 4150;
const BENCH_RANGE = 70;
const BENCH_LINGER = 1.6;

// ===== Lighter (easter egg + tool) =====
const LIGHTER_X = 1700;
const LIGHTER_RANGE = 55;

// ===== Person =====
const PERSON_MAX_SPEED = 160; // brisk walking pace
const PERSON_DEAD_PX = 24; // stop when cursor closer than this
const PERSON_FULL_SPEED_DIST = 320; // cursor distance at which max walking pace is reached

// ===== Static silhouettes / stars =====
function buildCity(seed: number, baseY: number, jagged: number): string {
  let path = `M 0 ${GROUND_Y} `;
  let x = 0;
  let n = seed;
  while (x < WORLD_WIDTH + 200) {
    n = (n * 1103515245 + 12345) >>> 0;
    const w = 50 + (n % 100);
    n = (n * 1103515245 + 12345) >>> 0;
    const h = baseY - (n % jagged);
    path += `L ${x} ${h} L ${x + w} ${h} `;
    x += w;
  }
  path += `L ${WORLD_WIDTH + 200} ${GROUND_Y} Z`;
  return path;
}
const CITY_FAR_PATH = buildCity(7, 590, 100);
const CITY_MID_PATH = buildCity(13, 660, 60);

const STARS: { x: number; y: number; r: number; o: number }[] = (() => {
  const out: { x: number; y: number; r: number; o: number }[] = [];
  let n = 42;
  for (let i = 0; i < 140; i++) {
    n = (n * 1103515245 + 12345) >>> 0;
    const x = n % WORLD_WIDTH;
    n = (n * 1103515245 + 12345) >>> 0;
    const yA = (n % 1000) / 1000;
    n = (n * 1103515245 + 12345) >>> 0;
    const yB = (n % 1000) / 1000;
    const y = 50 + ((yA + yB) / 2) * 470;
    n = (n * 1103515245 + 12345) >>> 0;
    const r = 0.7 + ((n % 100) / 100) * 1.1;
    n = (n * 1103515245 + 12345) >>> 0;
    const o = 0.55 + ((n % 100) / 100) * 0.45;
    out.push({ x, y, r, o });
  }
  return out;
})();

// ===== Context-aware cursors =====
const cursorSvg = (body: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'>${body}</svg>`)}") 14 14, auto`;

const CURSOR_WALK = cursorSvg(
  `<circle cx='14' cy='14' r='2.4' fill='white'/><circle cx='14' cy='14' r='6' fill='none' stroke='white' stroke-opacity='0.35' stroke-width='1'/>`,
);
const CURSOR_FIX = cursorSvg(
  `<g fill='none' stroke='white' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M19 6.5a3.6 3.6 0 0 1-4.3 4.3l-7.5 7.5a1.7 1.7 0 1 1-2.5-2.5l7.5-7.5A3.6 3.6 0 0 1 16.5 4l-2 2 1.5 1.5 2-2L19 6.5z'/></g>`,
);
const CURSOR_PET = cursorSvg(
  `<g fill='white'><circle cx='9' cy='8' r='2.2'/><circle cx='19' cy='8' r='2.2'/><circle cx='5' cy='13' r='1.9'/><circle cx='23' cy='13' r='1.9'/><ellipse cx='14' cy='19' rx='5.4' ry='4.2'/></g>`,
);

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

// ===== Preview — minimal, abstracted to match the other playground tiles =====
export function WalkHomePreview() {
  const personRef = useRef<SVGGElement>(null);
  const catRef = useRef<SVGGElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      if (personRef.current) {
        personRef.current.setAttribute("transform", "translate(110 86)");
      }
      if (catRef.current) {
        catRef.current.setAttribute("transform", "translate(98 86)");
      }
      return;
    }
    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 0.0022; // slow, cozy pace
      const phase = (Math.sin(t) + 1) / 2; // 0 → 1
      const x = 30 + phase * 140;
      const bob = Math.sin(t * 6) * 0.45;
      const catBob = Math.sin(t * 6 + 0.6) * 0.3;
      const catX = x - 12;
      if (personRef.current) {
        personRef.current.setAttribute(
          "transform",
          `translate(${x} ${86 + bob})`,
        );
      }
      if (catRef.current) {
        catRef.current.setAttribute(
          "transform",
          `translate(${catX} ${86 + catBob})`,
        );
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <svg
        viewBox="0 0 200 110"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="wh-prev-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9aa6c8" />
            <stop offset="100%" stopColor="#c8a8be" />
          </linearGradient>
        </defs>
        <rect width="200" height="110" fill="url(#wh-prev-sky)" />
        <circle cx="160" cy="26" r="5" fill="#fff8e8" opacity="0.95" />
        <line
          x1="0"
          y1="86"
          x2="200"
          y2="86"
          stroke="rgba(20,20,40,0.18)"
          strokeWidth="0.5"
        />
        {/* Cat — small, walks ahead of the person, faces right */}
        <g ref={catRef}>
          <path
            d="M -4 -2 Q -6.5 -4 -5.4 -6.6"
            stroke="#1c1f3a"
            strokeWidth="0.7"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="0" cy="-2.6" rx="3.6" ry="1.4" fill="#1c1f3a" />
          <circle cx="3.2" cy="-4.2" r="1.5" fill="#1c1f3a" />
          <polygon points="2.2,-5.4 2.8,-6.6 3.4,-5.4" fill="#1c1f3a" />
          <polygon points="3.4,-5.4 4,-6.6 4.6,-5.4" fill="#1c1f3a" />
          <line
            x1="-1.5"
            y1="-1.4"
            x2="-1.5"
            y2="0.2"
            stroke="#1c1f3a"
            strokeWidth="0.6"
          />
          <line
            x1="2.5"
            y1="-1.4"
            x2="2.5"
            y2="0.2"
            stroke="#1c1f3a"
            strokeWidth="0.6"
          />
        </g>
        {/* Person — simple silhouette */}
        <g ref={personRef}>
          <rect
            x="-1.6"
            y="-12"
            width="3.2"
            height="8"
            rx="1.2"
            fill="#1c1f3a"
          />
          <circle cx="0" cy="-14.2" r="1.8" fill="#1c1f3a" />
        </g>
      </svg>
    </div>
  );
}

// ===== Full =====
type CatState = "idle" | "wary" | "watching" | "inviting" | "befriended" | "scared";
type LightState = "broken" | "breaking" | "dead" | "fixed";

export function WalkHomeFull() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const personGRef = useRef<SVGGElement>(null);
  const personLegLRef = useRef<SVGLineElement>(null);
  const personLegRRef = useRef<SVGLineElement>(null);
  const catGRef = useRef<SVGGElement>(null);
  const catTailRef = useRef<SVGPathElement>(null);
  const catEyeRef = useRef<SVGCircleElement>(null);
  const catLegLRef = useRef<SVGLineElement>(null);
  const catLegRRef = useRef<SVGLineElement>(null);
  const catPrevXRef = useRef(CAT_HOME_X);
  const catPhaseRef = useRef(0);
  const skyRef = useRef<SVGGElement>(null);
  const cityFarRef = useRef<SVGGElement>(null);
  const cityMidRef = useRef<SVGGElement>(null);
  const brokenLampRef = useRef<SVGCircleElement>(null);

  const cameraXRef = useRef(0);
  const personXRef = useRef(120);
  const personVxRef = useRef(0);
  const personFacingRef = useRef(1);
  const phaseRef = useRef(0);
  const idleTimeRef = useRef(0);
  const catXRef = useRef(CAT_HOME_X);
  const catWatchRef = useRef(0);
  const catInviteRef = useRef(0);
  const cursorXNormRef = useRef(0.5);
  const cursorInSceneRef = useRef(false);
  const fixingChargeRef = useRef(0);
  const fixingHeldRef = useRef(false);
  const benchTimerRef = useRef(0);
  const homeRef = useRef(false);
  const lighterFoundRef = useRef(false);
  const gestureStartRef = useRef<{ x: number; y: number } | null>(null);
  const flameOuterRef = useRef<SVGCircleElement>(null);
  const flameInnerRef = useRef<SVGCircleElement>(null);
  const flameAmbientRef = useRef<SVGCircleElement>(null);
  const flameCoreRef = useRef<SVGEllipseElement>(null);
  const sittingRef = useRef(false);
  const shootingStarStartRef = useRef(0);
  const shootingStarRef = useRef<SVGLineElement>(null);
  const lighterOnRef = useRef(false);
  const shootingStarActiveRef = useRef(false);

  const catStateRef = useRef<CatState>("idle");
  const lightStateRef = useRef<LightState>("broken");
  const eggsRef = useRef<Set<string>>(new Set());

  const [catState, setCatStateReact] = useState<CatState>("idle");
  const [lightState, setLightStateReact] = useState<LightState>("broken");
  const [hasMoved, setHasMoved] = useState(false);
  const [home, setHome] = useState(false);
  const [inFixRange, setInFixRange] = useState(false);
  const [fixCharge, setFixCharge] = useState(0);
  const [petPromptVisible, setPetPromptVisible] = useState(false);
  const [petProgress, setPetProgress] = useState(1);
  const [petHoldElapsed, setPetHoldElapsed] = useState(0);
  const [tasks, setTasks] = useState<{ done: Set<string>; failed: Set<string> }>(
    () => ({ done: new Set(), failed: new Set() })
  );
  const [eggs, setEggs] = useState<Set<string>>(() => new Set());
  const [lighterFound, setLighterFound] = useState(false);
  const [lighterOn, setLighterOn] = useState(false);
  const [sitting, setSitting] = useState(false);
  const [inBenchRange, setInBenchRange] = useState(false);
  const [shootingStarActive, setShootingStarActive] = useState(false);
  const [catHeartActive, setCatHeartActive] = useState(false);
  const [petAnim, setPetAnim] = useState(false);
  const [petArmDir, setPetArmDir] = useState(1);
  const petAnimRef = useRef(false);
  const [homeSeq, setHomeSeq] = useState({
    guyAtWindow: false,
    catLeftWindow: false,
    catRightWindow: false,
    lightsOff: false,
  });
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(70);
  const {
    takenOver: walkTakenOver,
    glitching: walkGlitching,
    enter: enterWalkFullscreen,
    exit: exitWalkFullscreen,
  } = useExperimentTakeover();
  const fixAttemptsRef = useRef(0);
  const petHoldingRef = useRef(false);
  const petHoldStartRef = useRef(0);
  const catBefriendedIdleRef = useRef(0);
  const unlockedRef = useRef(false);
  const [unlocked, setUnlocked] = useState(false);
  const [inDoorRange, setInDoorRange] = useState(false);
  const [lighterTooltip, setLighterTooltip] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");
  const [entering, setEntering] = useState(false);
  const enteringRef = useRef(false);
  const audioRef = useRef<WalkAudio | null>(null);
  const wasFixingAudioRef = useRef(false);
  const lastStepBucketRef = useRef(0);

  const reduced = usePrefersReducedMotion();

  // Sync refs to state
  useEffect(() => { eggsRef.current = eggs; }, [eggs]);
  useEffect(() => { lighterFoundRef.current = lighterFound; }, [lighterFound]);
  useEffect(() => { sittingRef.current = sitting; }, [sitting]);
  useEffect(() => { petAnimRef.current = petAnim; }, [petAnim]);
  useEffect(() => { unlockedRef.current = unlocked; }, [unlocked]);
  useEffect(() => { enteringRef.current = entering; }, [entering]);
  useEffect(() => { lighterOnRef.current = lighterOn; }, [lighterOn]);
  useEffect(() => { shootingStarActiveRef.current = shootingStarActive; }, [shootingStarActive]);

  const ensureAudio = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!audioRef.current) {
      try {
        audioRef.current = new WalkAudio();
        // Try the user-supplied track first; falls back to a synth pad if missing.
        audioRef.current
          .startAmbient("/audio/the-walk-home/background-music.mp3")
          .catch(() => {});
      } catch {
        return null;
      }
    }
    audioRef.current.resume();
    return audioRef.current;
  }, []);

  // Lifecycle: dispose audio on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.dispose();
      audioRef.current = null;
    };
  }, []);

  // Sync mute state to audio
  useEffect(() => {
    audioRef.current?.setMuted(muted);
  }, [muted]);

  // Sync volume to audio (also re-asserts mute state when adjusting)
  useEffect(() => {
    audioRef.current?.setVolume(volume, muted);
  }, [volume, muted]);

  // Cat state → audio
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (catState === "inviting") a.playMeow();
    if (catState === "scared") a.catScratch();
    // Stop any lingering purr — was producing a constant hum
    a.stopPurr();
  }, [catState]);

  // Home post-arrival sequence: guy enters right window, cat joins, lights off.
  // Score panel is delayed until after the sequence so the user can watch it.
  useEffect(() => {
    if (!home) return;
    const catWasBefriended = tasks.done.has("befriend-cat");
    const timers: number[] = [];
    timers.push(
      window.setTimeout(
        () => setHomeSeq((s) => ({ ...s, guyAtWindow: true })),
        1600,
      ),
    );
    if (catWasBefriended) {
      timers.push(
        window.setTimeout(
          () => setHomeSeq((s) => ({ ...s, catLeftWindow: true })),
          3300,
        ),
      );
      // Stagger fade-out and fade-in so the cat appears to gracefully move
      timers.push(
        window.setTimeout(
          () => setHomeSeq((s) => ({ ...s, catLeftWindow: false })),
          5600,
        ),
      );
      timers.push(
        window.setTimeout(
          () => setHomeSeq((s) => ({ ...s, catRightWindow: true })),
          6500,
        ),
      );
    }
    timers.push(
      window.setTimeout(
        () => setHomeSeq((s) => ({ ...s, lightsOff: true })),
        8400,
      ),
    );
    return () => timers.forEach((id) => clearTimeout(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [home]);

  // Lighter on/off → use real sound files (with synth fallback)
  const prevLighterRef = useRef(false);
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (lighterOn !== prevLighterRef.current) {
      if (lighterOn) a.playLighterOn();
      else a.playLighterOff();
      prevLighterRef.current = lighterOn;
    }
  }, [lighterOn]);

  const setCat = useCallback((s: CatState) => {
    catStateRef.current = s;
    setCatStateReact(s);
  }, []);
  const setLight = useCallback((s: LightState) => {
    lightStateRef.current = s;
    setLightStateReact(s);
  }, []);

  const handleKeypadInput = useCallback(
    (n: number) => {
      ensureAudio();
      setEnteredCode((prev) => {
        const next = prev + String(n);
        if (next.length >= 3) {
          if (next === "246") {
            unlockedRef.current = true;
            setUnlocked(true);
            audioRef.current?.doorUnlock();
            // Sequence: padlock pops open, person walks into the door, fades, home lands.
            window.setTimeout(() => {
              enteringRef.current = true;
              setEntering(true);
            }, 700);
            window.setTimeout(() => {
              homeRef.current = true;
              setHome(true);
              personVxRef.current = 0;
              cursorInSceneRef.current = false;
            }, 2200);
          } else {
            audioRef.current?.fixFail();
          }
          return "";
        }
        return next;
      });
    },
    [ensureAudio],
  );

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    cursorXNormRef.current = px / rect.width;
    cursorInSceneRef.current = true;
    sceneRef.current.style.setProperty("--mouse-px", `${px}px`);
    sceneRef.current.style.setProperty("--mouse-py", `${py}px`);
    ensureAudio();
    if (!hasMoved) setHasMoved(true);
  }, [hasMoved, ensureAudio]);

  const onLeave = useCallback(() => {
    cursorInSceneRef.current = false;
  }, []);

  // Mouse interactions: click to fix/pet; hold + vertical swipe to toggle lighter
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const SWIPE_THRESHOLD = 60;

    const onDown = (e: MouseEvent) => {
      if (homeRef.current) return;
      if ((e.target as HTMLElement | null)?.closest?.("[data-ui]")) return;
      ensureAudio();

      gestureStartRef.current = { x: e.clientX, y: e.clientY };

      // Pet hold — cat is inviting, start the hold timer
      if (catStateRef.current === "inviting") {
        petHoldingRef.current = true;
        petHoldStartRef.current = performance.now();
        setPetHoldElapsed(0);
        return;
      }

      if (lightStateRef.current === "broken") {
        const dist = Math.abs(personXRef.current - BROKEN_LIGHT_X);
        if (dist < FIX_RANGE) {
          fixingHeldRef.current = true;
        }
      }
    };

    const onUp = (e: MouseEvent) => {
      const start = gestureStartRef.current;
      gestureStartRef.current = null;

      if (!start) {
        // mouseup without recorded start (e.g., started on a UI element)
        if (fixingHeldRef.current) {
          fixingChargeRef.current = 0;
          fixingHeldRef.current = false;
        }
        return;
      }

      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      const adx = Math.abs(dx);
      const ady = Math.abs(dy);

      // Vertical swipe (only if lighter found) takes priority
      if (lighterFoundRef.current && ady > SWIPE_THRESHOLD && ady > adx * 1.2) {
        if (dy < 0) setLighterOn(true);
        else setLighterOn(false);
        fixingChargeRef.current = 0;
        fixingHeldRef.current = false;
        return;
      }

      // Stand up if sitting (any click stands)
      if (sittingRef.current) {
        sittingRef.current = false;
        setSitting(false);
        fixingChargeRef.current = 0;
        fixingHeldRef.current = false;
        return;
      }

      // Pet cat — evaluate the hold duration
      if (petHoldingRef.current) {
        const heldFor =
          (performance.now() - petHoldStartRef.current) / 1000;
        petHoldingRef.current = false;
        setPetHoldElapsed(0);
        if (heldFor >= PET_HOLD_MIN && heldFor <= PET_HOLD_MAX) {
          setCat("befriended");
          setTasks((prev) => {
            const done = new Set(prev.done);
            done.add("befriend-cat");
            return { done, failed: prev.failed };
          });
          setPetAnim(true);
          window.setTimeout(() => setPetAnim(false), 850);
          setCatHeartActive(true);
          window.setTimeout(() => setCatHeartActive(false), 1700);
        } else {
          setCat("scared");
          setTasks((prev) => {
            const failed = new Set(prev.failed);
            failed.add("befriend-cat");
            return { done: prev.done, failed };
          });
        }
        fixingChargeRef.current = 0;
        fixingHeldRef.current = false;
        return;
      }

      // Fix evaluation (release on sweet spot)
      if (fixingHeldRef.current) {
        const charge = fixingChargeRef.current;
        if (charge >= FIX_SWEET_LO && charge <= FIX_SWEET_HI) {
          setLight("fixed");
          audioRef.current?.playLampRepaired();
          setTasks((prev) => {
            const done = new Set(prev.done);
            done.add("fix-light");
            return { done, failed: prev.failed };
          });
        } else {
          audioRef.current?.fixFail();
          fixAttemptsRef.current += 1;
          if (fixAttemptsRef.current >= 2) {
            setLight("breaking");
            audioRef.current?.lightBreak();
            setTasks((prev) => {
              const failed = new Set(prev.failed);
              failed.add("fix-light");
              return { done: prev.done, failed };
            });
            window.setTimeout(() => setLight("dead"), 1500);
          }
        }
        fixingChargeRef.current = 0;
        fixingHeldRef.current = false;
        return;
      }

      // (Door unlock is handled by the keypad UI, not a single click.)

      // Sit on bench (must be in range)
      const distToBenchClick = Math.abs(personXRef.current - BENCH_X);
      if (distToBenchClick < 90 && !homeRef.current) {
        sittingRef.current = true;
        setSitting(true);
        personVxRef.current = 0;
        personXRef.current = BENCH_X;
        shootingStarStartRef.current = performance.now();
        setShootingStarActive(true);
        audioRef.current?.benchSit();
        window.setTimeout(() => audioRef.current?.shootingStar(), 250);
        window.setTimeout(() => setShootingStarActive(false), 2500);
        setEggs((prev) => {
          if (prev.has("bench")) return prev;
          const next = new Set(prev);
          next.add("bench");
          return next;
        });
      }
    };

    scene.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      scene.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [setCat, setLight]);

  // RAF
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let lastInFix = false;
    let lastPetVisible = false;
    let lastInBench = false;
    let lastInDoor = false;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // ---- Input -> walk toward cursor (target-based, slower when closer)
      let vTarget = 0;
      if (enteringRef.current && !homeRef.current) {
        // Auto-walk into the door after the unlock
        vTarget = 70;
      } else if (
        cursorInSceneRef.current &&
        !sittingRef.current &&
        !homeRef.current &&
        !petAnimRef.current &&
        !petHoldingRef.current
      ) {
        const cursorWorldX = cursorXNormRef.current * VIEWPORT_W + cameraXRef.current;
        const dx = cursorWorldX - personXRef.current;
        const adx = Math.abs(dx);
        if (adx > PERSON_DEAD_PX) {
          const sign = Math.sign(dx);
          const inten = Math.min(
            1,
            (adx - PERSON_DEAD_PX) / (PERSON_FULL_SPEED_DIST - PERSON_DEAD_PX),
          );
          vTarget = sign * inten * PERSON_MAX_SPEED;
        }
      }
      personVxRef.current += (vTarget - personVxRef.current) * 0.12;
      if (vTarget === 0 && Math.abs(personVxRef.current) < 5) personVxRef.current = 0;
      let maxXLimit = HOME_DOOR_X;
      if (unlockedRef.current) {
        maxXLimit = enteringRef.current ? HOME_DOOR_X + 90 : WORLD_WIDTH - 40;
      }
      personXRef.current = Math.max(
        40,
        Math.min(maxXLimit, personXRef.current + personVxRef.current * dt),
      );
      const speed = Math.abs(personVxRef.current);
      if (speed > 8) personFacingRef.current = personVxRef.current > 0 ? 1 : -1;

      // ---- Camera
      const camTarget = Math.max(0, Math.min(WORLD_WIDTH - VIEWPORT_W, personXRef.current - VIEWPORT_W * 0.5));
      cameraXRef.current += (camTarget - cameraXRef.current) * 0.1;

      // ---- Phases (continuous gait phase tied to actual distance)
      if (!reduced) phaseRef.current += speed * dt * 0.1;
      idleTimeRef.current += dt;

      // ---- Audio: walking step trigger (per half-cycle of gait phase)
      if (audioRef.current && !reduced && !sittingRef.current) {
        const bucket = Math.floor(phaseRef.current / Math.PI);
        if (bucket !== lastStepBucketRef.current && speed > 8) {
          audioRef.current.step();
        }
        lastStepBucketRef.current = bucket;
      }

      // ---- Audio: lamp buzz proximity
      if (audioRef.current) {
        let nearest = Infinity;
        for (const lx of STREETLIGHT_X) {
          if (
            lx === BROKEN_LIGHT_X &&
            (lightStateRef.current === "dead" ||
              lightStateRef.current === "breaking")
          )
            continue;
          const d = Math.abs(lx - personXRef.current);
          if (d < nearest) nearest = d;
        }
        const buzz = Math.max(0, 1 - nearest / 220);
        audioRef.current.setBuzzVolume(buzz);
      }

      // ---- Audio: fix-charge tone
      if (audioRef.current) {
        if (fixingHeldRef.current && !wasFixingAudioRef.current) {
          audioRef.current.startCharge();
          wasFixingAudioRef.current = true;
        }
        if (!fixingHeldRef.current && wasFixingAudioRef.current) {
          audioRef.current.stopCharge();
          wasFixingAudioRef.current = false;
        }
        if (fixingHeldRef.current) {
          audioRef.current.setChargeLevel(fixingChargeRef.current);
        }
      }

      // ---- Apply camera (viewBox + CSS var for HTML)
      svgRef.current?.setAttribute("viewBox", `${cameraXRef.current} 0 ${VIEWPORT_W} ${VIEWPORT_H}`);
      sceneRef.current?.style.setProperty("--cam-x", String(cameraXRef.current));
      sceneRef.current?.style.setProperty("--cat-x", String(catXRef.current));

      // ---- Parallax
      skyRef.current?.setAttribute("transform", `translate(${cameraXRef.current * 0.92} 0)`);
      cityFarRef.current?.setAttribute("transform", `translate(${cameraXRef.current * 0.6} 0)`);
      cityMidRef.current?.setAttribute("transform", `translate(${cameraXRef.current * 0.35} 0)`);

      // ---- Person (sitting overrides; otherwise blend walk-bob + idle-breath)
      const moveT = Math.min(1, speed / 30);
      if (personGRef.current) {
        if (sittingRef.current) {
          personGRef.current.setAttribute(
            "transform",
            `translate(${personXRef.current} ${GROUND_Y + 18}) scale(${personFacingRef.current} 1)`,
          );
        } else {
          const walkBob = !reduced ? Math.sin(phaseRef.current * 2) * -1.1 * moveT : 0;
          const idleBob = Math.sin(idleTimeRef.current * 1.6) * -0.5 * (1 - moveT);
          const bob = walkBob + idleBob;
          personGRef.current.setAttribute(
            "transform",
            `translate(${personXRef.current} ${GROUND_Y + bob}) scale(${personFacingRef.current} 1)`,
          );
        }
      }
      if (sittingRef.current) {
        // Legs swing forward 70deg around the hip pivot — feet end up dangling forward.
        personLegLRef.current?.setAttribute("transform", `rotate(72 0 -50)`);
        personLegRRef.current?.setAttribute("transform", `rotate(72 0 -50)`);
      } else {
        const swing = !reduced ? Math.sin(phaseRef.current) * 13 * moveT : 0;
        personLegLRef.current?.setAttribute("transform", `rotate(${swing} 0 -50)`);
        personLegRRef.current?.setAttribute("transform", `rotate(${-swing} 0 -50)`);
      }

      // ---- Cat state machine
      const cs = catStateRef.current;
      const dx = personXRef.current - catXRef.current;
      const dist = Math.abs(dx);
      switch (cs) {
        case "idle":
          if (dist < CAT_CAUTIOUS) {
            if (speed > CAT_FAST) setCat("wary");
            else if (speed < CAT_SLOW) {
              setCat("watching");
              catWatchRef.current = 0;
            }
          }
          break;
        case "wary": {
          // Back away gently but stay within visible range so cat doesn't disappear.
          const away = -Math.sign(dx) * 50 * dt;
          catXRef.current = Math.max(
            CAT_HOME_X - 180,
            Math.min(CAT_HOME_X + 180, catXRef.current + away),
          );
          if (dist > CAT_FAR) {
            setCat("idle");
          } else if (speed < CAT_SLOW && dist < CAT_CAUTIOUS) {
            // User has slowed and is still nearby — cat starts to relax.
            setCat("watching");
            catWatchRef.current = 0;
          }
          break;
        }
        case "watching":
          if (speed > CAT_FAST) setCat("wary");
          else if (dist > CAT_FAR) setCat("idle");
          else if (dist < CAT_INVITE) {
            catWatchRef.current += dt;
            if (catWatchRef.current > CAT_INVITE_DELAY) {
              setCat("inviting");
              catInviteRef.current = 0;
            }
          }
          break;
        case "inviting":
          catInviteRef.current += dt;
          // Only abort the invite for genuinely fast movement — small twitches
          // of the cursor shouldn't lose the cat.
          if (
            catInviteRef.current > CAT_INVITE_TIMEOUT ||
            speed > CAT_VERY_FAST
          ) {
            setCat("scared");
            setTasks((prev) => {
              const failed = new Set(prev.failed);
              failed.add("befriend-cat");
              return { done: prev.done, failed };
            });
          }
          break;
        case "befriended": {
          if (sittingRef.current) {
            // Cat sits on the opposite side from where the person is facing
            const sitTarget = BENCH_X - 36 * personFacingRef.current;
            catXRef.current += (sitTarget - catXRef.current) * 0.08;
            catBefriendedIdleRef.current = 0;
          } else {
            const followX = personXRef.current - 70 * personFacingRef.current;
            catXRef.current += (followX - catXRef.current) * 0.06;
            // Stand still close to the cat for a few seconds → it asks for another pet
            if (speed < CAT_SLOW && dist < CAT_INVITE) {
              catBefriendedIdleRef.current += dt;
              if (catBefriendedIdleRef.current > 3) {
                catBefriendedIdleRef.current = 0;
                setCat("inviting");
                catInviteRef.current = 0;
              }
            } else {
              catBefriendedIdleRef.current = 0;
            }
          }
          break;
        }
        case "scared": {
          const targetX = WORLD_WIDTH + 200;
          catXRef.current += (targetX - catXRef.current) * 0.04;
          break;
        }
      }

      // pet UI
      const showPet = catStateRef.current === "inviting";
      if (showPet !== lastPetVisible) {
        lastPetVisible = showPet;
        setPetPromptVisible(showPet);
      }
      if (showPet) setPetProgress(Math.max(0, 1 - catInviteRef.current / CAT_INVITE_TIMEOUT));

      // Pet hold tracking — drives the visible bar and auto-fails if held forever
      if (petHoldingRef.current) {
        const elapsed = (performance.now() - petHoldStartRef.current) / 1000;
        setPetHoldElapsed(elapsed);
        if (elapsed > PET_HOLD_MAX + 1.0) {
          petHoldingRef.current = false;
          setPetHoldElapsed(0);
          setCat("scared");
          setTasks((prev) => {
            const failed = new Set(prev.failed);
            failed.add("befriend-cat");
            return { done: prev.done, failed };
          });
        }
      }

      if (catGRef.current) {
        const catSittingOnBench =
          sittingRef.current && catStateRef.current === "befriended";
        const catY = catSittingOnBench ? GROUND_Y - 30 : GROUND_Y;
        catGRef.current.setAttribute(
          "transform",
          `translate(${catXRef.current} ${catY})`,
        );
      }
      if (catTailRef.current && !reduced) {
        const wagSpeed = catStateRef.current === "befriended" ? 1.6 : (catStateRef.current === "wary" || catStateRef.current === "scared") ? 2.0 : 0.85;
        const wagAmp = catStateRef.current === "befriended" ? 22 : (catStateRef.current === "wary" || catStateRef.current === "scared") ? 22 : 11;
        const t = Math.sin(phaseRef.current * wagSpeed + 0.6) * wagAmp;
        catTailRef.current.setAttribute("transform", `rotate(${t} -22 -12)`);
      }
      if (catEyeRef.current) {
        const bright = catStateRef.current === "watching" || catStateRef.current === "inviting" ? "#fff8d8" : "#cfc8a3";
        catEyeRef.current.setAttribute("fill", bright);
      }

      // ---- Cat leg animation (swing when moving)
      const catDx = catXRef.current - catPrevXRef.current;
      catPrevXRef.current = catXRef.current;
      const catSpeedAbs = Math.abs(catDx / Math.max(dt, 0.001));
      if (catSpeedAbs > 5 && !reduced) {
        catPhaseRef.current += catSpeedAbs * dt * 0.18;
      }
      const catSwing = catSpeedAbs > 4 && !reduced ? Math.sin(catPhaseRef.current) * 22 : 0;
      catLegLRef.current?.setAttribute("transform", `rotate(${catSwing} -10 -3)`);
      catLegRRef.current?.setAttribute("transform", `rotate(${-catSwing} 14 -3)`);

      // ---- Broken lamp visual (flicker / shake on break)
      if (brokenLampRef.current) {
        const ls = lightStateRef.current;
        if (ls === "broken") {
          const flick = Math.random() < 0.6 ? 0.45 + Math.random() * 0.55 : 0.1;
          brokenLampRef.current.setAttribute("fill-opacity", String(flick));
          brokenLampRef.current.setAttribute("cx", String(BROKEN_LIGHT_X + 24));
        } else if (ls === "breaking") {
          const flick = Math.random() < 0.4 ? 0.7 + Math.random() * 0.3 : 0.05;
          brokenLampRef.current.setAttribute("fill-opacity", String(flick));
          const shake = Math.sin(idleTimeRef.current * 70) * 2.5;
          brokenLampRef.current.setAttribute(
            "cx",
            String(BROKEN_LIGHT_X + 24 + shake),
          );
        } else {
          brokenLampRef.current.setAttribute("fill-opacity", "1");
          brokenLampRef.current.setAttribute("cx", String(BROKEN_LIGHT_X + 24));
        }
      }

      // ---- Fix range / charge
      const distToBroken = Math.abs(personXRef.current - BROKEN_LIGHT_X);
      const inRange = distToBroken < FIX_RANGE && lightStateRef.current === "broken";
      if (inRange !== lastInFix) {
        lastInFix = inRange;
        setInFixRange(inRange);
      }
      if (fixingHeldRef.current && inRange) {
        fixingChargeRef.current = Math.min(1, fixingChargeRef.current + dt / FIX_FILL_TIME);
      } else if (!fixingHeldRef.current) {
        fixingChargeRef.current = Math.max(0, fixingChargeRef.current - dt * FIX_DECAY);
      }
      setFixCharge(fixingChargeRef.current);

      // ---- Bench range tracking (prompt to sit)
      const distToBench = Math.abs(personXRef.current - BENCH_X);
      const inBench = distToBench < 90 && !sittingRef.current && !homeRef.current;
      if (inBench !== lastInBench) {
        lastInBench = inBench;
        setInBenchRange(inBench);
      }

      // ---- Flame flicker (subtle organic motion when lighter is on)
      if (lighterOnRef.current) {
        const t1 = idleTimeRef.current;
        const flick = 0.92 + Math.sin(t1 * 11.3) * 0.05 + Math.sin(t1 * 17.8 + 0.7) * 0.03;
        flameOuterRef.current?.setAttribute("opacity", String(flick));
        flameInnerRef.current?.setAttribute("opacity", String(flick * 0.95 + 0.05));
        flameAmbientRef.current?.setAttribute("opacity", String(0.85 + Math.sin(t1 * 5.7) * 0.1));
        if (flameCoreRef.current) {
          const cy = -99 + Math.sin(t1 * 9.1) * 0.4;
          const ry = 3 + Math.sin(t1 * 11.7) * 0.25;
          flameCoreRef.current.setAttribute("cy", String(cy));
          flameCoreRef.current.setAttribute("ry", String(ry));
        }
      }

      // ---- Shooting star animation
      if (shootingStarActiveRef.current && shootingStarRef.current) {
        const elapsed = (now - shootingStarStartRef.current) / 2500;
        const layer = shootingStarRef.current;
        if (elapsed >= 0 && elapsed <= 1) {
          const startX = 220;
          const startY = 90;
          const endX = 1280;
          const endY = 240;
          const x = startX + (endX - startX) * elapsed;
          const y = startY + (endY - startY) * elapsed;
          const dx_s = endX - startX;
          const dy_s = endY - startY;
          const len = Math.hypot(dx_s, dy_s);
          const ux = dx_s / len;
          const uy = dy_s / len;
          const tail = 90;
          const tailX = x - ux * tail;
          const tailY = y - uy * tail;
          let opacity = 1;
          if (elapsed < 0.12) opacity = elapsed / 0.12;
          else if (elapsed > 0.88) opacity = (1 - elapsed) / 0.12;
          layer.setAttribute("x1", String(tailX));
          layer.setAttribute("y1", String(tailY));
          layer.setAttribute("x2", String(x));
          layer.setAttribute("y2", String(y));
          layer.setAttribute("stroke-opacity", String(opacity));
          layer.setAttribute(
            "transform",
            `translate(${cameraXRef.current} 0)`,
          );
        }
      }

      // ---- Lighter pickup
      if (!lighterFoundRef.current) {
        const distToLighter = Math.abs(personXRef.current - LIGHTER_X);
        if (distToLighter < LIGHTER_RANGE) {
          lighterFoundRef.current = true;
          setLighterFound(true);
          setLighterTooltip(true);
          window.setTimeout(() => setLighterTooltip(false), 5000);
          setEggs((prev) => {
            if (prev.has("lighter")) return prev;
            const next = new Set(prev);
            next.add("lighter");
            return next;
          });
        }
      }

      // ---- Door range (for unlock prompt)
      const distToDoor = Math.abs(personXRef.current - HOME_DOOR_X);
      const inDoor =
        distToDoor < 80 && !homeRef.current && !unlockedRef.current;
      if (inDoor !== lastInDoor) {
        lastInDoor = inDoor;
        setInDoorRange(inDoor);
      }

      // ---- Home (lock person + camera at the door, only after unlocking)
      if (
        !homeRef.current &&
        unlockedRef.current &&
        personXRef.current >= HOME_DOOR_X - 8
      ) {
        homeRef.current = true;
        setHome(true);
        personVxRef.current = 0;
        personXRef.current = HOME_DOOR_X;
        cursorInSceneRef.current = false;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, setCat]);

  // === Render ===
  const fixActive = inFixRange && lightState === "broken";
  const cursor = home
    ? "auto"
    : petPromptVisible
      ? CURSOR_PET
      : fixActive
        ? CURSOR_FIX
        : CURSOR_WALK;

  return (
    <>
    <div
      ref={sceneRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={
        walkTakenOver
          ? "fixed inset-0 z-[60] overflow-hidden"
          : "relative w-full aspect-[16/9] overflow-hidden"
      }
      style={{ cursor }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEWPORT_W} ${VIEWPORT_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="wh-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b1638" />
            <stop offset="55%" stopColor="#1f2750" />
            <stop offset="100%" stopColor="#321f4c" />
          </linearGradient>
          <radialGradient id="wh-moonGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(255,250,235,0.55)" />
            <stop offset="60%" stopColor="rgba(255,250,235,0.18)" />
            <stop offset="100%" stopColor="rgba(255,250,235,0)" />
          </radialGradient>
          <radialGradient id="wh-nebula" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(135,110,200,0.18)" />
            <stop offset="55%" stopColor="rgba(80,120,200,0.08)" />
            <stop offset="100%" stopColor="rgba(80,120,200,0)" />
          </radialGradient>
          <linearGradient id="wh-cone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,201,122,0.45)" />
            <stop offset="100%" stopColor="rgba(255,201,122,0)" />
          </linearGradient>
          <radialGradient id="wh-window" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(255,201,122,0.7)" />
            <stop offset="100%" stopColor="rgba(255,201,122,0)" />
          </radialGradient>
          <radialGradient id="wh-flameAmbient" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(255,170,80,0.22)" />
            <stop offset="40%" stopColor="rgba(255,170,80,0.08)" />
            <stop offset="80%" stopColor="rgba(255,170,80,0.02)" />
            <stop offset="100%" stopColor="rgba(255,170,80,0)" />
          </radialGradient>
          <radialGradient id="wh-flameOuter" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(255,180,90,0.55)" />
            <stop offset="25%" stopColor="rgba(255,180,90,0.32)" />
            <stop offset="55%" stopColor="rgba(255,180,90,0.14)" />
            <stop offset="80%" stopColor="rgba(255,180,90,0.04)" />
            <stop offset="100%" stopColor="rgba(255,180,90,0)" />
          </radialGradient>
          <radialGradient id="wh-flameInner" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(255,238,200,0.92)" />
            <stop offset="35%" stopColor="rgba(255,225,170,0.55)" />
            <stop offset="70%" stopColor="rgba(255,225,170,0.18)" />
            <stop offset="100%" stopColor="rgba(255,225,170,0)" />
          </radialGradient>
          {/* Person body shading — moonlit from upper-left */}
          <radialGradient id="wh-head" cx="0.32" cy="0.28" r="0.78">
            <stop offset="0%" stopColor="#2e3043" />
            <stop offset="55%" stopColor="#181924" />
            <stop offset="100%" stopColor="#080910" />
          </radialGradient>
          <linearGradient id="wh-body" x1="0.2" y1="0" x2="0.85" y2="1">
            <stop offset="0%" stopColor="#262836" />
            <stop offset="100%" stopColor="#0a0b13" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width={WORLD_WIDTH} height={VIEWPORT_H} fill="url(#wh-sky)" />

        <g ref={skyRef}>
          {/* Soft distant nebula — gives the sky depth and a hint of color */}
          <ellipse cx="540" cy="220" rx="640" ry="160" fill="url(#wh-nebula)" />
          <ellipse cx="2200" cy="160" rx="780" ry="140" fill="url(#wh-nebula)" opacity="0.7" />
          <circle cx="1300" cy="180" r="240" fill="url(#wh-moonGlow)" />
          <circle cx="1300" cy="180" r="44" fill="#fffdf2" opacity="0.98" />
          {/* Faint craters */}
          <circle cx="1288" cy="170" r="4" fill="rgba(75,70,95,0.16)" />
          <circle cx="1310" cy="190" r="3.2" fill="rgba(75,70,95,0.14)" />
          <circle cx="1318" cy="172" r="2.2" fill="rgba(75,70,95,0.12)" />
          <circle cx="1294" cy="196" r="2.6" fill="rgba(75,70,95,0.13)" />
          <circle cx="1305" cy="178" r="1.6" fill="rgba(75,70,95,0.10)" />
          {STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity={s.o} />
          ))}
          {/* A few "highlight stars" with a soft halo for wonder */}
          <g>
            <circle cx="380" cy="220" r="18" fill="white" opacity="0.06" />
            <circle cx="380" cy="220" r="2.2" fill="white" opacity="0.95" />
            <circle cx="980" cy="140" r="16" fill="white" opacity="0.05" />
            <circle cx="980" cy="140" r="1.9" fill="white" opacity="0.92" />
            <circle cx="1640" cy="320" r="20" fill="white" opacity="0.06" />
            <circle cx="1640" cy="320" r="2.4" fill="white" opacity="0.95" />
            <circle cx="2480" cy="190" r="18" fill="white" opacity="0.06" />
            <circle cx="2480" cy="190" r="2.1" fill="white" opacity="0.92" />
          </g>
        </g>

        <g ref={cityFarRef}>
          <path d={CITY_FAR_PATH} fill="#070a18" />
        </g>
        <g ref={cityMidRef}>
          <path d={CITY_MID_PATH} fill="#04060f" />
        </g>

        <rect x="0" y={GROUND_Y} width={WORLD_WIDTH + 400} height={VIEWPORT_H - GROUND_Y} fill="#03040c" />
        <line x1="0" y1={GROUND_Y} x2={WORLD_WIDTH} y2={GROUND_Y} stroke="rgba(120,120,160,0.08)" strokeWidth="1" />

        {/* Streetlights */}
        {STREETLIGHT_X.map((x, i) => {
          if (i === BROKEN_LIGHT_INDEX) return null;
          return (
            <g key={i}>
              <line x1={x} y1={GROUND_Y} x2={x} y2="420" stroke="#0c1424" strokeWidth="4" />
              <line x1={x} y1="420" x2={x + 22} y2="420" stroke="#0c1424" strokeWidth="3" />
              <circle cx={x + 24} cy="426" r="7" fill="#ffd17a" />
              <circle cx={x + 24} cy="426" r="22" fill="rgba(255,201,122,0.28)" />
              <polygon
                points={`${x + 24},432 ${x - 60},${GROUND_Y} ${x + 108},${GROUND_Y}`}
                fill="url(#wh-cone)"
              />
            </g>
          );
        })}

        {/* Broken streetlight */}
        <g>
          <line x1={BROKEN_LIGHT_X} y1={GROUND_Y} x2={BROKEN_LIGHT_X} y2="420" stroke="#0c1424" strokeWidth="4" />
          <line x1={BROKEN_LIGHT_X} y1="420" x2={BROKEN_LIGHT_X + 22} y2="420" stroke="#0c1424" strokeWidth="3" />
          <circle
            ref={brokenLampRef}
            cx={BROKEN_LIGHT_X + 24}
            cy="426"
            r="7"
            fill={
              lightState === "fixed"
                ? "#ffd17a"
                : lightState === "dead"
                  ? "#2a2a36"
                  : "#ff8a3a"
            }
            fillOpacity="1"
          />
          {lightState === "fixed" && (
            <>
              <circle cx={BROKEN_LIGHT_X + 24} cy="426" r="22" fill="rgba(255,201,122,0.28)" />
              <polygon
                points={`${BROKEN_LIGHT_X + 24},432 ${BROKEN_LIGHT_X - 60},${GROUND_Y} ${BROKEN_LIGHT_X + 108},${GROUND_Y}`}
                fill="url(#wh-cone)"
              />
            </>
          )}
        </g>

        {/* Lighter (easter egg pickup) */}
        {!lighterFound && (
          <g transform={`translate(${LIGHTER_X} ${GROUND_Y})`}>
            <circle cx="0" cy="-3" r="14" fill="rgba(255,180,100,0.08)" />
            <circle cx="0" cy="-3" r="7" fill="rgba(255,180,100,0.18)" />
            <rect x="-2.5" y="-7" width="5" height="6" rx="0.6" fill="#3a3a52" />
            <ellipse cx="0" cy="-9" rx="1.2" ry="2.2" fill="#ffb04a" opacity="0.9" />
            <circle cx="0" cy="-10" r="0.6" fill="#fff8d8" />
          </g>
        )}

        {/* Bench (wider — fits a person + a cat) */}
        <g transform={`translate(${BENCH_X} ${GROUND_Y})`}>
          {/* Seat */}
          <rect x="-48" y="-30" width="96" height="6" rx="1" fill="#1a1f3d" />
          {/* Back posts */}
          <rect x="-44" y="-50" width="3" height="20" fill="#1a1f3d" />
          <rect x="41" y="-50" width="3" height="20" fill="#1a1f3d" />
          {/* Back rail */}
          <rect x="-43" y="-50" width="86" height="3" rx="1" fill="#1a1f3d" />
          {/* Front legs */}
          <rect x="-44" y="-26" width="3" height="26" fill="#1a1f3d" />
          <rect x="41" y="-26" width="3" height="26" fill="#1a1f3d" />
        </g>

        {/* Home building (centered around HOME_DOOR_X = HOME_X + 180) */}
        <g transform={`translate(${HOME_X} ${GROUND_Y})`}>
          {/* Soft window glow (off when lights are out) */}
          {!homeSeq.lightsOff && (
            <>
              <circle cx="88" cy="-190" r="140" fill="url(#wh-window)" opacity="0.55" />
              <circle cx="272" cy="-190" r="140" fill="url(#wh-window)" opacity="0.55" />
            </>
          )}
          {/* House body */}
          <rect x="0" y="-280" width="360" height="280" fill="#0a0a18" />
          {/* Roof */}
          <polygon points="0,-280 180,-360 360,-280" fill="#0a0a18" />
          {/* Door */}
          <rect x="158" y="-130" width="44" height="110" rx="1" fill="#3a2a18" />
          <circle cx="195" cy="-78" r="2" fill="#5a4028" />
          {/* Padlock (locked) */}
          {!unlocked && !home && (
            <g transform="translate(180, -50)">
              <rect x="-4" y="-2" width="8" height="8" rx="1" fill="#7a5a38" />
              <path
                d="M -3 -2 Q -3 -6 0 -6 Q 3 -6 3 -2"
                stroke="#7a5a38"
                strokeWidth="1.2"
                fill="none"
              />
              <circle cx="0" cy="2" r="0.9" fill="#1a1a22" />
            </g>
          )}
          {/* Padlock (unlocked) — fades in for a moment */}
          {unlocked && !home && (
            <g transform="translate(180, -50)">
              <g className="wh-window-figure">
                <rect x="-4" y="-2" width="8" height="8" rx="1" fill="#7a5a38" opacity="0.55" />
                <path
                  d="M -3 -2 Q -3 -6 0 -6 Q 4 -6 5 -3"
                  stroke="#7a5a38"
                  strokeWidth="1.2"
                  fill="none"
                  opacity="0.55"
                />
              </g>
            </g>
          )}
          {/* Windows (warm when on, dark when off) */}
          <rect
            x="58"
            y="-220"
            width="60"
            height="60"
            fill={homeSeq.lightsOff ? "#0a0a18" : "#ffc97a"}
            opacity={homeSeq.lightsOff ? 1 : 0.92}
            style={{ transition: "fill 600ms ease-out, opacity 600ms ease-out" }}
          />
          <rect
            x="242"
            y="-220"
            width="60"
            height="60"
            fill={homeSeq.lightsOff ? "#0a0a18" : "#ffc97a"}
            opacity={homeSeq.lightsOff ? 1 : 0.92}
            style={{ transition: "fill 600ms ease-out, opacity 600ms ease-out" }}
          />

          {/* Figures inside the windows — always mounted; opacity drives smooth fade */}
          <g
            transform="translate(272, -188)"
            style={{
              opacity:
                homeSeq.guyAtWindow && !homeSeq.lightsOff ? 1 : 0,
              transition: "opacity 0.85s ease-out",
            }}
          >
            <rect x="-10" y="-6" width="20" height="22" rx="2" fill="#15161e" />
            <circle cx="0" cy="-12" r="7" fill="#15161e" />
          </g>
          <g
            transform="translate(88, -188)"
            style={{
              opacity:
                homeSeq.catLeftWindow && !homeSeq.lightsOff ? 1 : 0,
              transition: "opacity 0.85s ease-out",
            }}
          >
            <ellipse cx="0" cy="2" rx="11" ry="4" fill="#15161e" />
            <circle cx="6" cy="-3" r="4.5" fill="#15161e" />
            <polygon points="3,-7 5,-10 7,-7" fill="#15161e" />
            <polygon points="7,-7 9,-10 11,-7" fill="#15161e" />
          </g>
          <g
            transform="translate(252, -188)"
            style={{
              opacity:
                homeSeq.catRightWindow && !homeSeq.lightsOff ? 1 : 0,
              transition: "opacity 0.85s ease-out",
            }}
          >
            <ellipse cx="0" cy="2" rx="11" ry="4" fill="#15161e" />
            <circle cx="6" cy="-3" r="4.5" fill="#15161e" />
            <polygon points="3,-7 5,-10 7,-7" fill="#15161e" />
            <polygon points="7,-7 9,-10 11,-7" fill="#15161e" />
          </g>
        </g>

        {/* Cat */}
        <g
          ref={catGRef}
          transform={`translate(${CAT_HOME_X} ${GROUND_Y})`}
          style={{
            visibility:
              homeSeq.catLeftWindow || homeSeq.catRightWindow
                ? "hidden"
                : "visible",
          }}
        >
          <g key={petAnim ? "pet" : "idle"} className={petAnim ? "wh-cat-pet" : ""}>
            {sitting && catState === "befriended" ? (
              // Sitting on the bench beside us, facing forward (away from camera)
              <g>
                {/* When the lighter is on, paint a soft warm hint on the cat
                    so it reads against the dark bench (subtle, not a glow) */}
                {lighterOn && (
                  <circle
                    cx="0"
                    cy="-12"
                    r="26"
                    fill="url(#wh-flameOuter)"
                    opacity="0.6"
                  />
                )}
                <path
                  ref={catTailRef}
                  d="M 10 -2 Q 18 -4 14 -14"
                  stroke={lighterOn ? "#1f1a1d" : "#13141d"}
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Upright body */}
                <ellipse cx="0" cy="-9" rx="9" ry="13" fill={lighterOn ? "#1f1a1d" : "#13141d"} />
                {/* Head, centered (back of head) */}
                <circle cx="0" cy="-26" r="8" fill={lighterOn ? "#1f1a1d" : "#13141d"} />
                {/* Ears */}
                <polygon points="-6,-31 -3,-36 0,-31" fill={lighterOn ? "#1f1a1d" : "#13141d"} />
                <polygon points="0,-31 3,-36 6,-31" fill={lighterOn ? "#1f1a1d" : "#13141d"} />
                {/* Front paws */}
                <line x1="-3" y1="2" x2="-3" y2="-1" stroke={lighterOn ? "#1f1a1d" : "#13141d"} strokeWidth="3" strokeLinecap="round" />
                <line x1="3" y1="2" x2="3" y2="-1" stroke={lighterOn ? "#1f1a1d" : "#13141d"} strokeWidth="3" strokeLinecap="round" />
              </g>
            ) : (
              <g>
                {/* Soft moonlight rim (drawn slightly larger and offset up) */}
                <ellipse cx="0" cy="-13" rx="23" ry="10" fill="rgba(255,250,210,0.1)" />
                <circle cx="20" cy="-20" r="10" fill="rgba(255,250,210,0.1)" />
                <path
                  ref={catTailRef}
                  d="M -22 -12 Q -34 -22 -30 -34"
                  stroke="#13141d"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                <ellipse cx="0" cy="-12" rx="22" ry="9" fill="#13141d" />
                <circle cx="20" cy="-19" r="9" fill="#13141d" />
                <polygon points="14,-26 17,-32 20,-26" fill="#13141d" />
                <polygon points="20,-26 23,-32 26,-26" fill="#13141d" />
                <line ref={catLegLRef} x1="-10" y1="-3" x2="-10" y2="4" stroke="#13141d" strokeWidth="4" strokeLinecap="round" />
                <line ref={catLegRRef} x1="14" y1="-3" x2="14" y2="4" stroke="#13141d" strokeWidth="4" strokeLinecap="round" />
                <circle cx="22.5" cy="-20" r="3.5" fill="rgba(255,250,210,0.18)" />
                <circle ref={catEyeRef} cx="22.5" cy="-20" r="1.5" fill="#fff8d8" opacity="0.95" />
              </g>
            )}
            {catHeartActive && (
              <g className="wh-cat-heart">
                <text
                  x="0"
                  y="-32"
                  textAnchor="middle"
                  fontSize="22"
                  fill="#ff6a8a"
                >
                  ♥
                </text>
              </g>
            )}
          </g>
        </g>

        {/* Person */}
        <g
          ref={personGRef}
          style={{
            visibility: homeSeq.guyAtWindow ? "hidden" : "visible",
            opacity: entering ? 0 : 1,
            transition:
              "visibility 0.4s, opacity 0.9s ease-in" +
              (entering ? " 0.6s" : ""),
          }}
        >
          {lighterOn && (
            <g>
              <circle ref={flameAmbientRef} cx="32" cy="-95" r="380" fill="url(#wh-flameAmbient)" />
              <circle ref={flameOuterRef} cx="32" cy="-95" r="200" fill="url(#wh-flameOuter)" />
              <circle ref={flameInnerRef} cx="32" cy="-95" r="70" fill="url(#wh-flameInner)" />
            </g>
          )}
          {sitting ? (
            <g>
              {/* Thigh forward (slight downward angle from hip) */}
              <line x1="-2" y1="-50" x2="26" y2="-40" stroke="#15161e" strokeWidth="6" strokeLinecap="round" />
              <line x1="2" y1="-50" x2="30" y2="-40" stroke="#15161e" strokeWidth="6" strokeLinecap="round" />
              {/* Shin (knees bent ~90deg) — feet just clear the ground */}
              <line x1="26" y1="-40" x2="26" y2="-18" stroke="#15161e" strokeWidth="6" strokeLinecap="round" />
              <line x1="30" y1="-40" x2="30" y2="-18" stroke="#15161e" strokeWidth="6" strokeLinecap="round" />
            </g>
          ) : (
            <>
              <line ref={personLegLRef} x1="-5" y1="-50" x2="-5" y2="0" stroke="#15161e" strokeWidth="6" strokeLinecap="round" />
              <line ref={personLegRRef} x1="5" y1="-50" x2="5" y2="0" stroke="#15161e" strokeWidth="6" strokeLinecap="round" />
            </>
          )}
          <g className={petAnim ? "wh-pet-lean" : ""}>
            <rect x="-9" y="-110" width="18" height="62" rx="6" fill="url(#wh-body)" />
            <circle cx="0" cy="-122" r="12" fill="url(#wh-head)" />
            {!sitting && (
              <>
                <circle cx="-3.5" cy="-124" r="1.3" fill="#fff8d8" opacity="0.92" />
                <circle cx="3.5" cy="-124" r="1.3" fill="#fff8d8" opacity="0.92" />
              </>
            )}
          </g>
          {lighterOn && (
            <g>
              {/* Shoulder dot to anchor arm */}
              <circle cx="6" cy="-92" r="2.5" fill="#15161e" />
              {/* Outstretched arm */}
              <line
                x1="6"
                y1="-92"
                x2="28"
                y2="-86"
                stroke="#15161e"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Hand */}
              <circle cx="29" cy="-86" r="2.6" fill="#15161e" />
              {/* Lighter body */}
              <rect x="27" y="-94" width="4.4" height="6.2" rx="0.6" fill="#2a2a36" />
              <rect x="27" y="-94" width="4.4" height="1.8" fill="#1a1a22" />
              {/* Flame core */}
              <ellipse ref={flameCoreRef} cx="29.2" cy="-99" rx="1.3" ry="3" fill="#ffb04a" opacity="0.95" />
              <ellipse cx="29.2" cy="-100" rx="0.6" ry="1.5" fill="#fff8d8" opacity="0.95" />
            </g>
          )}
          {petAnim && (
            <g key="petarm" className="wh-pet-arm">
              {/* Upper arm — shoulder to elbow, slightly bent forward */}
              <line
                x1="8"
                y1="-92"
                x2="17"
                y2="-60"
                stroke="#15161e"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              {/* Forearm — elbow to hand, reaching toward the cat's head */}
              <line
                x1="17"
                y1="-60"
                x2="22"
                y2="-26"
                stroke="#15161e"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              {/* Hand */}
              <circle cx="22" cy="-26" r="2.7" fill="#15161e" />
            </g>
          )}
        </g>

        {/* Shooting star (animated via RAF when active) */}
        <line
          ref={shootingStarRef}
          x1="0"
          y1="0"
          x2="0"
          y2="0"
          stroke="#fffdf2"
          strokeWidth="2.5"
          strokeOpacity="0"
          strokeLinecap="round"
        />
      </svg>

      {/* Initial hint */}
      {!hasMoved && !home && (
        <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">
          ← move cursor to walk →
        </p>
      )}

      {/* Fix prompt + meter */}
      {fixActive && !home && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `calc((${BROKEN_LIGHT_X} - var(--cam-x, 0)) / ${VIEWPORT_W} * 100%)`,
            top: "32%",
          }}
        >
          <div className="flex flex-col items-center gap-2.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/85">
              click + hold — release on yellow
            </p>
            <div className="relative h-1.5 w-48 overflow-hidden rounded-full bg-white/15">
              <div
                className="absolute inset-y-0 bg-yellow-300/55"
                style={{
                  left: `${FIX_SWEET_LO * 100}%`,
                  width: `${(FIX_SWEET_HI - FIX_SWEET_LO) * 100}%`,
                }}
              />
              <div
                className="absolute inset-y-0 left-0 bg-white"
                style={{ width: `${fixCharge * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Cat state indicator (above cat) */}
      {!home && (catState === "wary" || catState === "watching") && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full"
          style={{
            left: `calc((var(--cat-x, 0) - var(--cam-x, 0)) / ${VIEWPORT_W} * 100%)`,
            top: "62%",
          }}
        >
          <span
            className={`block font-mono text-base ${
              catState === "wary" ? "text-rose-200/85" : "text-white/55"
            }`}
          >
            {catState === "wary" ? "!" : "·"}
          </span>
        </div>
      )}

      {/* Pet prompt — click + hold, release in the sweet spot to befriend */}
      {petPromptVisible && !home && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full"
          style={{
            left: `calc((var(--cat-x, 0) - var(--cam-x, 0)) / ${VIEWPORT_W} * 100%)`,
            top: "60%",
          }}
        >
          <div className="flex flex-col items-center gap-2 rounded-xl border border-[#ffb89a]/40 bg-[#1a0d18]/85 px-3 py-2 backdrop-blur-sm">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#ffb89a]">
              ♥ {petHoldingRef.current ? "release in the band" : "hold to pet"}
            </p>
            {/* Hold meter with sweet-spot band */}
            <div className="relative h-1.5 w-44 overflow-hidden rounded-full bg-white/12">
              {/* Sweet-spot band */}
              <div
                className="absolute inset-y-0 bg-[#ffb89a]/55"
                style={{
                  left: `${(PET_HOLD_MIN / PET_BAR_DURATION) * 100}%`,
                  width: `${((PET_HOLD_MAX - PET_HOLD_MIN) / PET_BAR_DURATION) * 100}%`,
                }}
              />
              {/* Fill — current hold time */}
              <div
                className="absolute inset-y-0 left-0 bg-[#ffd1b8]"
                style={{
                  width: `${Math.min(100, (petHoldElapsed / PET_BAR_DURATION) * 100)}%`,
                }}
              />
            </div>
            {/* Cat invite timeout (countdown if not yet held) */}
            {!petHoldingRef.current && (
              <div className="relative h-0.5 w-44 overflow-hidden rounded-full bg-white/8">
                <div
                  className="absolute inset-y-0 left-0 bg-white/45"
                  style={{ width: `${petProgress * 100}%` }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Audio panel (top-left) and Fullscreen button (top-right) */}
      {!home && (
        <>
          <div data-ui onMouseDown={(e) => e.stopPropagation()}>
            <AudioPanel
              muted={muted}
              volume={volume}
              onMuteToggle={() => setMuted((m) => !m)}
              onVolumeChange={setVolume}
              fg="#ffffff"
              accent="#ffac6e"
              bg="#0a0e1f"
            />
          </div>
          <div data-ui onMouseDown={(e) => e.stopPropagation()}>
            <FullscreenButton
              takenOver={walkTakenOver}
              onEnter={enterWalkFullscreen}
              onExit={exitWalkFullscreen}
              fg="#ffffff"
              accent="#ffac6e"
              bg="#0a0e1f"
            />
          </div>
        </>
      )}

      {/* Door unlock keypad — combo is hinted by the worn 2/4/6 keys */}
      {inDoorRange && !unlocked && !home && (
        <div
          className="pointer-events-auto absolute -translate-x-1/2 -translate-y-full"
          data-ui
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            left: `calc((${HOME_DOOR_X} - var(--cam-x, 0)) / ${VIEWPORT_W} * 100%)`,
            top: "60%",
          }}
        >
          <div className="rounded-2xl border border-white/15 bg-[#0a0a14]/90 p-3 backdrop-blur-md">
            <p className="mb-2 text-center font-mono text-[9px] uppercase tracking-[0.22em] text-white/55">
              enter code
            </p>
            <div className="mb-2 flex justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    enteredCode.length > i ? "bg-white/85" : "bg-white/20"
                  }`}
                />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
                const worn = n === 2 || n === 4 || n === 6;
                return (
                  <button
                    key={n}
                    type="button"
                    data-ui
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleKeypadInput(n);
                    }}
                    className={`size-9 rounded-md border font-mono text-[13px] transition ${
                      worn
                        ? "border-stone-500/30 text-stone-300/80 shadow-inner shadow-black/55 hover:brightness-110"
                        : "border-white/35 bg-white/20 text-white hover:bg-white/30"
                    }`}
                    style={
                      worn
                        ? {
                            // Solid muted gunmetal background (so the contrast
                            // against the bright unworn keys reads), with a
                            // worn-in dark patch and a faint fingerprint sheen.
                            background:
                              "radial-gradient(ellipse at 50% 70%, rgba(0,0,0,0.55) 0%, rgba(34,32,30,0.92) 60%), radial-gradient(circle at 70% 60%, rgba(255,235,205,0.06) 0%, transparent 45%)",
                            backgroundColor: "#2a2722",
                          }
                        : undefined
                    }
                  >
                    {n}
                  </button>
                );
              })}
              <div />
              <button
                type="button"
                data-ui
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  handleKeypadInput(0);
                }}
                className="size-9 rounded-md border border-white/12 bg-white/5 font-mono text-[13px] text-white/55 transition hover:bg-white/10 hover:text-white/80"
              >
                0
              </button>
              <div />
            </div>
          </div>
        </div>
      )}

      {/* Lighter pickup tooltip — prominent, fades after a few seconds */}
      {lighterTooltip && !home && (
        <div className="wh-tooltip-pop pointer-events-none absolute right-5 top-1/2 z-30 max-w-[260px] -translate-y-1/2 rounded-xl border border-yellow-200/30 bg-[#1a0d18]/85 p-3.5 backdrop-blur-md">
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-yellow-100">
            ✦ found a lighter
          </p>
          <p className="text-[12px] leading-snug text-white/85">
            Hold &amp; swipe up to light it. Hold &amp; swipe down to put it
            out. Or tap the button below.
          </p>
        </div>
      )}

      {/* Bench sit prompt */}
      {inBenchRange && !sitting && !home && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full"
          style={{
            left: `calc((${BENCH_X} - var(--cam-x, 0)) / ${VIEWPORT_W} * 100%)`,
            top: "60%",
          }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/80">
            click to sit
          </p>
        </div>
      )}

      {/* Stand-up hint while sitting */}
      {sitting && !home && (
        <div
          className="pointer-events-none absolute -translate-x-1/2"
          style={{
            left: `calc((${BENCH_X} - var(--cam-x, 0)) / ${VIEWPORT_W} * 100%)`,
            bottom: "12%",
          }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
            click anywhere to stand
          </p>
        </div>
      )}

      {/* Inventory: lighter button + hint */}
      {lighterFound && !home && (
        <div className="absolute bottom-5 right-5 z-20 flex flex-col items-end gap-1.5">
          <button
            type="button"
            data-ui
            onClick={(e) => {
              e.stopPropagation();
              setLighterOn((v) => !v);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition ${
              lighterOn
                ? "border-yellow-300/60 bg-yellow-300/15 text-yellow-100"
                : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <svg width="10" height="14" viewBox="0 0 10 14" aria-hidden>
              <ellipse cx="5" cy="3" rx="1.6" ry="2.6" fill={lighterOn ? "#ffb04a" : "#9a9a9a"} />
              <rect x="2" y="6" width="6" height="7" rx="0.8" fill="currentColor" opacity="0.8" />
            </svg>
            {lighterOn ? "lighter on" : "lighter"}
          </button>
          <p
            data-ui
            onMouseDown={(e) => e.stopPropagation()}
            className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40"
          >
            {lighterOn ? "swipe down or click to put out" : "swipe up or click to light"}
          </p>
        </div>
      )}

      {/* Score panel — fires on arrival; window sequence plays behind the blur */}
      {home && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-7 max-w-sm w-full mx-6 backdrop-blur-md">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 mb-3">
              you&rsquo;re home.
            </p>
            <h2 className="display-tight text-3xl text-white mb-6 leading-[0.95]">
              {(() => {
                const total = 4;
                const got = tasks.done.size + eggs.size;
                if (got === total) return "perfect walk.";
                if (got > 0) return "you found some.";
                return "another time.";
              })()}
            </h2>
            <ul className="flex flex-col gap-2.5 mb-6">
              <ScoreLine
                label="fix the broken light"
                status={
                  tasks.done.has("fix-light")
                    ? "done"
                    : tasks.failed.has("fix-light")
                      ? "failed"
                      : "missed"
                }
              />
              <ScoreLine
                label="befriend the cat"
                status={
                  tasks.done.has("befriend-cat")
                    ? "done"
                    : tasks.failed.has("befriend-cat")
                      ? "failed"
                      : "missed"
                }
              />
              <ScoreLine
                label="take a moment on the bench"
                status={eggs.has("bench") ? "done" : "missed"}
                egg
              />
              <ScoreLine
                label="pick up the lighter"
                status={eggs.has("lighter") ? "done" : "missed"}
                egg
              />
            </ul>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
              refresh to walk again
            </p>
          </div>
        </div>
      )}
    </div>
    {walkGlitching &&
      typeof document !== "undefined" &&
      createPortal(<GlitchOverlay />, document.body)}
    </>
  );
}

function ScoreLine({
  label,
  status,
  egg,
}: {
  label: string;
  status: "done" | "failed" | "missed";
  egg?: boolean;
}) {
  const symbol = status === "done" ? "✓" : status === "failed" ? "✗" : "·";
  const color =
    status === "done"
      ? "text-emerald-300"
      : status === "failed"
        ? "text-rose-300"
        : "text-white/40";
  return (
    <li className={`flex items-center gap-3 text-sm ${color}`}>
      <span className="font-mono w-3 text-center">{symbol}</span>
      <span>{label}</span>
      {egg && (
        <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
          hidden
        </span>
      )}
    </li>
  );
}
