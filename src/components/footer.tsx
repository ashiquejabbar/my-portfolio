import Link from "next/link";
import { contactInfo } from "@/lib/data";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

export default function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="bg-panel text-panel-foreground/60 border-t border-panel-foreground/10 py-8 text-sm">
      <div className="scroll-reveal section-container flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p>
            © {new Date().getFullYear()} Ashique PJ. {dict.footer.builtWith}
          </p>
          {/* Translated pages say so, so nobody assumes Ashique speaks the language */}
          {locale !== defaultLocale && (
            <p>
              {dict.language.translatedNote}{" "}
              <Link
                href="/"
                hrefLang="en"
                className="underline underline-offset-4 hover:text-panel-foreground transition-colors focus-visible:outline-panel-accent"
              >
                {dict.language.readInEnglish}
              </Link>
            </p>
          )}
        </div>
        <div className="flex gap-5">
          <a
            href={contactInfo.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-panel-foreground transition-colors focus-visible:outline-panel-accent"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${contactInfo.email}`}
            className="hover:text-panel-foreground transition-colors focus-visible:outline-panel-accent"
          >
            {dict.common.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
