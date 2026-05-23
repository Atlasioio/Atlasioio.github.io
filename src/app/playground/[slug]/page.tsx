import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Flask } from "@phosphor-icons/react/dist/ssr";
import { experiments, getExperiment } from "@/lib/experiments";
import { KineticTypeFull } from "@/components/experiments/KineticType";
import { ClickSymphonyFull } from "@/components/experiments/ClickSymphony";
import { WalkHomeFull } from "@/components/experiments/WalkHome";
import { LiveTimeFull } from "@/components/experiments/LiveTime";

type Params = { params: Promise<{ slug: string }> };

const FULLS: Record<string, () => React.ReactElement> = {
  "kinetic-type": KineticTypeFull,
  "click-symphony": ClickSymphonyFull,
  "walk-home": WalkHomeFull,
  "live-time": LiveTimeFull,
};

export async function generateStaticParams() {
  return experiments.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const e = getExperiment(slug);
  return { title: e ? `${e.name} · Playground` : "Playground" };
}

export default async function ExperimentPage({ params }: Params) {
  const { slug } = await params;
  const experiment = getExperiment(slug);
  if (!experiment) notFound();

  const idx = experiments.findIndex((e) => e.slug === experiment.slug);
  const next = experiments[(idx + 1) % experiments.length];
  const Full = FULLS[experiment.slug];

  return (
    <>
      <section className="mx-auto max-w-full md:max-w-[min(75vw,1400px)] w-full px-5 md:px-8 pt-12 md:pt-16 pb-8 flex items-center justify-between gap-4">
        <Link
          href="/playground"
          className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-hairline text-[12px] text-fg-muted hover:bg-[var(--chip)] hover:text-fg hover:border-[var(--chip)] transition-colors duration-300 ease-out"
        >
          <ArrowLeft weight="bold" className="size-3" />
          All experiments
        </Link>
        <Link
          href={`/playground/${next.slug}`}
          className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-hairline text-[12px] text-fg-muted hover:bg-[var(--chip)] hover:text-fg hover:border-[var(--chip)] transition-colors duration-300 ease-out"
        >
          Next: {next.name}
          <ArrowRight
            weight="bold"
            className="size-3 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </section>

      <section className="mx-auto max-w-full md:max-w-[min(75vw,1400px)] w-full px-5 md:px-8 pt-2 md:pt-4 pb-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle flex flex-wrap items-center gap-x-2 gap-y-1">
          <Flask weight="fill" className="size-3.5" />
          <span>{experiment.category}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="size-1.5 rounded-full"
              style={{
                background:
                  experiment.status === "live"
                    ? experiment.color
                    : "var(--fg-subtle)",
              }}
            />
            {experiment.status === "live" ? "Live" : "WIP"}
          </span>
        </p>

        <h1 className="display-tight text-display-md leading-[0.92] mt-4">
          {experiment.name}
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-6 max-w-[58ch] text-lg text-fg-muted leading-relaxed">
          {experiment.description}
        </p>
      </section>

      <section
        className="mx-auto max-w-full md:max-w-[min(86vw,1500px)] w-full px-5 md:px-8 pb-12"
        style={{ ["--card-accent" as string]: experiment.color }}
      >
        <div
          className="relative rounded-3xl border border-hairline overflow-hidden"
          style={{
            background: `linear-gradient(135deg, color-mix(in oklab, ${experiment.color} 12%, var(--bg-elevated)), color-mix(in oklab, ${experiment.color} 28%, var(--bg-elevated)))`,
          }}
        >
          {Full ? <Full /> : null}
        </div>
      </section>

      <section className="mx-auto max-w-full md:max-w-[min(75vw,1400px)] w-full px-5 md:px-8 pb-24 md:pb-32">
        <Link
          href={`/playground/${next.slug}`}
          className="group flex items-center justify-between gap-6 py-8 md:py-10 border-t border-hairline hover:border-fg transition-colors"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-muted mb-2">
              Next experiment
            </p>
            <h3 className="display-tight text-3xl md:text-5xl leading-[0.95]">
              {next.name}
              <span style={{ color: next.color }}>.</span>
            </h3>
          </div>
          <span className="flex size-12 items-center justify-center rounded-full bg-[var(--chip)] group-hover:bg-fg text-fg-muted group-hover:text-bg transition-colors shrink-0">
            <ArrowRight
              weight="bold"
              className="size-5 transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </Link>
      </section>
    </>
  );
}
