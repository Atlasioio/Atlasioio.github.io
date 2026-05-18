import {
  BookOpen,
  Buildings,
  Code,
  Coffee,
  DeviceTabletSpeaker,
  Leaf,
  PaintBrush,
  Wrench,
} from "@phosphor-icons/react/dist/ssr";
import type { ComponentType, SVGProps } from "react";

type IconComponent = ComponentType<
  SVGProps<SVGSVGElement> & { weight?: string }
>;

export type ProjectTag = "app" | "webdesign" | "graphic-design";

export type Project = {
  slug: string;
  name: string;
  year: string;
  context: string;
  category: string;
  tagline: string;
  color: string;
  Icon: IconComponent;
  tags: ProjectTag[];
};

export const projects: Project[] = [
  {
    slug: "sony",
    name: "Sony / Nimway",
    year: "2025 — 2026",
    context: "UX Designer · Malmö",
    category: "Smart-office system",
    tagline:
      "Smart-office product line for the Sony group — meeting room panels, booking app and website, large-format wayfinding maps. Real client work, NDA-restricted.",
    color: "#2F3E51",
    Icon: DeviceTabletSpeaker,
    tags: ["app", "webdesign"],
  },
  {
    slug: "sherry",
    name: "Sherry",
    year: "2024",
    context: "Course project, Malmö University",
    category: "Mobile app",
    tagline:
      "Tool sharing that turns neighbours into a small, working circular economy.",
    color: "#5DB075",
    Icon: Wrench,
    tags: ["app"],
  },
  {
    slug: "ecotrip",
    name: "EcoTrip",
    year: "2024",
    context: "Course project, Malmö University",
    category: "Mobile app",
    tagline:
      "A bee-led travel companion that nudges greener trips and rewards better choices.",
    color: "#F5B400",
    Icon: Leaf,
    tags: ["app"],
  },
  {
    slug: "reel",
    name: "Reel",
    year: "2025",
    context: "Self-initiated concept",
    category: "Website",
    tagline:
      "An architecture studio site that lets the work do the talking — clean, image-forward, no fluff.",
    color: "#3B4A6B",
    Icon: Buildings,
    tags: ["webdesign"],
  },
  {
    slug: "teem",
    name: "Teem",
    year: "2023",
    context: "Course project, Malmö University",
    category: "Brand & packaging",
    tagline:
      "Brand identity, packaging, and leaflet for a cold-brew matcha latte — a break from screens.",
    color: "#88A77A",
    Icon: Coffee,
    tags: ["graphic-design"],
  },
  {
    slug: "goodreads",
    name: "Goodreads Redesign",
    year: "2024",
    context: "Self-initiated redesign",
    category: "App redesign",
    tagline:
      "Rethinking how readers track and discover books — a focused redesign exercise.",
    color: "#8B6F47",
    Icon: BookOpen,
    tags: ["app"],
  },
  {
    slug: "artist-website",
    name: "Artist Website",
    year: "2025",
    context: "Self-initiated concept",
    category: "Website",
    tagline:
      "A modern portfolio concept for a Stockholm painter — as expressive as the canvas.",
    color: "#C9A36B",
    Icon: PaintBrush,
    tags: ["webdesign"],
  },
  {
    slug: "portfolio",
    name: "This Portfolio",
    year: "2026",
    context: "Self-initiated",
    category: "Website",
    tagline:
      "The very site you're reading — designed, written, and vibe-coded end-to-end. Every detail is open to inspect.",
    color: "#C45E2D",
    Icon: Code,
    tags: ["webdesign"],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
