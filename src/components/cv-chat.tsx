"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sendGAEvent } from "@next/third-parties/google";
import { Bot, Download, Mail, MessageCircle, RotateCcw, SendHorizontal, X } from "lucide-react";
import { siWhatsapp } from "simple-icons";
import { CV_PATH, contactInfo } from "@/lib/data";
import { BrandIcon, whatsappUrl } from "@/components/brand-icons";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import type { Locale } from "@/lib/i18n/config";
import { chatModels, type ChatModelId } from "@/lib/chat-models";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

// The conversation survives page reloads and language switches within this visit
const STORAGE_KEY = "cv-chat";
// Same limits as src/app/api/chat/route.ts
const MAX_TURNS = 12;
const MAX_CHARS = 1000;
// The hint bubble above the button: shown once per visit
const HINT_KEY = "cv-chat-hinted";
const HINT_AFTER_MS = 10_000;
const HINT_VISIBLE_MS = 9_000;

function wasHinted() {
  try {
    return Boolean(sessionStorage.getItem(HINT_KEY));
  } catch {
    return false;
  }
}

function rememberHinted() {
  try {
    sessionStorage.setItem(HINT_KEY, "1");
  } catch {
    // Storage blocked: the hint may show again after a reload
  }
}

function loadMessages(): ChatMessage[] {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: ChatMessage[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Storage blocked: the chat just won't survive a reload
  }
}

// Google Analytics events (GA loads in src/app/[lang]/layout.tsx). Only counts, never the chat text.
function track(name: string, params: Record<string, string | number> = {}) {
  try {
    sendGAEvent("event", name, params);
  } catch {
    // GA blocked or not loaded: nothing to do
  }
}

// The model sometimes adds **bold**; the panel shows plain text
const plain = (text: string) => text.replace(/\*\*(.+?)\*\*/g, "$1");
const BULLET = /^\s*(?:[-*•]|\d+\.)\s+/;

