import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import MotionProvider from "@/components/motion-provider";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
});

const body = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ashiquedev.netlify.app"),
  title: "Ashique PJ — Frontend Developer in Dubai, UAE | React & Next.js",
  description:
    "Frontend Developer in Dubai, UAE with 5+ years of React.js, Next.js and TypeScript. Enterprise and government platforms, RBAC, and AI integrations with OpenAI, Claude and Gemini. Available to join immediately.",
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
    canonical: "/",
  },
  openGraph: {
    title: "Ashique PJ — Frontend Developer in Dubai, UAE",
    description:
      "5+ years of React, Next.js and TypeScript on enterprise and government platforms. Available to join immediately in Dubai.",
    type: "profile",
    locale: "en_AE",
    url: "/",
    siteName: "Ashique PJ — Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashique PJ — Frontend Developer in Dubai, UAE",
    description:
      "5+ years of React, Next.js and TypeScript on enterprise and government platforms. Available to join immediately in Dubai.",
  },
};

export const viewport: Viewport = {
  themeColor: "#eef2f6",
};

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-theme is set by themeInitScript before hydration, so the server markup won't match it
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
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
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-primary focus:text-primary-foreground focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}

