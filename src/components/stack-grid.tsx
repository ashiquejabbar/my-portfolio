import { Sparkles } from "lucide-react";
import {
  siClaude,
  siGooglegemini,
  siJavascript,
  siMongodb,
  siMui,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siReactquery,
  siShadcnui,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";

// How a tile draws its mark: an official simple-icons path, or a stand-in when simple-icons has none
type Mark = { icon: SimpleIcon } | { glyph: "openai" } | { letter: string };
export type Tool = { label: string; mark: Mark; color?: string };

// Brand marks that are black by default follow the text colour, so they work in both themes
const INK = "currentColor";

// Also used by the full-screen intro (intro-showcase.tsx)
export const tools: Tool[] = [
  { label: "React", mark: { icon: siReact } },
  { label: "Next.js", mark: { icon: siNextdotjs }, color: INK },
  { label: "TypeScript", mark: { icon: siTypescript } },
  { label: "JavaScript", mark: { icon: siJavascript }, color: "#E5C800" },
  { label: "Tailwind CSS", mark: { icon: siTailwindcss } },
  { label: "shadcn/ui", mark: { icon: siShadcnui }, color: INK },
  { label: "Material UI", mark: { icon: siMui } },
  // simple-icons has no Zustand mark; a lettermark in Zustand's bear brown stands in
  { label: "Zustand", mark: { letter: "Z" }, color: "#A0703F" },
  { label: "TanStack Query", mark: { icon: siReactquery } },
  { label: "Node.js", mark: { icon: siNodedotjs } },
  { label: "Python", mark: { icon: siPython } },
  { label: "PostgreSQL", mark: { icon: siPostgresql } },
  { label: "MongoDB", mark: { icon: siMongodb } },
  // simple-icons doesn't ship the OpenAI mark, so a neutral glyph stands in
  { label: "OpenAI", mark: { glyph: "openai" }, color: INK },
  { label: "Claude", mark: { icon: siClaude } },
  { label: "Google Gemini", mark: { icon: siGooglegemini } },
];

export const toolColor = (tool: Tool) => tool.color ?? `#${"icon" in tool.mark ? tool.mark.icon.hex : "2446E0"}`;

export function MarkIcon({ mark, color, size = 26 }: { mark: Mark; color: string; size?: number }) {
  if ("icon" in mark) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
        <path d={mark.icon.path} />
      </svg>
    );
  }
  if ("glyph" in mark) {
    return <Sparkles size={size} color={color} aria-hidden="true" />;
  }
  return (
    <span
      className="font-heading font-extrabold leading-none"
      style={{ color, fontSize: size * 0.98 }}
      aria-hidden="true"
    >
      {mark.letter}
    </span>
  );
}

// Hero skills list: every tool as a logo + name pill, all visible at once so a recruiter
// can read the whole stack at a glance. Sits above the code workspace; pills ripple in.
export function StackRow({ title }: { title: string }) {
  return (
    <div className="mb-8">
      <h2 className="mb-2.5 font-sans text-sm font-medium text-muted-foreground">{title}</h2>
      <ul className="flex flex-wrap gap-2">
        {tools.map((tool, i) => (
          <li
            key={tool.label}
            className="tile-in flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[0.8rem] font-medium leading-none text-foreground/85"
            style={{ animationDelay: `${0.6 + i * 0.04}s` }}
          >
            <MarkIcon mark={tool.mark} color={toolColor(tool)} size={15} />
            {tool.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
