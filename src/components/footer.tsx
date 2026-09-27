import { contactInfo } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-panel text-panel-foreground/60 border-t border-panel-foreground/10 py-8 text-sm">
      <div className="section-container flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Ashique PJ. Built with Next.js.</p>
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
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
