/**
 * Stylised "Jobquest" sign-in screen, rendered as React inside the laptop
 * MockupFrame on the home bento and case-study hero. Uses container-query
 * units so the layout reads the same whether it's shown 1340px wide on the
 * case-study hero or 400px wide in the bento.
 */
export function JobquestLogin() {
  const green = "#87D970";
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-[3.5%]"
      style={{
        background: `radial-gradient(120% 90% at 25% 15%, #B0EA9C 0%, ${green} 45%, #6FC256 100%)`,
      }}
    >
      {/* Soft highlight glow, top-left */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          inset: "-10%",
          background:
            "radial-gradient(40% 32% at 18% 8%, rgba(255,255,255,0.35) 0%, transparent 65%)",
        }}
      />
      {/* Soft shade glow, bottom-right */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          background:
            "radial-gradient(50% 40% at 92% 92%, rgba(0,0,0,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Dark green J badge */}
      <div
        className="relative flex items-center justify-center leading-none"
        style={{
          background: "#1f5f10",
          color: "white",
          width: "13%",
          aspectRatio: "1 / 1",
          borderRadius: "22%",
          fontSize: "9cqw",
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontWeight: 800,
          boxShadow:
            "0 1.2cqw 3.2cqw -1cqw rgba(0,0,0,0.28), inset 0 0 0 1px rgba(0,0,0,0.08)",
        }}
      >
        J
      </div>

      {/* Jobquest wordmark — bold, dark */}
      <p
        className="relative leading-none tracking-tight"
        style={{
          fontSize: "7cqw",
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontWeight: 800,
          color: "#0a1f0a",
        }}
      >
        Jobquest<span style={{ color: "#0a1f0a" }}>.</span>
      </p>

      {/* Tagline */}
      <p
        className="relative uppercase"
        style={{
          fontSize: "1.6cqw",
          letterSpacing: "0.22em",
          color: "rgba(0,0,0,0.55)",
          fontFamily: "var(--font-mono), ui-monospace, monospace",
        }}
      >
        Personal job-search tracker
      </p>

      {/* Continue button — black, compact */}
      <button
        type="button"
        className="relative rounded-full"
        style={{
          background: "#0a0a0a",
          color: "white",
          fontSize: "1.4cqw",
          padding: "0.9cqw 3cqw",
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontWeight: 500,
          boxShadow: "0 0.7cqw 2cqw -0.5cqw rgba(0,0,0,0.32)",
        }}
      >
        Continue
      </button>
    </div>
  );
}
