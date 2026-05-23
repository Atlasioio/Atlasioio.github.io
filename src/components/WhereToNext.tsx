import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { ArrowDownRight } from "@phosphor-icons/react/dist/ssr";

type IconProps = SVGProps<SVGSVGElement> & { weight?: string };
type IconComponent = ComponentType<IconProps>;

export type WhereToNextLink = {
  href: string;
  label: string;
  Icon: IconComponent;
};

export function WhereToNext({ links }: { links: WhereToNextLink[] }) {
  return (
    <section className="mx-auto max-w-[min(75vw,1400px)] w-full px-5 md:px-8 pb-20 md:pb-28">
      <div className="flex items-center gap-3 mb-8 md:mb-10">
        <ArrowDownRight weight="bold" className="size-4 text-accent" />
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-fg-muted">
          Where to next
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {links.map((link, i) => {
          const isPrimary = i === 0;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                isPrimary
                  ? "group inline-flex items-center gap-2.5 pl-5 pr-4 py-3 rounded-full bg-[var(--fg)] text-[var(--bg)] hover:bg-accent hover:text-[var(--bg)] transition-colors duration-300 ease-out text-[14px]"
                  : "group inline-flex items-center gap-2 px-4 py-3 rounded-full border border-hairline text-[13px] text-fg-muted hover:bg-[var(--chip)] hover:text-fg hover:border-[var(--chip)] transition-colors duration-300 ease-out"
              }
            >
              <link.Icon
                weight="fill"
                className={
                  isPrimary
                    ? "row-icon size-4 translate-y-[1px]"
                    : "row-icon size-3.5"
                }
              />
              {link.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
