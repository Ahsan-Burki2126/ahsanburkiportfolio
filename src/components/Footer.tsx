"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/Ahsan-Burki2126", icon: "GH" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ahsan-ullah-burki-25496930b/",
    icon: "LI",
  },
  { label: "Twitter / X", href: "https://x.com/ahsanburki", icon: "X" },
];

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/lab-control")) return null;

  return (
    <footer className="relative z-10 border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
      {/* Gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 border border-[var(--accent-cyan)] rounded flex items-center justify-center">
                <span className="text-[var(--accent-cyan)] font-bold text-sm">
                  AB
                </span>
              </div>
              <span className="text-sm font-semibold tracking-wider">
                AHSAN<span className="text-[var(--accent-cyan)]">.BURKI</span>
              </span>
            </div>
            <p className="text-[var(--text-secondary)] text-xs leading-relaxed max-w-xs">
              AI Systems Architect building intelligent agents and immersive
              digital experiences from Waziristan to the world.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-[var(--border-color)] rounded flex items-center justify-center text-[10px] font-bold text-[var(--text-secondary)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/5 transition-all"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-[10px] tracking-[0.3em] text-[var(--accent-purple)]">
              // NAVIGATION
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-colors py-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h3 className="text-[10px] tracking-[0.3em] text-[var(--accent-purple)]">
              // SYSTEM_STATUS
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse" />
                <span className="text-xs text-[var(--text-secondary)]">
                  All systems operational
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--accent-cyan)]" />
                <span className="text-xs text-[var(--text-secondary)]">
                  Open to opportunities
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--accent-purple)]" />
                <span className="text-xs text-[var(--text-secondary)]">
                  Based in Pakistan
                </span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/contact"
                className="inline-block px-4 py-2 text-[10px] tracking-widest bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)] rounded hover:bg-[var(--accent-cyan)]/20 transition-all"
              >
                OPEN UPLINK →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-[var(--text-secondary)] tracking-wider">
            © {new Date().getFullYear()} AHSAN BURKI // ALL SYSTEMS RESERVED
          </p>
          <p className="text-[10px] text-[var(--text-secondary)] tracking-wider">
            BUILT WITH{" "}
            <span className="text-[var(--accent-cyan)]">NEXT.JS</span> +{" "}
            <span className="text-[var(--accent-purple)]">THREE.JS</span> +{" "}
            <span className="text-[var(--accent-green)]">GSAP</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
