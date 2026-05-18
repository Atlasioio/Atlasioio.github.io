"use client";

import { useEffect, useState } from "react";

export type TocSection = { id: string; label: string };

export function CaseStudyToc({
  sections,
  color,
}: {
  sections: TocSection[];
  color: string;
}) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top,
          );
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0% -55% 0%",
        threshold: 0,
      },
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="Case study sections"
      className="hidden min-[1380px]:block fixed right-4 top-1/2 -translate-y-1/2 w-[130px] z-30"
    >
      <ul className="flex flex-col gap-3.5">
        {sections.map(({ id, label }) => {
          const active = activeId === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`group flex items-center gap-2.5 transition-colors duration-200 ${
                  active ? "text-fg" : "text-fg-subtle hover:text-fg-muted"
                }`}
              >
                <span
                  className="block size-1.5 rounded-full transition-all duration-300 shrink-0"
                  style={{
                    background: active ? color : "currentColor",
                    opacity: active ? 1 : 0.35,
                  }}
                  aria-hidden
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] truncate">
                  {label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
