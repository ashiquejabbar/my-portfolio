import { skills } from "@/lib/data";
import SectionHeading from "@/components/section-heading";

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="py-20 md:py-28 border-t border-border">
      <div className="section-container">
        <SectionHeading id="skills-title" title="Tools I work with" />
        {/* Nine categories fill an even 3×3 grid; tags wrap instead of stacking into one tall column */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <div key={skill.category} className="rounded-xl bg-card border border-border p-5">
              <h3 className="text-base font-semibold">{skill.category}</h3>
              <ul className="mt-3 flex flex-wrap gap-2" aria-label={skill.category}>
                {skill.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-border bg-background px-2.5 py-1 text-sm leading-snug text-muted-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
