import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans_Arabic, Instrument_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import MotionProvider from "@/components/motion-provider";
import { themeColors, themeInitScript } from "@/lib/theme";
import { isLocale, localeDir, localePath, locales, ogLocales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import "../globals.css";

// The CSS in globals.css composes these into --font-body / --font-display (Arabic first on /ar)
const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
});

const body = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

// Not preloaded: only the Arabic page uses it, so other languages never download it
const arabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});

// All five languages are prerendered; anything else under /[lang] is a 404
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { meta } = await getDictionary(lang);
  // Ready-made files (public/og/), not generated per request: WhatsApp drops images that load slowly.
  // Bump ?v= when the images change, so apps that cached the old one fetch it again.
  const shareImage = { url: `/og/${lang}.jpg?v=4`, width: 1200, height: 630, alt: meta.ogImageAlt, type: "image/jpeg" };

  return {
    metadataBase: new URL("https://ashiquedev.netlify.app"),
    title: meta.title,
    description: meta.description,
    keywords: [
      "Frontend Developer Dubai",
      "Frontend Developer UAE",
      "React Developer Dubai",
      "Next.js Developer Dubai",
      "React Developer UAE",
      "Frontend Developer",
      "React.js",
      "Next.js",
      "TypeScript",
      "Dubai",
      "Abu Dhabi",
      "Web Developer",
      "AI Integration",
      "OpenAI API",
      "Claude API",
      "Google Gemini API",
      "Ashique PJ",
    ],
    authors: [{ name: "Ashique PJ" }],
    alternates: {
      canonical: localePath(lang),
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, localePath(l)])),
        "x-default": "/",
      },
    },
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      type: "profile",
      locale: ogLocales[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocales[l]),
      url: localePath(lang),
      siteName: "Ashique PJ — Portfolio",
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.ogTitle,
      description: meta.ogDescription,
      images: [shareImage],
    },
  };
}

export const viewport: Viewport = {
  themeColor: themeColors.dark,
};

// Structured data stays in English: it's read by search engines, not people
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ashique PJ",
  jobTitle: "Frontend Developer",
  description:
    "Frontend Developer in Dubai, UAE with 5+ years of experience building enterprise web applications using React.js, Next.js, and TypeScript.",
  url: "https://ashiquedev.netlify.app",
  image: "https://ashiquedev.netlify.app/Ashique.JPG",
  email: "ashiquejabbar007@gmail.com",
  telephone: "+971505619899",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
  nationality: { "@type": "Country", name: "India" },
  // The languages Ashique speaks, not the ones the site is translated into
  knowsLanguage: ["English", "Malayalam"],
  alumniOf: { "@type": "CollegeOrUniversity", name: "Mahatma Gandhi University, Kerala" },
  hasOccupation: {
    "@type": "Occupation",
    name: "Frontend Developer",
    occupationLocation: { "@type": "City", name: "Dubai" },
    skills: "React.js, Next.js, TypeScript, Tailwind CSS, Zustand, TanStack Query, Micro Frontends, AI integration",
  },
  sameAs: ["https://www.linkedin.com/in/ashique-pj/"],
  knowsAbout: [
    "React.js",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Frontend Development",
    "AI Integration",
    "OpenAI API",
    "Claude API",
    "Google Gemini API",
  ],
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    // Dark by default (also without JS); themeInitScript swaps in a saved choice before hydration,
    // so the server markup may not match it
    <html
      lang={lang}
      dir={localeDir(lang)}
      data-theme="dark"
      className={`${display.variable} ${body.variable} ${arabic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      {/* Browser extensions inject attributes on <body>; don't treat that as a hydration error */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/* Skip to content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-primary focus:text-primary-foreground focus:text-sm focus:font-medium"
        >
          {dict.common.skipToContent}
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
