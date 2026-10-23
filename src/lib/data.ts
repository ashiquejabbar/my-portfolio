// Content mirrors Ashique_PJ_Dubai_CV (latest CV).
// This file holds what is the same in every language; wording lives in src/lib/i18n/dictionaries/.

import type { Dictionary } from "@/lib/i18n/dictionaries/en";

export interface ContactInfo {
  phone: string;
  email: string;
  linkedin: string;
  linkedinUrl: string;
}

export type SkillCategory = keyof Dictionary["skills"]["categories"];

export interface Skill {
  category: SkillCategory;
  items: string[];
}

export const personalInfo = {
  name: "Ashique PJ",
  photo: "/Ashique.JPG",
} as const;

export const contactInfo: ContactInfo = {
  phone: "+971 50 561 9899",
  email: "ashiquejabbar007@gmail.com",
  linkedin: "ashique-pj",
  linkedinUrl: "https://www.linkedin.com/in/ashique-pj/",
};

// Item names that are plain words get translated through Dictionary["skills"]["terms"]
export const skills: Skill[] = [
  {
    category: "frontend",
    items: [
      "Next.js (SSR/SSG)",
      "React.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "HTML5",
      "CSS3",
      "React Native (iOS & Android)",
      "Micro Frontends",
      "Module Federation",
    ],
  },
  {
    category: "ai",
    items: [
      "Generative AI",
      "LLM Integration",
      "OpenAI API",
      "Claude API (Anthropic)",
      "Google Gemini API",
      "Prompt Engineering",
      "Structured JSON Output",
      "Streaming Responses",
      "MediaPipe FaceMesh",
    ],
  },
  {
    category: "backend",
    items: [
      "Node.js",
      "Express",
      "REST API Design & Integration (CRUD)",
      "Third-Party API Integration",
      "MongoDB",
      "Mongoose",
      "PostgreSQL",
      "Supabase",
      "Firebase",
      "Zod",
      "Yup",
      "File Uploads (Multer)",
      "Nodemailer (SMTP)",
      "Python",
      "Django",
      "MySQL",
    ],
  },
  {
    category: "ui",
    items: ["Tailwind CSS", "shadcn/ui", "Material-UI", "Ant Design", "Mantine"],
  },
  {
    category: "state",
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
    category: "security",
    items: [
      "JWT Authentication",
      "Passport.js",
      "OAuth 2.0",
      "Role-Based Access Control (RBAC)",
      "Authorization Middleware",
      "Biometric SDK Integration",
    ],
  },
  {
    category: "devops",
    items: ["AWS (EC2)", "Nginx", "Docker", "ngrok", "Git", "GitHub", "GitHub Actions", "CI/CD Pipelines", "Webpack"],
  },
  {
    category: "testing",
    items: ["Playwright", "End-to-End Testing", "Cross-Browser Testing"],
  },
  {
    category: "uiux",
    items: [
      "Arabic/English RTL Layouts",
      "Responsive Design",
      "WCAG/ARIA Accessibility",
      "Semantic HTML",
      "SEO",
    ],
  },
];

// Same order as Dictionary["experience"]["roles"]
export const experiences = [
  { company: "Floges Software Solutions" },
  { company: "Infox Technologies" },
] as const;

// Same order as Dictionary["projects"]["items"]
export const projects: { stack: string[]; url?: string }[] = [
  { stack: ["Next.js (SSR/SSG)", "TypeScript", "Tailwind CSS", "Node.js", "OpenAI API"], url: "https://kyna.ai" },
  { stack: ["React.js", "TypeScript", "Zustand", "Material-UI", "Biometric SDKs"] },
  { stack: ["React.js", "TypeScript", "Zustand", "Material-UI"] },
  {
    stack: ["Next.js", "React Native", "TypeScript", "OpenAI API", "WebSockets", "TanStack Query"],
    url: "https://theorbin.com",
  },
  { stack: ["React.js", "Node.js", "TypeScript", "MediaPipe FaceMesh"] },
];

export const navLinks = [
  { key: "work", href: "#experience" },
  { key: "projects", href: "#projects" },
  { key: "skills", href: "#skills" },
  { key: "contact", href: "#contact" },
] as const;

export const CV_PATH = "/Ashique_PJ_Dubai_CV.pdf";
// Shown in the CV button's tooltip; update it when the PDF changes
export const CV_SIZE = "236 KB";
