import Image from "next/image";
import { Download, Mail } from "lucide-react";
import { siWhatsapp, type SimpleIcon } from "simple-icons";
import { personalInfo, contactInfo } from "@/lib/data";
import StackGrid from "@/components/stack-grid";
import NamePronunciation from "@/components/name-pronunciation";

const proofPoints = [
  { value: "5+", label: "years in React and Next.js" },
  { value: "500+", label: "daily users on a government platform" },
  { value: "11", label: "user roles in one RBAC system" },
  { value: "5+", label: "client projects on shared UI libraries" },
];

const whatsappUrl = `https://wa.me/${contactInfo.phone.replace(/\D/g, "")}`;

function BrandIcon({ icon }: { icon: SimpleIcon }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}

// simple-icons doesn't ship LinkedIn; this is the mark the site used before
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const headline = ["I build the interfaces", "enterprise teams", "rely on."];

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

export default function Hero() {
  return (
    <section id="home" className="pt-24 pb-20 md:pt-28 md:pb-24">
      <div className="section-container grid gap-14 lg:grid-cols-12 lg:gap-10 items-start">
        <div className="lg:col-span-7">
          <h1 className="type-condensed font-semibold text-[3rem] leading-[0.95] sm:text-[4rem] lg:text-[4.5rem] text-foreground">
            {headline.map((line, i) => (
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
                <NamePronunciation name={personalInfo.name} />
              </div>
              <p className="text-muted-foreground text-sm">
                Frontend developer in Dubai, UAE. React, Next.js and AI integration
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.5} className="mt-5 max-w-[60ch] space-y-3 text-muted-foreground">
            <p>
              Five years of React, Next.js and TypeScript, building enterprise platforms
              for government and private sectors across India and the Middle East: role-based
              access with biometric verification, an AI property search for the Dubai market,
              and a networking app across web and mobile.
            </p>
            <p>
              I also build AI features into web apps using the OpenAI, Claude and Google
              Gemini APIs, like the AI-driven search and recommendations behind kyna.ai.
            </p>
            <p className="flex items-center gap-2 text-dune font-medium">
              <span className="size-2 rounded-full bg-dune-soft" aria-hidden="true" />
              Available to join immediately, in Dubai on a visit visa
            </p>
          </Reveal>

          <Reveal delay={0.6} className="mt-7 flex flex-wrap gap-3">
            <a
              href={`mailto:${contactInfo.email}`}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/85 transition-colors"
            >
              <Mail size={17} aria-hidden="true" />
              Email me
            </a>
            <a
              href="/Ashique_PJ_Dubai_CV.pdf"
              download="ashique_pj_cv.pdf"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-md border border-foreground/20 text-foreground font-medium hover:border-foreground/50 transition-colors"
            >
              <Download size={17} aria-hidden="true" />
              Download CV
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Message on WhatsApp"
              className="grid place-items-center size-11 rounded-md border border-foreground/20 text-foreground hover:border-foreground/50 transition-colors"
            >
              <BrandIcon icon={siWhatsapp} />
            </a>
            <a
              href={contactInfo.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="grid place-items-center size-11 rounded-md border border-foreground/20 text-foreground hover:border-foreground/50 transition-colors"
            >
              <LinkedInIcon />
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.25} className="lg:col-span-5 lg:pt-3">
          <StackGrid />

          {/* Proof points, taken from the CV */}
          <Reveal delay={0.7} className="mt-6">
            <dl className="grid grid-cols-2 gap-px rounded-xl overflow-hidden border border-border bg-border">
              {proofPoints.map((p) => (
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
