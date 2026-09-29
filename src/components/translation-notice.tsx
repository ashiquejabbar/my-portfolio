"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Languages, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

const SHOW_AFTER_MS = 1200;
const HIDE_AFTER_MS = 12000;

// On translated pages: a small note that the text was translated with AI and English is the original.
// Shown once per language per browser session; closes by itself, with ✕, or with Escape.
export default function TranslationNotice({ locale, t }: { locale: Locale; t: Dictionary["language"] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const key = `ai-notice-${locale}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // Storage blocked (private mode): show it anyway, it closes by itself
    }
    const showTimer = window.setTimeout(() => setOpen(true), SHOW_AFTER_MS);
    const hideTimer = window.setTimeout(() => setOpen(false), SHOW_AFTER_MS + HIDE_AFTER_MS);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [locale]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          role="status"
          aria-label={t.noticeTitle}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:start-4 z-[60] sm:w-[22rem] rounded-xl border border-border bg-popover text-popover-foreground shadow-[var(--shadow-raised)] p-4"
        >
          <div className="flex items-start gap-3">
            <span className="grid place-items-center size-8 shrink-0 rounded-lg bg-primary/12 text-primary" aria-hidden="true">
              <Languages size={17} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{t.noticeTitle}</p>
              <p className="mt-1 text-sm text-muted-foreground leading-snug">{t.noticeBody}</p>
              <Link
                href="/"
                hrefLang="en"
                className="mt-2 inline-block text-sm font-medium text-primary hover:underline underline-offset-4"
              >
                {t.readInEnglish}
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.close}
              className="-m-1 grid place-items-center size-8 shrink-0 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
