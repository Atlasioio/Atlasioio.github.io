import {
  Clock,
  Moon,
  MusicNote,
  TextAa,
} from "@phosphor-icons/react/dist/ssr";
import type { ComponentType, SVGProps } from "react";

type IconComponent = ComponentType<
  SVGProps<SVGSVGElement> & { weight?: string }
>;

export type ExperimentCategory =
  | "Typography"
  | "Audio"
  | "Cursor"
  | "Generative";

export type ExperimentStatus = "wip" | "live";

export type Experiment = {
  slug: string;
  name: string;
  category: ExperimentCategory;
  tagline: string;
  description: string;
  color: string;
  Icon: IconComponent;
  status: ExperimentStatus;
};

export const experiments: Experiment[] = [
  {
    slug: "kinetic-type",
    name: "Kinetic Type",
    category: "Typography",
    tagline: "AI matches typography to the vibe of what you write.",
    description:
      "Type a word — refinement, punk, space, dread, tender. The page reaches for a typeface, weight, and rhythm that fits the mood.",
    color: "#6B5DB0",
    Icon: TextAa,
    status: "wip",
  },
  {
    slug: "click-symphony",
    name: "Click Symphony",
    category: "Audio",
    tagline: "Every clickable element is a tuned note. The page is the instrument.",
    description:
      "One scale, one page, many keys. Click around to play yourself a tune — or hit play and let the page perform itself.",
    color: "#D4A03A",
    Icon: MusicNote,
    status: "wip",
  },
  {
    slug: "walk-home",
    name: "The Walk Home",
    category: "Cursor",
    tagline: "Your cursor walks home. A cat follows.",
    description:
      "A wordless night scene. You guide a small figure left and right; a cat trails behind with its own ideas. Streetlights flicker on as you pass.",
    color: "#1C2E4A",
    Icon: Moon,
    status: "wip",
  },
  {
    slug: "live-time",
    name: "Live Time",
    category: "Generative",
    tagline: "The page bends to the time, season, and weather where you are.",
    description:
      "Real local time and weather drive the palette, motion, and sound. A scrubber lets you wind the page a thousand years forward or back — and things change.",
    color: "#BF6E94",
    Icon: Clock,
    status: "wip",
  },
];

export function getExperiment(slug: string): Experiment | undefined {
  return experiments.find((e) => e.slug === slug);
}
