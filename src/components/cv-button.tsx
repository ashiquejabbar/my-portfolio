"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Download, ExternalLink, FileText, X } from "lucide-react";
import { CV_FILENAME, CV_PATH, CV_SIZE } from "@/lib/data";
import { format } from "@/lib/i18n/format";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

// How long the "Saved" card stays up (paused while the pointer is on it)
const SAVED_CARD_MS = 5000;
// Opening one card closes any other (the navbar and the hero each have a CV button)
const CARD_EVENT = "cv-saved-card";
const noopSubscribe = () => () => {};

// CV download link, shared by the navbar and the hero. After a click the icon turns into a tick
// and the label says "Downloaded" for a moment (also announced to screen readers), and a small
// "Saved" card slides up at the bottom with the file name, size and an Open button: browsers often
// hide where a download went, and opening the CV is what a recruiter wants next.
// The tooltip gives the file type and size. `compact` shows only the icon below the lg breakpoint;
// `showNote` prints the CV language note after the label.
// `chip`: an outline chip with a document icon, the label, and the download icon in a small filled
// square at the end (`squareClassName` sets that square's size and shape); its tooltip is just the label.
export default function CvButton({
  common,
  className,
  compact = false,
  showNote = false,
  iconSize = 15,
  chip = false,
  squareClassName = "size-6 rounded-md",
}: {
  common: Dictionary["common"];
  className: string;
  compact?: boolean;
  showNote?: boolean;
  iconSize?: number;
  chip?: boolean;
  squareClassName?: string;
}) {
  const [done, setDone] = useState(false);
  const [card, setCard] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const id = useId();
  useEffect(() => () => clearTimeout(timer.current), []);

  // Another CV button opened its card: close this one
  useEffect(() => {
    const onOther = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== id) setCard(false);
    };
    window.addEventListener(CARD_EVENT, onOther);
    return () => window.removeEventListener(CARD_EVENT, onOther);
  }, [id]);

  // Download arrow that turns into a tick after a click
  const icon = (
    <span className="relative grid place-items-center overflow-hidden" style={{ width: iconSize + 1, height: iconSize + 1 }} aria-hidden="true">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={done ? "done" : "idle"}
          initial={{ y: done ? 0 : -14, scale: done ? 0.4 : 1, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: done ? 0 : 14, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="grid place-items-center"
        >
          {done ? (
            <Check size={iconSize + 1} strokeWidth={2.5} />
          ) : (
            <Download size={iconSize} className="transition-transform duration-200 motion-safe:group-hover:translate-y-0.5" />
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  );
  const info = `PDF, ${CV_SIZE}${common.cvLanguageNote ? ` ${common.cvLanguageNote}` : ""}`;
  return (
    <>
      <a
        href={CV_PATH}
        download={CV_FILENAME}
        title={chip ? common.downloadCv : info}
        aria-label={compact ? (chip ? common.downloadCv : `${common.downloadCv} (${info})`) : undefined}
        onClick={() => {
          setDone(true);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setDone(false), 2500);
          window.dispatchEvent(new CustomEvent(CARD_EVENT, { detail: id }));
          setCard(true);
        }}
        className={`group ${className}`}
      >
        {chip ? <FileText size={iconSize} aria-hidden="true" className={`text-muted-foreground ${compact ? "max-lg:hidden" : ""}`} /> : icon}
        {/* Both labels share one grid cell, so the button keeps the width of the longer one */}
        <span className={`grid ${compact ? "max-lg:sr-only" : ""}`}>
          <span className={`col-start-1 row-start-1 ${done ? "invisible" : ""}`} aria-hidden={done}>
            {common.downloadCv}
          </span>
          <span className={`col-start-1 row-start-1 ${done ? "" : "invisible"}`} aria-live="polite">
            {done ? common.cvDownloaded : ""}
          </span>
          {/* Reserves the width of "Downloaded" while it isn't showing */}
          <span className="col-start-1 row-start-1 invisible" aria-hidden="true">
            {common.cvDownloaded}
          </span>
        </span>
        {/* Phones: read out but not shown, so the hero bar keeps Download CV and both icons on one row
            (the tooltip still gives it) */}
        {showNote && common.cvLanguageNote && (
          <span className="max-sm:sr-only font-normal text-muted-foreground">{common.cvLanguageNote}</span>
        )}
        {chip && (
          <span className={`grid shrink-0 place-items-center bg-primary text-primary-foreground ${squareClassName}`}>
            {icon}
          </span>
        )}
      </a>
      <SavedCard open={card} onClose={() => setCard(false)} common={common} />
    </>
  );
}

// Small card at the bottom of the screen after the CV downloads: PDF badge, "<file> saved", size and
// pages, Open (the PDF in a new tab) and close. Leaves by itself; hovering or focusing it holds it.
function SavedCard({ open, onClose, common }: { open: boolean; onClose: () => void; common: Dictionary["common"] }) {
  const [held, setHeld] = useState(false);
  // The portal needs document.body, so nothing renders on the server
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  // The parent passes a new function each render; a ref keeps the timer from restarting
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });

  useEffect(() => {
    if (!open || held) return;
    const t = setTimeout(() => close.current(), SAVED_CARD_MS);
    return () => clearTimeout(t);
  }, [open, held]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close.current();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          onPointerEnter={() => setHeld(true)}
          onPointerLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={() => setHeld(false)}
          className="fixed bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-auto sm:start-1/2 sm:-translate-x-1/2 rtl:sm:translate-x-1/2 z-[65] sm:w-max sm:max-w-[calc(100vw-2rem)] flex items-center gap-3 overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-[var(--shadow-raised)] p-2.5 ps-3"
        >
          <span className="grid h-10 w-8 shrink-0 place-items-center rounded-md bg-[#e5484d] text-[9px] font-bold text-white" aria-hidden="true">
            PDF
          </span>
          <div className="min-w-0 flex-1">
            <p dir="auto" className="truncate text-sm font-semibold">{format(common.cvSaved, { file: CV_FILENAME })}</p>
            <p className="text-xs text-muted-foreground">
              PDF · {CV_SIZE} · {common.cvPages}
            </p>
          </div>
          <a
            href={CV_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-muted px-3 text-sm font-semibold transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <ExternalLink size={14} aria-hidden="true" className="rtl:-scale-x-100" />
            {common.cvOpen}
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label={common.cvClose}
            className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={16} aria-hidden="true" />
          </button>
          {/* Time left before the card goes; stops while the card is held */}
          <motion.span
            key={held ? "held" : "running"}
            className="absolute inset-x-3 bottom-1 h-0.5 origin-left rtl:origin-right rounded-full bg-primary/60"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: held ? 1 : 0 }}
            transition={{ duration: held ? 0 : SAVED_CARD_MS / 1000, ease: "linear" }}
            aria-hidden="true"
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
