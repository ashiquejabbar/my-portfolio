"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { personalInfo } from "@/lib/data";

// Hero showpiece: a 3D developer workspace. An editor types out a code profile, a
// terminal "hires" the developer, a browser preview sits behind and an AI chip streams
// in front. The stack tilts toward the pointer and fans out in depth as the hero scrolls
// away. Decorative (the same facts are in the hero copy), so it's hidden from screen readers.

type Kind = "kw" | "fn" | "str" | "prop" | "pun" | "bool" | "com" | "txt";
type Line = [string, Kind][];

const code: Line[] = [
  [["// developer.config.ts", "com"]],
  [["export ", "kw"], ["const ", "kw"], ["developer", "fn"], [" = ", "pun"], ["defineProfile", "fn"], ["({", "pun"]],
  [["  name", "prop"], [": ", "pun"], [`"${personalInfo.name}"`, "str"], [",", "pun"]],
  [["  role", "prop"], [": ", "pun"], ['"Frontend Developer"', "str"], [",", "pun"]],
  [["  based", "prop"], [": ", "pun"], ['"Dubai, UAE"', "str"], [",", "pun"]],
  [["  focus", "prop"], [": [", "pun"]],
  [['    "Enterprise UI"', "str"], [", ", "pun"], ['"AI features"', "str"], [",", "pun"]],
  [['    "Performance"', "str"], [", ", "pun"], ['"API integration"', "str"], [",", "pun"]],
  [["  ],", "pun"]],
  [["  experience", "prop"], [": ", "pun"], ["5", "bool"], [", ", "pun"], ["// years", "com"]],
  [["  available", "prop"], [": ", "pun"], ["true", "bool"], [",", "pun"]],
  [["});", "pun"]],
];

const terminal = [
  { text: "$ npx hire ashique", tone: "cmd" },
  { text: "✓ resolved 5+ yrs React · Next.js", tone: "ok" },
  { text: "✓ immediate joiner · UAE", tone: "ok" },
] as const;

const aiTokens = ["Building", " accessible,", " fast", " interfaces", " with", " AI", " inside."];

const total = code.reduce((n, l) => n + l.reduce((m, [t]) => m + t.length, 0), 0);
const CHAR_MS = 28;
const TERM_MS = 420;
const HOLD_MS = 4200;

const kindClass: Record<Kind, string> = {
  kw: "text-[#c4a7ff]",
  fn: "text-[#8da2ff]",
  str: "text-[#d9ae72]",
  prop: "text-[#e6ecf3]",
  pun: "text-[#7d8aa0]",
  bool: "text-[#ff9e7a]",
  com: "text-[#56637a] italic",
  txt: "text-[#e6ecf3]",
};

function useLoop(reduced: boolean, active: boolean) {
  // typed chars, then terminal lines shown, in one counter driven by a timer
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  useEffect(() => {
    if (reduced || !active) return;
    let id: ReturnType<typeof setTimeout>;
    const tick = (s: number) => {
      stepRef.current = s;
      setStep(s);
      let wait = CHAR_MS;
      if (s >= total) wait = TERM_MS;
      if (s >= total + terminal.length) wait = HOLD_MS;
      const next = s >= total + terminal.length ? 0 : s + 1;
      id = setTimeout(() => tick(next), wait);
    };
    // Resume where it paused (scrolled away), not from the start
    id = setTimeout(() => tick(stepRef.current), 600);
    return () => clearTimeout(id);
  }, [reduced, active]);
  // reduced is only known after mount, so derive the finished state rather than store it
  return reduced ? total + terminal.length : step;
}

function Editor({ typed }: { typed: number }) {
  const lines: React.ReactNode[][] = [];
  let left = typed;
  let cursorLine = -1;
  for (let li = 0; li < code.length; li++) {
    const parts: React.ReactNode[] = [];
    for (let ti = 0; ti < code[li].length; ti++) {
      const [text, kind] = code[li][ti];
      const shown = text.slice(0, Math.max(left, 0));
      left -= text.length;
      if (shown)
        parts.push(
          <span key={ti} className={kindClass[kind]}>
            {shown}
          </span>,
        );
    }
    // The caret sits on the line where typing has got to
    if (cursorLine < 0 && (left < 0 || li === code.length - 1)) cursorLine = li;
    lines.push(parts);
  }
  return (
    <div className="font-mono text-[11.5px] sm:text-[12.5px] leading-[1.75]">
      {lines.map((parts, i) => (
        <div key={i} className="flex whitespace-pre">
          <span className="w-7 shrink-0 select-none pr-3 text-right text-[#3b4759]">{i + 1}</span>
          <span>
            {parts}
            {i === cursorLine && <span className="code-caret" />}
          </span>
        </div>
      ))}
    </div>
  );
}

