"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, Mail, X } from "lucide-react";
import { siWhatsapp } from "simple-icons";
import { contactInfo } from "@/lib/data";
import { BrandIcon, whatsappUrl } from "@/components/brand-icons";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

// Seconds the visitor has actually had the page on screen (hidden tabs don't count)
const SHOW_AFTER_SECONDS = 210;
// Closing the card hides it for this visit only (sessionStorage): a recruiter who comes back
// another day sees it once more
const DISMISSED_KEY = "hire-toast-dismissed";
// Add ?hire-preview to the URL to see the card after 2 seconds (ignores an earlier dismissal)
const PREVIEW_PARAM = "hire-preview";

// The email opens pre-filled in English: that's the language Ashique reads
const interviewMail =
  `mailto:${contactInfo.email}` +
  `?subject=${encodeURIComponent("Interview request – Frontend Developer")}` +
  `&body=${encodeURIComponent("Hi Ashique,\n\nWe would like to schedule an interview with you for a frontend role.\n\nSuggested times:\n\n")}`;

// Exit intent: seconds on the page before moving the mouse to the tab bar shows the card
const EXIT_INTENT_AFTER_SECONDS = 20;

function rememberDismissed() {
  try {
    sessionStorage.setItem(DISMISSED_KEY, "1");
  } catch {
    // Storage blocked: it just won't be remembered
  }
}

function wasDismissed() {
  try {
    return Boolean(sessionStorage.getItem(DISMISSED_KEY));
  } catch {
    // Storage blocked: treat as not closed, so the card can still show once
    return false;
  }
}

// "Available for interview" card, bottom corner. It opens after a few minutes on the site, or earlier
// on exit intent: the mouse leaving through the top of the page, towards the tabs or the close button.
//   Browsers don't let a page delay closing or show its own UI on close; this catches the moment before.
// An in-page card rather than a browser notification: no permission prompt, works on every device.
export default function HireToast({ t }: { t: Dictionary["hire"] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).has(PREVIEW_PARAM);
    if (!preview && wasDismissed()) return;

    const target = preview ? 2 : SHOW_AFTER_SECONDS;
    let seen = 0;
    const tick = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      // Wait while the intro overlay is open, so the card never sits on top of it
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      seen += 1;
      if (seen >= target) {
        window.clearInterval(tick);
        setOpen(true);
      }
    }, 1000);
    const showNow = () => {
      // Closed earlier in this visit: stay closed
      if (!preview && wasDismissed()) return;
      window.clearInterval(tick);
      setOpen(true);
    };

    // Exit intent (mouse only): leaving the page through its top edge
    const onMouseOut = (e: MouseEvent) => {
      if (e.relatedTarget || e.clientY > 0) return;
      if (!preview && seen < EXIT_INTENT_AFTER_SECONDS) return;
      showNow();
    };

    document.addEventListener("mouseout", onMouseOut);
    return () => {
      window.clearInterval(tick);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  const dismiss = () => {
    setOpen(false);
    rememberDismissed();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      rememberDismissed();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          role="status"
          aria-label={t.label}
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:end-4 z-[60] sm:w-[23rem] rounded-xl border border-border bg-popover text-popover-foreground shadow-[var(--shadow-raised)] p-4"
        >
          <div className="flex items-start gap-3">
            <span className="relative grid place-items-center size-9 shrink-0 rounded-lg bg-dune-soft/20 text-dune" aria-hidden="true">
              <CalendarCheck size={18} />
              <span className="absolute -top-0.5 -end-0.5 size-2.5 rounded-full bg-dune-soft ring-2 ring-popover animate-pulse" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold leading-snug">{t.title}</p>
              <p className="mt-1 text-sm text-muted-foreground leading-snug">{t.body}</p>
            </div>
            <button
              type="button"
              onClick={dismiss}
              aria-label={t.close}
              className="-m-1 grid place-items-center size-8 shrink-0 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          <a
            href={interviewMail}
            className="mt-4 flex items-center justify-center gap-2 h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/85 transition-colors"
          >
            <CalendarCheck size={16} aria-hidden="true" />
            {t.cta}
          </a>
          {/* Wraps on narrow phones so the full email address stays visible */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-sm">
            <a
              href={`mailto:${contactInfo.email}`}
              dir="ltr"
              className="inline-flex max-w-full items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail size={15} className="shrink-0" aria-hidden="true" />
              <span className="truncate underline underline-offset-4 decoration-border">{contactInfo.email}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 text-muted-foreground hover:text-[#25D366] transition-colors"
            >
              <BrandIcon icon={siWhatsapp} />
              {t.whatsapp}
            </a>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
