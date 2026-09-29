"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Download, Mail, Phone, Sparkles, X } from "lucide-react";
import { siWhatsapp } from "simple-icons";

import { CV_PATH, contactInfo, personalInfo } from "@/lib/data";
import { format } from "@/lib/i18n/format";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

type IntroText = Dictionary["intro"];
import { MarkIcon, toolColor, tools, type Tool } from "@/components/stack-grid";
import { BrandIcon, LinkedInIcon, phoneUrl, whatsappUrl } from "@/components/brand-icons";

const EASE = [0.22, 1, 0.36, 1] as const;
// Keeps "Ashique PJ" on one line while each letter animates separately
const NBSP = String.fromCharCode(160);

// Two rings around the photo; they spin in opposite directions (orbit classes in globals.css)
const INNER_RING = tools.slice(0, 7);
const OUTER_RING = tools.slice(7);

// Portals need document.body, which only exists in the browser
const noopSubscribe = () => () => {};
const isClient = () => true;
const isServer = () => false;

function OrbitRing({
  items,
  radiusVar,
  spinClass,
  counterClass,
  startDelay,
}: {
  items: Tool[];
  radiusVar: string;
  spinClass: string;
  counterClass: string;
  startDelay: number;
}) {
  return (
    <div className={`absolute inset-0 ${spinClass}`} aria-hidden="true">
      {items.map((tool, i) => {
        const angle = (i / items.length) * 360;
        const rad = (angle * Math.PI) / 180;
        return (
          <div
            key={tool.label}
            className="absolute left-1/2 top-1/2"
            style={{ transform: `rotate(${angle}deg) translateX(var(${radiusVar})) rotate(${-angle}deg)` }}
          >
            {/* Each logo flies in from off-screen along its own direction, then joins the orbit */}
            <motion.div
              className="-translate-x-1/2 -translate-y-1/2"
              initial={{ x: Math.cos(rad) * 700, y: Math.sin(rad) * 700, opacity: 0, scale: 0.3 }}
              animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: startDelay + i * 0.04, duration: 0.7, ease: EASE }}
            >
              {/* Counter-spin keeps the logo upright while the ring turns */}
              <div
                className={`${counterClass} grid place-items-center size-10 sm:size-12 rounded-xl border border-border bg-card shadow-[var(--shadow-raised)] text-foreground [&_svg]:size-5 sm:[&_svg]:size-6`}
                title={tool.label}
              >
                <MarkIcon mark={tool.mark} color={toolColor(tool)} />
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

function CopyEmail({ t }: { t: IntroText }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contactInfo.email);
    } catch {
      // Clipboard API needs a secure page; fall back to the older copy command
      const field = document.createElement("textarea");
      field.value = contactInfo.email;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="inline-flex max-w-full items-center gap-1 rounded-full border border-border bg-card py-1 ps-4 pe-1 shadow-[var(--shadow-raised)]">
      <Mail size={16} className="shrink-0 text-muted-foreground" aria-hidden="true" />
      <a href={`mailto:${contactInfo.email}`} dir="ltr" className="ms-1 truncate text-sm sm:text-base font-medium hover:text-primary transition-colors">
        {contactInfo.email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? t.copied : t.copyLabel}
        className={`ms-1 inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors ${
          copied ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-primary/15"
        }`}
      >
        {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
        {copied ? t.copied : t.copy}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? t.copied : ""}
      </span>
    </div>
  );
}

// Staggered entrance for the details column
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45, ease: EASE },
});

const contactButton =
  "inline-flex items-center gap-2 h-10 px-3.5 rounded-md border border-border bg-card text-sm font-medium hover:border-foreground/40 transition-colors";

