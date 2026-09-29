"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { projects } from "@/lib/data";
import SectionHeading from "@/components/section-heading";
import { format } from "@/lib/i18n/format";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

export default function Projects({ t }: { t: Dictionary["projects"] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="projects" aria-labelledby="projects-title" className="py-20 md:py-28 border-t border-border">
      <div className="section-container">
        <SectionHeading id="projects-title" title={t.title} />

        <ul className="border-t border-border">
          {t.items.map((item, i) => {
            const project = { ...item, ...projects[i] };
            const { name, tagline } = project;
            const isOpen = open === i;
            const panelId = `project-panel-${i}`;
            const buttonId = `project-button-${i}`;

            return (
              <li key={name} className="border-b border-border">
                <h3 className="flex items-stretch">
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex-1 flex items-center gap-4 py-5 text-start"
                  >
                    <span className="flex-1 min-w-0 sm:flex sm:items-baseline sm:gap-4">
                      <span className="block text-xl sm:text-2xl font-semibold group-hover:text-primary transition-colors">
                        {name}
                      </span>
                      {tagline && (
                        <span className="block text-muted-foreground font-sans text-base font-normal">
                          {tagline}
                        </span>
                      )}
                    </span>
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
                      className="overflow-hidden"
                    >
                      <div className="pb-7 grid gap-6 md:grid-cols-12">
                        <div className="md:col-span-7 space-y-3 text-muted-foreground max-w-[64ch]">
                          <p className="text-foreground">{project.description}</p>
                          <ul className="space-y-2">
                            {project.highlights.map((h) => (
                              <li
                                key={h}
                                className="ps-4 relative before:absolute before:start-0 before:top-[0.7em] before:w-2 before:h-px before:bg-muted-foreground/60"
                              >
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="md:col-span-5 md:ps-6 md:border-s border-border space-y-4 text-sm">
                          {project.context && (
                            <div>
                              <p className="text-muted-foreground">{t.client}</p>
                              <p className="mt-1">{project.context}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-muted-foreground">{t.builtWith}</p>
                            <p className="mt-1">{project.stack.join(", ")}</p>
                          </div>
                          {project.url ? (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-medium text-primary hover:underline underline-offset-4"
                            >
                              {format(t.visit, { host: new URL(project.url).hostname })}
                              <ArrowUpRight size={16} aria-hidden="true" className="rtl:-scale-x-100" />
                            </a>
                          ) : (
                            <p className="text-muted-foreground">
                              {t.private}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
