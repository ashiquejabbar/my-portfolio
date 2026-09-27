// Content mirrors Ashique_PJ_Dubai_CV (latest CV). AI Integration is website-only.

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
    "Frontend Developer with 5+ years of experience specializing in React.js, Next.js, and TypeScript. Built enterprise-grade platforms for government and private sectors across India and the Middle East, including RBAC systems with biometric verification, AI-powered real estate platforms, and cross-platform networking apps. Proven ability to architect scalable frontend solutions for complex, multi-role workflows.",
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
      "Micro Frontends (Module Federation)",
      "React Native",
      "TypeScript",
      "JavaScript (ES6+)",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "shadcn/ui",
      "Material-UI",
      "Ant Design",
      "Mantine",
    ],
  },
  {
    category: "State Management",
    items: [
      "Zustand",
      "Redux",
      "Context API",
      "TanStack Query",
      "React Router",
      "Axios",
      "JWT Authentication",
    ],
  },
  {
    category: "AI Integration",
    items: [
      "OpenAI API",
      "Claude API (Anthropic)",
      "Google Gemini API",
      "MediaPipe FaceMesh",
      "AI-powered search & recommendations",
    ],
  },
  {
    category: "Testing",
    items: ["Playwright", "End-to-End Testing", "Cross-Browser Testing"],
  },
  {
    category: "Backend",
    items: [
      "Node.js",
      "Python",
      "Django",
      "RESTful APIs",
      "PostgreSQL",
      "MongoDB",
      "MySQL",
      "Firebase",
    ],
  },
  {
    category: "DevOps and Tools",
    items: [
      "Git",
      "GitHub",
      "Docker",
      "AWS (EC2, S3)",
      "GitHub Actions",
      "CI/CD Pipelines",
      "WebSockets",
    ],
  },
  {
    category: "UI/UX",
    items: [
      "Responsive Design",
      "Semantic HTML",
      "WCAG Accessibility",
      "ARIA Labels",
      "Cross-Browser Compatibility",
    ],
  },
];

export const experiences: Experience[] = [
  {
    title: "React Developer",
    company: "Floges Software Solutions",
    location: "India",
    period: "Sep 2022 – Apr 2026",
    highlights: [
      "Engineered reusable component libraries with React.js and TypeScript using Material-UI, Tailwind CSS, and shadcn/ui across 5+ client projects, improving UI development speed and ensuring design consistency.",
      "Implemented Micro Frontend architecture using Webpack Module Federation to decompose monolithic applications into independently deployable modules, enabling parallel team development and faster release cycles.",
      "Improved page load performance through code splitting, lazy loading, memoization, and Webpack optimization, reducing initial bundle size and improving Core Web Vitals.",
      "Architected RBAC systems supporting up to 11 user roles with biometric verification (iris, fingerprint, facial recognition) and multi-level approval workflows for government document management platforms serving 500+ daily users.",
      "Integrated RESTful API endpoints with optimistic UI updates, TanStack Query caching, and real-time WebSocket features for live notifications, chat, and collaborative workflows.",
      "Configured CI/CD pipelines using GitHub Actions, automating testing and deployment for faster, reliable releases.",
    ],
  },
  {
    title: "Python Developer",
    company: "Infox Technologies",
    location: "India",
    period: "Mar 2021 – Aug 2022",
    highlights: [
      "Developed and maintained RESTful APIs using Python and Django for various web applications.",
      "Designed and optimized MySQL database schemas, improving query response times and ensuring data integrity at scale.",
      "Delivered frontend features using React.js, bridging full-stack capabilities and accelerating feature delivery across projects.",
    ],
  },
];

export const projects: Project[] = [
  {
    name: "kyna.ai — AI Property Finder",
    description: "AI-driven property search for the Dubai real estate market.",
    stack: ["Next.js (SSR/SSG)", "TypeScript", "Tailwind CSS", "OpenAI API"],
    highlights: [
      "Developed AI-driven property search platform for Dubai real estate market with intelligent recommendation engine and SEO-optimized server-side rendering.",
      "Integrated property listing APIs and lead management system for channel partners, enabling real-time property matching for agents.",
    ],
    url: "https://kyna.ai",
  },
  {
    name: "Orbin — Professional Networking Platform",
    description: "LinkedIn-style networking platform across web and mobile.",
    stack: ["Next.js", "React Native", "TypeScript", "WebSockets", "TanStack Query"],
    highlights: [
      "Developed LinkedIn-style networking platform with consultation booking, real-time messaging, and push notifications across web and mobile.",
      "Optimized data fetching with TanStack Query caching and WebSocket-based real-time notifications, eliminating unnecessary API calls and improving app responsiveness.",
    ],
    url: "https://theorbin.com",
  },
  {
    name: "IDMS — Government Document Management System",
    description: "Enterprise-scale document management for government operations.",
    context: "Middle East government project",
    stack: ["React.js", "TypeScript", "Zustand", "Material-UI", "Biometric SDKs"],
    highlights: [
      "Architected RBAC with 11 user roles, biometric verification (iris, fingerprint, facial recognition), and multi-level approval workflows for enterprise-scale government operations.",
      "Developed secure UI components for document handling, audit trail tracking, and role-based data visibility.",
    ],
  },
  {
    name: "Sinyar — Access Management System",
    description: "Access management for company and employee workflows.",
    context: "Abu Dhabi, UAE",
    stack: ["React.js", "TypeScript", "Zustand", "Material-UI"],
    highlights: [
      "Designed RBAC with 5 user roles for company and employee workflow management with secure, multi-level approval processes.",
      "Built dynamic forms and approval dashboards with role-based data visibility and audit trail tracking for compliance requirements.",
    ],
  },
  {
    name: "Virtual Optical Store — AI-Powered Eyewear E-Commerce",
    description: "Eyewear e-commerce with an AI-powered virtual try-on.",
    stack: ["React.js", "Node.js", "TypeScript", "MediaPipe FaceMesh", "AI/ML"],
    highlights: [
      "Developed full-featured e-commerce platform with AI-powered Virtual Try-On using MediaPipe FaceMesh for real-time glasses fitting visualization.",
      "Implemented role-based access for 4 user types (Admin, Optician, Salesman, Customer) with responsive cross-device UI.",
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
  visaStatus: "Visit Visa — Immediate Joiner",
  languages: ["English", "Malayalam (Native)"],
} as const;

export const navLinks = [
  { label: "Work", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;
