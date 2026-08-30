"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { skills } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import SectionHeading from "@/components/section-heading";
import {
  Code2,
  Layers,
  Server,
  Wrench,
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  Frontend: <Code2 size={20} />,
  "State & Libraries": <Layers size={20} />,
  Backend: <Server size={20} />,
  "DevOps & Tools": <Wrench size={20} />,
};

const categoryGradients: Record<string, string> = {
  Frontend: "from-blue-500/20 to-cyan-500/20",
  "State & Libraries": "from-purple-500/20 to-pink-500/20",
  Backend: "from-emerald-500/20 to-teal-500/20",
  "DevOps & Tools": "from-orange-500/20 to-amber-500/20",
};

const categoryBorders: Record<string, string> = {
  Frontend: "hover:border-blue-500/30",
  "State & Libraries": "hover:border-purple-500/30",
  Backend: "hover:border-emerald-500/30",
  "DevOps & Tools": "hover:border-orange-500/30",
};

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="relative py-24 md:py-32">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />

      <div className="section-container relative" ref={ref}>
        <SectionHeading title="Technical" highlight="Skills" />

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.category}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className={`group glass rounded-2xl p-6 transition-all duration-300 ${categoryBorders[skill.category] || ""}`}
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`p-2.5 rounded-xl bg-gradient-to-br ${categoryGradients[skill.category] || "from-primary/20 to-accent/20"}`}
                >
                  {categoryIcons[skill.category] || <Code2 size={20} />}
                </div>
                <h3 className="text-lg font-semibold font-[family-name:var(--font-heading)]">
                  {skill.category}
                </h3>
              </div>

              {/* Skill badges */}
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item, j) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      duration: 0.3,
                      delay: 0.4 + i * 0.1 + j * 0.03,
                    }}
                  >
                    <Badge
                      variant="secondary"
                      className="px-3 py-1.5 text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 cursor-default"
                    >
                      {item}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
