"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { contactInfo } from "@/lib/data";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

// Copies the email address; `copied` stays true for 2 seconds so the button can show a tick.
// If the clipboard is blocked, the mail app opens instead.
function useCopyEmail() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contactInfo.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${contactInfo.email}`;
    }
  };

  return { copied, copy };
}

// Hero quick-fact chip: the email address (opens the mail app) with a copy button beside it
export default function EmailChip({ t }: { t: Dictionary["contact"] }) {
  const { copied, copy } = useCopyEmail();

  return (
    <li className="inline-flex items-center rounded-full border border-border bg-card/60 text-xs font-medium text-foreground/85">
      <a
        href={`mailto:${contactInfo.email}`}
        dir="ltr"
        lang="en"
        className="inline-flex items-center gap-1.5 ps-2.5 pe-1.5 py-1 hover:text-foreground transition-colors"
      >
        <Mail size={13} aria-hidden="true" className="text-primary" />
        {contactInfo.email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? t.emailCopied : t.copyEmail}
        title={copied ? t.emailCopied : t.copyEmail}
        className="me-0.5 grid size-6 place-items-center rounded-full text-muted-foreground hover:bg-foreground/10 hover:text-foreground transition-colors"
      >
        {copied ? <Check size={13} className="text-dune" aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? t.copiedAnnouncement : ""}
      </span>
    </li>
  );
}

// Main hero contact button: the email address itself (opens the mail app) and a copy button,
// together in one filled pill. Shape and hover motion come from the hero's .hero-cta classes.
export function EmailCta({ t, className }: { t: Dictionary["contact"]; className: string }) {
  const { copied, copy } = useCopyEmail();

  return (
    <span className={`${className} gap-1 ps-4 pe-1`}>
      <a href={`mailto:${contactInfo.email}`} dir="ltr" lang="en" className="group inline-flex items-center gap-2 h-full">
        <Mail size={17} aria-hidden="true" className="hero-cta-mail shrink-0" />
        <span className="underline-offset-4 group-hover:underline">{contactInfo.email}</span>
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? t.emailCopied : t.copyEmail}
        title={copied ? t.emailCopied : t.copyEmail}
        className="relative z-[1] grid size-8 shrink-0 place-items-center rounded-full bg-primary-foreground/15 transition-colors hover:bg-primary-foreground/25"
      >
        {copied ? <Check size={16} strokeWidth={2.5} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? t.copiedAnnouncement : ""}
      </span>
    </span>
  );
}
