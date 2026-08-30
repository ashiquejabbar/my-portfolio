"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface SectionHeadingProps {
  title: string;
  highlight: string;
}

export default function SectionHeading({ title, highlight }: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-[family-name:var(--font-heading)] mb-4">
        {title} <span className="gradient-text">{highlight}</span>
      </h2>
      <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto" />
    </motion.div>
  );
}
