import { BadgeCheck, GraduationCap, type LucideIcon } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

// Icon per entry, same order as Dictionary["education"]["items"]: the degree, then the certificate
const icons: LucideIcon[] = [GraduationCap, BadgeCheck];

export default function Education({ t, sep }: { t: Dictionary["education"]; sep: string }) {
  return (
    <section id="education" aria-labelledby="education-title" className="py-16 md:py-20 border-t border-border">
      <div className="section-container grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <h2 id="education-title" className="text-xl font-semibold overflow-hidden pb-[0.08em]">
            <span className="block scroll-rise">{t.title}</span>
          </h2>
        </div>
        {/* A short timeline, drawn like the one in "Where I've worked" */}
        <ol className="lg:col-span-8 relative">
          <span className="absolute start-[1.1875rem] top-6 bottom-6 w-px bg-border" aria-hidden="true" />
          {t.items.map((edu, i) => {
            const Icon = icons[i] ?? GraduationCap;
            return (
              <li key={edu.degree} className="scroll-slide relative flex gap-4 py-3">
                <span className="relative grid size-10 shrink-0 place-items-center rounded-full border border-border bg-card text-primary">
                  <Icon size={19} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div className="flex-1 min-w-0 pt-1.5 sm:flex sm:items-start sm:justify-between sm:gap-6">
                  <p>
                    <span className="font-medium">{edu.degree}</span>
                    <span className="text-muted-foreground">
                      {sep}
                      {edu.institution}
                    </span>
                  </p>
                  <p className="mt-1.5 sm:mt-0 shrink-0">
                    <span className="inline-block rounded-full border border-border px-2.5 py-0.5 text-sm text-muted-foreground tabular-nums">
                      {edu.year}
                    </span>
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
