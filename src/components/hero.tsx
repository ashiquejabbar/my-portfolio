import Image from "next/image";
import { Mail } from "lucide-react";
import { siWhatsapp } from "simple-icons";
import { personalInfo, contactInfo } from "@/lib/data";
import CvButton from "@/components/cv-button";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import HeroBackdrop from "@/components/hero-backdrop";
import CodeStage from "@/components/code-stage";
import { StackRow } from "@/components/stack-grid";
import NamePronunciation from "@/components/name-pronunciation";
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

// Shared shape of the contact buttons, and the outline style of the secondary ones
const cta = "hero-cta inline-flex items-center justify-center h-11 rounded-md font-medium";
const outline = "border border-foreground/20 hover:border-foreground/50";

export default function Hero({ dict }: { dict: Dictionary }) {
  const t = dict.hero;
  return (
    <section id="home" className="relative isolate pt-24 pb-20 md:pt-28 md:pb-24">
      <HeroBackdrop />
      <div className="section-container grid gap-14 lg:grid-cols-12 lg:gap-10 items-start">
        <div className="lg:col-span-7">
          <h1 className="type-condensed font-semibold text-[3rem] leading-[0.95] sm:text-[4rem] lg:text-[4.5rem] text-foreground">
            {t.headline.map((line, i) => (
              <span key={line} className="block">
                {/* CSS rather than JS so the headline shows even before hydration */}
                <span className="block line-rise" style={{ animationDelay: `${50 + i * 90}ms` }}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          {/* z-10 keeps the voice menu above the animated paragraphs below, which form their own layers */}
          <Reveal delay={0.4} className="relative z-10 mt-7 flex items-center gap-4">
            <Image
              src={personalInfo.photo}
              alt=""
              width={56}
              height={56}
              priority
              className="size-14 rounded-full object-cover object-top border border-border"
            />
            <div>
              {/* div, not p: the voice picker inside holds a menu, which a <p> can't contain */}
              <div className="flex items-center gap-1 font-medium text-foreground">
                {personalInfo.name}
                <NamePronunciation name={personalInfo.name} t={dict.pronounce} />
              </div>
              <p className="text-muted-foreground text-sm">
                {t.roleLine}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.5} className="mt-5 max-w-[60ch] space-y-3 text-muted-foreground">
            <p>{t.intro}</p>
            <p>{t.ai}</p>
            <p className="flex items-center gap-2 text-dune font-medium">
              <span className="size-2 rounded-full bg-dune-soft" aria-hidden="true" />
              {t.available}
            </p>
          </Reveal>

          {/* Each button rises in on its own beat; hover/press motion lives in globals.css (.hero-cta) */}
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={`mailto:${contactInfo.email}`}
              className={`${cta} hero-cta-primary fade-rise group gap-2 px-5 bg-primary text-primary-foreground`}
              style={{ animationDelay: "0.6s" }}
            >
              <Mail size={17} aria-hidden="true" className="hero-cta-mail" />
              {t.emailMe}
            </a>
            <CvButton
              common={dict.common}
              showNote
              iconSize={17}
              className={`${cta} ${outline} fade-rise gap-2 px-5 text-foreground [animation-delay:0.68s]`}
            />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.whatsappLabel}
              title="WhatsApp"
              className={`${cta} ${outline} hero-cta-brand fade-rise size-11 text-foreground`}
              style={{ "--brand": "#25d366", animationDelay: "0.76s" } as React.CSSProperties}
            >
              <BrandIcon icon={siWhatsapp} />
            </a>
            <a
              href={contactInfo.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.linkedinLabel}
              title="LinkedIn"
              className={`${cta} ${outline} hero-cta-brand fade-rise size-11 text-foreground`}
              style={{ "--brand": "#0a66c2", animationDelay: "0.84s" } as React.CSSProperties}
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
