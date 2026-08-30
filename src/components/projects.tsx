"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { projects } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/section-heading";

const projectGradients = [
  "from-blue-500/10 to-cyan-500/10",
  "from-purple-500/10 to-pink-500/10",
  "from-emerald-500/10 to-teal-500/10",
  "from-orange-500/10 to-amber-500/10",
  "from-rose-500/10 to-red-500/10",
];

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="relative py-24 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/3 to-transparent" />

      <div className="section-container relative" ref={ref}>
        <SectionHeading title="Featured" highlight="Projects" />

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="group relative"
            >
              {/* Hover glow */}
              <div
                className={`absolute -inset-1 bg-gradient-to-br ${projectGradients[i % projectGradients.length]} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative glass rounded-2xl p-6 h-full flex flex-col hover:border-primary/30 transition-all duration-300">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-semibold font-[family-name:var(--font-heading)] text-foreground leading-tight pr-2">
                    {project.name}
                  </h3>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-primary transition-all duration-200"
                      aria-label={`Visit ${project.name}`}
                    >
                      <ArrowUpRight size={16} />
                    </a>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-grow">
                  {project.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-1.5 mb-4">
                  {project.highlights.map((h, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-xs text-muted-foreground/80"
                    >
                      <span className="w-1 h-1 rounded-full bg-accent/60 shrink-0 mt-1.5" />
                      {h}
                    </li>
                  ))}
                </ul>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-white/5">
                  {project.stack.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="px-2 py-0.5 text-[10px] font-medium bg-white/5 border border-white/10"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* Live link */}
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 mt-4 text-xs text-primary hover:text-accent transition-colors font-medium"
                  >
                    <ExternalLink size={12} />
                    View Live
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
