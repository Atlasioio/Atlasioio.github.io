import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Envelope,
} from "@phosphor-icons/react/dist/ssr";
import { MockupFrame } from "@/components/MockupFrame";
import { PaperNote } from "@/components/PaperNote";
import { getProject, projects, type Project } from "@/lib/projects";
import { getCaseStudy, type CaseStudy, type Shot } from "@/lib/case-studies";
import { CaseStudyToc, type TocSection } from "./case-study-toc";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project ? `${project.name}` : "Case study" };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const idx = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(idx + 1) % projects.length];
  const study = getCaseStudy(project.slug);
  const isRestricted = study?.variant === "restricted";

  // Reel uses a bespoke image-forward layout — the live site is the work.
  if (project.slug === "reel" && study) {
    return <ReelCaseStudy project={project} study={study} next={next} />;
  }

  // J Lorin (artist-website) follows Reel's image-led pattern, lighter on process.
  if (project.slug === "artist-website" && study) {
    return (
      <ArtistWebsiteCaseStudy project={project} study={study} next={next} />
    );
  }

  const highlights: Shot[] =
    study?.highlights ?? study?.solutionShots?.slice(0, 4) ?? [];

  const tocSections: TocSection[] = [];
  if (study) {
    tocSections.push({ id: "snapshot", label: "Snapshot" });
    if (highlights.length > 0)
      tocSections.push({ id: "highlights", label: "Highlights" });
    tocSections.push({ id: "problem", label: "Problem" });
    if (isRestricted && study.surfaces)
      tocSections.push({ id: "surfaces", label: "What I worked on" });
    if (!isRestricted && study.approach)
      tocSections.push({ id: "approach", label: "Approach" });
    if (!isRestricted && study.solutionShots)
      tocSections.push({ id: "solution", label: "Solution" });
    if (!isRestricted && study.outcome)
      tocSections.push({ id: "outcome", label: "Outcome" });
    if (isRestricted && study.callToAction)
      tocSections.push({ id: "contact", label: "Get in touch" });
  }

  return (
    <>
      {/* Sticky right-side TOC (visible on 2xl+) */}
      {tocSections.length > 0 && (
        <CaseStudyToc sections={tocSections} color={project.color} />
      )}

      {/* Top nav row */}
      <section className="mx-auto max-w-full md:max-w-[min(67vw,1200px)] w-full px-5 md:px-8 pt-12 md:pt-16 pb-8 flex items-center justify-between gap-4">
        <Link
          href="/work"
          className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-hairline text-[12px] text-fg-muted hover:bg-[var(--chip)] hover:text-fg hover:border-[var(--chip)] transition-colors duration-300 ease-out"
        >
          <ArrowLeft weight="bold" className="size-3" />
          All case studies
        </Link>
        <Link
          href={`/work/${next.slug}`}
          className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-hairline text-[12px] text-fg-muted hover:bg-[var(--chip)] hover:text-fg hover:border-[var(--chip)] transition-colors duration-300 ease-out"
        >
          Next: {next.name}
          <ArrowRight
            weight="bold"
            className="size-3 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </section>

      {/* Hero */}
      <section className="mx-auto max-w-full md:max-w-[min(67vw,1200px)] w-full px-5 md:px-8 pt-6 md:pt-10 pb-10">
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-fg-muted mb-6 flex items-center gap-2">
          <Briefcase weight="fill" className="size-3.5" /> Case study
        </p>
        <h1 className="display-tight text-display-md leading-[0.95]">
          {project.name}
          <span style={{ color: project.color }}>.</span>
        </h1>
        <p className="mt-6 max-w-[60ch] text-lg md:text-xl text-fg-muted leading-relaxed">
          {project.tagline}
        </p>
        {study?.liveUrl && (
          <a
            href={study.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex items-center gap-2.5 rounded-full border border-hairline bg-[var(--chip)] px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-fg hover:bg-fg hover:text-bg hover:border-fg transition-colors"
          >
            Visit live site
            <ArrowUpRight
              weight="bold"
              className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        )}
      </section>

      {/* Hero mockup */}
      <section className="mx-auto max-w-full md:max-w-[min(76vw,1400px)] w-full px-5 md:px-8 pb-10 md:pb-12">
        <MockupFrame
          image={study?.heroImage}
          mobileImage={study?.heroImageMobile}
          alt={`${project.name} — hero`}
          aspect={study?.heroAspect ?? "aspect-[16/9]"}
          tint={project.color}
          chrome={study?.mediaChrome ?? "browser"}
          intensity="strong"
          fallbackLabel={`Hero mockup placeholder · ${project.name}`}
          url={resolveDisplayUrl(study)}
          objectFit={study?.heroObjectFit}
          innerPadding="inset-8 md:inset-14"
          priority
        />
      </section>

      {/* Metadata strip */}
      <section className="mx-auto max-w-full md:max-w-[min(67vw,1200px)] w-full px-5 md:px-8 pb-20 md:pb-24">
        <dl className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-6">
          <MetaItem label="Year" value={project.year} />
          <MetaItem label="Type" value={project.category} />
          <MetaItem label="Role" value={study?.meta?.role ?? "Designer"} />
          {study?.meta?.timeline && (
            <MetaItem label="Timeline" value={study.meta.timeline} />
          )}
          {study?.meta?.tools && (
            <MetaItem label="Tools" value={study.meta.tools} />
          )}
        </dl>
      </section>

      {study && (
        <>
          {/* Snapshot — TL;DR */}
          <SnapshotSection study={study} color={project.color} />

          {/* Highlights — preview reel */}
          {highlights.length > 0 && (
            <HighlightsSection
              highlights={highlights}
              color={project.color}
              project={project}
              chrome={study.shotChrome ?? study.mediaChrome ?? "browser"}
              url={resolveDisplayUrl(study)}
            />
          )}

          {/* The problem */}
          <ProblemSection study={study} color={project.color} />

          {/* Sony variant: surfaces list */}
          {isRestricted && study.surfaces && (
            <SurfacesSection surfaces={study.surfaces} color={project.color} />
          )}

          {/* The approach */}
          {!isRestricted && study.approach && (
            <ApproachSection
              approach={study.approach}
              color={project.color}
              project={project}
            />
          )}

          {/* The solution */}
          {!isRestricted && study.solutionShots && (
            <SolutionSection
              shots={study.solutionShots}
              color={project.color}
              project={project}
              chrome={study.shotChrome ?? study.mediaChrome ?? "browser"}
              url={resolveDisplayUrl(study)}
            />
          )}

          {/* Outcome */}
          {!isRestricted && study.outcome && (
            <OutcomeSection outcome={study.outcome} color={project.color} />
          )}

          {/* Sony variant: call to action */}
          {isRestricted && study.callToAction && (
            <CallToActionSection text={study.callToAction} />
          )}
        </>
      )}

      {/* Next case study */}
      <section className="mx-auto max-w-full md:max-w-[min(67vw,1200px)] w-full px-5 md:px-8 pb-24 md:pb-32">
        <Link
          href={`/work/${next.slug}`}
          className="group flex items-center justify-between gap-6 py-8 md:py-10 border-t border-hairline hover:border-fg transition-colors"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-muted mb-2">
              Next case study
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

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-muted mb-1.5">
        {label}
      </dt>
      <dd className="text-[15px]">{value}</dd>
    </div>
  );
}

