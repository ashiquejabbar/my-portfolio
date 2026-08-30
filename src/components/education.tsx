"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { education } from "@/lib/data";
import { GraduationCap, Award, Calendar } from "lucide-react";
import SectionHeading from "@/components/section-heading";

export default function Education() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const icons = [
    <GraduationCap key="grad" size={22} />,
    <Award key="award" size={22} />,
  ];

  return (
    <section id="education" className="relative py-24 md:py-32">
      <div className="section-container" ref={ref}>
        <SectionHeading title="Education &" highlight="Certifications" />

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {education.map((edu, i) => (
            <motion.div
              key={edu.degree}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
              className="group"
            >
              <div className="glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 h-full">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary shrink-0">
                    {icons[i] || <GraduationCap size={22} />}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold font-[family-name:var(--font-heading)] text-foreground mb-1">
                      {edu.degree}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {edu.institution}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                      <Calendar size={12} className="text-accent" />
                      {edu.year}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
