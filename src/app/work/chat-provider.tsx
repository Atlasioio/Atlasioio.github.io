"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { getMockResponse, type MockResponse } from "./chat-data";

export type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  references?: { name: string; slug: string }[];
};

type ChatContextValue = {
  messages: Message[];
  isOpen: boolean;
  isDismissed: boolean;
  isThinking: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  dismiss: () => void;
  restore: () => void;
  send: (text: string) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

const STORAGE_KEY = "lukas-portfolio-chat-v1";

type StoredState = {
  messages: Message[];
  isDismissed: boolean;
};

function loadStored(): StoredState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredState;
  } catch {
    return null;
  }
}

function saveStored(state: StoredState) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const thinkingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from sessionStorage
  useEffect(() => {
    const stored = loadStored();
    if (stored) {
      setMessages(stored.messages || []);
      setIsDismissed(stored.isDismissed || false);
    }
    setHydrated(true);
  }, []);

  // Persist to sessionStorage
  useEffect(() => {
    if (!hydrated) return;
    saveStored({ messages, isDismissed });
  }, [messages, isDismissed, hydrated]);

  // Cleanup pending timeout
  useEffect(() => {
    return () => {
      if (thinkingTimeout.current) clearTimeout(thinkingTimeout.current);
    };
  }, []);

  const currentSlug =
    pathname.startsWith("/work/") && pathname !== "/work"
      ? pathname.slice("/work/".length).split("/")[0]
      : null;

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  const dismiss = useCallback(() => {
    setIsOpen(false);
    setIsDismissed(true);
  }, []);
  const restore = useCallback(() => {
    setIsDismissed(false);
    setIsOpen(true);
  }, []);

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isThinking) return;

      setMessages((prev) => [
        ...prev,
        { id: newId(), role: "user", text: trimmed },
      ]);
      setIsThinking(true);

      const delay = 500 + Math.random() * 500;
      thinkingTimeout.current = setTimeout(() => {
        const response: MockResponse = getMockResponse(trimmed, currentSlug);
        setMessages((prev) => [
          ...prev,
          {
            id: newId(),
            role: "assistant",
            text: response.text,
            references: response.references,
          },
        ]);
        setIsThinking(false);
      }, delay);
    },
    [currentSlug, isThinking],
  );

  return (
    <ChatContext.Provider
      value={{
        messages,
        isOpen,
        isDismissed,
        isThinking,
        open,
        close,
        toggle,
        dismiss,
        restore,
        send,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
}
