"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Building2,
  Check,
  FileLock2,
  Lock,
  MapPin,
  Glasses,
  KeyRound,
  MonitorSmartphone,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { projects } from "@/lib/data";
import SectionHeading from "@/components/section-heading";
import { format } from "@/lib/i18n/format";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

// Icon and glow colour of each project row. Same order as `projects` (src/lib/data.ts).
const visuals: { Icon: LucideIcon; accent: string }[] = [
  { Icon: FileLock2, accent: "#7b93ff" },
  { Icon: KeyRound, accent: "#c4a7ff" },
  { Icon: Building2, accent: "#d9ae72" },
  { Icon: MonitorSmartphone, accent: "#4fd18b" },
  { Icon: Glasses, accent: "#ff9e7a" },
];

// Rows are wide, so they tip more front-to-back than side-to-side
const TILT_X = 5; // degrees
const TILT_Y = 2.5;

// A row that tilts towards the pointer. Values go straight to CSS
// variables, so React never re-renders. Touch screens and reduced motion get a flat row.
function TiltRow({ children, accent, open }: { children: React.ReactNode; accent: string; open: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${((x - 0.5) * 2 * TILT_Y).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - y) * 2 * TILT_X).toFixed(2)}deg`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };
  return (
    <li className="scroll-reveal tilt-card" style={{ "--accent": accent } as React.CSSProperties}>
      <div ref={ref} className="tilt-card-inner" data-open={open || undefined} onPointerMove={onMove} onPointerLeave={onLeave}>
        {children}
      </div>
    </li>
  );
}

export default function Projects({ t }: { t: Dictionary["projects"] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="projects" aria-labelledby="projects-title" className="py-20 md:py-28 border-t border-border">
      <div className="section-container">
        <SectionHeading id="projects-title" title={t.title} />

        <ul className="space-y-4">
          {t.items.map((item, i) => {
            const project = { ...item, ...projects[i] };
            const { name, tagline } = project;
            const { Icon, accent } = visuals[i];
            const isOpen = open === i;
            const panelId = `project-panel-${i}`;
            const buttonId = `project-button-${i}`;

            return (
              <TiltRow key={name} accent={accent} open={isOpen}>
                {/* Big faint icon in the open card's corner, deepest layer */}
                {isOpen && <Icon className="tilt-watermark" strokeWidth={1} aria-hidden="true" />}
                <h3 className="tilt-layer-2 flex items-stretch">
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex-1 flex items-center gap-4 px-5 py-5 sm:px-6 text-start"
                  >
                    {/* Code-style index: 01, 02 … */}
                    <span className="w-7 shrink-0 font-mono text-sm tabular-nums" style={{ color: "var(--accent-ink)" }} aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 min-w-0 sm:flex sm:items-baseline sm:gap-4">
                      <span className="flex items-center gap-2 text-xl sm:text-2xl font-semibold group-hover:text-primary transition-colors">
                        {name}
                        {project.url && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 font-sans text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                            {t.live}
                          </span>
                        )}
                      </span>
                      {tagline && (
                        <span className="block text-muted-foreground font-sans text-base font-normal">{tagline}</span>
                      )}
                    </span>
                    <Icon
                      size={26}
                      strokeWidth={1.5}
                      className="max-sm:hidden shrink-0 opacity-70 transition-opacity group-hover:opacity-100"
                      style={{ color: "var(--accent-ink)" }}
                      aria-hidden="true"
                    />
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      className="shrink-0 text-muted-foreground group-hover:text-primary"
                      aria-hidden="true"
                    >
                      <Plus size={22} />
                    </motion.span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="tilt-layer-1 overflow-hidden"
                    >
                      <div className="px-5 pb-6 sm:px-6 sm:ps-[4.25rem] grid gap-6 md:grid-cols-12">
                        <div className="md:col-span-7 space-y-4 text-muted-foreground max-w-[64ch]">
                          <p className="text-lg leading-snug text-foreground">{project.description}</p>
                          {/* Checklist; points slide in one after another as the card opens */}
                          <ul className="space-y-3">
                            {project.highlights.map((h, k) => (
                              <motion.li
                                key={h}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.12 + k * 0.08, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                className="flex gap-3"
                              >
                                <span
                                  className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full"
                                  style={{ background: `color-mix(in oklab, ${accent} 18%, transparent)`, color: "var(--accent-ink)" }}
                                  aria-hidden="true"
                                >
                                  <Check size={13} strokeWidth={2.5} />
                                </span>
                                <span>{h}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                        <div className="md:col-span-5 md:ps-6 md:border-s border-border space-y-5 text-sm">
                          {project.context && (
                            <div>
                              <p className="text-xs uppercase tracking-wider text-muted-foreground">{t.client}</p>
                              <p className="mt-1.5 flex items-center gap-1.5 text-foreground">
                                <MapPin size={15} style={{ color: "var(--accent-ink)" }} aria-hidden="true" />
                                {project.context}
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">{t.builtWith}</p>
                            <ul className="mt-2 flex flex-wrap gap-1.5">
                              {project.stack.map((s) => (
                                <li
                                  key={s}
                                  className="rounded-md border px-2 py-0.5 text-xs text-foreground/90"
                                  style={{
                                    borderColor: `color-mix(in oklab, ${accent} 35%, var(--border))`,
                                    background: `color-mix(in oklab, ${accent} 8%, transparent)`,
                                  }}
                                >
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {project.url ? (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-10 items-center gap-1.5 rounded-md px-4 font-medium text-[#0e1520] transition-[filter] hover:brightness-110"
                              style={{ background: accent }}
                            >
                              {format(t.visit, { host: new URL(project.url).hostname })}
                              <ArrowUpRight size={16} aria-hidden="true" className="rtl:-scale-x-100" />
                            </a>
                          ) : (
                            <p className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background/50 px-3 py-1.5 text-muted-foreground">
                              <Lock size={14} aria-hidden="true" />
                              {t.private}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TiltRow>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
