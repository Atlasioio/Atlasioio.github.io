"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Envelope } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/lib/site";

export function CopyEmailButton() {
  const [toast, setToast] = useState<
    { msg: string; tone: "success" | "error" } | null
  >(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setToast({ msg: "Copied email address", tone: "success" });
    } catch {
      setToast({ msg: "Couldn't copy email", tone: "error" });
    }
    setTimeout(() => setToast(null), 2400);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy ${site.email}`}
        className="group inline-flex items-center gap-3 px-5 py-3.5 rounded-full bg-[var(--fg)] text-[var(--bg)] hover:bg-accent hover:text-[var(--bg)] transition-colors duration-300 ease-out text-lg md:text-xl cursor-pointer"
      >
        <Envelope weight="fill" className="row-icon size-5 translate-y-[1px]" />
        {site.email}
        <Copy
          weight="regular"
          className="size-5 translate-y-[1px] transition-transform duration-300 ease-out group-hover:scale-110"
        />
      </button>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-fg text-bg text-[13px] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)]"
          >
            {toast.tone === "success" ? (
              <Check weight="bold" className="size-3.5 text-[var(--status-available)]" />
            ) : (
              <span
                className="size-1.5 rounded-full"
                style={{ background: "#e36b4d" }}
                aria-hidden
              />
            )}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
