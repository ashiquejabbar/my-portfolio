// English source text. Every other dictionary must match this shape (`satisfies Dictionary`).
// Tech and product names stay in English in every language. {placeholders} are filled by t().

const en = {
  meta: {
    title: "Ashique PJ — Full Stack & AI/LLM Developer in Dubai, UAE | Next.js SSR, LLMs & Node.js",
    description:
      "Full Stack & AI/LLM Developer in Dubai, UAE. 5+ years building server-rendered Next.js (SSR/SSG) apps with React and TypeScript and LLM-powered features with the OpenAI, Claude and Gemini APIs, backed by Node.js and MongoDB. Enterprise and government platforms with RBAC. Available to join immediately.",
    ogTitle: "Ashique PJ — Full Stack & AI/LLM Developer in Dubai, UAE",
    ogDescription:
      "Server-rendered Next.js and LLM integration, with 5+ years of React, Node.js and TypeScript on enterprise and government platforms. Available to join immediately in Dubai.",
    ogImageAlt: "Ashique PJ, Full Stack & AI/LLM Developer in Dubai",
    ogTagline: "Full stack & AI/LLM developer in Dubai. React, Next.js, Node.js and LLM integration",
    ogAvailable: "Available to join immediately in Dubai, UAE",
  },
  common: {
    // Between two items in one line ("React Developer, Floges"); Arabic has its own comma
    separator: ", ",
    skipToContent: "Skip to main content",
    downloadCv: "Download CV",
    // Shown on the CV button for a moment after it is clicked
    cvDownloaded: "Downloaded",
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
    // Status chip next to the name, with the live time in Dubai
    openToWork: "Open to work · UAE",
    dubaiTime: "Local time in Dubai",
  },
  theme: {
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
  },
  hero: {
    headline: ["I build enterprise", "web apps with", "AI and LLMs built in."],
    roleLine: "Full stack developer (frontend and backend) in Dubai, UAE. React.js, Next.js, Node.js and AI/LLM integration",
    intro:
      "Five years of Next.js, React, TypeScript and Node.js, building enterprise platforms for government and private sectors across India and the Middle East: role-based access with biometric verification, an AI property search for the Dubai market, and a networking app across web and mobile.",
    ai: "I build generative AI features into web apps with the OpenAI, Claude and Google Gemini APIs: prompt design, structured JSON output, streaming responses and Node.js endpoints that keep API keys on the server. Examples include the natural-language property search behind kyna.ai and the AI profile-summary rewrite in Orbin.",
    available: "Relocated from India to Dubai. Available to join immediately, on a visit visa",
    // Short hero paragraph; **double stars** mark the highlighted words.
    // The longer intro and ai texts above stay: the AI chat reads them
    summary:
      "**Five years** of **Next.js**, **React**, TypeScript and **Node.js** on **enterprise and government platforms** across India and the Middle East. I add **AI/LLM features** with the OpenAI, Anthropic Claude and Google Gemini APIs, like the property search behind **kyna.ai** and a **procurement automation platform** for construction tenders.",
    // Quick facts under the name, in this order: location, visa, start date, experience
    facts: ["Dubai, UAE", "UAE visit visa", "Can join immediately", "5+ years experience"],
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
        title: "Full Stack Developer",
        location: "India (clients in UAE and Middle East)",
        period: "Sep 2022 – Apr 2026",
        highlights: [
          "Developed full stack apps for UAE and Middle East clients: Next.js (SSR) and TypeScript frontends with Arabic/English (RTL) support, and secure Node.js REST APIs on MongoDB, PostgreSQL and Supabase (JWT, OAuth 2.0).",
          "Integrated OpenAI, Claude and Gemini APIs into client products: custom prompts, structured JSON output and streamed responses.",
          "Architected access control for government document platforms: 11 user roles, biometric login and multi-level approvals, used by 500+ people daily.",
          "Deployed to AWS EC2 behind Nginx, with CI/CD pipelines on GitHub Actions.",
          "Delivered real-time chat and notifications with WebSockets and TanStack Query.",
          "Shipped React Native apps for iOS and Android alongside the web platforms.",
          "Created a reusable component library shared across 5+ client projects, speeding up UI delivery.",
          "Improved load times and Core Web Vitals with code splitting and lazy loading, and split large apps into micro frontends.",
        ],
      },
      {
        title: "Python Developer",
        location: "India",
        period: "Mar 2021 – Aug 2022",
        highlights: [
          "Developed client web apps with React frontends and Python/Django REST APIs.",
          "Designed and optimized MySQL schemas and queries, improving response times and data integrity.",
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
    // Screenshot captions and the label on each screenshot
    shots: { overview: "Dashboard: 5-step workflow and daily run", record: "One tile package with all 5 steps", lara: "Lara, the voice assistant, listening" },
    demoData: "Demo data",
    openFull: "opens full size",
    // Headings of the longer case study (only projects with a `problem` show them)
    caseLabels: { problem: "The problem", steps: "How it works", built: "What I built" },
    // Same order as `projects` in src/lib/data.ts
    items: [
      {
        name: "Procurement Automation Platform",
        tagline: "Construction Tendering",
        description: "AI and browser automation that runs a construction procurement team’s tendering workflow, from RFP documents to award letters.",
        context: "Construction sector, Dubai",
        problem: "The procurement team collected tender (RFP) documents from their project management system by hand, record by record. Then they wrote tile requirement lists, emailed suppliers, built comparison sheets in Excel and prepared the award documents. With thousands of tender records, this was slow, repetitive and easy to get wrong.",
        steps: [
          { title: "Collect RFP files", text: "A Playwright worker uses the user’s own browser sign-in, so no passwords are stored. It filters the procurement register by status and keywords and downloads only new or changed attachments into a cluster → project → package folder tree, every day at 07:00." },
          { title: "AI tile selection list", text: "Claude reads the RFP PDFs, BOQ spreadsheets and drawings and fills a standard Excel template: tile name, finish, brand, size, unit and quantity, with images from the documents. Duplicate lines are merged and missing fields are marked “TBC”." },
          { title: "Bidders and offers", text: "One email draft per bidder, with the tile list attached and the deadline taken from the tender record. A person always reviews the drafts; nothing is sent automatically. Offers are uploaded back into the package folder." },
          { title: "Comparison sheet", text: "Claude reads the offers against the main-works BOQ and fills a comparison sheet with budget, PC budget and benchmark columns. In testing, the totals matched a hand-made sheet exactly." },
          { title: "Final submission", text: "One click creates the final comparison, the winning offer priced and unpriced, an evaluation report and an award letter as Word files, after a sign-off checklist." },
        ],
        highlights: [
          "Split architecture: a Fastify API with Zod validation and SQLite, and a Next.js front end that reaches the API only through a server-side proxy holding the API token.",
          "“Lara” voice assistant (Ctrl+Space, 5 languages, 20+ actions): it asks for confirmation before any change and highlights the change on screen. Deleting is click-only, never by voice.",
          "Background job queue with live progress, a notification bell, a full audit history (made by the user, the automation or Lara) and Ctrl+K search across records, files and spreadsheet rows.",
          "Security first: read-only on the source system, scrypt password hashes, a separate process and data folder per user, rate-limited logins and HTTPS office-network access that is off by default.",
          "Excel files built with exceljs, with an Excel automation fallback for workbooks the library can’t read. Light and dark themes with an animated dashboard (Motion, Recharts).",
        ],
      },
      {
        name: "kyna.ai",
        tagline: "AI Property Finder",
        description: "AI-driven property search for the Dubai real estate market.",
        context: "Dubai, UAE",
        highlights: [
          "Developed an AI-driven property search platform for the Dubai real estate market, using the OpenAI API to turn natural-language queries into property matches and recommendations, with SEO-optimized server-side rendering.",
          "Integrated property listing APIs and a lead management system for channel partners, enabling real-time property matching for agents.",
        ],
      },
      {
        name: "Government Document Management Platform",
        tagline: "Middle East",
        description: "Bilingual document management for government operations.",
        context: "Middle East government project",
        highlights: [
          "Developed bilingual Arabic/English UI with RTL support for secure document handling and role-based data visibility.",
          "Integrated iris, fingerprint, and facial recognition SDKs for identity verification.",
        ],
      },
      {
        name: "Enterprise Access Management System",
        tagline: "Abu Dhabi",
        description: "Access management for company and employee workflows.",
        context: "Abu Dhabi, UAE",
        highlights: [
          "Designed RBAC with 5 user roles for company and employee workflow management with multi-level approvals.",
          "Built bilingual Arabic/English (RTL) dynamic forms and approval dashboards.",
        ],
      },
      {
        name: "Orbin",
        tagline: "Professional Networking Platform",
        description: "LinkedIn-style networking platform across web and mobile.",
        context: "",
        highlights: [
          "Built a LinkedIn-style networking platform for web and mobile (React Native on iOS and Android) with consultation booking, real-time messaging, and push notifications.",
          "Added an optional AI rewrite of the profile summary with the OpenAI API, so users can polish their summary whenever they want.",
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
      ai: "AI / LLM",
      backend: "Backend",
      devops: "DevOps and Tools",
      testing: "Testing",
      uiux: "UI/UX",
    },
    // Skill names that are words rather than product names; anything not listed shows as-is
    terms: {
      "Micro Frontends": "Micro Frontends",
      "React Native (iOS & Android)": "React Native (iOS & Android)",
      "REST API Design & Integration (CRUD)": "REST API Design & Integration (CRUD)",
      "Third-Party API Integration": "Third-Party API Integration",
      "File Uploads (Multer)": "File Uploads (Multer)",
      "Authorization Middleware": "Authorization Middleware",
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
      "Generative AI": "Generative AI",
      "LLM Integration": "LLM Integration",
      "Prompt Engineering": "Prompt Engineering",
      "Structured JSON Output": "Structured JSON Output",
      "Streaming Responses": "Streaming Responses",
    },
  },
  education: {
    title: "Education",
    items: [
      {
        degree: "Bachelor of Computer Applications (BCA)",
        institution: "MG University, Kerala, India · Degree attested",
        year: "2017 – 2020",
      },
      { degree: "Certified Python Developer", institution: "Nordic Academy", year: "2021" },
    ],
  },
  contact: {
    title: "Hiring a full stack & AI/LLM developer in Dubai?",
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
    languageList: "English (Professional), Malayalam (Native)",
    nationality: "Nationality",
    nationalityValue: "Indian",
  },
  hire: {
    label: "Interview availability",
    title: "Hiring a full stack & AI/LLM developer?",
    body: "I’m available to join immediately and can interview this week, in person in Dubai or online.",
    cta: "Schedule an interview",
    whatsapp: "WhatsApp",
    close: "Dismiss",
  },
  chat: {
    // CV chat assistant (src/components/cv-chat.tsx)
    open: "Hiring? Ask my AI",
    openShort: "Ask my AI",
    hint: "👋 Hiring? Ask me anything about Ashique",
    title: "Ask about Ashique",
    subtitle: "AI assistant · knows his experience & skills",
    greeting: "Hi! I can answer questions about Ashique’s experience, skills, projects and availability. What would you like to know?",
    placeholder: "Ask about experience, skills…",
    send: "Send",
    close: "Close chat",
    thinking: "Thinking",
    disclaimer: "AI answers about Ashique’s experience. They may be imperfect, so confirm important details with him.",
    error: "Sorry, the assistant isn’t available right now. Please email or WhatsApp Ashique instead.",
    rateLimited: "Too many questions in a short time. Please try again in a few minutes.",
    clear: "Clear chat",
    contactPrompt: "Want to talk to Ashique directly?",
    email: "Email",
    whatsapp: "WhatsApp",
    downloadCv: "Download CV",
    model: "Model",
    // Voice: mic button and voice call (src/components/cv-call.tsx)
    dictate: "Speak your question",
    stopDictating: "Stop recording",
    transcribing: "Transcribing…",
    micDenied: "Microphone access is blocked. Allow it in your browser to use voice.",
    voiceBusy: "Voice isn’t available right now. Please type your question instead.",
    micSilent: "Your microphone isn’t picking up any sound. Check that it isn’t muted on your device.",
    noSpeech: "Didn’t catch that. Tap the mic and try again.",
    call: "Call the AI assistant",
    chatMenu: "Chat with AI",
    chatMenuHint: "Type your questions",
    callMenuHint: "Talk to his AI assistant",
    chatTab: "Chat",
    callTab: "AI voice call",
    callWho: "You’re talking to an AI assistant",
    callGreeting: "Hi, I’m Ashique’s AI assistant, not Ashique himself.",
    connecting: "Connecting…",
    tryAsking: "Ask out loud, or tap a question",
    listening: "Listening…",
    speaking: "Speaking…",
    interruptHint: "Tap the orb to interrupt",
    muted: "Muted",
    mute: "Mute",
    unmute: "Unmute",
    endCall: "End call",
    callDisclaimer: "Your voice is sent to Groq for transcription and isn’t stored. Answers are AI-generated.",
    suggestions: ["Summarise his experience","What AI / LLM work has he done?","Is he available to join immediately?","Which tech stack does he use?"],
  },
  footer: {
    builtWith: "Built with Next.js.",
  },
};

export type Dictionary = typeof en;
export default en;
