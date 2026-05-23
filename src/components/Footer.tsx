import Link from "next/link";
import {
  ArrowUpRight,
  FileArrowDown,
  Envelope,
  MapPin,
  Phone,
} from "@phosphor-icons/react/dist/ssr";
import { site } from "@/lib/site";
import { InstagramIcon, LinkedInIcon } from "@/components/BrandIcons";

const linkRows = [
  { label: "Email", value: "ahlselukas@gmail.com", href: `mailto:${site.email}`, Icon: Envelope },
  { label: "LinkedIn", value: "lukas-ahlse", href: site.links.linkedin, Icon: LinkedInIcon, external: true },
  { label: "Instagram", value: "@lukasahlse", href: site.links.instagram, Icon: InstagramIcon, external: true },
  { label: "Resume", value: "Download (PDF)", href: site.links.cv, Icon: FileArrowDown },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16">
      <div className="mx-auto max-w-full md:max-w-[min(75vw,1400px)] px-5 md:px-8 py-12 md:py-16">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle mb-6 flex items-center gap-2">
              <Envelope weight="fill" className="size-3.5" /> Get in touch
            </p>
            <h2 className="display-tight text-5xl md:text-7xl leading-[0.92]">
              Let&rsquo;s build
              <br />
              something good<span className="text-accent">.</span>
            </h2>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${site.email}`}
                className="group inline-flex items-center gap-2.5 pl-4 pr-3 py-2.5 rounded-full bg-[var(--fg)] text-[var(--bg)] hover:bg-accent hover:text-[var(--bg)] transition-colors duration-300 ease-out text-[14px]"
              >
                <Envelope weight="fill" className="row-icon size-3.5 translate-y-[1px]" />
                {site.email}
                <ArrowUpRight className="size-3.5 translate-y-[1px] group-hover:-translate-y-[1px] group-hover:translate-x-px transition-transform" />
              </a>
              <a
                href={`tel:${site.phone}`}
                className="group inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full border border-hairline text-[13px] text-fg-muted hover:bg-[var(--chip)] hover:text-fg hover:border-[var(--chip)] transition-colors duration-300 ease-out"
                aria-label="Call Lukas"
              >
                <Phone weight="fill" className="row-icon size-3.5" />
                Call
              </a>
            </div>
          </div>

          <div className="md:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle mb-6 flex items-center gap-2">
              <ArrowUpRight className="size-3" /> Elsewhere
            </p>
            <ul className="space-y-1">
              {linkRows.map((row) => (
                <li key={row.label}>
                  <Link
                    href={row.href}
                    target={row.external ? "_blank" : undefined}
                    rel={row.external ? "noreferrer" : undefined}
                    className="group flex items-center justify-between py-3 border-b border-hairline hover:border-fg transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <row.Icon weight="fill" className="row-icon size-3.5 opacity-60 group-hover:opacity-100 group-hover:text-accent transition-[opacity,color] duration-300" />
                      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle group-hover:text-fg transition-colors">
                        {row.label}
                      </span>
                    </span>
                    <span className="flex items-center gap-2 text-[14px] group-hover:text-accent transition-colors">
                      {row.value}
                      <ArrowUpRight className="size-3.5 opacity-50 group-hover:opacity-100 group-hover:-translate-y-px group-hover:translate-x-px transition-all" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-16 text-[11px] font-mono uppercase tracking-[0.18em] text-fg-subtle">
          <span>© {year} Lukas Ahlse</span>
          <span className="flex items-center gap-2">
            <span className="relative flex size-1.5">
              <span
                className="absolute inset-0 rounded-full bg-[var(--status-available)] animate-ping opacity-70"
                aria-hidden
              />
              <span
                className="relative size-1.5 rounded-full bg-[var(--status-available)]"
                aria-hidden
              />
            </span>
            Available for new opportunities
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin weight="fill" className="size-3.5" />
            Malmö, Sweden
          </span>
        </div>
      </div>
    </footer>
  );
}

