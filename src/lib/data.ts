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
  url?: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export const personalInfo = {
  name: "Ashique PJ",
  role: "Frontend Developer",
  specialization: "React.js & Next.js Specialist",
  summary:
    "Frontend Developer with 5+ years of experience building high-performance web applications using React.js, Next.js, and TypeScript. Delivered enterprise platforms including government RBAC systems with biometric verification, AI-powered real estate apps, and professional networking platforms. Based in Dubai — Immediate Joiner.",
  photo: "/Ashique.JPG",
} as const;

export const contactInfo: ContactInfo = {
  location: "Dubai, UAE",
  phone: "+971 50 561 9899",
  email: "ashiquejabbar007@gmail.com",
  linkedin: "ashique-pj",
  linkedinUrl: "https://www.linkedin.com/in/ashique-pj/",
};

export const stats: StatItem[] = [
  { value: "5+", label: "Years Experience" },
  { value: "5+", label: "Major Projects" },
  { value: "3", label: "Companies" },
  { value: "11", label: "RBAC Roles Built" },
];

export const skills: Skill[] = [
  {
    category: "Frontend",
    items: [
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "shadcn/ui",
      "Material-UI",
      "Ant Design",
      "Mantine",
      "Micro Frontends",
      "Remix.js",
      "React Native",
    ],
  },
  {
    category: "State & Libraries",
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
    category: "DevOps & Tools",
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
];

export const experiences: Experience[] = [
  {
    title: "Freelance Frontend Developer",
    company: "Self-Employed",
    location: "Dubai (Remote)",
    period: "May 2026 – Present",
    highlights: [
      "Delivering end-to-end frontend solutions — from requirement analysis and architecture to development and deployment.",
      "Building responsive, cross-device web applications using React.js, Node.js, and TypeScript, featuring AI integrations.",
    ],
  },
  {
    title: "React Developer",
    company: "Floges Software Solutions",
    location: "India",
    period: "Sep 2022 – Apr 2026",
    highlights: [
      "Engineered reusable component libraries with React.js and TypeScript using Material-UI, Tailwind CSS, and shadcn/ui across multiple client projects.",
      "Implemented Micro Frontend architecture using Webpack Module Federation for independently deployable modules.",
      "Improved page load performance through code splitting, lazy loading, memoization, and Webpack optimization.",
      "Architected RBAC systems supporting up to 11 user roles for government document management platforms.",
      "Developed biometric verification modules (iris, fingerprint, facial recognition) and multi-level approval workflows.",
      "Integrated RESTful API endpoints with optimistic UI updates and TanStack Query caching.",
      "Implemented real-time WebSocket features for live notifications, chat, and collaborative workflows.",
      "Worked with CI/CD pipelines using GitHub Actions for automated testing and deployment.",
    ],
  },
  {
    title: "Python Developer",
    company: "Infox Technologies",
    location: "India",
    period: "Mar 2021 – Aug 2022",
    highlights: [
      "Developed and maintained RESTful APIs using Python and Django for various web applications.",
      "Designed and optimized MySQL database schemas, improving query response times and data integrity at scale.",
      "Contributed to frontend development using React.js, bridging full-stack capabilities across projects.",
    ],
  },
];

export const projects: Project[] = [
  {
    name: "kyna.ai — AI Property Finder",
    description:
      "AI-driven property search platform for Dubai real estate market with intelligent recommendation engine and SEO-optimized server-side rendering.",
    stack: ["Next.js (SSR/SSG)", "TypeScript", "Tailwind CSS", "OpenAI API"],
    highlights: [
      "Developed AI-driven property search platform for Dubai real estate market with intelligent recommendation engine.",
      "Integrated property listing APIs and lead management system for channel partners.",
    ],
    url: "https://kyna.ai",
  },
  {
    name: "Orbin — Professional Networking",
    description:
      "LinkedIn-style networking platform with consultation booking, real-time messaging, and push notifications across web and mobile.",
    stack: [
      "Next.js",
      "React Native",
      "TypeScript",
      "WebSockets",
      "TanStack Query",
    ],
    highlights: [
      "Developed networking platform with consultation booking, real-time messaging, and push notifications.",
      "Optimized data fetching with TanStack Query caching and WebSocket-based real-time notifications.",
    ],
    url: "https://theorbin.com",
  },
  {
    name: "IDMS — Government Document Management",
    description:
      "Enterprise-scale government document management system with RBAC, biometric verification, and multi-level approval workflows.",
    stack: [
      "React.js",
      "TypeScript",
      "Zustand",
      "Material-UI",
      "Biometric SDKs",
    ],
    highlights: [
      "Architected RBAC with 11 user roles and biometric verification (iris, fingerprint, facial recognition).",
      "Developed secure UI components for document handling, audit trail tracking, and role-based data visibility.",
    ],
  },
  {
    name: "Sinyar — Access Management System",
    description:
      "RBAC system with 5 user roles for company and employee workflow management with multi-level approval processes.",
    stack: ["React.js", "TypeScript", "Zustand", "Material-UI"],
    highlights: [
      "Designed RBAC with 5 user roles for company and employee workflow management.",
    ],
  },
  {
    name: "Virtual Optical Store",
    description:
      "Full-featured e-commerce platform with AI-powered Virtual Try-On using MediaPipe FaceMesh for real-time glasses fitting.",
    stack: ["React.js", "Node.js", "TypeScript", "MediaPipe FaceMesh", "AI/ML"],
    highlights: [
      "Developed e-commerce platform with AI-powered Virtual Try-On using MediaPipe FaceMesh.",
      "Implemented role-based access for 4 user types with responsive cross-device UI.",
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
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
] as const;
