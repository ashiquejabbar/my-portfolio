"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

import { THEME_STORAGE_KEY, themeColors, type Theme } from "@/lib/theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColors[theme]);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked (private mode); the theme still applies for this visit
  }
}

// The theme lives on <html data-theme>, set before hydration; watch it rather than copying it into state
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
const getTheme = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";
const getServerTheme = (): Theme | null => null;

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!document.startViewTransition || reduceMotion || document.hidden) {
      applyTheme(next);
      return;
    }

    // Grow the new theme as a circle from the button to the farthest corner
    const x = e.clientX || window.innerWidth - 40;
    const y = e.clientY || 32;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transition = document.startViewTransition(() => {
      applyTheme(next);
    });
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 550, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" }
        );
      })
      // The browser can skip the transition (tab hidden, another one started); the theme is applied either way
      .catch(() => {});
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="relative grid place-items-center size-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors overflow-hidden"
    >
      {/* Render nothing until the stored theme is known, so the icon never flips on load */}
      <AnimatePresence mode="wait" initial={false}>
        {theme && (
          <motion.span
            key={theme}
            initial={{ y: 14, rotate: -60, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: -14, rotate: 60, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="grid place-items-center"
          >
            {isDark ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
