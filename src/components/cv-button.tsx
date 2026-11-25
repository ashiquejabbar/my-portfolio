"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Download, FileText } from "lucide-react";
import { CV_FILENAME, CV_PATH, CV_SIZE } from "@/lib/data";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

// CV download link, shared by the navbar and the hero. After a click the icon turns into a tick
// and the label says "Downloaded" for a moment (also announced to screen readers), so it's clear
// something happened. The tooltip gives the file type and size. `compact` shows only the icon
// below the lg breakpoint; `showNote` prints the CV language note after the label.
// `chip` (navbar): an outline chip with a document icon, the label, and the download icon in a
// small filled square at the end; its tooltip is just the label, without file type or size.
export default function CvButton({
  common,
  className,
  compact = false,
  showNote = false,
  iconSize = 15,
  chip = false,
}: {
  common: Dictionary["common"];
  className: string;
  compact?: boolean;
  showNote?: boolean;
  iconSize?: number;
  chip?: boolean;
}) {
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  // Download arrow that turns into a tick after a click
  const icon = (
    <span className="relative grid place-items-center overflow-hidden" style={{ width: iconSize + 1, height: iconSize + 1 }} aria-hidden="true">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={done ? "done" : "idle"}
          initial={{ y: done ? 0 : -14, scale: done ? 0.4 : 1, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: done ? 0 : 14, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="grid place-items-center"
        >
          {done ? (
            <Check size={iconSize + 1} strokeWidth={2.5} />
          ) : (
            <Download size={iconSize} className="transition-transform duration-200 motion-safe:group-hover:translate-y-0.5" />
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  );
  const info = `PDF, ${CV_SIZE}${common.cvLanguageNote ? ` ${common.cvLanguageNote}` : ""}`;
  return (
    <a
      href={CV_PATH}
      download={CV_FILENAME}
      title={chip ? common.downloadCv : info}
      aria-label={compact ? (chip ? common.downloadCv : `${common.downloadCv} (${info})`) : undefined}
      onClick={() => {
        setDone(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setDone(false), 2500);
      }}
      className={`group ${className}`}
    >
      {chip ? <FileText size={iconSize} aria-hidden="true" className={`text-muted-foreground ${compact ? "max-lg:hidden" : ""}`} /> : icon}
      {/* Both labels share one grid cell, so the button keeps the width of the longer one */}
      <span className={`grid ${compact ? "max-lg:sr-only" : ""}`}>
        <span className={`col-start-1 row-start-1 ${done ? "invisible" : ""}`} aria-hidden={done}>
          {common.downloadCv}
        </span>
        <span className={`col-start-1 row-start-1 ${done ? "" : "invisible"}`} aria-live="polite">
          {done ? common.cvDownloaded : ""}
        </span>
        {/* Reserves the width of "Downloaded" while it isn't showing */}
        <span className="col-start-1 row-start-1 invisible" aria-hidden="true">
          {common.cvDownloaded}
        </span>
      </span>
      {showNote && common.cvLanguageNote && (
        <span className="font-normal text-muted-foreground">{common.cvLanguageNote}</span>
      )}
      {chip && (
        <span className="grid size-6 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
          {icon}
        </span>
      )}
    </a>
  );
}