function IntroContent({ t, common }: { t: IntroText; common: Dictionary["common"] }) {
  const letters = Array.from(personalInfo.name);

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-14">
      <p className="sr-only">
        {t.techLabel}: {tools.map((tool) => tool.label).join(", ")}
      </p>

      {/* Laptop: orbit left, details right. Phone: one centred column */}
      <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="flex justify-center">
          {/* Orbit stage: radii shrink on phones so the rings fit a 375px screen */}
          <div className="relative size-[260px] sm:size-[340px] shrink-0 [--r-inner:78px] [--r-outer:118px] sm:[--r-inner:100px] sm:[--r-outer:152px]">
            {/* Faint ring guides */}
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 grid place-items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
            >
              <span className="absolute size-[156px] sm:size-[200px] rounded-full border border-dashed border-border" />
              <span className="absolute size-[236px] sm:size-[304px] rounded-full border border-border/70" />
            </motion.div>

            <OrbitRing items={INNER_RING} radiusVar="--r-inner" spinClass="orbit-ccw" counterClass="orbit-cw" startDelay={0.15} />
            <OrbitRing items={OUTER_RING} radiusVar="--r-outer" spinClass="orbit-cw" counterClass="orbit-ccw" startDelay={0.25} />

            <motion.div
              className="absolute inset-0 grid place-items-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05, type: "spring", stiffness: 260, damping: 18 }}
            >
              <span className="relative">
                <span aria-hidden="true" className="absolute -inset-3 rounded-full bg-primary/25 blur-xl animate-pulse" />
                <Image
                  src={personalInfo.photo}
                  alt=""
                  width={112}
                  height={112}
                  className="relative size-20 sm:size-28 rounded-full object-cover object-top border-2 border-primary/50"
                />
              </span>
            </motion.div>
          </div>
        </div>

        <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
          {/* Same availability styling as the hero */}
          <motion.p
            {...rise(0.45)}
            className="inline-flex items-center gap-2 rounded-full border border-dune-soft/40 bg-dune-soft/15 px-3 py-1 text-sm font-medium text-dune"
          >
            <span className="size-2 rounded-full bg-dune-soft animate-pulse" aria-hidden="true" />
            {t.badge}
          </motion.p>

          {/* Letters rise through a clipping line, like the hero headline.
              dir="ltr": the name is in Latin letters, and on the Arabic page the per-letter spans
              would otherwise be laid out right to left and spell it backwards.
              lang="en" keeps the condensed display font there too (globals.css) */}
          <h2
            dir="ltr"
            lang="en"
            aria-label={personalInfo.name}
            className="mt-3 font-heading type-condensed font-semibold text-foreground text-[3.25rem] sm:text-[4.5rem] leading-[0.95] overflow-hidden pb-[0.08em]"
          >
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.55 + i * 0.03, duration: 0.5, ease: EASE }}
              >
                {letter === " " ? NBSP : letter}
              </motion.span>
            ))}
          </h2>

          <motion.p {...rise(0.85)} className="mt-1 text-lg sm:text-xl text-muted-foreground">
            {t.role}
          </motion.p>

          <ul className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start" aria-label={t.skillsLabel}>
            {t.skills.map((skill, i) => (
              <motion.li
                key={skill}
                className="rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-sm font-medium text-primary"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.08, type: "spring", stiffness: 420, damping: 22 }}
              >
                {skill}
              </motion.li>
            ))}
          </ul>

          <motion.div {...rise(1.2)} className="mt-6 flex w-full flex-col items-center gap-3 lg:items-start">
            <CopyEmail t={t} />
            <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={contactButton}>
                <span className="text-[#25D366]">
                  <BrandIcon icon={siWhatsapp} />
                </span>
                WhatsApp
              </a>
              <a href={phoneUrl} dir="ltr" className={contactButton}>
                <Phone size={16} className="text-muted-foreground" aria-hidden="true" />
                {contactInfo.phone}
              </a>
              <a href={contactInfo.linkedinUrl} target="_blank" rel="noopener noreferrer" className={contactButton}>
                <span className="text-[#0A66C2] dark:text-[#4C9AE8]">
                  <LinkedInIcon />
                </span>
                LinkedIn
              </a>
            </div>
            <a
              href={CV_PATH}
              download="ashique_pj_cv.pdf"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              <Download size={17} aria-hidden="true" />
              {common.downloadCv}
              {common.cvLanguageNote && <span className="font-normal opacity-80">{common.cvLanguageNote}</span>}
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function IntroShowcase({ t, common }: { t: IntroText; common: Dictionary["common"] }) {
  const [open, setOpen] = useState(false);
  // A new key each time it opens remounts the content, so the animation plays from the start
  const [runId, setRunId] = useState(0);
  const mounted = useSyncExternalStore(noopSubscribe, isClient, isServer);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // While open: lock page scroll, focus ✕, keep Tab inside, close on Escape; restore everything on close
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();
    const trigger = triggerRef.current;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("a[href], button") ?? []);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  // Clicking empty space closes it; clicks on the photo, text or buttons don't
  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!(e.target as HTMLElement).closest("a, button, h2, p, li, img, [title]")) setOpen(false);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setRunId((r) => r + 1);
          setOpen(true);
        }}
        aria-label={t.play}
        title={t.play}
        className="grid place-items-center size-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <Sparkles size={18} aria-hidden="true" />
      </button>

      {/* Rendered on <body>: the navbar's backdrop blur would otherwise trap a fixed overlay inside the header */}
      {mounted &&
        createPortal(
          // While fading out, the overlay must stop catching clicks and focus at once, not after the fade
          <div inert={!open} style={{ pointerEvents: open ? undefined : "none" }}>
            <AnimatePresence>
              {open && (
                <motion.div
                  ref={dialogRef}
                  role="dialog"
                  aria-modal="true"
                  aria-label={format(t.dialogLabel, { name: personalInfo.name })}
                  onClick={onBackdropClick}
                  className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden bg-background text-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Soft glow in the brand colour behind the orbit */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none fixed inset-0"
                    style={{
                      background:
                        "radial-gradient(55% 45% at 50% 35%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 70%)",
                    }}
                  />
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label={t.close}
                    className="fixed top-4 end-4 z-10 grid place-items-center size-10 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                  <IntroContent key={runId} t={t} common={common} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </>
  );
}
