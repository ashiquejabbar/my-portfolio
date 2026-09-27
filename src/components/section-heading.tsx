interface SectionHeadingProps {
  title: string;
  id?: string;
}

// Same motion as the hero headline, driven by scroll in CSS (globals.css .scroll-rise),
// so the heading is visible without JS and simply static where scroll timelines aren't supported
export default function SectionHeading({ title, id }: SectionHeadingProps) {
  return (
    <h2
      id={id}
      className="text-[2rem] sm:text-[2.5rem] leading-tight font-semibold tracking-[-0.01em] mb-10 overflow-hidden pb-[0.08em]"
    >
      <span className="block scroll-rise">{title}</span>
    </h2>
  );
}
