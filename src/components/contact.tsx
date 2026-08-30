"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { contactInfo, additionalInfo } from "@/lib/data";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/section-heading";

function LinkedInSvg({ size = 20 }: { size?: number }) {
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

const contactLinks = [
  {
    icon: <Mail size={20} />,
    label: "Email",
    value: contactInfo.email,
    href: `mailto:${contactInfo.email}`,
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: <Phone size={20} />,
    label: "Phone",
    value: contactInfo.phone,
    href: `tel:${contactInfo.phone.replace(/\s/g, "")}`,
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: <LinkedInSvg size={20} />,
    label: "LinkedIn",
    value: `linkedin.com/in/${contactInfo.linkedin}`,
    href: contactInfo.linkedinUrl,
    color: "from-blue-600/20 to-blue-400/20",
  },
  {
    icon: <MapPin size={20} />,
    label: "Location",
    value: contactInfo.location,
    href: `https://www.google.com/maps/search/${encodeURIComponent(contactInfo.location)}`,
    color: "from-orange-500/20 to-amber-500/20",
  },
];

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />

      <div className="section-container relative" ref={ref}>
        <SectionHeading title="Get In" highlight="Touch" />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-muted-foreground max-w-lg mx-auto text-center -mt-10 mb-16"
        >
          I&apos;m currently based in Dubai and available for new opportunities.
          Let&apos;s connect and discuss how I can contribute to your team.
        </motion.p>

        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="flex items-center gap-3 px-6 py-3 glass rounded-full border border-accent/20">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="text-sm font-medium text-foreground">
              {additionalInfo.visaStatus}
            </span>
          </div>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
          {contactLinks.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.label === "LinkedIn" || link.label === "Location" ? "_blank" : undefined}
              rel={link.label === "LinkedIn" || link.label === "Location" ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="group glass rounded-2xl p-5 text-center hover:border-primary/30 transition-all duration-300 block"
            >
              <div
                className={`mx-auto w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-3 text-foreground group-hover:scale-110 transition-transform duration-300`}
              >
                {link.icon}
              </div>
              <div className="text-xs text-muted-foreground mb-1">
                {link.label}
              </div>
              <div className="text-sm font-medium text-foreground truncate">
                {link.value}
              </div>
            </motion.a>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-accent" />
            <span>
              <strong className="text-foreground">Nationality:</strong>{" "}
              {additionalInfo.nationality}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>
              <strong className="text-foreground">Languages:</strong>{" "}
              {additionalInfo.languages.join(", ")}
            </span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-12"
        >
          <a
            href={`mailto:${contactInfo.email}`}
            className="inline-flex items-center justify-center h-9 gap-1.5 px-8 text-sm font-semibold rounded-full bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 cursor-pointer"
          >
            <Send size={16} className="mr-2" />
            Send Me an Email
          </a>
        </motion.div>
      </div>
    </section>
  );
}
