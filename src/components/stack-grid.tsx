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

const COLUMNS = 4;
const START = 0.35;

export const toolColor = (tool: Tool) => tool.color ?? `#${"icon" in tool.mark ? tool.mark.icon.hex : "2446E0"}`;

export function MarkIcon({ mark, color }: { mark: Mark; color: string }) {
  if ("icon" in mark) {
    return (
      <svg viewBox="0 0 24 24" width="26" height="26" fill={color} aria-hidden="true">
        <path d={mark.icon.path} />
      </svg>
    );
  }
  if ("glyph" in mark) {
    return <Sparkles size={26} color={color} aria-hidden="true" />;
  }
  return (
    <span
      className="font-heading text-[1.6rem] font-extrabold leading-none"
      style={{ color }}
      aria-hidden="true"
    >
      {mark.letter}
    </span>
  );
}

export default function StackGrid() {
  return (
    <div className="rounded-xl bg-card border border-border shadow-[var(--shadow-raised)] p-5 sm:p-6">
      <h2 className="font-sans text-sm font-medium text-muted-foreground mb-4">
        What I build with
      </h2>
      <ul className="grid grid-cols-4 gap-x-2 gap-y-5">
        {tools.map((tool, i) => {
          const color = toolColor(tool);
          // Diagonal ripple: tiles further along row + column come in a beat later
          const delay = START + ((i % COLUMNS) + Math.floor(i / COLUMNS)) * 0.07;

          return (
            <li
              key={tool.label}
              className="tile-in group flex flex-col items-center gap-2 text-center"
              style={{ animationDelay: `${delay}s` }}
            >
              <span className="grid place-items-center size-12 rounded-lg bg-background text-foreground transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
                <span className="grid place-items-center transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
                  <MarkIcon mark={tool.mark} color={color} />
                </span>
              </span>
              <span className="text-xs leading-tight text-muted-foreground group-hover:text-foreground transition-colors">
                {tool.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
