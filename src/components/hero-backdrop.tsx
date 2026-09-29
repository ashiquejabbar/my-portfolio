"use client";

import { useEffect, useRef } from "react";
import { MarkIcon, toolColor, tools } from "@/components/stack-grid";

// Where each logo floats, in % of the hero, placed in the empty space around the content.
// depth (0–1): nearer logos are larger, stronger and react more to the pointer.
// edge: kept on small screens, where the middle of the hero is all text.
const slots = [
  { label: "React", left: 3, top: 14, depth: 1, edge: true },
  { label: "TypeScript", left: 44, top: 12, depth: 0.6 },
  { label: "Next.js", left: 47, top: 38, depth: 0.9 },
  { label: "Tailwind CSS", left: 93, top: 9, depth: 0.7, edge: true },
  { label: "OpenAI", left: 95, top: 55, depth: 1, edge: true },
  { label: "Claude", left: 2, top: 62, depth: 0.7, edge: true },
  { label: "Python", left: 30, top: 88, depth: 0.6 },
  { label: "Node.js", left: 54, top: 87, depth: 0.8 },
  { label: "Google Gemini", left: 96, top: 82, depth: 0.5, edge: true },
  { label: "TanStack Query", left: 11, top: 89, depth: 0.7 },
];

const floaters = slots.flatMap((slot) => {
  const tool = tools.find((t) => t.label === slot.label);
  return tool ? [{ ...slot, tool }] : [];
});

const REPEL_RADIUS = 220; // px around the pointer that pushes logos away
const REPEL_FORCE = 70; // px a nearest logo moves at full depth
const PARALLAX = 0.025; // share of the pointer's distance from centre that all logos drift
const EASE = 0.1; // how quickly logos catch up with their target each frame

// Hero background: tech logos floating behind the content (bob animation in globals.css).
// With a mouse they drift with the pointer and scatter away from it. Positions are written
// straight to the DOM once per frame, so React never re-renders. Touch screens and
// reduced-motion visitors get the logos without pointer reactions.
export default function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const section = root?.parentElement;
    if (!root || !section) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-depth]")).map((el) => ({
      el,
      depth: Number(el.dataset.depth),
      cx: 0,
      cy: 0,
      x: 0,
      y: 0,
    }));

    // Resting centres; offsetLeft/Top ignore the transforms applied below
    const measure = () => {
      for (const it of items) {
        it.cx = it.el.offsetLeft + it.el.offsetWidth / 2;
        it.cy = it.el.offsetTop + it.el.offsetHeight / 2;
      }
    };
    measure();

    let pointer: { x: number; y: number } | null = null;
    let frame = 0;

    const tick = () => {
      frame = 0;
      let moving = false;
      const w = section.offsetWidth;
      const h = section.offsetHeight;

      for (const it of items) {
        let tx = 0;
        let ty = 0;
        let near = 0;
        if (pointer) {
          tx = -(pointer.x - w / 2) * PARALLAX * it.depth;
          ty = -(pointer.y - h / 2) * PARALLAX * it.depth;
          const dx = it.cx - pointer.x;
          const dy = it.cy - pointer.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < REPEL_RADIUS) {
            near = 1 - dist / REPEL_RADIUS;
            const push = near * near * REPEL_FORCE * it.depth;
            tx += (dx / dist) * push;
            ty += (dy / dist) * push;
          }
        }
        it.x += (tx - it.x) * EASE;
        it.y += (ty - it.y) * EASE;
        if (Math.abs(tx - it.x) > 0.1 || Math.abs(ty - it.y) > 0.1) moving = true;
        it.el.style.translate = `${it.x.toFixed(1)}px ${it.y.toFixed(1)}px`;
        it.el.style.setProperty("--near", near.toFixed(2));
      }
      if (moving) frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      start();
    };
    const onLeave = () => {
      pointer = null;
      start();
    };
    const onResize = () => {
      measure();
      start();
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="hero-backdrop">
      {floaters.map(({ label, left, top, depth, edge, tool }, i) => (
        <div
          key={label}
          data-depth={depth}
          className={`hero-floater ${edge ? "" : "max-lg:hidden"}`}
          style={
            {
              left: `${left}%`,
              top: `${top}%`,
              "--depth": depth,
              animationDelay: `${-i * 1.7}s`,
              animationDuration: `${9 + (i % 4) * 2}s`,
            } as React.CSSProperties
          }
        >
          <span className="hero-floater-tile">
            <MarkIcon mark={tool.mark} color={toolColor(tool)} />
          </span>
        </div>
      ))}
    </div>
  );
}
