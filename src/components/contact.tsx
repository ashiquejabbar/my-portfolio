"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Download } from "lucide-react";
import { CV_PATH, contactInfo } from "@/lib/data";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

export default function Contact({
  t,
  common,
}: {
  t: Dictionary["contact"];
  common: Dictionary["common"];
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(t);
  }, [copied]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactInfo.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${contactInfo.email}`;
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="py-20 md:py-28 bg-panel text-panel-foreground"
    >
      <div className="section-container grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 id="contact-title" className="text-[2rem] sm:text-[2.5rem] font-semibold leading-tight">
            {t.title}
          </h2>
          <p className="mt-4 max-w-[52ch] text-panel-foreground/70">
            {t.lead}
          </p>

          <a
            href={`mailto:${contactInfo.email}`}
            dir="ltr"
            lang="en"
            className="font-heading type-condensed mt-10 inline-block break-all text-[2rem] sm:text-[3rem] lg:text-[3.6rem] leading-none font-semibold underline decoration-2 decoration-panel-foreground/30 underline-offset-[0.15em] hover:decoration-panel-accent transition-colors focus-visible:outline-panel-accent"
          >
            {contactInfo.email}
          </a>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-panel-foreground text-panel font-medium hover:opacity-90 transition-opacity focus-visible:outline-panel-accent"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? "done" : "copy"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex items-center gap-2"
                >
                  {copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
                  {copied ? t.emailCopied : t.copyEmail}
                </motion.span>
              </AnimatePresence>
            </button>
            <a
              href={CV_PATH}
              download="ashique_pj_cv.pdf"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-md border border-panel-foreground/30 font-medium hover:border-panel-foreground/70 transition-colors focus-visible:outline-panel-accent"
            >
              <Download size={17} aria-hidden="true" />
              {common.downloadCv}
              {common.cvLanguageNote && <span className="font-normal opacity-70">{common.cvLanguageNote}</span>}
            </a>
          </div>
          <p className="sr-only" aria-live="polite">
            {copied ? t.copiedAnnouncement : ""}
          </p>
        </div>

        <dl className="lg:col-span-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 content-start text-sm lg:pt-3">
          <dt className="text-panel-foreground/60">{t.phone}</dt>
          <dd>
            <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`} dir="ltr" className="hover:underline underline-offset-4 focus-visible:outline-panel-accent">
              {contactInfo.phone}
            </a>
          </dd>
          <dt className="text-panel-foreground/60">{t.whatsapp}</dt>
          <dd>
            <a
              href={`https://wa.me/${contactInfo.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline underline-offset-4 focus-visible:outline-panel-accent"
            >
              {t.messageMe}
            </a>
          </dd>
          <dt className="text-panel-foreground/60">{t.linkedin}</dt>
          <dd>
            <a
              href={contactInfo.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline underline-offset-4 focus-visible:outline-panel-accent"
            >
              in/{contactInfo.linkedin}
            </a>
          </dd>
          <dt className="text-panel-foreground/60">{t.basedIn}</dt>
          <dd>{t.location}</dd>
          <dt className="text-panel-foreground/60">{t.status}</dt>
          <dd className="text-dune-soft">{t.visaStatus}</dd>
          <dt className="text-panel-foreground/60">{t.languages}</dt>
          <dd>{t.languageList}</dd>
          <dt className="text-panel-foreground/60">{t.nationality}</dt>
          <dd>{t.nationalityValue}</dd>
        </dl>
      </div>
    </section>
  );
}
