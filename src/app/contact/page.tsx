import Image from "next/image";
import {
  ArrowUpRight,
  Briefcase,
  FileArrowDown,
  Envelope,
  Flask,
  MapPin,
  Phone,
  PencilLine,
  User,
} from "@phosphor-icons/react/dist/ssr";
import { InstagramIcon, LinkedInIcon } from "@/components/BrandIcons";
import { ContactForm } from "@/components/ContactForm";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { WhereToNext } from "@/components/WhereToNext";
import { site } from "@/lib/site";

export const metadata = { title: "Contact" };

import type { ComponentType } from "react";

type Card = {
  label: string;
  value: string;
  Icon: ComponentType<{ className?: string; weight?: string }>;
  href?: string;
  external?: boolean;
};

const contactCards: Card[] = [
  {
    label: "Email",
    value: "ahlselukas@gmail.com",
    href: `mailto:${site.email}`,
    Icon: Envelope,
  },
  {
    label: "LinkedIn",
    value: "lukas-ahlse",
    href: site.links.linkedin,
    external: true,
    Icon: LinkedInIcon,
  },
  {
    label: "Instagram",
    value: "@lukasahlse",
    href: site.links.instagram,
    external: true,
    Icon: InstagramIcon,
  },
  {
    label: "Phone",
    value: "+46 706 17 98 98",
    href: `tel:${site.phone}`,
    Icon: Phone,
  },
  {
    label: "Resume",
    value: "Download (PDF)",
    href: site.links.cv,
    Icon: FileArrowDown,
  },
  {
    label: "Location",
    value: "Malmö, Sweden — open to relocate",
    href: "https://www.google.com/maps/place/Malm%C3%B6,+Sweden/",
    external: true,
    Icon: MapPin,
  },
];

function CardContent({ card }: { card: Card }) {
  const Icon = card.Icon;
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <span className="size-10 rounded-full bg-[var(--chip)] flex items-center justify-center group-hover:bg-accent transition-colors duration-300 ease-out">
          <Icon weight="fill" className="row-icon size-4 group-hover:text-white transition-colors duration-300 ease-out" />
        </span>
        {card.href && (
          <ArrowUpRight className="size-4 opacity-40 group-hover:opacity-100 group-hover:-translate-y-px group-hover:translate-x-px transition-all duration-300 ease-out" />
        )}
      </div>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle mb-2">
        {card.label}
      </p>
      <p className="text-base font-medium leading-snug">{card.value}</p>
    </>
  );
}

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-[min(75vw,1400px)] w-full px-5 md:px-8 py-14 md:py-20">
      {/* Hero row */}
      <div className="grid grid-cols-12 gap-x-6 gap-y-10 items-end">
        <div className="col-span-12 md:col-span-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle mb-6 flex items-center gap-2">
            <Envelope weight="fill" className="size-3.5" /> Contact
          </p>
          <h1 className="display-tight text-display-lg leading-[0.92]">
            Say hi<span className="text-accent">.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg md:text-xl text-fg-muted leading-relaxed">
            Open to product-design roles, freelance, and good design &amp;
            tech conversations. Replies usually within a day.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <CopyEmailButton />

            <a
              href={site.links.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="group flex size-14 items-center justify-center rounded-full bg-[var(--chip)] hover:bg-[var(--chip-hover)] text-fg-muted hover:text-fg transition-colors duration-300 ease-out"
            >
              <LinkedInIcon className="row-icon size-5 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            </a>

            <a
              href={`tel:${site.phone}`}
              aria-label="Call"
              className="group flex size-14 items-center justify-center rounded-full bg-[var(--chip)] hover:bg-[var(--chip-hover)] text-fg-muted hover:text-fg transition-colors duration-300 ease-out"
            >
              <Phone weight="fill" className="row-icon size-5 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
          </div>
        </div>

        <div className="col-span-12 md:col-span-5 flex justify-center md:justify-end">
          <div className="relative isolate shrink-0">
            <span
              aria-hidden
              className="absolute -inset-3 md:-inset-5 bg-bg-elevated blob-morph-contact -z-10"
            />
            <div
              className="relative size-56 md:size-72 overflow-hidden border border-hairline"
              style={{
                borderRadius: "42% 76% 48% 60% / 70% 60% 50% 60%",
              }}
            >
              <Image
                src="/photo.jpg"
                alt="Lukas Ahlse"
                fill
                sizes="(min-width: 768px) 288px, 224px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact form */}
      <div id="message" className="mt-16 md:mt-24 grid grid-cols-12 gap-x-6 gap-y-8 scroll-mt-24">
        <div className="col-span-12 md:col-span-5">
          <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-fg-muted mb-5 flex items-center gap-2">
            <PencilLine weight="fill" className="size-3.5" /> Or write
          </p>
          <h2 className="display-tight text-3xl md:text-5xl leading-[0.95]">
            A message<span className="text-accent">.</span>
          </h2>
          <p className="mt-5 text-base text-fg-muted leading-relaxed max-w-md">
            For longer notes, briefs, or just a hello — happy to hear
            whatever&rsquo;s on your mind. I&rsquo;ll get back to you in no
            time.
          </p>
        </div>
        <div className="col-span-12 md:col-span-7 md:pt-[38px]">
          <ContactForm />
        </div>
      </div>

      {/* Contact cards grid */}
      <div className="mt-16 md:mt-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle mb-6 flex items-center gap-2">
          <ArrowUpRight className="size-3" /> All channels
        </p>
        <div className="grid grid-cols-12 gap-4">
          {contactCards.map((card) =>
            card.href ? (
              <a
                key={card.label}
                href={card.href}
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noreferrer" : undefined}
                className="group col-span-12 sm:col-span-6 md:col-span-4 rounded-2xl border border-hairline p-6 transition-all duration-300 ease-out hover:border-fg hover:bg-bg-elevated"
              >
                <CardContent card={card} />
              </a>
            ) : (
              <div
                key={card.label}
                className="group col-span-12 sm:col-span-6 md:col-span-4 rounded-2xl border border-hairline p-6"
              >
                <CardContent card={card} />
              </div>
            )
          )}
        </div>
      </div>

      <WhereToNext
        links={[
          { href: "/work", label: "See selected work", Icon: Briefcase },
          { href: "/about", label: "Learn more about me", Icon: User },
          { href: "/playground", label: "Laboratory", Icon: Flask },
        ]}
      />
    </section>
  );
}
