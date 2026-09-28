// Content mirrors Ashique_PJ_Dubai_CV (latest CV). Claude and Gemini under AI Integration are website-only.

export interface ContactInfo {
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  linkedinUrl: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  highlights: string[];
}

export interface Project {
  name: string;
  description: string;
  stack: string[];
  highlights: string[];
  context?: string;
  url?: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export const personalInfo = {
  name: "Ashique PJ",
  role: "Frontend Developer",
  specialization: "React.js and Next.js Specialist",
  summary:
    "Frontend Developer with 5+ years of experience specializing in React.js, Next.js, and TypeScript. Delivered enterprise platforms for government and private-sector clients in the UAE and Middle East, with bilingual Arabic/English (RTL) interfaces, REST API integration, secure JWT/OAuth authentication, and role-based access control. Built the user interface for an 11-role government document platform with iris, fingerprint, and facial recognition, used by 500+ people daily. Integrates AI into web applications using the OpenAI API, including AI-driven property search and recommendations for the Dubai market, and real-time virtual try-on with MediaPipe FaceMesh.",
  photo: "/Ashique.JPG",
} as const;

export const contactInfo: ContactInfo = {
  location: "Dubai, UAE",
  phone: "+971 50 561 9899",
  email: "ashiquejabbar007@gmail.com",
  linkedin: "ashique-pj",
  linkedinUrl: "https://www.linkedin.com/in/ashique-pj/",
};

export const skills: Skill[] = [
  {
    category: "Frontend",
    items: [
      "React.js",
      "Next.js (SSR/SSG)",
      "TypeScript",
      "JavaScript (ES6+)",
      "HTML5",
      "CSS3",
      "React Native",
      "Micro Frontends",
      "Module Federation",
    ],
  },
  {
    category: "UI Libraries",
    items: ["Tailwind CSS", "shadcn/ui", "Material-UI", "Ant Design", "Mantine"],
  },
  {
    category: "State and Data",
    items: [
      "Zustand",
      "Redux",
      "Context API",
      "TanStack Query",
      "React Router",
      "Axios",
      "RESTful APIs",
      "WebSockets",
    ],
  },
  {
    category: "Security",
    items: [
      "JWT Authentication",
      "OAuth 2.0",
      "Role-Based Access Control (RBAC)",
      "Biometric SDK Integration",
    ],
  },
  {
    category: "AI Integration",
    items: [
      "OpenAI API",
      "Claude API (Anthropic)",
      "Google Gemini API",
      "MediaPipe FaceMesh",
    ],
  },
  {
    category: "Backend",
    items: [
      "Node.js",
      "Python",
      "Django",
      "PostgreSQL",
      "MongoDB",
      "MySQL",
      "Firebase",
      "Supabase",
    ],
  },
  {
    category: "DevOps and Tools",
    items: [
      "Git",
      "GitHub",
      "GitHub Actions",
      "CI/CD Pipelines",
      "Docker",
      "AWS (EC2)",
      "Webpack",
    ],
  },
  {
    category: "Testing",
    items: ["Playwright", "End-to-End Testing", "Cross-Browser Testing"],
  },
  {
    category: "UI/UX",
    items: [
      "Arabic/English RTL Layouts",
      "Responsive Design",
      "WCAG/ARIA Accessibility",
      "Semantic HTML",
      "SEO",
    ],
  },
];

export const experiences: Experience[] = [
  {
    title: "React Developer",
    company: "Floges Software Solutions",
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
    company: "Infox Technologies",
    location: "India",
    period: "Mar 2021 – Aug 2022",
    highlights: [
      "Developed and maintained client web applications with React.js on the frontend and RESTful APIs with Python and Django on the backend.",
      "Designed and optimized MySQL schemas and queries, improving query response times and data integrity.",
    ],
  },
];

export const projects: Project[] = [
  {
    name: "IDMS — Government Document Management System",
    description: "Bilingual document management for government operations.",
    context: "Middle East government project",
    stack: ["React.js", "TypeScript", "Zustand", "Material-UI", "Biometric SDKs"],
    highlights: [
      "Developed bilingual Arabic/English UI with RTL support for secure document handling and role-based data visibility.",
      "Integrated iris, fingerprint, and facial recognition SDKs for identity verification.",
    ],
  },
  {
    name: "Sinyar — Access Management System",
    description: "Access management for company and employee workflows.",
    context: "Abu Dhabi, UAE",
    stack: ["React.js", "TypeScript", "Zustand", "Material-UI"],
    highlights: [
      "Designed RBAC with 5 user roles for company and employee workflow management with multi-level approvals.",
      "Built bilingual Arabic/English (RTL) dynamic forms and approval dashboards.",
    ],
  },
  {
    name: "kyna.ai — AI Property Finder",
    description: "AI-driven property search for the Dubai real estate market.",
    context: "Dubai, UAE",
    stack: ["Next.js (SSR/SSG)", "TypeScript", "Tailwind CSS", "OpenAI API"],
    highlights: [
      "Developed an AI-driven property search platform for the Dubai real estate market with an intelligent recommendation engine and SEO-optimized server-side rendering.",
      "Integrated property listing APIs and a lead management system for channel partners, enabling real-time property matching for agents.",
    ],
    url: "https://kyna.ai",
  },
  {
    name: "Orbin — Professional Networking Platform",
    description: "LinkedIn-style networking platform across web and mobile.",
    stack: ["Next.js", "React Native", "TypeScript", "WebSockets", "TanStack Query"],
    highlights: [
      "Built a LinkedIn-style networking platform for web and mobile with consultation booking, real-time messaging, and push notifications.",
      "Reduced redundant API calls with TanStack Query caching and WebSocket-based notifications, improving app responsiveness.",
    ],
    url: "https://theorbin.com",
  },
  {
    name: "Virtual Optical Store — AI-Powered Eyewear E-Commerce",
    description: "Eyewear e-commerce with an AI-powered virtual try-on.",
    stack: ["React.js", "Node.js", "TypeScript", "MediaPipe FaceMesh"],
    highlights: [
      "Developed an e-commerce platform with Virtual Try-On using MediaPipe FaceMesh for real-time glasses fitting.",
      "Implemented role-based access for 4 user types (Admin, Optician, Salesman, Customer) with a responsive cross-device UI.",
    ],
  },
];

export const education: Education[] = [
  {
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "MG University, Kerala, India",
    year: "2017 – 2020",
  },
  {
    degree: "Certified Python Developer",
    institution: "Nordic Academy",
    year: "2021",
  },
];

export const additionalInfo = {
  nationality: "Indian",
  visaStatus: "UAE Visit Visa — Available to join immediately",
  languages: ["English", "Malayalam (Native)"],
} as const;

export const navLinks = [
  { label: "Work", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;