// An answer as paragraphs, with runs of "- " lines shown as a bulleted list
function Answer({ text }: { text: string }) {
  const blocks: (string | string[])[] = [];
  for (const line of plain(text).split("\n")) {
    if (!line.trim()) continue;
    if (BULLET.test(line)) {
      const item = line.replace(BULLET, "");
      const last = blocks.at(-1);
      if (Array.isArray(last)) last.push(item);
      else blocks.push([item]);
    } else {
      blocks.push(line);
    }
  }
  return (
    <div className="space-y-2">
      {blocks.map((block, i) =>
        Array.isArray(block) ? (
          <ul key={i} className="list-disc ps-4 space-y-1">
            {block.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>{block}</p>
        ),
      )}
    </div>
  );
}

// "Ask about my CV" button, bottom corner, below the hire card (src/components/hire-toast.tsx).
// Answers come from Gemini through /api/chat, using only the CV (src/lib/cv-context.ts).
export default function CvChat({ t, locale }: { t: Dictionary["chat"]; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [model, setModel] = useState<ChatModelId>(chatModels[0].id);
  const [hint, setHint] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // "Ask me about Ashique's CV" bubble: once per visit, a few seconds in, gone again after a while
  useEffect(() => {
    if (wasHinted()) return;
    let hide = 0;
    const show = window.setTimeout(() => {
      // Not over the intro overlay (src/components/intro-showcase.tsx)
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      rememberHinted();
      setHint(true);
      hide = window.setTimeout(() => setHint(false), HINT_VISIBLE_MS);
    }, HINT_AFTER_MS);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, busy, open]);

  useEffect(() => {
    if (!open) return;
    // Lets the hire card step aside while the chat is open (globals.css)
    document.documentElement.dataset.chatOpen = "";
    // Touch screens: no autofocus, so the keyboard doesn't cover the suggestions straight away
    if (window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    // Phones: the chat fills the screen, so the page behind stops scrolling and the panel
    // shrinks to the space above the on-screen keyboard
    const phone = window.matchMedia("(max-width: 639px)").matches;
    const viewport = window.visualViewport;
    const { overflow } = document.body.style;
    const fit = () => {
      const panel = panelRef.current;
      if (!panel || !viewport) return;
      panel.style.height = `${viewport.height}px`;
      panel.style.top = `${viewport.offsetTop}px`;
    };
    if (phone) {
      document.body.style.overflow = "hidden";
      fit();
      viewport?.addEventListener("resize", fit);
      viewport?.addEventListener("scroll", fit);
    }

    return () => {
      delete document.documentElement.dataset.chatOpen;
      window.removeEventListener("keydown", onKey);
      if (phone) {
        document.body.style.overflow = overflow;
        viewport?.removeEventListener("resize", fit);
        viewport?.removeEventListener("scroll", fit);
      }
    };
  }, [open]);

  const ask = async (question: string) => {
    const text = question.trim().slice(0, MAX_CHARS);
    if (!text || busy) return;
    const history = [...messages, { role: "user" as const, text }];
    setMessages(history);
    setInput("");
    setError("");
    setBusy(true);
    track("chat_question", { locale, model, turn: history.filter((m) => m.role === "user").length });

    let answer = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Older turns drop off: an odd count keeps the history starting with a question
        body: JSON.stringify({ messages: history.slice(-(MAX_TURNS - 1)), locale, model }),
      });
      if (!res.ok || !res.body) {
        track("chat_error", { status: res.status });
        throw new Error(res.status === 429 ? t.rateLimited : t.error);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      setMessages([...history, { role: "model", text: "" }]);
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "model", text: answer }]);
      }
      if (!answer.trim()) throw new Error(t.error);
      saveMessages([...history, { role: "model", text: answer }]);
    } catch (e) {
      // Drop the unanswered question so a retry doesn't send it twice
      setMessages(messages);
      setInput(text);
      setError(e instanceof Error && e.message ? e.message : t.error);
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  const toggle = (from: "button" | "hint") => {
    setHint(false);
    if (open) {
      setOpen(false);
      return;
    }
    // Saved history is read on first open: sessionStorage only exists in the browser
    if (messages.length === 0) setMessages(loadMessages());
    track("chat_open", { from });
    setOpen(true);
  };

  const clear = () => {
    setMessages([]);
    setError("");
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage blocked: nothing was saved
    }
    track("chat_clear");
    inputRef.current?.focus();
  };

  const waiting = busy && messages.at(-1)?.role === "user";
  const contactLink = "inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.section
            ref={panelRef}
            role="dialog"
            aria-label={t.title}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            // Phones: full screen (height follows the keyboard, see the effect above). Larger screens: a card above the button
            className="fixed inset-x-0 top-0 h-dvh sm:top-auto sm:inset-x-auto sm:bottom-20 sm:end-4 sm:w-[24rem] sm:h-[min(34rem,calc(100dvh-7rem))] z-[70] flex flex-col sm:rounded-xl sm:border border-border bg-popover text-popover-foreground shadow-[var(--shadow-raised)]"
          >
            <header className="flex items-center gap-3 border-b border-border px-4 py-3">
              <span className="grid place-items-center size-8 shrink-0 rounded-lg bg-muted text-foreground" aria-hidden="true">
                <Bot size={17} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-snug">{t.title}</p>
                <p className="text-xs text-muted-foreground leading-snug">{t.subtitle}</p>
              </div>
              {messages.length > 0 && !busy && (
                <button
                  type="button"
                  onClick={clear}
                  aria-label={t.clear}
                  title={t.clear}
                  className="-m-1 grid place-items-center size-8 shrink-0 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <RotateCcw size={15} aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.close}
                className="-m-1 grid place-items-center size-8 shrink-0 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </header>

            <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm" aria-live="polite">
              <p className="rounded-lg bg-muted px-3 py-2 leading-relaxed">{t.greeting}</p>
              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2">
                  {t.suggestions.map((s, i) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        track("chat_suggestion", { index: i });
                        ask(s);
                      }}
                      className="rounded-full border border-border px-3 py-1.5 text-start text-xs hover:bg-muted transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <p
                    key={i}
                    className="w-fit max-w-[85%] ms-auto rounded-lg bg-primary text-primary-foreground px-3 py-2 whitespace-pre-wrap break-words"
                  >
                    {m.text}
                  </p>
                ) : (
                  <div key={i} className="me-8 rounded-lg bg-muted px-3 py-2 leading-relaxed break-words">
                    <Answer text={m.text} />
                  </div>
                ),
              )}
              {/* After the latest answer: a direct way to reach Ashique */}
              {!busy && messages.at(-1)?.role === "model" && (
                <div className="me-8 text-xs">
                  <p className="text-muted-foreground">{t.contactPrompt}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    <a href={`mailto:${contactInfo.email}`} onClick={() => track("chat_contact", { method: "email" })} className={contactLink}>
                      <Mail size={14} aria-hidden="true" />
                      {t.email}
                    </a>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track("chat_contact", { method: "whatsapp" })}
                      className={contactLink}
                    >
                      <BrandIcon icon={siWhatsapp} />
                      {t.whatsapp}
                    </a>
                    <a href={CV_PATH} download="ashique_pj_cv.pdf" onClick={() => track("chat_contact", { method: "cv" })} className={contactLink}>
                      <Download size={14} aria-hidden="true" />
                      {t.downloadCv}
                    </a>
                  </div>
                </div>
              )}
              {waiting && (
                <p className="me-8 w-fit rounded-lg bg-muted px-3 py-2 text-muted-foreground" aria-label={t.thinking}>
                  <span className="animate-pulse">•••</span>
                </p>
              )}
              {error && <p className="text-destructive">{error}</p>}
            </div>

            <form onSubmit={onSubmit} className="border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={MAX_CHARS}
                  placeholder={t.placeholder}
                  aria-label={t.placeholder}
                  className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  aria-label={t.send}
                  className="grid place-items-center size-10 shrink-0 rounded-md bg-primary text-primary-foreground hover:bg-primary/85 disabled:opacity-50 transition-colors"
                >
                  <SendHorizontal size={16} className="rtl:-scale-x-100" aria-hidden="true" />
                </button>
              </div>
              <label className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                {t.model}
                <select
                  value={model}
                  onChange={(e) => {
                    const next = e.target.value as ChatModelId;
                    setModel(next);
                    track("chat_model", { model: next });
                  }}
                  disabled={busy}
                  dir="ltr"
                  className="h-7 rounded-md border border-border bg-background px-1.5 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                >
                  {chatModels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>
              <p className="mt-1.5 text-[11px] text-muted-foreground">{t.disclaimer}</p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hint && !open && (
          <motion.div
            data-chat-hint
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-[4.75rem] end-4 z-[55] flex max-w-[16rem] items-start gap-1 rounded-xl border border-border bg-popover text-popover-foreground text-sm shadow-[var(--shadow-raised)] py-2 ps-3 pe-1"
          >
            <button type="button" onClick={() => toggle("hint")} className="text-start leading-snug">
              {t.hint}
            </button>
            <button
              type="button"
              onClick={() => setHint(false)}
              aria-label={t.close}
              className="grid place-items-center size-6 shrink-0 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        data-chat-button
        onClick={() => toggle("button")}
        aria-expanded={open}
        aria-label={open ? t.close : t.open}
        className="fixed bottom-4 end-4 z-[55] flex items-center gap-2 h-12 rounded-full bg-primary px-4 text-primary-foreground text-sm font-medium shadow-[var(--shadow-raised)] hover:bg-primary/85 transition-colors"
      >
        {open ? <X size={18} aria-hidden="true" /> : <MessageCircle size={18} aria-hidden="true" />}
        <span className="sm:hidden">{t.openShort}</span>
        <span className="hidden sm:inline">{t.open}</span>
      </button>
    </>
  );
}