function WindowBar({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 border-b border-white/[0.07] px-3.5 py-2.5">
      <span className="flex gap-1.5">
        <span className="size-2.5 rounded-full bg-[#ff6b6b]/80" />
        <span className="size-2.5 rounded-full bg-[#f7c25c]/80" />
        <span className="size-2.5 rounded-full bg-[#4fd18b]/80" />
      </span>
      <span className="ml-2 font-mono text-[11px] text-[#93a1b3]">{title}</span>
      {children}
    </div>
  );
}

export default function CodeStage() {
  const ref = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- media query only exists on the client
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  // Type only while the workspace is on screen, so it costs nothing once scrolled past
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const step = useLoop(reduced, inView);
  const typed = Math.min(step, total);
  const termShown = Math.max(step - total, 0);
  const aiShown = Math.min(Math.floor((step / total) * aiTokens.length * 1.4), aiTokens.length);

  // Pointer tilt and scroll spread, written to CSS variables once per frame
  useEffect(() => {
    const stage = ref.current;
    const section = stage?.closest("section");
    if (!stage || !section || reduced) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0, s: 0 };
    let frame = 0;
    const spread = () => {
      const r = section.getBoundingClientRect();
      return Math.min(Math.max(-r.top / (r.height * 0.6), 0), 1);
    };
    const tick = () => {
      const s = spread();
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      cur.s += (s - cur.s) * 0.12;
      stage.style.setProperty("--tilt-x", cur.y.toFixed(3));
      stage.style.setProperty("--tilt-y", cur.x.toFixed(3));
      stage.style.setProperty("--spread", cur.s.toFixed(3));
      const moving =
        Math.abs(target.x - cur.x) > 0.001 || Math.abs(target.y - cur.y) > 0.001 || Math.abs(s - cur.s) > 0.001;
      frame = moving ? requestAnimationFrame(tick) : 0;
    };
    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      target.x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width * 0.9)));
      target.y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height * 0.9)));
      start();
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      start();
    };
    if (fine) {
      section.addEventListener("pointermove", onMove);
      section.addEventListener("pointerleave", onLeave);
    }
    window.addEventListener("scroll", start, { passive: true });
    start();
    return () => {
      cancelAnimationFrame(frame);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", start);
    };
  }, [reduced]);

  return (
    <div ref={ref} aria-hidden="true" className="code-stage">
      <div className="code-stage-rig">
        {/* Back: browser preview of what the code builds */}
        <div className="code-pane code-pane-browser">
          <WindowBar title="localhost:3000">
            <span className="ml-auto rounded bg-[#4fd18b]/15 px-1.5 py-0.5 font-mono text-[10px] text-[#4fd18b]">200</span>
          </WindowBar>
          <div className="grid grid-cols-3 gap-2 p-3">
            <div className="col-span-3 h-14 rounded-md bg-gradient-to-r from-[#2446e0]/60 via-[#7b93ff]/40 to-[#d9ae72]/40" />
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-1.5 rounded-md bg-white/[0.04] p-2">
                <div className="h-8 rounded bg-white/[0.07]" />
                <div className="h-1.5 w-4/5 rounded bg-white/[0.12]" />
                <div className="h-1.5 w-1/2 rounded bg-white/[0.08]" />
              </div>
            ))}
          </div>
        </div>

        {/* Middle: the editor */}
        <div className="code-pane code-pane-editor">
          <WindowBar title="developer.config.ts">
            <span className="ml-auto font-mono text-[10px] text-[#56637a]">TypeScript · UTF-8</span>
          </WindowBar>
          <div className="px-2 py-3">
            <Editor typed={typed} />
          </div>
        </div>

        {/* Front: terminal */}
        <div className="code-pane code-pane-terminal">
          <WindowBar title="zsh — portfolio" />
          <div className="space-y-1 px-3.5 py-3 font-mono text-[11.5px] leading-relaxed">
            {terminal.map((l, i) => (
              <div
                key={l.text}
                className={`transition-opacity duration-300 ${i < termShown ? "opacity-100" : "opacity-0"} ${
                  l.tone === "cmd" ? "text-[#e6ecf3]" : "text-[#4fd18b]"
                }`}
              >
                {l.text}
              </div>
            ))}
          </div>
        </div>

        {/* Floating AI chip */}
        <div className="code-pane code-pane-ai">
          <span className="grid size-7 shrink-0 place-items-center rounded-md bg-gradient-to-br from-[#d9ae72] to-[#c26a3d] text-[#0e1520]">
            <Sparkles size={14} />
          </span>
          <span className="min-w-0">
            <span className="block font-mono text-[10px] uppercase tracking-wider text-[#93a1b3]">ai.stream()</span>
            <span className="block truncate text-[12px] text-[#e6ecf3]">
              {aiTokens.slice(0, aiShown).join("") || "…"}
              <span className="code-caret code-caret-thin" />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
