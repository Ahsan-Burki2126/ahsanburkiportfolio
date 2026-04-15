"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCmsContent } from "@/lib/useContent";

const navLinks = [
  { href: "/", label: "HOME", code: "00" },
  { href: "/about", label: "ABOUT", code: "01" },
  { href: "/experience", label: "EXPERIENCE", code: "02" },
  { href: "/skills", label: "SKILLS", code: "03" },
  { href: "/projects", label: "PROJECTS", code: "04" },
  { href: "/contact", label: "CONTACT", code: "05" },
];

interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

const defaultSocialLinks: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/Ahsan-Burki2126", icon: "GH" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ahsan-ullah-burki-25496930b/",
    icon: "LI",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { json } = useCmsContent("global");

  const allSocialLinks = json<SocialLink[]>(
    "footer_social_links",
    defaultSocialLinks,
  );
  // Only show GitHub and LinkedIn in the navbar
  const navSocialLinks = allSocialLinks.filter((s) =>
    ["GitHub", "LinkedIn"].includes(s.label),
  );

  if (pathname?.startsWith("/lab-control")) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 border border-[var(--accent-cyan)] rounded flex items-center justify-center group-hover:bg-[var(--accent-cyan)]/10 transition-colors">
            <span className="text-[var(--accent-cyan)] font-bold text-sm">
              AB
            </span>
          </div>
          <span className="text-sm font-semibold tracking-wider hidden sm:block">
            AHSAN<span className="text-[var(--accent-cyan)]">.BURKI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-xs tracking-widest transition-all rounded ${
                pathname === link.href
                  ? "text-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
              }`}
            >
              <span className="text-[var(--accent-purple)] mr-1">
                {link.code}
              </span>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Social icons + status */}
        <div className="hidden md:flex items-center gap-3">
          {navSocialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="w-8 h-8 border border-[var(--border-color)] rounded flex items-center justify-center text-[10px] font-bold text-[var(--text-secondary)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/5 transition-all"
            >
              {social.icon}
            </a>
          ))}
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] pl-2 border-l border-[var(--border-color)]">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse" />
            OPEN TO WORK
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[var(--text-primary)] p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            {mobileOpen ? (
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            ) : (
              <path
                d="M3 5h14M3 10h14M3 15h14"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border-color)] bg-[var(--bg-primary)]/95 backdrop-blur-md">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-6 py-3 text-xs tracking-widest border-b border-[var(--border-color)] ${
                pathname === link.href
                  ? "text-[var(--accent-cyan)] bg-[var(--accent-cyan)]/5"
                  : "text-[var(--text-secondary)]"
              }`}
            >
              <span className="text-[var(--accent-purple)] mr-2">
                {link.code}
              </span>
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 px-6 py-3">
            {navSocialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-[var(--border-color)] rounded flex items-center justify-center text-[10px] font-bold text-[var(--text-secondary)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] transition-all"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
