"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  CaretUp,
  Minus,
} from "@phosphor-icons/react";
import { useChat, type Message } from "./chat-provider";
import { projects } from "@/lib/projects";
import { getKicker, getChips, type Kicker } from "./chat-data";

export function ChatDock() {
  const pathname = usePathname();
  const {
    messages,
    isOpen,
    isDismissed,
    isThinking,
    open,
    close,
    dismiss,
    restore,
    send,
  } = useChat();

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const currentSlug =
    pathname.startsWith("/work/") && pathname !== "/work"
      ? pathname.slice("/work/".length).split("/")[0]
      : null;
  const currentProject = currentSlug
    ? projects.find((p) => p.slug === currentSlug) ?? null
    : null;

  const [kicker, setKicker] = useState<Kicker>(() =>
    getKicker(currentProject?.name ?? null, 0),
  );

  // Pick a fresh kicker variant on mount and when context changes
  useEffect(() => {
    const seed = Math.floor(Math.random() * 100);
    setKicker(getKicker(currentProject?.name ?? null, seed));
  }, [currentProject?.name]);

  // Auto-scroll the latest message into view (above the bottom spacer)
  useEffect(() => {
    if (isOpen) {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isOpen, isThinking]);

  // On page change, scroll past history (and the spacer) so the user starts blank
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [pathname]);

  // Focus input when expanded
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [isOpen]);


  const chips = getChips(currentSlug);
  const accentColor = currentProject?.color ?? "var(--accent)";

  const handleChip = (text: string) => {
    if (isThinking) return;
    if (!isOpen) open();
    send(text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;
    const text = input.trim();
    setInput("");
    send(text);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isDismissed ? (
        <motion.button
          key="mini"
          type="button"
          onClick={restore}
          aria-label="Show assistant"
          initial={{ opacity: 0, scale: 0.6, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 16 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.08 }}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 size-12 overflow-hidden border border-hairline bg-bg-elevated shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)] cursor-pointer"
          style={{ borderRadius: "70% 30% 56% 44% / 40% 64% 50% 60%" }}
        >
          <Image
            src="/photo.jpg"
            alt=""
            fill
            sizes="48px"
            className="object-cover"
          />
        </motion.button>
      ) : (
        <motion.div
          key="dock"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className={`fixed left-0 right-0 bottom-0 md:left-1/2 md:-translate-x-1/2 md:bottom-4 md:max-w-[440px] z-40 transition-[height] duration-300 ease-out ${
            isOpen ? "h-[100dvh] md:h-[520px]" : "h-14"
          }`}
        ><div className="h-full bg-bg-elevated border-t border-hairline md:border md:rounded-3xl overflow-hidden flex flex-col shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.18)] md:shadow-[0_18px_36px_-20px_rgba(0,0,0,0.25)]">
        {/* Header */}
        <button
          type="button"
          onClick={isOpen ? close : open}
          className="shrink-0 flex items-center gap-3 px-3.5 md:px-4 py-3 cursor-pointer text-left group/header w-full"
          aria-expanded={isOpen}
        >
          <span
            className="relative size-7 overflow-hidden border border-hairline shrink-0"
            style={{ borderRadius: "70% 30% 56% 44% / 40% 64% 50% 60%" }}
            aria-hidden
          >
            <Image
              src="/photo.jpg"
              alt=""
              fill
              sizes="28px"
              className="object-cover"
            />
          </span>

          <h3 className="display-tight text-[14px] md:text-[15px] truncate">
            {kicker.text}
            <span style={{ color: accentColor }}>
              {kicker.isQuestion ? "?" : "."}
            </span>
          </h3>

          <span className="ml-auto flex items-center gap-1.5">
            {!isOpen && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  dismiss();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    dismiss();
                  }
                }}
                className="hidden md:flex size-7 items-center justify-center rounded-full hover:bg-[var(--chip)] text-fg-subtle hover:text-fg transition-colors"
                aria-label="Minimise assistant"
              >
                <Minus weight="bold" className="size-3.5" />
              </span>
            )}
            <span
              className="flex size-7 items-center justify-center rounded-full bg-[var(--chip)] group-hover/header:bg-[var(--chip-hover)] text-fg-muted group-hover/header:text-fg transition-colors"
              aria-hidden
            >
              <CaretUp
                weight="bold"
                className={`size-3.5 transition-transform duration-300 ease-out ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </span>
          </span>
        </button>

        {isOpen && (
          <ExpandedView
            messages={messages}
            chips={chips}
            isThinking={isThinking}
            currentProjectName={currentProject?.name ?? null}
            input={input}
            setInput={setInput}
            inputRef={inputRef}
            messagesEndRef={messagesEndRef}
            lastMessageRef={lastMessageRef}
            onChipClick={handleChip}
            onSubmit={handleSubmit}
          />
        )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ExpandedView({
  messages,
  chips,
  isThinking,
  currentProjectName,
  input,
  setInput,
  inputRef,
  messagesEndRef,
  lastMessageRef,
  onChipClick,
  onSubmit,
}: {
  messages: Message[];
  chips: string[];
  isThinking: boolean;
  currentProjectName: string | null;
  input: string;
  setInput: (v: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  lastMessageRef: React.RefObject<HTMLDivElement | null>;
  onChipClick: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-5 py-5 flex flex-col gap-5">
        {messages.length === 0 && (
          <div className="text-[14px] text-fg-muted leading-relaxed max-w-[60ch]">
            {currentProjectName
              ? `I can answer questions about ${currentProjectName} — and any other project. Pick a prompt below to start, or ask anything.`
              : `I can give you a tour of the work or answer specific questions. Pick a prompt below to start, or ask anything.`}
          </div>
        )}
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {isThinking && <ThinkingIndicator />}
        <div ref={lastMessageRef} />
        {messages.length > 0 && (
          <div className="grow shrink-0 min-h-[55vh] md:min-h-[280px]" aria-hidden />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested chips */}
      <div className="shrink-0 px-4 md:px-5 pt-3 pb-3">
        <ul className="flex flex-wrap gap-2 mb-3">
          {chips.map((chip) => (
            <li key={chip}>
              <button
                type="button"
                onClick={() => onChipClick(chip)}
                disabled={isThinking}
                className="inline-flex items-center px-3 py-1 rounded-full border border-hairline text-[12px] text-fg-muted hover:text-fg hover:bg-[var(--chip)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {chip}
              </button>
            </li>
          ))}
        </ul>

        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              currentProjectName
                ? `Ask anything about ${currentProjectName}...`
                : "Ask anything about the work..."
            }
            className="flex-1 h-10 bg-[var(--chip)] rounded-full px-4 text-[14px] text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-1 focus:ring-fg-muted/40"
            disabled={isThinking}
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="flex size-10 items-center justify-center rounded-full bg-fg text-[var(--bg)] hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            aria-label="Send"
          >
            <ArrowUp weight="bold" className="size-4" />
          </button>
        </form>

        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle mt-2.5">
          AI assistant. Trained on my work, by me
        </p>
      </div>
    </>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <span className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-hairline bg-[var(--chip)] text-[13px] text-fg max-w-[80%]">
          {message.text}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-2 max-w-[85%]"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle flex items-center gap-1.5">
        <span
          className="relative size-4 overflow-hidden border border-hairline shrink-0"
          style={{ borderRadius: "70% 30% 56% 44% / 40% 64% 50% 60%" }}
          aria-hidden
        >
          <Image src="/photo.jpg" alt="" fill sizes="16px" className="object-cover" />
        </span>
        Assistant
      </p>
      <p className="text-[14px] text-fg leading-relaxed">{message.text}</p>
      {message.references && message.references.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {message.references.map((ref) => (
            <Link
              key={ref.slug}
              href={`/work/${ref.slug}`}
              className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--chip)] hover:bg-[var(--chip-hover)] text-[11px] text-fg-muted hover:text-fg transition-colors"
            >
              {ref.name}
              <ArrowRight
                weight="bold"
                className="size-3 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function ThinkingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-1.5"
    >
      <span className="size-1.5 rounded-full bg-fg-subtle animate-pulse" />
      <span
        className="size-1.5 rounded-full bg-fg-subtle animate-pulse"
        style={{ animationDelay: "0.15s" }}
      />
      <span
        className="size-1.5 rounded-full bg-fg-subtle animate-pulse"
        style={{ animationDelay: "0.3s" }}
      />
    </motion.div>
  );
}
