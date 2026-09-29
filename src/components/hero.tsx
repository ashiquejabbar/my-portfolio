import Image from "next/image";
import { Download, Mail } from "lucide-react";
import { siWhatsapp } from "simple-icons";
import { CV_PATH, personalInfo, contactInfo } from "@/lib/data";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import StackGrid from "@/components/stack-grid";
import HeroBackdrop from "@/components/hero-backdrop";
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

export default function Hero({ dict }: { dict: Dictionary }) {
  const t = dict.hero;
  return (
    <section id="home" className="relative isolate pt-24 pb-20 md:pt-28 md:pb-24">
      <HeroBackdrop />
      <div className="section-container grid gap-14 lg:grid-cols-12 lg:gap-10 items-start">
        <div className="lg:col-span-7">
          <h1 className="type-condensed font-semibold text-[3rem] leading-[0.95] sm:text-[4rem] lg:text-[4.5rem] text-foreground">
            {t.headline.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
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

          <Reveal delay={0.6} className="mt-7 flex flex-wrap gap-3">
            <a
              href={`mailto:${contactInfo.email}`}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/85 transition-colors"
            >
              <Mail size={17} aria-hidden="true" />
              {t.emailMe}
            </a>
            <a
              href={CV_PATH}
              download="ashique_pj_cv.pdf"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-md border border-foreground/20 text-foreground font-medium hover:border-foreground/50 transition-colors"
            >
              <Download size={17} aria-hidden="true" />
              {dict.common.downloadCv}
              {dict.common.cvLanguageNote && (
                <span className="font-normal text-muted-foreground">{dict.common.cvLanguageNote}</span>
              )}
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.whatsappLabel}
              className="grid place-items-center size-11 rounded-md border border-foreground/20 text-foreground hover:border-foreground/50 transition-colors"
            >
              <BrandIcon icon={siWhatsapp} />
            </a>
            <a
              href={contactInfo.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.linkedinLabel}
              className="grid place-items-center size-11 rounded-md border border-foreground/20 text-foreground hover:border-foreground/50 transition-colors"
            >
              <LinkedInIcon />
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.25} className="lg:col-span-5 lg:pt-3">
          <StackGrid title={t.stackTitle} />

          {/* Proof points, taken from the CV */}
          <Reveal delay={0.7} className="mt-6">
            <dl className="grid grid-cols-2 gap-px rounded-xl overflow-hidden border border-border bg-border">
              {t.proofPoints.map((p) => (
                <div key={p.label} className="bg-background px-4 py-3">
                  <dt className="sr-only">{p.label}</dt>
                  <dd>
                    <span className="block font-heading type-condensed text-3xl font-semibold text-foreground tabular-nums">
                      {p.value}
                    </span>
                    <span className="block text-sm text-muted-foreground leading-snug">{p.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Reveal>
      </div>
    </section>
  );
}
