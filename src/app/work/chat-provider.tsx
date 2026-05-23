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

export type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  references?: { name: string; slug: string }[];
};

async function streamChatResponse(
  payload: { messages: { role: "user" | "assistant"; content: string }[]; currentSlug: string | null },
  onChunk: (accumulated: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) message = data.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  if (!res.body) {
    throw new Error("No response body from the server.");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    accumulated += decoder.decode(value, { stream: true });
    onChunk(accumulated);
  }

  accumulated += decoder.decode();
  if (accumulated.length > 0) onChunk(accumulated);

  return accumulated;
}

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

const STORAGE_KEY = "lukas-portfolio-chat-v2";

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
  // Mirror of `messages` so `send` can read the latest value synchronously
  // without depending on the setState updater (which doesn't always fire
  // before the next line — especially under React Strict Mode in dev).
  const messagesRef = useRef<Message[]>([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

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
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isThinking) return;

      const assistantId = newId();
      const userMessage: Message = {
        id: newId(),
        role: "user",
        text: trimmed,
      };
      const assistantPlaceholder: Message = {
        id: assistantId,
        role: "assistant",
        text: "",
      };

      const prev = messagesRef.current;
      const payloadMessages = [...prev, userMessage]
        .filter((m) => m.text.length > 0)
        .map((m) => ({ role: m.role, content: m.text }));
      setMessages([...prev, userMessage, assistantPlaceholder]);

      setIsThinking(true);

      try {
        await streamChatResponse(
          {
            messages: payloadMessages,
            currentSlug,
          },
          (accumulated) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, text: accumulated } : m,
              ),
            );
          },
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Sorry — something went wrong on my end. Try again in a moment.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, text: message }
              : m,
          ),
        );
      } finally {
        setIsThinking(false);
      }
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
