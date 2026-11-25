"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Mail, Menu, X } from "lucide-react";
import Image from "next/image";
import { contactInfo, navLinks, personalInfo } from "@/lib/data";
import CvButton from "@/components/cv-button";
import ThemeToggle from "@/components/theme-toggle";
import LanguageSwitcher from "@/components/language-switcher";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

const NAME = "Ashique PJ";
// Height of the floating navbar plus its top gap; the hero photo counts as "gone" once it passes this line
const NAV_SPACE = 76;

// Live time in Dubai for the status chip. Checked every 15 s; empty on the server, so the
// prerendered page never shows a wrong time
const subscribeClock = (tick: () => void) => {
  const id = window.setInterval(tick, 15_000);
  return () => window.clearInterval(id);
};
function useDubaiTime(locale: Locale) {
  return useSyncExternalStore(
    subscribeClock,
    () => new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "Asia/Dubai" }).format(new Date()),
    () => "",
  );
}
const sectionIds =navLinks.map((link) => link.href.slice(1));
// A section counts as current once its top passes this share of the screen height
const ACTIVE_LINE = 0.4;
// Fallback for browsers without the scrollend event: unlock after this much quiet
const UNLOCK_AFTER_MS = 500;

// Floating glass navigation bar: logo with an "available" dot on the left; section links,
// quick controls and a CV button on the right; a thin line that fills as the page is read.
// Scroll work runs at most once per frame and only sets state when something changes.
export default function Navbar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.nav;
  const dubaiTime = useDubaiTime(locale);
  // True once the hero photo has scrolled up behind the navbar: a small photo then slides in beside the name
  const [photoDocked, setPhotoDocked] = useState(false);
  useEffect(() => {
    const photo = document.getElementById("hero-photo");
    if (!photo) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPhotoDocked(!entry.isIntersecting && entry.boundingClientRect.top < NAV_SPACE),
      { rootMargin: `-${NAV_SPACE}px 0px 0px 0px` },
    );
    observer.observe(photo);
    return () => observer.disconnect();
  }, []);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  // While a click scrolls the page, the clicked link stays active (no flicker through the
  // sections in between) until the scroll ends
  const lockedTo = useRef<string | null>(null);
  const unlockTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const sections = sectionIds.map((id) => document.getElementById(id));
    let frame = 0;

    const update = () => {
      frame = 0;
      setIsScrolled(window.scrollY > 24);
      if (lockedTo.current) return;
      const line = window.innerHeight * ACTIVE_LINE;
      let current: string | null = null;
      sections.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= line) current = sectionIds[i];
      });
      // The last section can't scroll to the top, so treat the page bottom as reaching it
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = sectionIds[sectionIds.length - 1];
      }
      setActiveSection(current);
    };
    const unlock = () => {
      if (!lockedTo.current) return;
      lockedTo.current = null;
      update();
    };
    const onScroll = () => {
      if (lockedTo.current) {
        clearTimeout(unlockTimer.current);
        unlockTimer.current = setTimeout(unlock, UNLOCK_AFTER_MS);
      }
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", unlock);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(unlockTimer.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", unlock);
    };
  }, []);

  const goTo = (id: string) => {
    lockedTo.current = id;
    setActiveSection(id);
    clearTimeout(unlockTimer.current);
    // If the page doesn't move (already there), release the lock anyway
    unlockTimer.current = setTimeout(() => (lockedTo.current = null), 1200);
  };

  // Keys 1–4 jump to the sections (ignored while typing, in a dialog, or with modifier keys);
  // Escape closes the mobile menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setIsMobileOpen(false);
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      const el = e.target as HTMLElement;
      if (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      const id = sectionIds[Number(e.key) - 1];
      if (!id) return;
      goTo(id);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", "#" + id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The open mobile menu closes on a tap outside the bar, or when the window grows to the
  // desktop layout (where the menu is hidden but would still be open)
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!isMobileOpen) return;
    const desktop = window.matchMedia("(min-width: 768px)");
    const close = () => setIsMobileOpen(false);
    const onPointerDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", close);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", close);
    };
  }, [isMobileOpen]);

  const solid = isScrolled || isMobileOpen;

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <nav
        aria-label={t.main}
        className={`nav-glass backdrop-blur-md backdrop-saturate-150 relative mx-auto flex h-14 max-w-[72rem] items-center gap-2 rounded-2xl ps-3 pe-2 sm:ps-4 transition-[background-color,box-shadow] duration-300 ${
          solid ? "nav-glass-solid" : ""
        }`}
      >
        <a
          href="#home"
          className="nav-name group me-auto lg:me-0 flex shrink-0 items-center gap-2 sm:gap-2.5 whitespace-nowrap font-heading text-base sm:text-lg font-semibold"
        >
          {/* Letters rise in one by one on load and ripple on hover (globals.css .nav-name).
              Split for the animation only: screen readers get the plain name. */}
          {/* Small photo: slides in from the left once the hero photo has scrolled away; the name moves over */}
          <span
            aria-hidden="true"
            className={`grid shrink-0 overflow-hidden transition-[width,opacity,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              photoDocked ? "w-7 opacity-100" : "w-0 opacity-0 -me-2 sm:-me-2.5"
            }`}
          >
            <Image
              src={personalInfo.photo}
              alt=""
              width={28}
              height={28}
              className={`size-7 max-w-none rounded-full border border-border object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                photoDocked ? "translate-x-0" : "-translate-x-4 rtl:translate-x-4"
              }`}
            />
          </span>
          <span className="sr-only">{NAME}</span>
          {/* dir="ltr": the name is Latin, and a right-to-left page (Arabic) would lay the letters out backwards */}
          <span aria-hidden="true" dir="ltr" className="flex">
            {[...NAME].map((ch, i) => (
              <span key={i} className="nav-name-char" style={{ "--i": i } as React.CSSProperties}>
                {ch === " " ? " " : ch}
              </span>
            ))}
          </span>
          <span className="relative flex size-2 lg:hidden" title={dict.hero.available}>
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60 motion-reduce:hidden" />
            <span className="relative size-2 rounded-full bg-emerald-500" />
            <span className="sr-only">{dict.hero.available}</span>
          </span>
        </a>
        {/* Recruiters' first questions at a glance: open to work, in the UAE, and the time there now */}
        <span className="hidden lg:inline-flex -ms-0.5 me-auto items-center gap-1.5 rounded-full border border-foreground/12 px-2.5 py-1 text-xs text-muted-foreground whitespace-nowrap">
          <span className="relative flex size-1.5" aria-hidden="true">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60 motion-reduce:hidden" />
            <span className="relative size-1.5 rounded-full bg-emerald-500" />
          </span>
          {t.openToWork}
          {dubaiTime && (
            <time dir="ltr" className="font-mono tabular-nums text-foreground/80" aria-label={`${t.dubaiTime}: ${dubaiTime}`}>
              {dubaiTime}
            </time>
          )}
        </span>

        <ul className="hidden md:flex items-center gap-0.5" onPointerLeave={() => setHovered(null)}>
          {navLinks.map((link, i) => {
            const id = link.href.slice(1);
            const isActive = activeSection === id;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => goTo(id)}
                  onPointerEnter={() => setHovered(id)}
                  onFocus={() => setHovered(id)}
                  onBlur={() => setHovered(null)}
                  aria-current={isActive ? "true" : undefined}
                  aria-keyshortcuts={String(i + 1)}
                  className={`group relative block rounded-lg px-3.5 py-1.5 text-sm transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {/* Hover highlight glides between links; the active pill stays put */}
                  {hovered === id && !isActive && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-lg bg-foreground/[0.04]"
                      transition={{ type: "spring", stiffness: 500, damping: 38 }}
                    />
                  )}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-foreground/[0.07] ring-1 ring-inset ring-foreground/10"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{t[link.key]}</span>
                  {/* Keyboard hint on the corner: press the number to jump here */}
                  <kbd
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-1.5 -end-1.5 hidden lg:grid size-4 place-items-center rounded border border-foreground/15 bg-background font-mono text-[10px] leading-none text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    {i + 1}
                  </kbd>
                </a>
              </li>
            );
          })}
        </ul>

        <span className="hidden md:block mx-1 h-5 w-px bg-foreground/15" aria-hidden="true" />

        <div className="flex items-center gap-1">
          <LanguageSwitcher locale={locale} t={dict.language} />
          <ThemeToggle t={dict.theme} />
          {/* Icon only on tablets (the phone menu has its own), full label from lg */}
          {/* File-chip style: outline, document icon, label and a small filled download square */}
          <CvButton
            common={dict.common}
            compact
            chip
            className="ms-1 hidden md:inline-flex h-9 items-center gap-2 rounded-lg border border-foreground/15 ps-1.5 lg:ps-3 pe-1.5 text-sm font-medium text-foreground transition-[border-color,translate] hover:border-primary/60 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          />
          <button
            type="button"
            className="md:hidden grid size-9 place-items-center rounded-lg hover:bg-muted"
            onClick={() => setIsMobileOpen((v) => !v)}
            aria-label={isMobileOpen ? t.closeMenu : t.openMenu}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
          >
            {isMobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {/* Reading progress along the bottom edge */}
        <motion.span
          aria-hidden="true"
          className="absolute inset-x-4 -bottom-px h-[2px] origin-left rounded-full bg-primary rtl:origin-right"
          style={{ scaleX: progress }}
        />
      </nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="nav-glass nav-glass-solid backdrop-blur-md md:hidden mx-auto mt-2 max-w-[72rem] origin-top rounded-2xl p-2"
          >
            <ul>
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 + i * 0.05 }}
                >
                  <a
                    href={link.href}
                    onClick={() => {
                      goTo(link.href.slice(1));
                      setIsMobileOpen(false);
                    }}
                    className={`flex items-baseline gap-3 rounded-xl px-3 py-3 font-heading text-xl transition-colors hover:bg-muted ${
                      activeSection === link.href.slice(1) ? "bg-foreground/[0.06]" : ""
                    }`}
                  >
                    <span className="font-mono text-xs tabular-nums text-primary">{String(i + 1).padStart(2, "0")}</span>
                    {t[link.key]}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border p-2 pt-3">
              <CvButton
                common={dict.common}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground"
              />
              <a
                href={`mailto:${contactInfo.email}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-foreground/20 text-sm font-medium"
              >
                <Mail size={16} aria-hidden="true" />
                {dict.common.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
