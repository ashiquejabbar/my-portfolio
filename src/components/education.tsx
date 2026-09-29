import type { Dictionary } from "@/lib/i18n/dictionaries/en";

export default function Education({ t, sep }: { t: Dictionary["education"]; sep: string }) {
  return (
    <section id="education" aria-labelledby="education-title" className="py-14 border-t border-border">
      <div className="section-container grid gap-6 lg:grid-cols-12">
        <h2 id="education-title" className="lg:col-span-4 text-xl font-semibold">
          {t.title}
        </h2>
        <ul className="lg:col-span-8 space-y-4">
          {t.items.map((edu) => (
            <li key={edu.degree} className="sm:flex sm:items-baseline sm:justify-between sm:gap-6">
              <p>
                <span className="font-medium">{edu.degree}</span>
                <span className="text-muted-foreground">
                  {sep}
                  {edu.institution}
                </span>
              </p>
              <p className="text-sm text-muted-foreground tabular-nums shrink-0">{edu.year}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
