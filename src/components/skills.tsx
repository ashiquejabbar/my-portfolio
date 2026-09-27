import { skills } from "@/lib/data";
import SectionHeading from "@/components/section-heading";

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="py-20 md:py-28 border-t border-border">
      <div className="section-container">
        <SectionHeading id="skills-title" title="Tools I work with" />
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 gap-y-12">
          {skills.map((skill) => (
            <div key={skill.category}>
              <h3 className="text-lg font-semibold pb-3">{skill.category}</h3>
              {/* Rule draws in as the column scrolls into view (CSS, see .scroll-draw) */}
              <div className="h-px bg-border scroll-draw" aria-hidden="true" />
              <ul className="mt-3 space-y-1.5 text-muted-foreground">
                {skill.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
