export type PaperNoteItem = string | { text: string; sub?: string[] };

type Props = {
  title: string;
  items: PaperNoteItem[];
  tint: string;
  tilt?: number;
  aspect?: string;
  rounded?: string;
};

export function PaperNote({
  title,
  items,
  tint,
  tilt = 0,
  aspect = "aspect-[4/3]",
  rounded = "rounded-2xl",
}: Props) {
  const tintBg = `linear-gradient(135deg, color-mix(in oklab, ${tint} 6%, var(--bg)), color-mix(in oklab, ${tint} 12%, var(--bg)))`;

  return (
    <div
      className={`relative ${aspect} ${rounded} overflow-hidden border border-hairline`}
      style={{ background: tintBg }}
    >
      <div className="absolute inset-6 md:inset-10 flex items-center justify-center">
        <div
          className="relative h-full w-full"
          style={{ transform: `rotate(${tilt}deg)` }}
        >
          {/* paper card */}
          <div
            className="relative h-full w-full rounded-[3px] p-5 md:p-8 flex flex-col"
            style={{
              background: "linear-gradient(180deg, #fbfaf5 0%, #f4f0e6 100%)",
              boxShadow:
                "0 26px 50px -22px rgba(40,30,20,0.34), 0 6px 14px -8px rgba(40,30,20,0.2), inset 0 0 0 1px rgba(0,0,0,0.04)",
            }}
          >
            <h4
              className="display-tight text-[1.05rem] md:text-2xl leading-[1.05] mb-3 md:mb-5 pr-6"
              style={{ color: "#2a1f10", letterSpacing: "-0.01em" }}
            >
              {title}
            </h4>
            <ul className="flex flex-col gap-1.5 md:gap-2.5 min-h-0">
              {items.map((raw, i) => {
                const item =
                  typeof raw === "string" ? { text: raw } : raw;
                return (
                  <li key={i} className="flex flex-col gap-1 md:gap-1.5">
                    <div className="flex items-start gap-2 md:gap-2.5">
                      <span
                        aria-hidden
                        className="mt-[0.45em] size-1 md:size-1.5 rounded-full shrink-0"
                        style={{ background: tint }}
                      />
                      <span
                        className="text-[0.78rem] md:text-[0.95rem] leading-snug"
                        style={{ color: "#3a2f20" }}
                      >
                        {item.text}
                      </span>
                    </div>
                    {item.sub && item.sub.length > 0 && (
                      <ul className="flex flex-col gap-1 md:gap-1.5 pl-4 md:pl-6">
                        {item.sub.map((s, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2 md:gap-2.5"
                          >
                            <span
                              aria-hidden
                              className="mt-[0.5em] size-1 rounded-full shrink-0"
                              style={{
                                background: `color-mix(in oklab, ${tint} 55%, transparent)`,
                              }}
                            />
                            <span
                              className="text-[0.72rem] md:text-[0.85rem] leading-snug italic"
                              style={{ color: "#5a4d3c" }}
                            >
                              {s}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          {/* washi tape — top-left */}
          <span
            aria-hidden
            className="absolute -top-2 left-[16%] z-10 h-5 w-14 md:w-20 -rotate-6"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,228,158,0.65) 0%, rgba(238,205,128,0.5) 100%)",
              boxShadow: "0 1px 3px rgba(40,30,20,0.14)",
            }}
          />
          {/* washi tape — top-right */}
          <span
            aria-hidden
            className="absolute -top-2 right-[16%] z-10 h-5 w-14 md:w-20 rotate-6"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,228,158,0.65) 0%, rgba(238,205,128,0.5) 100%)",
              boxShadow: "0 1px 3px rgba(40,30,20,0.14)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
