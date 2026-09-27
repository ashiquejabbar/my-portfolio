"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { projects } from "@/lib/data";
import SectionHeading from "@/components/section-heading";

export default function Projects() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="projects" aria-labelledby="projects-title" className="py-20 md:py-28 border-t border-border">
      <div className="section-container">
        <SectionHeading id="projects-title" title="Selected projects" />

        <ul className="border-t border-border">
          {projects.map((project, i) => {
            const isOpen = open === i;
            const [name, tagline] = project.name.split(" — ");
            const panelId = `project-panel-${i}`;
            const buttonId = `project-button-${i}`;

            return (
              <li key={project.name} className="border-b border-border">
                <h3 className="flex items-stretch">
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex-1 flex items-center gap-4 py-5 text-left"
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
                                className="pl-4 relative before:absolute before:left-0 before:top-[0.7em] before:w-2 before:h-px before:bg-muted-foreground/60"
                              >
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="md:col-span-5 md:pl-6 md:border-l border-border space-y-4 text-sm">
                          {project.context && (
                            <div>
                              <p className="text-muted-foreground">Client</p>
                              <p className="mt-1">{project.context}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-muted-foreground">Built with</p>
                            <p className="mt-1">{project.stack.join(", ")}</p>
                          </div>
                          {project.url ? (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-medium text-primary hover:underline underline-offset-4"
                            >
                              Visit {new URL(project.url).hostname}
                              <ArrowUpRight size={16} aria-hidden="true" />
                            </a>
                          ) : (
                            <p className="text-muted-foreground">
                              Private client system, not publicly available.
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
