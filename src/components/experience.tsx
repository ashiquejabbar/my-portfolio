"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { experiences } from "@/lib/data";
import { Briefcase, MapPin, Calendar } from "lucide-react";
import SectionHeading from "@/components/section-heading";

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="relative py-24 md:py-32">
      <div className="section-container" ref={ref}>
        <SectionHeading title="Work" highlight="Experience" />

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-accent/30 to-transparent md:-translate-x-px" />

          {experiences.map((exp, i) => (
            <motion.div
              key={exp.title + exp.company}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              className={`relative flex flex-col md:flex-row gap-4 md:gap-8 mb-12 last:mb-0 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 top-6 w-3 h-3 -translate-x-1.5 md:-translate-x-1.5">
                <div className="w-full h-full rounded-full bg-primary glow-blue" />
                <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30" />
              </div>

              {/* Spacer for layout */}
              <div className="hidden md:block md:w-1/2" />

              {/* Card */}
              <div className="ml-10 md:ml-0 md:w-1/2">
                <div className="group glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-300">
                  {/* Title */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                      <Briefcase size={16} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-foreground">
                        {exp.title}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium">
                        {exp.company}
                      </p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-accent" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-accent" />
                      {exp.location}
                    </span>
                  </div>

                  {/* Highlights */}
                  <ul className="space-y-2">
                    {exp.highlights.map((highlight, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0 mt-1.5" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
