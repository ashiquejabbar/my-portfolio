import { skills } from "@/lib/data";
import SectionHeading from "@/components/section-heading";

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="py-20 md:py-28 border-t border-border">
      <div className="section-container">
        <SectionHeading id="skills-title" title="Tools I work with" />
        {/* One row per category, like the CV's skills table: no half-empty cards, easy to scan down the left */}
        <dl className="border-b border-border">
          {skills.map((skill) => (
            <div
              key={skill.category}
              className="grid gap-3 border-t border-border py-5 md:grid-cols-[13rem_1fr] md:gap-8"
            >
              <dt className="font-semibold text-foreground md:pt-1">{skill.category}</dt>
              <dd>
                <ul className="flex flex-wrap gap-2" aria-label={skill.category}>
                  {skill.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-md border border-border bg-card px-2.5 py-1 text-sm leading-snug text-foreground/85"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
