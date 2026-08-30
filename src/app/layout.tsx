import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Outfit } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ashiquepj.dev"),
  title: "Ashique PJ — Frontend Developer | React.js & Next.js Specialist",
  description:
    "Frontend Developer with 5+ years of experience building high-performance web applications using React.js, Next.js, and TypeScript. Based in Dubai, UAE.",
  keywords: [
    "Frontend Developer",
    "React.js",
    "Next.js",
    "TypeScript",
    "Dubai",
    "Web Developer",
    "Ashique PJ",
  ],
  authors: [{ name: "Ashique PJ" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ashique PJ — Frontend Developer",
    description:
      "Frontend Developer with 5+ years of experience building high-performance web applications.",
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Ashique PJ — Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashique PJ — Frontend Developer",
    description:
      "Frontend Developer with 5+ years of experience building high-performance web applications.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ashique PJ",
  jobTitle: "Frontend Developer",
  description:
    "Frontend Developer with 5+ years of experience building high-performance web applications using React.js, Next.js, and TypeScript.",
  url: "https://ashiquepj.dev",
  email: "ashiquejabbar007@gmail.com",
  telephone: "+971505619899",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dubai",
    addressCountry: "UAE",
  },
  sameAs: ["https://www.linkedin.com/in/ashique-pj/"],
  knowsAbout: [
    "React.js",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Frontend Development",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${outfit.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Skip to content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-white focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}