function SectionHeader({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <h2 className="display-tight text-3xl md:text-4xl leading-[0.95] mb-8 md:mb-12">
      {label}
      <span style={{ color }}>.</span>
    </h2>
  );
}

function SnapshotSection({
  study,
  color,
}: {
  study: CaseStudy;
  color: string;
}) {
  return (
    <section
      id="snapshot"
      className="mx-auto max-w-full md:max-w-[min(67vw,1200px)] w-full px-5 md:px-8 pb-20 md:pb-24 scroll-mt-24"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        <SnapshotCell label="The problem" color={color} body={study.snapshot.problem} />
        <SnapshotCell label="The outcome" color={color} body={study.snapshot.outcome} />
      </div>
    </section>
  );
}

function SnapshotCell({
  label,
  color,
  body,
}: {
  label: string;
  color: string;
  body: string;
}) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-muted mb-3 flex items-center gap-2">
        <span
          className="size-1.5 rounded-full shrink-0"
          style={{ background: color }}
          aria-hidden
        />
        {label}
      </p>
      <p className="text-[15px] md:text-base text-fg leading-relaxed">{body}</p>
    </div>
  );
}

function ProblemSection({
  study,
  color,
}: {
  study: CaseStudy;
  color: string;
}) {
  const paragraphs = Array.isArray(study.problem.body)
    ? study.problem.body
    : [study.problem.body];
  return (
    <section
      id="problem"
      className="mx-auto max-w-full md:max-w-[min(67vw,1200px)] w-full px-5 md:px-8 pb-20 md:pb-28 scroll-mt-24"
    >
      <SectionHeader label="The problem" color={color} />
      <div className="max-w-[68ch] flex flex-col gap-5 md:gap-6">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-lg text-fg-muted leading-relaxed">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}

function ApproachSection({
  approach,
  color,
  project,
}: {
  approach: NonNullable<CaseStudy["approach"]>;
  color: string;
  project: { name: string; color: string };
}) {
  return (
    <section
      id="approach"
      className="mx-auto max-w-full md:max-w-[min(67vw,1200px)] w-full px-5 md:px-8 pb-20 md:pb-28 scroll-mt-24"
    >
      <SectionHeader label="The approach" color={color} />
      <ul className="flex flex-col gap-12 md:gap-16">
        {approach.blocks.map((block, i) => {
          const hasArtefact = !!block.image || !!block.note;
          const tilt = [-1.4, 0.9, -0.6][i % 3];
          return (
            <li
              key={block.heading}
              className="grid grid-cols-12 gap-x-6 md:gap-x-10 gap-y-5 items-start"
            >
              <div
                className={
                  hasArtefact
                    ? "col-span-12 md:col-span-5"
                    : "col-span-12 md:col-span-8"
                }
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-muted mb-3">
                  Step {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="display-tight text-xl md:text-2xl leading-[1.05] mb-2">
                  {block.heading}
                </h3>
                {block.hook && (
                  <p
                    className="text-[15px] md:text-base mb-3 leading-snug"
                    style={{ color: "var(--fg)" }}
                  >
                    {block.hook}
                  </p>
                )}
                <p
                  className={`text-[15px] text-fg-muted leading-relaxed ${
                    hasArtefact ? "max-w-[44ch]" : "max-w-[60ch]"
                  }`}
                >
                  {block.body}
                </p>
              </div>
              {hasArtefact && (
                <div className="col-span-12 md:col-span-7">
                  {block.note ? (
                    <PaperNote
                      title={block.note.title}
                      items={block.note.items}
                      tint={color}
                      tilt={tilt}
                    />
                  ) : (
                    <MockupFrame
                      image={block.image}
                      alt={`${project.name} — ${block.heading}`}
                      aspect="aspect-[4/3]"
                      tint={color}
                      chrome="paper"
                      intensity="subtle"
                      rounded="rounded-2xl"
                      tilt={tilt}
                      fallbackLabel={`Process artefact · ${project.name}`}
                      sizes="(min-width: 1200px) 700px, 100vw"
                    />
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {approach.pullQuote && (
        <blockquote className="mt-20 md:mt-24 max-w-[40ch]">
          <p className="display-tight text-3xl md:text-5xl leading-[1.05]">
            &ldquo;{approach.pullQuote}
            <span style={{ color }}>&rdquo;</span>
          </p>
        </blockquote>
      )}
    </section>
  );
}

function SolutionSection({
  shots,
  color,
  project,
  chrome,
  url,
}: {
  shots: Shot[];
  color: string;
  project: { name: string };
  chrome: "browser" | "none" | "phone";
  url?: string;
}) {
  return (
    <section
      id="solution"
      className="mx-auto max-w-full md:max-w-[min(76vw,1400px)] w-full px-5 md:px-8 pb-20 md:pb-28 scroll-mt-24"
    >
      <div className="max-w-full md:max-w-[min(67vw,1200px)] mx-auto">
        <SectionHeader label="The solution" color={color} />
      </div>
      <div className="grid grid-cols-12 gap-5 md:gap-6">
        {shots.map((shot, i) => {
          const data = typeof shot === "string" ? { caption: shot } : shot;
          const layout = layoutFor(i, shots.length);
          const span = data.span ?? layout.col;
          const aspect = data.aspect ?? layout.aspect;
          return (
            <figure
              key={data.caption}
              className={`${span} flex flex-col gap-3`}
            >
              <MockupFrame
                image={data.image}
                alt={`${project.name} — ${data.caption}`}
                aspect={aspect}
                tint={color}
                chrome={chrome}
                intensity="subtle"
                rounded="rounded-2xl"
                innerPadding="inset-6 md:inset-10"
                fallbackLabel={`${project.name} · ${String(i + 1).padStart(2, "0")}`}
                objectFit={data.objectFit}
                url={url}
              />
              <figcaption className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-muted">
                {data.caption}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}

function layoutFor(i: number, total: number): { col: string; aspect: string } {
  // Pattern: shot 0 is a full-width hero; rest are 2-up at the same aspect.
  // If the trailing shot would sit alone in a half-row, promote it back to full-width.
  if (i === 0) return { col: "col-span-12", aspect: "aspect-[16/9]" };
  const remaining = total - 1;
  const isLastAlone = i === total - 1 && remaining % 2 === 1;
  if (isLastAlone) return { col: "col-span-12", aspect: "aspect-[16/9]" };
  return { col: "col-span-12 md:col-span-6", aspect: "aspect-[4/3]" };
}

function OutcomeSection({
  outcome,
  color,
}: {
  outcome: NonNullable<CaseStudy["outcome"]>;
  color: string;
}) {
  const [headlineStat, ...remainingStats] = outcome.stats ?? [];

  return (
    <section
      id="outcome"
      className="mx-auto max-w-full md:max-w-[min(67vw,1200px)] w-full px-5 md:px-8 pb-20 md:pb-28 scroll-mt-24"
    >
      <SectionHeader label="The outcome" color={color} />

      {headlineStat && (
        <div className="mb-10 md:mb-14">
          <p
            className="display-tight text-6xl md:text-8xl leading-[0.9] mb-2"
            style={{ color }}
          >
            {headlineStat.value}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-muted">
            {headlineStat.label}
          </p>
        </div>
      )}

      <p className="max-w-[68ch] text-lg text-fg-muted leading-relaxed">
        {outcome.body}
      </p>

      {remainingStats.length > 0 && (
        <div className="mt-12 md:mt-14 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8 border-t border-hairline pt-10 md:pt-12">
          {remainingStats.map((stat) => (
            <div key={stat.label}>
              <p
                className="display-tight text-4xl md:text-5xl leading-[0.9] mb-2"
                style={{ color }}
              >
                {stat.value}
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {outcome.reflection && (
        <div className="mt-16 md:mt-20 max-w-[68ch]">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-muted mb-3 flex items-center gap-2">
            <span
              className="size-1.5 rounded-full shrink-0"
              style={{ background: color }}
              aria-hidden
            />
            What I&rsquo;d do differently
          </p>
          <p className="text-[15px] md:text-base text-fg-muted leading-relaxed">
            {outcome.reflection}
          </p>
        </div>
      )}
    </section>
  );
}

function HighlightsSection({
  highlights,
  color,
  project,
  chrome,
  url,
}: {
  highlights: Shot[];
  color: string;
  project: { name: string };
  chrome: "browser" | "none" | "phone";
  url?: string;
}) {
  return (
    <section
      id="highlights"
      className="mx-auto max-w-full md:max-w-[min(76vw,1400px)] w-full px-5 md:px-8 pb-20 md:pb-24 scroll-mt-24"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted mb-6 flex items-center gap-2">
        <span
          className="size-1.5 rounded-full shrink-0"
          style={{ background: color }}
          aria-hidden
        />
        Highlights
      </p>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {highlights.map((shot, i) => {
          const data = typeof shot === "string" ? { caption: shot } : shot;
          const aspect =
            data.aspect ?? (chrome === "phone" ? "aspect-[3/4]" : "aspect-[4/3]");
          return (
            <li key={data.caption} className="flex flex-col gap-2.5">
              <MockupFrame
                image={data.image}
                alt={`${project.name} — ${data.caption}`}
                aspect={aspect}
                tint={color}
                chrome={chrome}
                intensity="subtle"
                rounded="rounded-2xl"
                innerPadding="inset-3 md:inset-4"
                fallbackLabel={`${project.name} · ${String(i + 1).padStart(2, "0")}`}
                objectFit={data.objectFit}
                url={url}
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-muted line-clamp-2">
                {data.caption}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function SurfacesSection({
  surfaces,
  color,
}: {
  surfaces: string[];
  color: string;
}) {
  return (
    <section
      id="surfaces"
      className="mx-auto max-w-full md:max-w-[min(67vw,1200px)] w-full px-5 md:px-8 pb-20 md:pb-28 scroll-mt-24"
    >
      <SectionHeader label="What I worked on" color={color} />
      <ul className="flex flex-col gap-3 max-w-[68ch]">
        {surfaces.map((s) => (
          <li
            key={s}
            className="flex items-start gap-3 py-3 border-b border-hairline last:border-b-0"
          >
            <span
              className="mt-2 size-1.5 rounded-full shrink-0"
              style={{ background: color }}
              aria-hidden
            />
            <p className="text-[15px] md:text-base text-fg leading-relaxed">{s}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CallToActionSection({ text }: { text: string }) {
  return (
    <section
      id="contact"
      className="mx-auto max-w-full md:max-w-[min(67vw,1200px)] w-full px-5 md:px-8 pb-20 md:pb-28 scroll-mt-24"
    >
      <div className="rounded-3xl border border-hairline bg-bg-elevated p-8 md:p-12 flex flex-col gap-6 max-w-[68ch]">
        <p className="text-lg md:text-xl text-fg leading-relaxed">{text}</p>
        <div>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2.5 pl-5 pr-4 py-3 rounded-full bg-[var(--fg)] text-[var(--bg)] hover:bg-accent transition-colors duration-300 ease-out text-[14px]"
          >
            <Envelope weight="fill" className="size-3.5 translate-y-[1px]" />
            Get in touch
            <ArrowRight
              weight="bold"
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

function stripProtocol(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function resolveDisplayUrl(study: CaseStudy | undefined): string | undefined {
  if (!study) return undefined;
  if (study.displayUrl) return study.displayUrl;
  if (study.liveUrl) return stripProtocol(study.liveUrl);
  return undefined;
}

function ArtistWebsiteCaseStudy({
  project,
  study,
  next,
}: {
  project: Project;
  study: CaseStudy;
  next: Project;
}) {
  const liveUrl = study.liveUrl ?? "#";
  const displayUrl = resolveDisplayUrl(study) ?? "jlorin.com";
  const shots = [
    {
      src: "/case-studies/artist/hero.png",
      caption: "Home — the work, oversized and centred",
    },
    {
      src: "/case-studies/artist/latest-work.png",
      caption: "Latest work — scroll-first, image-led",
    },
    {
      src: "/case-studies/artist/contact.png",
      caption: "Contact — the artist's note, plainly",
    },
  ];

  const tocSections: TocSection[] = [
    { id: "snapshot", label: "Snapshot" },
    { id: "problem", label: "Problem" },
    { id: "shots", label: "The site" },
  ];
  if (study.outcome) tocSections.push({ id: "outcome", label: "Outcome" });

  return (
    <>
      <CaseStudyToc sections={tocSections} color={project.color} />

      {/* Top nav row */}
      <section className="mx-auto max-w-full md:max-w-[min(76vw,1400px)] w-full px-5 md:px-8 pt-12 md:pt-16 pb-8 flex items-center justify-between gap-4">
        <Link
          href="/work"
          className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-hairline text-[12px] text-fg-muted hover:bg-[var(--chip)] hover:text-fg hover:border-[var(--chip)] transition-colors duration-300 ease-out"
        >
          <ArrowLeft weight="bold" className="size-3" />
          All case studies
        </Link>
        <Link
          href={`/work/${next.slug}`}
          className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-hairline text-[12px] text-fg-muted hover:bg-[var(--chip)] hover:text-fg hover:border-[var(--chip)] transition-colors duration-300 ease-out"
        >
          Next: {next.name}
          <ArrowRight
            weight="bold"
            className="size-3 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </section>

      {/* Title */}
      <section className="mx-auto max-w-full md:max-w-[min(76vw,1400px)] w-full px-5 md:px-8 pt-6 md:pt-10 pb-10 md:pb-14">
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-fg-muted mb-6 flex items-center gap-2">
          <Briefcase weight="fill" className="size-3.5" /> Case study
        </p>
        <h1 className="display-tight text-display-md leading-[0.95]">
          {project.name}
          <span style={{ color: project.color }}>.</span>
        </h1>
        <p className="mt-6 max-w-[60ch] text-lg md:text-xl text-fg-muted leading-relaxed">
          {project.tagline}
        </p>
        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-fg-muted">
          {[
            project.year,
            project.category,
            study.meta?.role,
            study.meta?.timeline,
            study.meta?.tools,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </section>

      {/* Massive live-site CTA */}
      <section className="mx-auto max-w-full md:max-w-[min(76vw,1400px)] w-full px-5 md:px-8 pb-16 md:pb-24">
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.18em] text-fg-muted mb-5 md:mb-8 flex items-center gap-2">
            <span
              className="size-1.5 rounded-full shrink-0"
              style={{ background: project.color }}
              aria-hidden
            />
            See it live
          </p>
          <h2
            className="display-tight leading-[0.9] flex items-start gap-4 md:gap-8"
            style={{ fontSize: "clamp(3rem, 11vw, 9rem)" }}
          >
            <span className="relative inline-block">
              {displayUrl}
              <span
                className="absolute left-0 right-0 bottom-[0.08em] h-[0.06em] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
                style={{ background: project.color }}
                aria-hidden
              />
            </span>
            <ArrowUpRight
              weight="bold"
              className="shrink-0 transition-transform duration-500 ease-out group-hover:translate-x-2 group-hover:-translate-y-2"
              style={{
                color: project.color,
                width: "clamp(2.5rem, 8vw, 6rem)",
                height: "clamp(2.5rem, 8vw, 6rem)",
              }}
            />
          </h2>
        </a>
      </section>

      {/* Snapshot — TL;DR */}
      <SnapshotSection study={study} color={project.color} />

      {/* Problem */}
      <ProblemSection study={study} color={project.color} />

      {/* Three full-width browser-framed shots */}
      <section
        id="shots"
        className="mx-auto max-w-full md:max-w-[min(76vw,1400px)] w-full px-5 md:px-8 pb-12 md:pb-16 flex flex-col gap-10 md:gap-14 scroll-mt-24"
      >
        {shots.map((shot) => (
          <figure key={shot.src} className="flex flex-col gap-3">
            <MockupFrame
              image={shot.src}
              alt={`${project.name} — ${shot.caption}`}
              aspect="aspect-[7/5]"
              tint={project.color}
              chrome="browser"
              intensity="subtle"
              url={displayUrl}
              innerPadding="inset-6 md:inset-10"
              objectFit="contain"
              sizes="(min-width: 1400px) 1340px, 100vw"
            />
            <figcaption className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-muted">
              {shot.caption}
            </figcaption>
          </figure>
        ))}
      </section>

      {/* Outcome */}
      {study.outcome && (
        <OutcomeSection outcome={study.outcome} color={project.color} />
      )}

      {/* Next case study */}
      <section className="mx-auto max-w-full md:max-w-[min(67vw,1200px)] w-full px-5 md:px-8 pb-24 md:pb-32">
        <Link
          href={`/work/${next.slug}`}
          className="group flex items-center justify-between gap-6 py-8 md:py-10 border-t border-hairline hover:border-fg transition-colors"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-muted mb-2">
              Next case study
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

function ReelCaseStudy({
  project,
  study,
  next,
}: {
  project: Project;
  study: CaseStudy;
  next: Project;
}) {
  const liveUrl = study.liveUrl ?? "#";

  const tocSections: TocSection[] = [
    { id: "snapshot", label: "Snapshot" },
    { id: "problem", label: "Problem" },
  ];
  if (study.approach) tocSections.push({ id: "approach", label: "Approach" });
  if (study.solutionShots)
    tocSections.push({ id: "solution", label: "Solution" });
  if (study.outcome) tocSections.push({ id: "outcome", label: "Outcome" });

  return (
    <>
      <CaseStudyToc sections={tocSections} color={project.color} />

      {/* Top nav row */}
      <section className="mx-auto max-w-full md:max-w-[min(76vw,1400px)] w-full px-5 md:px-8 pt-12 md:pt-16 pb-8 flex items-center justify-between gap-4">
        <Link
          href="/work"
          className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-hairline text-[12px] text-fg-muted hover:bg-[var(--chip)] hover:text-fg hover:border-[var(--chip)] transition-colors duration-300 ease-out"
        >
          <ArrowLeft weight="bold" className="size-3" />
          All case studies
        </Link>
        <Link
          href={`/work/${next.slug}`}
          className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-hairline text-[12px] text-fg-muted hover:bg-[var(--chip)] hover:text-fg hover:border-[var(--chip)] transition-colors duration-300 ease-out"
        >
          Next: {next.name}
          <ArrowRight
            weight="bold"
            className="size-3 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </section>

      {/* Title */}
      <section className="mx-auto max-w-full md:max-w-[min(76vw,1400px)] w-full px-5 md:px-8 pt-6 md:pt-10 pb-10 md:pb-14">
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-fg-muted mb-6 flex items-center gap-2">
          <Briefcase weight="fill" className="size-3.5" /> Case study
        </p>
        <h1 className="display-tight text-display-md leading-[0.95]">
          {project.name}
          <span style={{ color: project.color }}>.</span>
        </h1>
        <p className="mt-6 max-w-[60ch] text-lg md:text-xl text-fg-muted leading-relaxed">
          {project.tagline}
        </p>
        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-fg-muted">
          {[
            project.year,
            project.category,
            study.meta?.role,
            study.meta?.timeline,
            study.meta?.tools,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </section>

      {/* Massive live-site CTA */}
      <section className="mx-auto max-w-full md:max-w-[min(76vw,1400px)] w-full px-5 md:px-8 pb-16 md:pb-24">
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.18em] text-fg-muted mb-5 md:mb-8 flex items-center gap-2">
            <span
              className="size-1.5 rounded-full shrink-0"
              style={{ background: project.color }}
              aria-hidden
            />
            See it live
          </p>
          <h2
            className="display-tight leading-[0.9] flex items-start gap-4 md:gap-8"
            style={{ fontSize: "clamp(3rem, 11vw, 9rem)" }}
          >
            <span className="relative inline-block">
              reel.com
              <span
                className="absolute left-0 right-0 bottom-[0.08em] h-[0.06em] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
                style={{ background: project.color }}
                aria-hidden
              />
            </span>
            <ArrowUpRight
              weight="bold"
              className="shrink-0 transition-transform duration-500 ease-out group-hover:translate-x-2 group-hover:-translate-y-2"
              style={{
                color: project.color,
                width: "clamp(2.5rem, 8vw, 6rem)",
                height: "clamp(2.5rem, 8vw, 6rem)",
              }}
            />
          </h2>
        </a>
      </section>

      {/* Snapshot — TL;DR */}
      <SnapshotSection study={study} color={project.color} />

      {/* The problem */}
      <ProblemSection study={study} color={project.color} />

      {/* The approach */}
      {study.approach && (
        <ApproachSection
          approach={study.approach}
          color={project.color}
          project={project}
        />
      )}

      {/* The solution */}
      {study.solutionShots && (
        <SolutionSection
          shots={study.solutionShots}
          color={project.color}
          project={project}
          chrome={study.shotChrome ?? study.mediaChrome ?? "browser"}
          url={resolveDisplayUrl(study)}
        />
      )}

      {/* Outcome */}
      {study.outcome && (
        <OutcomeSection outcome={study.outcome} color={project.color} />
      )}

      {/* Next case study */}
      <section className="mx-auto max-w-full md:max-w-[min(67vw,1200px)] w-full px-5 md:px-8 pb-24 md:pb-32">
        <Link
          href={`/work/${next.slug}`}
          className="group flex items-center justify-between gap-6 py-8 md:py-10 border-t border-hairline hover:border-fg transition-colors"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-muted mb-2">
              Next case study
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
