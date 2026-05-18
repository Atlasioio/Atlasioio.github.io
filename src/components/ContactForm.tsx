"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, PaperPlaneRight } from "@phosphor-icons/react/dist/ssr";

const PLACEHOLDERS = [
  "Hi Lukas — we're hiring a UX designer, and your work caught our eye. Let's chat!",
  "I'm working on something circular-economy-ish — chat?",
  "Quick brief: B2B dashboard, 6 weeks, Malmö-based. Could you take a look?",
  "You should check out the prototype I'm building — would love a designer's eye on it.",
  "Just wanted to introduce myself — fellow designer in Stockholm :).",
  "Have a freelance gig that needs a sharp generalist with code and AI instinct.",
  "Building an AI-native tool. Looking for a design partner who gets craft. Coffee?",
];

const QUICK_SUBJECTS = ["Job opportunity", "Freelance", "Quick chat", "Other"];

const TYPE_SPEED_MS = 28;
const BACKSPACE_SPEED_MS = 14;
const PAUSE_AT_FULL_MS = 1800;
const PAUSE_AT_EMPTY_MS = 220;

type Phase = "typing" | "pausing" | "backspacing";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [textareaFocused, setTextareaFocused] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");
  const [toast, setToast] = useState<{ msg: string; tone: "success" | "error" | "neutral" } | null>(null);

  const showToast = (msg: string, tone: "success" | "error" | "neutral" = "neutral") => {
    setToast({ msg, tone });
    setTimeout(() => setToast(null), 2400);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("ahlselukas@gmail.com");
      showToast("Copied email address", "success");
    } catch {
      showToast("Couldn't copy email", "error");
    }
  };

  const showPlaceholder = message.length === 0 && !textareaFocused;

  useEffect(() => {
    if (!showPlaceholder) {
      setDisplayedText("");
      setPhase("typing");
      return;
    }

    const target = PLACEHOLDERS[placeholderIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (displayedText.length < target.length) {
        timeout = setTimeout(() => {
          setDisplayedText(target.slice(0, displayedText.length + 1));
        }, TYPE_SPEED_MS);
      } else {
        timeout = setTimeout(() => setPhase("pausing"), PAUSE_AT_FULL_MS);
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("backspacing"), 60);
    } else if (phase === "backspacing") {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, BACKSPACE_SPEED_MS);
      } else {
        timeout = setTimeout(() => {
          setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length);
          setPhase("typing");
        }, PAUSE_AT_EMPTY_MS);
      }
    }

    return () => clearTimeout(timeout!);
  }, [phase, displayedText, placeholderIndex, showPlaceholder]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      // TODO: wire to real email service (Resend / Formspree / Next API route)
      showToast("Message sent successfully", "success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      showToast("Message failed to send", "error");
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Name"
          value={name}
          onChange={setName}
          placeholder="Your name"
          required
        />
        <Field
          type="email"
          label="Email"
          value={email}
          onChange={setEmail}
          placeholder="you@company.com"
          required
        />
      </div>

      <div>
        <Field
          label="Subject"
          value={subject}
          onChange={setSubject}
          placeholder="What can I help with?"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {QUICK_SUBJECTS.map((tag) => {
            const active = subject === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSubject(active ? "" : tag)}
                className={`group cursor-pointer inline-flex items-center px-3 py-1.5 rounded-full border text-[12px] transition-colors duration-300 ease-out ${
                  active
                    ? "bg-[var(--fg)] text-[var(--bg)] border-[var(--fg)]"
                    : "border-hairline text-fg-muted hover:border-fg hover:text-fg"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle mb-2 block">
          Message
        </span>
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setTextareaFocused(true)}
            onBlur={() => setTextareaFocused(false)}
            rows={5}
            required
            className="relative w-full rounded-2xl bg-bg-elevated border border-hairline px-4 py-3.5 text-[15px] text-fg outline-none focus:border-fg transition-colors duration-300 ease-out resize-none"
          />
          {showPlaceholder && (
            <div
              className="pointer-events-none absolute inset-0 z-10 px-4 py-3.5 text-[15px] text-fg-subtle leading-relaxed"
              aria-hidden
            >
              {displayedText}
              <span className="caret">|</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={handleCopyEmail}
          className="group inline-flex items-center gap-1.5 text-[12px] text-fg-subtle hover:text-fg transition-colors duration-200"
        >
          <span>Goes straight to ahlselukas@gmail.com.</span>
          <Copy weight="regular" className="size-3 opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
        </button>
        <button
          type="submit"
          className="group inline-flex items-center gap-2.5 pl-4 pr-3 py-2.5 rounded-full bg-[var(--fg)] text-[var(--bg)] hover:bg-accent hover:text-[var(--bg)] transition-colors duration-300 ease-out text-[14px]"
        >
          <PaperPlaneRight weight="fill" className="row-icon size-3.5 translate-y-[1px]" />
          Send message
          <ArrowUpRight className="size-3.5 translate-y-[1px] group-hover:-translate-y-px group-hover:translate-x-px transition-transform" />
        </button>
      </div>
    </form>
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
          ) : toast.tone === "error" ? (
            <span className="size-1.5 rounded-full" style={{ background: "#e36b4d" }} aria-hidden />
          ) : (
            <span className="size-1.5 rounded-full bg-[var(--bg)]" aria-hidden />
          )}
          {toast.msg}
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle mb-2 block">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-full bg-bg-elevated border border-hairline px-5 py-3 text-[15px] text-fg placeholder:text-fg-subtle outline-none focus:border-fg transition-colors duration-300 ease-out"
      />
    </label>
  );
}
