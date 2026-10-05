import {
  siAntdesign,
  siAxios,
  siClaude,
  siCss,
  siDjango,
  siDocker,
  siFirebase,
  siGit,
  siGithub,
  siGithubactions,
  siGooglegemini,
  siHtml5,
  siJavascript,
  siJsonwebtokens,
  siMantine,
  siMediapipe,
  siMongodb,
  siMui,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siReactquery,
  siReactrouter,
  siRedux,
  siShadcnui,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siWebpack,
  type SimpleIcon,
} from "simple-icons";
import { skills } from "@/lib/data";
import SectionHeading from "@/components/section-heading";
import { MarkIcon, type Tool } from "@/components/stack-grid";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

// Products get their logo; practices (RBAC, RTL layouts, SEO …) stay plain text, so the two read differently.
// Keyed by the item names in src/lib/data.ts. `color` overrides the brand hex where it's unreadable.
const marks: Record<string, { mark: Tool["mark"]; color?: string }> = {
  "React.js": { mark: { icon: siReact } },
  "Next.js (SSR/SSG)": { mark: { icon: siNextdotjs } },
  TypeScript: { mark: { icon: siTypescript } },
  "JavaScript (ES6+)": { mark: { icon: siJavascript }, color: "#E5C800" },
  HTML5: { mark: { icon: siHtml5 } },
  CSS3: { mark: { icon: siCss } },
  "React Native": { mark: { icon: siReact } },
  "Tailwind CSS": { mark: { icon: siTailwindcss } },
  "shadcn/ui": { mark: { icon: siShadcnui } },
  "Material-UI": { mark: { icon: siMui } },
  "Ant Design": { mark: { icon: siAntdesign } },
  Mantine: { mark: { icon: siMantine } },
  Zustand: { mark: { letter: "Z" }, color: "#A0703F" },
  Redux: { mark: { icon: siRedux } },
  "TanStack Query": { mark: { icon: siReactquery } },
  "React Router": { mark: { icon: siReactrouter } },
  Axios: { mark: { icon: siAxios } },
  "JWT Authentication": { mark: { icon: siJsonwebtokens } },
  "OpenAI API": { mark: { glyph: "openai" } },
  "Claude API (Anthropic)": { mark: { icon: siClaude } },
  "Google Gemini API": { mark: { icon: siGooglegemini } },
  "MediaPipe FaceMesh": { mark: { icon: siMediapipe } },
  "Node.js": { mark: { icon: siNodedotjs } },
  Python: { mark: { icon: siPython } },
  Django: { mark: { icon: siDjango } },
  PostgreSQL: { mark: { icon: siPostgresql } },
  MongoDB: { mark: { icon: siMongodb } },
  MySQL: { mark: { icon: siMysql } },
  Firebase: { mark: { icon: siFirebase } },
  Supabase: { mark: { icon: siSupabase } },
  Git: { mark: { icon: siGit } },
  GitHub: { mark: { icon: siGithub } },
  "GitHub Actions": { mark: { icon: siGithubactions } },
  Docker: { mark: { icon: siDocker } },
  Webpack: { mark: { icon: siWebpack } },
};

// Near-black brand marks (Next.js, GitHub …) follow the text colour instead, so they show on the dark theme
function brandStyle(icon: SimpleIcon | undefined, color: string | undefined) {
  const hex = color ?? (icon ? `#${icon.hex}` : undefined);
  if (!hex) return { ink: true, hex: undefined };
  // Relative luminance (WCAG): Django's dark green and GitHub's black land under the cut-off
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return { ink: 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.04, hex };
}

export default function Skills({ t }: { t: Dictionary["skills"] }) {
  const terms: Record<string, string> = t.terms;
  return (
    <section id="skills" aria-labelledby="skills-title" className="py-20 md:py-28 border-t border-border">
      <div className="section-container">
        <SectionHeading id="skills-title" title={t.title} />
        {/* One row per category, like the CV's skills table: no half-empty cards, easy to scan down the left */}
        <dl className="border-b border-border">
          {skills.map((skill) => {
            const category = t.categories[skill.category];
            return (
            <div
              key={skill.category}
              className="scroll-reveal grid gap-3 border-t border-border py-5 md:grid-cols-[13rem_1fr] md:gap-8"
            >
              <dt className="font-semibold text-foreground md:pt-1">{category}</dt>
              <dd>
                <ul className="flex flex-wrap gap-2" aria-label={category}>
                  {skill.items.map((item, i) => {
                    const brand = marks[item];
                    const { ink, hex } = brandStyle(
                      brand && "icon" in brand.mark ? brand.mark.icon : undefined,
                      brand?.color,
                    );
                    return (
                      <li
                        key={item}
                        style={{ "--i": i, "--brand": hex } as React.CSSProperties}
                        data-tool={brand ? "" : undefined}
                        data-ink={brand && ink ? "" : undefined}
                        className="skill-chip scroll-chip inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-sm leading-snug"
                      >
                        {brand && (
                          <span className="skill-mark grid size-4 shrink-0 place-items-center">
                            <MarkIcon mark={brand.mark} color="currentColor" size={15} />
                          </span>
                        )}
                        {terms[item] ?? item}
                      </li>
                    );
                  })}
                </ul>
              </dd>
            </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
