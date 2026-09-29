"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/data";
import ThemeToggle from "@/components/theme-toggle";
import IntroShowcase from "@/components/intro-showcase";
import LanguageSwitcher from "@/components/language-switcher";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

const sectionIds = navLinks.map((link) => link.href.slice(1));

export default function Navbar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.nav;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24);
      let current: string | null = null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      // The last section can't scroll to the top, so treat the page bottom as reaching it
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = sectionIds[sectionIds.length - 1];
      }
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isMobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-200 border-b ${
        isScrolled || isMobileOpen
          ? "bg-background/95 backdrop-blur-sm border-border"
          : "bg-transparent border-transparent"
      }`}
    >
      <nav aria-label={t.main} className="section-container flex items-center justify-between h-16">
        <a href="#home" className="font-heading font-semibold text-lg">
          Ashique PJ
        </a>

        <ul className="hidden md:flex items-center gap-1 ms-auto">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative block px-3 py-2 text-sm transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t[link.key]}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute left-3 right-3 -bottom-px h-0.5 bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1 md:ms-2">
        <IntroShowcase t={dict.intro} common={dict.common} />
        <LanguageSwitcher locale={locale} t={dict.language} />
        <ThemeToggle t={dict.theme} />
        <button
          type="button"
          className="md:hidden -me-2 p-2 rounded-md hover:bg-muted"
          onClick={() => setIsMobileOpen((v) => !v)}
          aria-label={isMobileOpen ? t.closeMenu : t.openMenu}
          aria-expanded={isMobileOpen}
          aria-controls="mobile-menu"
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.ul
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden overflow-hidden section-container"
          >
            {navLinks.map((link) => (
              <li key={link.href} className="border-t border-border first:border-t-0">
                <a
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="block py-3.5 font-heading text-xl"
                >
                  {t[link.key]}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
