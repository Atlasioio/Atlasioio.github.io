import Image from "next/image";

type Props = {
  image?: string;
  mobileImage?: string;
  alt: string;
  aspect?: string;
  tint: string;
  chrome?: "browser" | "none" | "phone" | "paper" | "bleed";
  url?: string;
  intensity?: "subtle" | "strong";
  fallbackLabel?: string;
  priority?: boolean;
  rounded?: string;
  innerPadding?: string;
  sizes?: string;
  // Degrees of rotation for the paper chrome (e.g. 1.2 or -0.8). Ignored otherwise.
  tilt?: number;
  // How the image fits inside the browser/none chrome. "cover" (default) fills the
  // area and may crop; "contain" letterboxes so the full image is always visible —
  // use this when the screenshot aspect doesn't match the frame aspect.
  objectFit?: "cover" | "contain";
};

export function MockupFrame({
  image,
  mobileImage,
  alt,
  aspect = "aspect-[16/9]",
  tint,
  chrome = "browser",
  url = "lukasahlse.com",
  intensity = "subtle",
  fallbackLabel,
  priority = false,
  rounded = "rounded-3xl",
  innerPadding = "inset-6 md:inset-10",
  sizes = "(min-width: 1400px) 1340px, 100vw",
  tilt,
  objectFit = "cover",
}: Props) {
  const imageObjectClass =
    objectFit === "contain" ? "object-contain" : "object-cover object-top";
  // Tint pair: very light to slightly more saturated, so the screenshot pops
  const tintFrom = intensity === "strong" ? "14%" : "6%";
  const tintTo = intensity === "strong" ? "26%" : "12%";
  const tintBg = `linear-gradient(135deg, color-mix(in oklab, ${tint} ${tintFrom}, var(--bg)), color-mix(in oklab, ${tint} ${tintTo}, var(--bg)))`;

  // No image → keep the existing colored placeholder treatment
  if (!image) {
    const placeholderBg = `linear-gradient(135deg, color-mix(in oklab, ${tint} 38%, var(--bg)), color-mix(in oklab, ${tint} 60%, var(--bg)))`;
    return (
      <div
        className={`relative ${aspect} ${rounded} overflow-hidden border border-hairline flex items-center justify-center`}
        style={{ background: placeholderBg }}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-muted text-center px-4">
          {fallbackLabel ?? "Mockup placeholder"}
        </p>
      </div>
    );
  }

  if (chrome === "bleed") {
    return (
      <div
        className={`relative ${aspect} ${rounded} overflow-hidden border border-hairline`}
        style={{ background: tintBg }}
      >
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          className={imageObjectClass}
          priority={priority}
        />
      </div>
    );
  }

  if (chrome === "paper") {
    const tiltDeg = tilt ?? 0;
    return (
      <div
        className={`relative ${aspect} ${rounded} overflow-hidden border border-hairline`}
        style={{ background: tintBg }}
      >
        <div className="absolute inset-6 md:inset-10 flex items-center justify-center">
          <div
            className="relative h-full w-full"
            style={{ transform: `rotate(${tiltDeg}deg)` }}
          >
            {/* paper card */}
            <div
              className="relative h-full w-full rounded-[3px] p-2.5 md:p-4"
              style={{
                background:
                  "linear-gradient(180deg, #fbfaf5 0%, #f4f0e6 100%)",
                boxShadow:
                  "0 26px 50px -22px rgba(40,30,20,0.34), 0 6px 14px -8px rgba(40,30,20,0.2), inset 0 0 0 1px rgba(0,0,0,0.04)",
              }}
            >
              <div
                className="relative h-full w-full overflow-hidden rounded-[2px]"
                style={{ background: "#efeadc" }}
              >
                <Image
                  src={image}
                  alt={alt}
                  fill
                  sizes={sizes}
                  className="object-contain"
                  priority={priority}
                />
              </div>
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

  if (chrome === "phone") {
    return (
      <div
        className={`relative ${aspect} ${rounded} overflow-hidden border border-hairline flex items-center justify-center`}
        style={{ background: tintBg }}
      >
        <div
          className="relative h-[88%] aspect-[9/19] rounded-[1.6rem] p-[5px] shadow-[0_22px_50px_-22px_rgba(0,0,0,0.5)]"
          style={{
            background: "linear-gradient(180deg, #1d1d20 0%, #0a0a0c 100%)",
          }}
        >
          <div className="relative h-full w-full rounded-[1.3rem] overflow-hidden bg-bg">
            <span
              aria-hidden
              className="absolute top-1.5 left-1/2 -translate-x-1/2 z-10 h-3.5 w-14 rounded-full bg-black/95"
            />
            <Image
              src={image}
              alt={alt}
              fill
              sizes={sizes}
              className="object-cover object-top"
              priority={priority}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${aspect} ${rounded} overflow-hidden border border-hairline`}
      style={{ background: tintBg }}
    >
      {/* Desktop / main image, padded inside the tinted card */}
      <div className={`absolute ${innerPadding}`}>
        <div className="relative h-full w-full rounded-xl overflow-hidden bg-bg border border-hairline shadow-[0_18px_48px_-20px_rgba(0,0,0,0.35)] flex flex-col">
          {chrome === "browser" && (
            <div className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-bg-elevated border-b border-hairline">
              <span className="block size-[7px] rounded-full bg-fg-subtle/40" aria-hidden />
              <span className="block size-[7px] rounded-full bg-fg-subtle/40" aria-hidden />
              <span className="block size-[7px] rounded-full bg-fg-subtle/40" aria-hidden />
              <span className="ml-3 text-[9px] tracking-[0.06em] font-mono text-fg-subtle truncate">
                {url}
              </span>
            </div>
          )}
          <div className="relative flex-1">
            <Image
              src={image}
              alt={alt}
              fill
              sizes={sizes}
              className={imageObjectClass}
              priority={priority}
            />
          </div>
        </div>
      </div>

      {/* Mobile companion, floating bottom-right (only md+ to keep mobile layouts simple) */}
      {mobileImage && (
        <div className="hidden md:block absolute bottom-5 right-5 lg:bottom-8 lg:right-8 w-[11%] min-w-[100px] aspect-[9/19] rounded-2xl overflow-hidden bg-bg border border-hairline shadow-[0_18px_48px_-20px_rgba(0,0,0,0.4)]">
          <Image
            src={mobileImage}
            alt={`${alt} — mobile`}
            fill
            sizes="160px"
            className="object-cover object-top"
          />
        </div>
      )}
    </div>
  );
}
