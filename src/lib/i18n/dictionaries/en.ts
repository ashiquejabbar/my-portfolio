// English source text. Every other dictionary must match this shape (`satisfies Dictionary`).
// Tech and product names stay in English in every language. {placeholders} are filled by t().

const en = {
  meta: {
    title: "Ashique PJ — Frontend Developer in Dubai, UAE | React & Next.js",
    description:
      "Frontend Developer in Dubai, UAE with 5+ years of React.js, Next.js and TypeScript. Enterprise and government platforms, RBAC, and AI integrations with OpenAI, Claude and Gemini. Available to join immediately.",
    ogTitle: "Ashique PJ — Frontend Developer in Dubai, UAE",
    ogDescription:
      "5+ years of React, Next.js and TypeScript on enterprise and government platforms. Available to join immediately in Dubai.",
    ogImageAlt: "Ashique PJ, Frontend Developer in Dubai",
    ogTagline: "Frontend developer in Dubai. React, Next.js and AI integration",
    ogAvailable: "Available to join immediately in Dubai, UAE",
  },
  common: {
    // Between two items in one line ("React Developer, Floges"); Arabic has its own comma
    separator: ", ",
    skipToContent: "Skip to main content",
    downloadCv: "Download CV",
    // Empty in English; other languages say the CV itself is in English
    cvLanguageNote: "",
    email: "Email",
  },
  language: {
    label: "Language",
    // Empty in English; other languages show it in the footer
    translatedNote: "",
    readInEnglish: "Read in English",
    menuNote: "English is the original. Other languages are translated with AI.",
    aiLabel: "AI-translated",
    noticeTitle: "Translated with AI",
    noticeBody: "This page was translated from English with AI. The English version is the original.",
    close: "Close",
  },
  nav: {
    main: "Main",
    work: "Work",
    projects: "Projects",
    skills: "Skills",
    contact: "Contact",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  theme: {
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
  },
  hero: {
    headline: ["I build the interfaces", "enterprise teams", "rely on."],
    roleLine: "Frontend developer in Dubai, UAE. React, Next.js and AI integration",
    intro:
      "Five years of React, Next.js and TypeScript, building enterprise platforms for government and private sectors across India and the Middle East: role-based access with biometric verification, an AI property search for the Dubai market, and a networking app across web and mobile.",
    ai: "I also build AI features into web apps using the OpenAI, Claude and Google Gemini APIs, like the AI-driven search and recommendations behind kyna.ai.",
    available: "Relocated from India to Dubai. Available to join immediately, on a visit visa",
    emailMe: "Email me",
    whatsappLabel: "Message on WhatsApp",
    linkedinLabel: "LinkedIn profile",
    stackTitle: "What I build with",
  },
  pronounce: {
    title: "Hear my name",
    buttonTitle: "Hear how to pronounce my name",
    buttonLabel: "Hear how to pronounce {name}",
    buttonLabelVoice: "Hear how to pronounce {name} ({voice}, {detail} voice)",
    chooseVoice: "Choose a voice",
    hint: "Pick a voice. Your choice is remembered.",
    similarVoice: "Similar voice on this device",
    voices: {
      "en-IN": { label: "Indian English", detail: "Female · India" },
      "en-GB-f": { label: "British English", detail: "Female · United Kingdom" },
      "en-GB-m": { label: "British English", detail: "Male · United Kingdom" },
      "en-US": { label: "American English", detail: "Male · United States" },
      "en-AU": { label: "Australian English", detail: "Female · Australia" },
      ar: { label: "Arabic", detail: "Male · Arabic (عاشِق)" },
    },
  },
  experience: {
    title: "Where I’ve worked",
    showFewer: "Show fewer",
    showAll: "Show all {count}",
    // Same order as `experiences` in src/lib/data.ts
    roles: [
      {
        title: "React Developer",
        location: "India (clients in UAE and Middle East)",
        period: "Sep 2022 – Apr 2026",
        highlights: [
          "Architected RBAC for government document management platforms with up to 11 user roles, biometric verification (iris, fingerprint, facial recognition), and multi-level approval workflows, serving 500+ daily users.",
          "Built bilingual Arabic/English interfaces with full RTL/LTR layout switching for UAE government and enterprise clients.",
          "Created reusable component libraries with React.js and TypeScript (Material-UI, Tailwind CSS, shadcn/ui) shared across 5+ client projects, speeding up UI delivery and keeping design consistent.",
          "Implemented Micro Frontend architecture with Webpack Module Federation, splitting monolithic applications into independently deployable modules so teams could develop and release in parallel.",
          "Optimized page load performance using code splitting, lazy loading, memoization, and Webpack tuning, reducing initial bundle size and improving Core Web Vitals.",
          "Integrated authentication APIs using JWT, OAuth 2.0, and Supabase, handling login flows, protected routes, and role-based UI access.",
          "Connected REST APIs with TanStack Query caching, optimistic UI updates, and WebSocket features for live notifications, chat, and collaborative workflows.",
          "Set up CI/CD pipelines with GitHub Actions to automate testing and deployment.",
        ],
      },
      {
        title: "Python Developer",
        location: "India",
        period: "Mar 2021 – Aug 2022",
        highlights: [
          "Developed and maintained client web applications with React.js on the frontend and RESTful APIs with Python and Django on the backend.",
          "Designed and optimized MySQL schemas and queries, improving query response times and data integrity.",
        ],
      },
    ],
  },
  projects: {
    title: "Selected projects",
    client: "Client",
    builtWith: "Built with",
    visit: "Visit {host}",
    private: "Private client system, not publicly available.",
    // Badge on projects with a public site
    live: "Live",
    // Same order as `projects` in src/lib/data.ts
    items: [
      {
        name: "IDMS",
        tagline: "Government Document Management System",
        description: "Bilingual document management for government operations.",
        context: "Middle East government project",
        highlights: [
          "Developed bilingual Arabic/English UI with RTL support for secure document handling and role-based data visibility.",
          "Integrated iris, fingerprint, and facial recognition SDKs for identity verification.",
        ],
      },
      {
        name: "Sinyar",
        tagline: "Access Management System",
        description: "Access management for company and employee workflows.",
        context: "Abu Dhabi, UAE",
        highlights: [
          "Designed RBAC with 5 user roles for company and employee workflow management with multi-level approvals.",
          "Built bilingual Arabic/English (RTL) dynamic forms and approval dashboards.",
        ],
      },
      {
        name: "kyna.ai",
        tagline: "AI Property Finder",
        description: "AI-driven property search for the Dubai real estate market.",
        context: "Dubai, UAE",
        highlights: [
          "Developed an AI-driven property search platform for the Dubai real estate market with an intelligent recommendation engine and SEO-optimized server-side rendering.",
          "Integrated property listing APIs and a lead management system for channel partners, enabling real-time property matching for agents.",
        ],
      },
      {
        name: "Orbin",
        tagline: "Professional Networking Platform",
        description: "LinkedIn-style networking platform across web and mobile.",
        context: "",
        highlights: [
          "Built a LinkedIn-style networking platform for web and mobile with consultation booking, real-time messaging, and push notifications.",
          "Reduced redundant API calls with TanStack Query caching and WebSocket-based notifications, improving app responsiveness.",
        ],
      },
      {
        name: "Virtual Optical Store",
        tagline: "AI-Powered Eyewear E-Commerce",
        description: "Eyewear e-commerce with an AI-powered virtual try-on.",
        context: "",
        highlights: [
          "Developed an e-commerce platform with Virtual Try-On using MediaPipe FaceMesh for real-time glasses fitting.",
          "Implemented role-based access for 4 user types (Admin, Optician, Salesman, Customer) with a responsive cross-device UI.",
        ],
      },
    ],
  },
  skills: {
    title: "Tools I work with",
    // Keyed by the category ids in src/lib/data.ts
    categories: {
      frontend: "Frontend",
      ui: "UI Libraries",
      state: "State and Data",
      security: "Security",
      ai: "AI Integration",
      backend: "Backend",
      devops: "DevOps and Tools",
      testing: "Testing",
      uiux: "UI/UX",
    },
    // Skill names that are words rather than product names; anything not listed shows as-is
    terms: {
      "Micro Frontends": "Micro Frontends",
      "RESTful APIs": "RESTful APIs",
      "JWT Authentication": "JWT Authentication",
      "Role-Based Access Control (RBAC)": "Role-Based Access Control (RBAC)",
      "Biometric SDK Integration": "Biometric SDK Integration",
      "CI/CD Pipelines": "CI/CD Pipelines",
      "End-to-End Testing": "End-to-End Testing",
      "Cross-Browser Testing": "Cross-Browser Testing",
      "Arabic/English RTL Layouts": "Arabic/English RTL Layouts",
      "Responsive Design": "Responsive Design",
      "WCAG/ARIA Accessibility": "WCAG/ARIA Accessibility",
      "Semantic HTML": "Semantic HTML",
    },
  },
  education: {
    title: "Education",
    items: [
      {
        degree: "Bachelor of Computer Applications (BCA)",
        institution: "MG University, Kerala, India",
        year: "2017 – 2020",
      },
      { degree: "Certified Python Developer", institution: "Nordic Academy", year: "2021" },
    ],
  },
  contact: {
    title: "Hiring a frontend developer in Dubai?",
    lead: "I can start immediately. Email is the quickest way to reach me.",
    copyEmail: "Copy email",
    emailCopied: "Email copied",
    copiedAnnouncement: "Email address copied to clipboard",
    phone: "Phone",
    whatsapp: "WhatsApp",
    messageMe: "Message me",
    linkedin: "LinkedIn",
    basedIn: "Based in",
    location: "Dubai, UAE",
    status: "Status",
    visaStatus: "UAE Visit Visa — Available to join immediately",
    languages: "Languages",
    languageList: "English, Malayalam (Native)",
    nationality: "Nationality",
    nationalityValue: "Indian",
  },
  hire: {
    label: "Interview availability",
    title: "Hiring a frontend developer?",
    body: "I’m available to join immediately and can interview this week, in person in Dubai or online.",
    cta: "Schedule an interview",
    whatsapp: "WhatsApp",
    close: "Dismiss",
  },
  footer: {
    builtWith: "Built with Next.js.",
  },
  intro: {
    play: "Play intro",
    close: "Close intro",
    dialogLabel: "Intro: {name}, Frontend Developer",
    badge: "Immediate joiner · Dubai, UAE",
    role: "Frontend Developer — React.js and Next.js Specialist",
    skillsLabel: "Frontend skills",
    techLabel: "Tech I work with",
    // The role line already names React.js and Next.js, so the chips show the other frontend strengths
    skills: ["TypeScript", "Tailwind CSS", "Micro Frontends", "Arabic/English RTL", "AI Integration"],
    copy: "Copy",
    copied: "Copied!",
    copyLabel: "Copy email address",
  },
};

export type Dictionary = typeof en;
export default en;
