"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Languages } from "lucide-react";
import { defaultLocale, localeNames, localePath, locales, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

// Navbar language menu. Plain links (each language is its own prerendered page), so it also works
// without JS; with JS the current #section is kept, so switching language doesn't jump to the top.
export default function LanguageSwitcher({ locale, t }: { locale: Locale; t: Dictionary["language"] }) {
  const label = t.label;
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, target: Locale) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setOpen(false);
    if (target === locale) return;
    window.location.assign(localePath(target) + window.location.hash);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`${label}: ${localeNames[locale]}`}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        className="flex items-center gap-1 h-9 px-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <Languages size={18} aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-wide">{locale}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute end-0 top-full z-50 mt-2 w-60 origin-top-right rtl:origin-top-left rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-[var(--shadow-raised)]"
          >
            <ul>
              {locales.map((l) => (
                <li key={l}>
                  <a
                    href={localePath(l)}
                    hrefLang={l}
                    lang={l}
                    aria-current={l === locale ? "page" : undefined}
                    onClick={(e) => go(e, l)}
                    className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-muted focus-visible:bg-muted ${
                      l === locale ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="w-6 text-xs font-semibold uppercase text-muted-foreground">{l}</span>
                    <span className="flex-1">{localeNames[l]}</span>
                    {/* Every language except the English original is an AI translation */}
                    {l !== defaultLocale && (
                      <span
                        title={t.aiLabel}
                        aria-label={t.aiLabel}
                        className="rounded border border-border px-1 text-[10px] font-semibold leading-4 text-muted-foreground"
                      >
                        AI
                      </span>
                    )}
                    <span className="grid w-4 place-items-center">
                      {l === locale && <Check size={15} className="text-primary" aria-hidden="true" />}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-1 border-t border-border px-2.5 pt-2 pb-1 text-xs leading-snug text-muted-foreground">
              {t.menuNote}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
