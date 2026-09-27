"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Download } from "lucide-react";
import { contactInfo, additionalInfo } from "@/lib/data";

export default function Contact() {
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
            Hiring a frontend developer in Dubai?
          </h2>
          <p className="mt-4 max-w-[52ch] text-panel-foreground/70">
            I can start immediately. Email is the quickest way to reach me.
          </p>

          <a
            href={`mailto:${contactInfo.email}`}
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
                  {copied ? "Email copied" : "Copy email"}
                </motion.span>
              </AnimatePresence>
            </button>
            <a
              href="/Ashique_PJ_Dubai_CV.pdf"
              download
              className="inline-flex items-center gap-2 h-11 px-5 rounded-md border border-panel-foreground/30 font-medium hover:border-panel-foreground/70 transition-colors focus-visible:outline-panel-accent"
            >
              <Download size={17} aria-hidden="true" />
              Download CV
            </a>
          </div>
          <p className="sr-only" aria-live="polite">
            {copied ? "Email address copied to clipboard" : ""}
          </p>
        </div>

        <dl className="lg:col-span-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 content-start text-sm lg:pt-3">
          <dt className="text-panel-foreground/60">Phone</dt>
          <dd>
            <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`} className="hover:underline underline-offset-4 focus-visible:outline-panel-accent">
              {contactInfo.phone}
            </a>
          </dd>
          <dt className="text-panel-foreground/60">WhatsApp</dt>
          <dd>
            <a
              href={`https://wa.me/${contactInfo.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline underline-offset-4 focus-visible:outline-panel-accent"
            >
              Message me
            </a>
          </dd>
          <dt className="text-panel-foreground/60">LinkedIn</dt>
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
          <dt className="text-panel-foreground/60">Based in</dt>
          <dd>{contactInfo.location}</dd>
          <dt className="text-panel-foreground/60">Status</dt>
          <dd className="text-dune-soft">{additionalInfo.visaStatus}</dd>
          <dt className="text-panel-foreground/60">Languages</dt>
          <dd>{additionalInfo.languages.join(", ")}</dd>
          <dt className="text-panel-foreground/60">Nationality</dt>
          <dd>{additionalInfo.nationality}</dd>
        </dl>
      </div>
    </section>
  );
}
