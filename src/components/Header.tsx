"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent as ReactMouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Envelope,
  Flask,
  User,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

const NAV_ICONS = {
  "/work": Briefcase,
  "/about": User,
  "/playground": Flask,
  "/contact": Envelope,
} as const;

// Mobile uses shorter labels for the longest names so adjacent icons don't
// need extra spacing to keep their labels from colliding. Desktop keeps the
// full names.
const MOBILE_LABEL_OVERRIDES: Record<string, string> = {
  "/playground": "Lab",
};

const COLLAPSE_TRANSITION = "500ms cubic-bezier(0.65, 0, 0.35, 1)";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [workHovered, setWorkHovered] = useState(false);
  const [mobileWorkOpen, setMobileWorkOpen] = useState(false);
  // Track viewport so we can gate the inline pill-collapse styles (max-width,
  // padding) to desktop only. Initial value is `false` to match SSR; this
  // means mobile renders correctly on first paint and desktop gets the pill
  // styling re-applied on mount.
  const [isDesktop, setIsDesktop] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const currentSlug =
    pathname.startsWith("/work/") && pathname !== "/work"
      ? pathname.slice("/work/".length).split("/")[0]
      : null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Close the projects sheet whenever the route changes.
  useEffect(() => {
    setMobileWorkOpen(false);
  }, [pathname]);

  // Lock body scroll while the projects sheet is open.
  useEffect(() => {
    if (!mobileWorkOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileWorkOpen]);

  const handleHomeClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // On mobile (<md), tapping Work opens the projects sheet instead of
  // navigating to /work. Width is checked at click time so rotating into
  // landscape (which crosses 768px) restores normal navigation.
  const handleWorkClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      e.preventDefault();
      setMobileWorkOpen((v) => !v);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 pt-5 md:pt-7 px-[clamp(10px,3vw,16px)] md:px-0 pointer-events-none">
        <div
          className={`mx-auto w-full px-[clamp(14px,4vw,20px)] md:px-8 ${
            scrolled ? "h-12 md:h-14" : "h-14 md:h-16"
          } flex items-center justify-between gap-3 pointer-events-auto`}
          style={{
            // Pill-collapse maxWidth + extra horizontal padding only apply on
            // desktop. On mobile the bar stays full-width with consistent
            // px-5 padding in both states.
            maxWidth: isDesktop
              ? scrolled
                ? "480px"
                : "min(75vw, 1400px)"
              : undefined,
            paddingLeft: isDesktop && scrolled ? "1.35rem" : undefined,
            paddingRight: isDesktop && scrolled ? "1.5rem" : undefined,
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
            <span className="relative z-10 display-tight text-[19px] md:text-[20px] leading-none hidden md:inline-block transition-colors duration-300 ease-out delay-100 group-hover:text-[var(--bg)]">
              Lukas Ahlse
              <span className="text-accent transition-colors duration-300 delay-100 group-hover:text-[var(--bg)] inline-block text-[0.9em] align-baseline">
                .
              </span>
            </span>
            <span className="relative z-10 display-tight text-[19px] leading-none md:hidden inline-block transition-colors duration-300 ease-out delay-100 group-hover:text-[var(--bg)]">
              LA
              <span className="text-accent transition-colors duration-300 delay-100 group-hover:text-[var(--bg)] inline-block text-[0.9em] align-baseline">
                .
              </span>
            </span>
          </Link>

          <nav
            className={`flex items-center transition-[gap] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
              scrolled
                ? "gap-[clamp(14px,3.5vw,20px)] md:gap-5"
                : "gap-[clamp(18px,5vw,28px)] md:gap-7"
            }`}
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
              const isRouteActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`));
              const isActive =
                isRouteActive || (item.href === "/work" && mobileWorkOpen);
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
                  onClick={item.href === "/work" ? handleWorkClick : undefined}
                  onMouseEnter={item.href === "/work" ? () => setWorkHovered(true) : undefined}
                  onMouseLeave={item.href === "/work" ? () => setWorkHovered(false) : undefined}
                  className={`group relative flex items-center py-1 text-[14px] transition-colors ${
                    isActive ? "text-fg" : "text-fg-muted hover:text-fg"
                  }`}
                  style={{
                    // Gap only matters on desktop where the label sits inline
                    // next to the icon. Mobile label is absolutely positioned
                    // so it doesn't push the icon around.
                    gap: isDesktop ? (scrolled ? "0" : "0.4rem") : 0,
                    transition: `color 200ms, gap ${COLLAPSE_TRANSITION}`,
                  }}
                  aria-current={isRouteActive ? "page" : undefined}
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
                        {isActive && !scrolled && isDesktop && (
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
                            className="pointer-events-none hidden md:block absolute left-1/2 top-full mt-3 -translate-x-1/2 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-[0.14em] bg-[var(--fg)] text-[var(--bg)] whitespace-nowrap opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 z-50"
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

                  {/* Conditionally render one label or the other based on
                      viewport. Mobile uses absolute positioning so the label
                      width never affects icon spacing. */}
                  {isDesktop ? (
                    <span
                      className="nav-text inline-block"
                      style={{
                        maxWidth: scrolled ? "0px" : "120px",
                        opacity: scrolled ? 0 : 1,
                      }}
                    >
                      {item.label}
                    </span>
                  ) : (
                    <span
                      className="absolute left-1/2 font-mono uppercase leading-none whitespace-nowrap pointer-events-none text-center"
                      style={{
                        top: "calc(100% - 2px)",
                        transform: "translateX(-50%)",
                        fontSize: "9px",
                        letterSpacing: "0.12em",
                        opacity: scrolled ? 0 : 1,
                        transition: `opacity 280ms ease`,
                      }}
                    >
                      {MOBILE_LABEL_OVERRIDES[item.href] ?? item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {mobileWorkOpen && (
          <MobileProjectsSheet
            onClose={() => setMobileWorkOpen(false)}
            currentSlug={currentSlug}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function MobileProjectsSheet({
  onClose,
  currentSlug,
}: {
  onClose: () => void;
  currentSlug: string | null;
}) {
  return (
    <>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] md:hidden"
        style={{
          background: "color-mix(in oklab, var(--fg) 28%, transparent)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
        }}
      />
      <motion.div
        key="sheet"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 32, mass: 0.9 }}
        className="fixed left-0 right-0 bottom-0 z-[61] md:hidden bg-bg-elevated border-t border-hairline rounded-t-3xl shadow-[0_-12px_30px_-12px_rgba(0,0,0,0.25)] flex flex-col max-h-[78dvh]"
        role="dialog"
        aria-label="Projects"
        aria-modal="true"
      >
        <div className="pt-3 pb-1 flex justify-center shrink-0">
          <div className="h-1 w-10 rounded-full bg-fg-subtle/40" />
        </div>

        <div className="px-5 pt-2 pb-3 flex items-center justify-between shrink-0">
          <h2 className="display-tight text-[18px]">Selected work</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full bg-[var(--chip)] hover:bg-[var(--chip-hover)] text-fg-muted hover:text-fg transition-colors"
            aria-label="Close"
          >
            <X weight="bold" className="size-3.5" />
          </button>
        </div>

        <div className="px-5 pb-3 shrink-0">
          <Link
            href="/work"
            onClick={onClose}
            className="group/all flex items-center justify-between px-4 py-3 rounded-2xl bg-fg text-[var(--bg)] active:scale-[0.99] transition-transform"
          >
            <span className="font-medium text-[14px]">All projects</span>
            <ArrowRight
              weight="bold"
              className="size-4 transition-transform group-hover/all:translate-x-0.5"
            />
          </Link>
        </div>

        <ul
          className="px-3 flex flex-col gap-1 overflow-y-auto"
          style={{ paddingBottom: "max(env(safe-area-inset-bottom), 1rem)" }}
        >
          {projects.map((p) => {
            const isCurrent = currentSlug === p.slug;
            return (
              <li key={p.slug}>
                <Link
                  href={`/work/${p.slug}`}
                  onClick={onClose}
                  className={`group/row flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    isCurrent
                      ? "bg-[var(--chip-hover)]"
                      : "active:bg-[var(--chip)] hover:bg-[var(--chip)]"
                  }`}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  <span
                    className="flex size-9 items-center justify-center rounded-full shrink-0"
                    style={{ backgroundColor: p.color, color: "white" }}
                  >
                    <p.Icon weight="fill" className="size-4" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-medium text-[14px] text-fg truncate">
                      {p.name}
                    </span>
                    <span className="block text-[11px] text-fg-muted truncate">
                      {p.year} · {p.category}
                    </span>
                  </span>
                  <ArrowRight
                    weight="bold"
                    className="size-3.5 text-fg-subtle group-hover/row:text-fg-muted shrink-0"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </>
  );
}
