import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import { ScrollReveal } from "@/components/ScrollReveal";

type IconProps = SVGProps<SVGSVGElement> & { weight?: string };
type IconComponent = ComponentType<IconProps>;

export type WhereToNextLink = {
  href: string;
  label: string;
  descriptor?: string;
  Icon: IconComponent;
};

export function WhereToNext({ links }: { links: WhereToNextLink[] }) {
  return (
    <ScrollReveal className="mx-auto max-w-full md:max-w-[min(75vw,1400px)] w-full px-5 md:px-8 pb-20 md:pb-28">
      <div className="flex items-center gap-3 mb-8 md:mb-10">
        <ArrowDownRight weight="bold" className="size-4 text-accent" />
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-fg-muted">
          Where to next
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {links.map((link, i) => {
          const isPrimary = i === 0;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                isPrimary
                  ? "group flex flex-col rounded-2xl bg-[var(--fg)] text-[var(--bg)] p-5 md:p-6 min-h-[120px] md:min-h-[160px] hover:bg-accent transition-colors duration-300 ease-out"
                  : "group flex flex-col rounded-2xl border border-hairline bg-bg-elevated p-5 md:p-6 min-h-[120px] md:min-h-[160px] hover:border-fg transition-colors duration-300 ease-out"
              }
            >
              <div className="flex items-start justify-between">
                <link.Icon
                  weight="fill"
                  className={
                    isPrimary
                      ? "row-icon size-5"
                      : "row-icon size-5 text-fg"
                  }
                />
                {isPrimary ? (
                  <ArrowRight
                    weight="bold"
                    className="row-icon size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                ) : (
                  <ArrowUpRight
                    weight="bold"
                    className="row-icon size-4 text-fg-subtle group-hover:text-fg transition-colors duration-300 ease-out"
                  />
                )}
              </div>
              <div className="mt-8 md:mt-12">
                <p className="display-tight text-[18px] md:text-[20px] leading-[1] mb-1">
                  {link.label}
                </p>
                {link.descriptor && (
                  <p
                    className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
                      isPrimary ? "opacity-60" : "text-fg-subtle"
                    }`}
                  >
                    {link.descriptor}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </ScrollReveal>
  );
}
