import { Fragment } from "react";
import Image from "next/image";
import { BadgeCheck, Briefcase, CalendarCheck, MapPin, type LucideIcon } from "lucide-react";
import { siWhatsapp } from "simple-icons";
import { personalInfo, contactInfo } from "@/lib/data";
import CvButton from "@/components/cv-button";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import HeroBackdrop from "@/components/hero-backdrop";
import CodeStage from "@/components/code-stage";
import { StackRow } from "@/components/stack-grid";
import NamePronunciation from "@/components/name-pronunciation";
import EmailChip, { EmailCta } from "@/components/email-chip";
import { BrandIcon, LinkedInIcon, whatsappUrl } from "@/components/brand-icons";

// CSS animation (globals.css) so hero content is visible even before JS hydrates
function Reveal({
  children,
  delay,
  className = "",
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <div className={`fade-rise ${className}`} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

// Icon per quick fact, same order as Dictionary["hero"]["facts"]: location, visa, start date, experience
const factIcons: LucideIcon[] = [MapPin, BadgeCheck, CalendarCheck, Briefcase];

// Shared shape of the contact buttons, and the outline style of the secondary ones
// Email me inside the connected pill: rounded to match, with the lift and shine of .hero-cta
const cta = "hero-cta inline-flex items-center justify-center h-10 rounded-full font-medium";
// The other pill items: no border of their own, a soft background on hover
const pillItem =
  "inline-flex items-center justify-center h-10 rounded-full font-medium text-foreground transition-colors hover:bg-foreground/10 active:scale-[0.97]";

export default function Hero({ dict }: { dict: Dictionary }) {
  const t = dict.hero;
  let word = 0;
  return (
    <section id="home" className="relative isolate pt-24 pb-20 md:pt-28 md:pb-24">
      <HeroBackdrop />
      <div className="section-container grid gap-14 lg:grid-cols-12 lg:gap-10 items-start">
        <div className="lg:col-span-7">
          {/* Photo beside the name and role, above the headline. z-10 keeps the voice menu above the
              animated headline and paragraphs below, which form their own layers */}
          <Reveal delay={0.05} className="relative z-10 mb-8 flex items-center gap-4">
            <Image
              // The navbar watches this photo: once it scrolls away, a small copy slides in beside the name
              id="hero-photo"
              src={personalInfo.photo}
              alt=""
              width={72}
              height={72}
              priority
              className="size-[4.5rem] shrink-0 rounded-full object-cover object-top border border-border"
            />
            <div className="min-w-0">
              {/* div, not p: the voice picker inside holds a menu, which a <p> can't contain */}
              <div className="flex items-center gap-1 font-medium text-foreground">
                {personalInfo.name}
                <NamePronunciation name={personalInfo.name} t={dict.pronounce} />
              </div>
              <p className="mt-0.5 max-w-[46ch] text-muted-foreground text-sm leading-relaxed">
                {t.roleLine}
              </p>
              {/* Quick facts a recruiter looks for first: location, visa, start date, experience */}
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {t.facts.map((fact, i) => {
                  const Icon = factIcons[i] ?? BadgeCheck;
                  const isStart = i === 2;
                  return (
                    <li
                      key={fact}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                        isStart
                          ? "border-dune-soft/40 bg-dune-soft/10 text-dune"
                          : "border-border bg-card/60 text-foreground/85"
                      }`}
                    >
                      <Icon size={13} aria-hidden="true" className={isStart ? "" : "text-primary"} />
                      {fact}
                    </li>
                  );
                })}
                <EmailChip t={dict.contact} />
              </ul>
            </div>
          </Reveal>

          <h1 className="type-condensed font-semibold text-[3rem] leading-[0.95] sm:text-[4rem] lg:text-[4.5rem] text-foreground">
            {t.headline.map((line) => (
              <span key={line} className="block">
                {/* Each word comes into focus in turn. CSS rather than JS so the headline shows even before hydration */}
                {line.split(" ").map((w, j) => {
                  const delay = 120 + word++ * 70;
                  return (
                    <Fragment key={j}>
                      {j > 0 && " "}
                      <span className="line-rise" style={{ animationDelay: `${delay}ms` }}>
                        {w}
                      </span>
                    </Fragment>
                  );
                })}
              </span>
            ))}
          </h1>

          {/* One short paragraph, so the contact buttons below fit on the first screen */}
          <Reveal delay={0.55} className="mt-6 max-w-[60ch] text-muted-foreground">
            <p>
              {/* Words wrapped in **double stars** in the dictionary are highlighted */}
              {t.summary.split(/\*\*(.+?)\*\*/).map((part, i) =>
                i % 2 ? (
                  <strong key={i} className="font-semibold text-foreground">
                    {part}
                  </strong>
                ) : (
                  part
                ),
              )}
            </p>
          </Reveal>

          {/* Connected pill: all four contact actions in one glass bar, Email me highlighted. Rises in as one
              piece (CSS, so it shows before hydration); hover motion lives in globals.css (.hero-cta) */}
          <div
            className="fade-rise mt-7 inline-flex max-w-full flex-wrap items-center gap-1 rounded-3xl sm:rounded-full border border-foreground/12 bg-foreground/[0.04] p-1 backdrop-blur-md"
            style={{ animationDelay: "0.6s" }}
          >
            <EmailCta t={dict.contact} className={`${cta} hero-cta-primary bg-primary text-primary-foreground`} />
            <CvButton
              common={dict.common}
              showNote
              iconSize={17}
              className={`${pillItem} gap-2 px-4`}
            />
            <span className="mx-0.5 h-5 w-px bg-foreground/15" aria-hidden="true" />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.whatsappLabel}
              title="WhatsApp"
              className={`${pillItem} hero-cta-brand size-10`}
              style={{ "--brand": "#25d366" } as React.CSSProperties}
            >
              <BrandIcon icon={siWhatsapp} />
            </a>
            <a
              href={contactInfo.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.linkedinLabel}
              title="LinkedIn"
              className={`${pillItem} hero-cta-brand size-10`}
              style={{ "--brand": "#0a66c2" } as React.CSSProperties}
            >
              <LinkedInIcon />
            </a>
          </div>
        </div>

        <Reveal delay={0.25} className="lg:col-span-5 lg:pt-3">
          <StackRow title={t.stackTitle} />
          <CodeStage />
        </Reveal>
      </div>
    </section>
  );
}
