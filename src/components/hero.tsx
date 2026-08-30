"use client";

import { motion } from "framer-motion";
import { MapPin, Download, ArrowDown, Mail, Phone } from "lucide-react";
import Image from "next/image";
import { personalInfo, contactInfo } from "@/lib/data";
import { Button } from "@/components/ui/button";

function LinkedInIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function Hero() {
  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/15 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px]" />

      <div className="section-container relative z-10 pt-24 pb-16">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 lg:gap-20">
          {/* Left — Profile Photo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
            className="relative shrink-0"
          >
            {/* Glow ring */}
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-70 blur-lg animate-pulse" />
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-50" />
            <div className="relative w-32 h-32 sm:w-34 sm:h-34 md:w-36 md:h-36 rounded-full overflow-hidden border-3 border-background">
              <Image
                src={personalInfo.photo}
                alt={personalInfo.name}
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 640px) 128px, 144px"
              />
            </div>
          </motion.div>

          {/* Right — Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold font-[family-name:var(--font-heading)] tracking-tight mb-3"
            >
              <span className="gradient-text">{personalInfo.name}</span>
            </motion.h1>

            {/* Role & Specialization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mb-5"
            >
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-medium">
                {personalInfo.role}
              </p>
              <p className="text-sm sm:text-base text-primary/80 font-medium mt-1">
                {personalInfo.specialization}
              </p>
            </motion.div>

            {/* Location & Availability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex items-center gap-2 text-muted-foreground mb-5"
            >
              <MapPin size={16} className="text-accent" />
              <span className="text-sm">{contactInfo.location}</span>
              <span className="mx-1.5 text-border">•</span>
              <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 font-medium">
                Immediate Joiner
              </span>
            </motion.div>

            {/* Contact Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-col gap-2.5 mb-7 w-full md:w-auto"
            >
              <a
                href={`mailto:${contactInfo.email}`}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl glass text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300 group"
              >
                <Mail size={15} className="text-primary group-hover:scale-110 transition-transform shrink-0" />
                {contactInfo.email}
              </a>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl glass text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300 group"
                >
                  <Phone size={15} className="text-accent group-hover:scale-110 transition-transform shrink-0" />
                  {contactInfo.phone}
                </a>
                <a
                  href={contactInfo.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl glass text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300 group"
                >
                  <span className="text-[#0A66C2] group-hover:scale-110 transition-transform shrink-0">
                    <LinkedInIcon size={15} />
                  </span>
                  LinkedIn
                </a>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="flex flex-col sm:flex-row items-center md:items-start gap-3"
            >
              <Button
                size="lg"
                onClick={() => handleScroll("projects")}
                className="bg-gradient-to-r from-primary to-accent text-white font-semibold px-8 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 cursor-pointer"
              >
                View Projects
              </Button>
              <a
                href="/Ashique_PJ_Dubai_CV.pdf"
                download
                className="inline-flex items-center justify-center h-11 gap-1.5 px-8 text-sm font-medium rounded-full border border-border/50 hover:bg-white/5 transition-all cursor-pointer"
              >
                <Download size={16} className="mr-2" />
                Download CV
              </a>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          onClick={() => handleScroll("about")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          aria-label="Scroll to about section"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ArrowDown size={20} className="text-muted-foreground/50" />
          </motion.div>
        </motion.button>
      </div>
    </section>
  );
}
