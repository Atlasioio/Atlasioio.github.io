"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent as ReactMouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Briefcase, Flask, Envelope, User } from "@phosphor-icons/react/dist/ssr";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

const NAV_ICONS = {
  "/work": Briefcase,
  "/about": User,
  "/playground": Flask,
  "/contact": Envelope,
} as const;

const COLLAPSE_TRANSITION =
  "500ms cubic-bezier(0.65, 0, 0.35, 1)";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [workHovered, setWorkHovered] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleHomeClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 pt-5 md:pt-7 pointer-events-none">
      <div
        className={`mx-auto px-5 md:px-8 ${
          scrolled ? "h-12 md:h-14" : "h-14 md:h-16"
        } flex items-center justify-between gap-3 pointer-events-auto`}
        style={{
          maxWidth: scrolled ? "480px" : "min(75vw, 1400px)",
          paddingLeft: scrolled ? "1.35rem" : undefined,
          paddingRight: scrolled ? "1.5rem" : undefined,
          background: scrolled
            ? "color-mix(in oklab, var(--bg) 54%, transparent)"
            : "transparent",
          borderRadius: scrolled ? "9999px" : "0",
          backdropFilter: scrolled ? "blur(12px) saturate(150%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px) saturate(150%)" : "none",
          border: scrolled
            ? "1px solid color-mix(in oklab, var(--fg) 7%, transparent)"
            : "1px solid transparent",
          boxShadow: scrolled
            ? "0 8px 22px -14px color-mix(in oklab, var(--fg) 14%, transparent)"
            : "none",
          transition:
            "max-width 500ms cubic-bezier(0.65, 0, 0.35, 1), height 500ms cubic-bezier(0.65, 0, 0.35, 1), padding 500ms cubic-bezier(0.65, 0, 0.35, 1), background 380ms ease 60ms, border-color 380ms ease 60ms, border-radius 380ms ease 60ms, box-shadow 380ms ease 60ms, backdrop-filter 380ms ease 60ms",
        }}
      >
        <Link
          href="/"
          onClick={handleHomeClick}
          className="group relative inline-flex items-center px-3.5 py-1.5 -mx-3.5 -my-1.5 overflow-hidden"
          style={{ borderRadius: "45% 60% 50% 55% / 70% 90% 75% 85%" }}
          aria-label="Home"
        >
          <span className="engulf-dot" aria-hidden />
          <span className="relative z-10 display-tight text-[19px] md:text-[20px] leading-none hidden sm:inline-block transition-colors duration-300 ease-out delay-100 group-hover:text-[var(--bg)]">
            Lukas Ahlse
            <span className="text-accent transition-colors duration-300 delay-100 group-hover:text-[var(--bg)]">
              .
            </span>
          </span>
          <span className="relative z-10 display-tight text-[19px] leading-none sm:hidden inline-block transition-colors duration-300 ease-out delay-100 group-hover:text-[var(--bg)]">
            LA
            <span className="text-accent transition-colors duration-300 delay-100 group-hover:text-[var(--bg)]">
              .
            </span>
          </span>
        </Link>

        <nav
          className="flex items-center"
          style={{
            gap: scrolled ? "1.25rem" : "1.75rem",
            transition: `gap ${COLLAPSE_TRANSITION}`,
          }}
          aria-label="Primary"
        >
          <AnimatePresence initial={false}>
            {!isHome && (
              <motion.div
                key="back-btn"
                initial={{ opacity: 0, width: 0, x: -10, scale: 0.85 }}
                animate={{ opacity: 1, width: 28, x: 0, scale: 1 }}
                exit={{ opacity: 0, width: 0, x: -10, scale: 0.85 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: "hidden" }}
              >
                <Link
                  href={pathname.startsWith("/work/") ? "/work" : "/"}
                  className="flex size-7 items-center justify-center rounded-full bg-[var(--chip)] hover:bg-accent text-fg-muted hover:text-white transition-colors duration-300 ease-out shrink-0"
                  aria-label={pathname.startsWith("/work/") ? "Back to work" : "Back to home"}
                >
                  <ArrowLeft weight="bold" className="size-3.5" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {site.nav.map((item) => {
            const Icon = NAV_ICONS[item.href as keyof typeof NAV_ICONS];
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(`${item.href}/`));
            const currentProject =
              item.href === "/work" && pathname.startsWith("/work/")
                ? projects.find(
                    (p) =>
                      pathname === `/work/${p.slug}` ||
                      pathname.startsWith(`/work/${p.slug}/`),
                  )
                : null;
            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={item.href === "/work" ? () => setWorkHovered(true) : undefined}
                onMouseLeave={item.href === "/work" ? () => setWorkHovered(false) : undefined}
                className={`group flex items-center py-1 text-[14px] transition-colors ${
                  isActive
                    ? "text-fg"
                    : "text-fg-muted hover:text-fg"
                }`}
                style={{
                  gap: scrolled ? "0" : "0.5rem",
                  transition: `color 200ms, gap ${COLLAPSE_TRANSITION}`,
                }}
              >
                {Icon && (
                  <span className="relative shrink-0 inline-block">
                    <span className="group/icon relative inline-block">
                      <span
                        className={`flex size-8 items-center justify-center rounded-full transition-colors ${
                          isActive
                            ? "bg-accent text-white"
                            : "bg-[var(--chip)] group-hover:bg-[var(--chip-hover)] text-fg"
                        }`}
                      >
                        <Icon
                          weight="fill"
                          className={`size-4 transition-opacity ${
                            isActive
                              ? "opacity-100"
                              : "opacity-80 group-hover:opacity-100"
                          }`}
                        />
                      </span>
                      {isActive && !scrolled && (
                        <motion.span
                          layoutId="nav-active-dot"
                          aria-hidden
                          className="absolute left-1/2 -bottom-3 size-1 -translate-x-1/2 rounded-full bg-accent"
                          transition={{ type: "spring", stiffness: 420, damping: 32 }}
                        />
                      )}
                      {scrolled && !(item.href === "/work" && isActive) && (
                        <span
                          role="tooltip"
                          className="pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-[0.14em] bg-[var(--fg)] text-[var(--bg)] whitespace-nowrap opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 z-50"
                        >
                          {item.href === "/work" ? "Selected work" : item.label}
                        </span>
                      )}
                    </span>
                    {item.href === "/work" &&
                      (pathname === "/work" || pathname.startsWith("/work/")) && (
                        <ul className="hidden md:flex flex-col items-center absolute left-1/2 -translate-x-1/2 top-full pt-5 gap-3">
                          {(currentProject
                            ? [
                                currentProject,
                                ...projects.filter(
                                  (p) => p.slug !== currentProject.slug,
                                ),
                              ]
                            : projects
                          ).map((p, i) => {
                            const isCurrent = currentProject?.slug === p.slug;
                            const visible = isCurrent || workHovered;
                            return (
                              <motion.li
                                key={p.slug}
                                layoutId={`work-sub-dot-${p.slug}`}
                                initial={false}
                                animate={{
                                  opacity: visible ? 1 : 0,
                                  scale: visible ? 1 : 0.6,
                                }}
                                transition={{
                                  opacity: {
                                    duration: 0.2,
                                    delay:
                                      workHovered && !isCurrent ? i * 0.04 : 0,
                                    ease: [0.22, 1, 0.36, 1],
                                  },
                                  scale: {
                                    duration: 0.25,
                                    delay:
                                      workHovered && !isCurrent ? i * 0.04 : 0,
                                    ease: [0.22, 1, 0.36, 1],
                                  },
                                  layout: {
                                    type: "spring",
                                    stiffness: 380,
                                    damping: 28,
                                  },
                                }}
                                className={
                                  visible ? "" : "pointer-events-none"
                                }
                              >
                                <Link
                                  href={`/work/${p.slug}`}
                                  aria-label={p.name}
                                  aria-current={isCurrent ? "page" : undefined}
                                  title={p.name}
                                  className="group/dot relative flex items-center justify-center size-3"
                                >
                                  <span
                                    className={`size-1.5 rounded-full transition-[colors,transform] duration-200 group-hover/dot:scale-125 ${
                                      isCurrent
                                        ? "bg-fg"
                                        : "bg-fg-muted group-hover/dot:bg-accent"
                                    }`}
                                  />
                                  <span className="pointer-events-none absolute left-full ml-2 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-[0.14em] bg-[var(--fg)] text-[var(--bg)] whitespace-nowrap opacity-0 group-hover/dot:opacity-100 transition-opacity duration-150 z-50 inline-flex items-center gap-1.5">
                                    <p.Icon weight="regular" className="size-3" />
                                    {p.name}
                                  </span>
                                </Link>
                              </motion.li>
                            );
                          })}
                        </ul>
                      )}
                  </span>
                )}
                <span
                  className="nav-text hidden sm:inline-block"
                  style={{
                    maxWidth: scrolled ? "0px" : "120px",
                    opacity: scrolled ? 0 : 1,
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
