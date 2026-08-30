"use client";

import { Heart } from "lucide-react";
import { contactInfo } from "@/lib/data";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 py-8">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold font-[family-name:var(--font-heading)] gradient-text">
              Ashique
            </span>
            <span className="text-lg font-bold text-foreground/80">.dev</span>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            © {currentYear} Ashique PJ. Built with
            <Heart
              size={12}
              className="text-red-400 fill-red-400"
            />
            using Next.js
          </p>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a
              href={contactInfo.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
              aria-label="LinkedIn profile"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
              aria-label="Send email"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
