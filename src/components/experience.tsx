"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { experiences } from "@/lib/data";
import SectionHeading from "@/components/section-heading";

const VISIBLE_HIGHLIGHTS = 4;

function Role({ exp }: { exp: (typeof experiences)[number] }) {
  const [expanded, setExpanded] = useState(false);
  const extra = exp.highlights.length - VISIBLE_HIGHLIGHTS;
  const listId = `${exp.company}-highlights`.replace(/\W+/g, "-").toLowerCase();

  return (
    <li className="relative pl-8 sm:pl-10 pb-14 last:pb-0">
      {/* The dot fills as the scroll-drawn line reaches this job */}
      <span
        className="absolute left-0 top-2 size-[11px] -translate-x-[5px] rounded-full bg-background border-2 border-primary overflow-hidden"
        aria-hidden="true"
      >
        <motion.span
          className="block size-full rounded-full bg-primary"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -40% 0px" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </span>
      <p className="text-sm text-muted-foreground tabular-nums">
        {exp.period}, {exp.location}
      </p>
      <h3 className="mt-1 text-xl font-semibold">
        {exp.title}, <span className="font-normal">{exp.company}</span>
      </h3>

      <ul id={listId} className="mt-4 space-y-2.5 max-w-[68ch] text-muted-foreground">
        {exp.highlights.slice(0, VISIBLE_HIGHLIGHTS).map((h) => (
          <li key={h} className="pl-4 relative before:absolute before:left-0 before:top-[0.7em] before:w-2 before:h-px before:bg-muted-foreground/60">
            {h}
          </li>
        ))}
        <AnimatePresence initial={false}>
          {expanded &&
            exp.highlights.slice(VISIBLE_HIGHLIGHTS).map((h, i) => (
              <motion.li
                key={h}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                className="pl-4 relative overflow-hidden before:absolute before:left-0 before:top-[0.7em] before:w-2 before:h-px before:bg-muted-foreground/60"
              >
                {h}
              </motion.li>
            ))}
        </AnimatePresence>
      </ul>

      {extra > 0 && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          {expanded ? "Show fewer" : `Show all ${exp.highlights.length}`}
        </button>
      )}
    </li>
  );
}

export default function Experience() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const reduceMotion = useReducedMotion();

  return (
    <section id="experience" aria-labelledby="experience-title" className="py-20 md:py-28 border-t border-border">
      <div className="section-container lg:grid lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading id="experience-title" title="Where I’ve worked" />
          </div>
        </div>
        <div className="relative ml-1 lg:col-span-8">
          <div className="absolute left-0 top-2 bottom-0 w-px bg-border" aria-hidden="true" />
          <motion.div
            className="absolute left-0 top-2 bottom-0 w-px bg-primary origin-top"
            style={{ scaleY: reduceMotion ? 1 : progress }}
            aria-hidden="true"
          />
          <ol ref={ref} className="relative">
            {experiences.map((exp) => (
              <Role key={exp.title + exp.company} exp={exp} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
