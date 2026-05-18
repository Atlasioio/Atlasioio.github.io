"use client";

export function ClickSymphonyPreview() {
  const dots = [0, 1, 2, 3, 4, 5, 6];
  return (
    <div className="flex h-full w-full items-center justify-center gap-2">
      {dots.map((i) => (
        <span
          key={i}
          className="size-2 rounded-full bg-fg/40"
          style={{
            transform: `translateY(${Math.sin(i) * 6}px)`,
          }}
        />
      ))}
    </div>
  );
}

export function ClickSymphonyFull() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle">
        Step 2 — coming next session
      </p>
      <p className="mt-6 max-w-[44ch] text-fg-muted">
        Every clickable thing on this page tuned to a note in one scale. Click
        around and play. Or hit play and let the page perform itself.
      </p>
    </div>
  );
}
