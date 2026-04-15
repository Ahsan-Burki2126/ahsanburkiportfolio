"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ScrollReveal from "@/components/ScrollReveal";
import GlitchText from "@/components/GlitchText";
import TiltCard from "@/components/TiltCard";
import { useCmsContent } from "@/lib/useContent";

const ParticleField = dynamic(() => import("@/components/ParticleField"), {
  ssr: false,
});

interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

interface LocationInfo {
  city: string;
  country: string;
  coordinates: string;
  sector: string;
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const { text, json } = useCmsContent("contact");
  const { json: globalJson } = useCmsContent("global");

  const location = json<LocationInfo>("contact_location", {
    city: "Waziristan / Islamabad",
    country: "Pakistan",
    coordinates: "32.9°N, 69.9°E",
    sector: "WAZIRISTAN SECTOR",
  });

  const contactEmail = text("contact_email", "");
  const socialLinks = globalJson<SocialLink[]>("footer_social_links", []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen py-20 px-6 relative">
      <ParticleField />
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <ScrollReveal>
          <div className="space-y-2">
            <p className="text-xs tracking-[0.3em] text-[var(--accent-purple)]">
              // 03.CONTACT
            </p>
            <GlitchText
              text={text("contact_page_title", "GET IN TOUCH")}
              as="h1"
              className="text-3xl md:text-5xl font-bold"
            />
            <p className="text-[var(--text-secondary)] text-sm">
              {text(
                "contact_page_description",
                "Open to work, collaborations, and interesting projects. I usually respond within 24 hours.",
              )}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Left panel */}
          <div className="md:col-span-2 space-y-5">
            {/* Email */}
            {contactEmail && (
              <ScrollReveal direction="left" delay={0.05}>
                <TiltCard intensity={5}>
                  <div className="border border-[var(--border-color)] rounded-lg p-5 bg-[var(--bg-card)]">
                    <h3 className="text-[10px] tracking-widest text-[var(--accent-cyan)] mb-3">
                      EMAIL
                    </h3>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-sm text-[var(--text-primary)] hover:text-[var(--accent-cyan)] transition-colors break-all"
                    >
                      {contactEmail}
                    </a>
                  </div>
                </TiltCard>
              </ScrollReveal>
            )}

            {/* Location */}
            <ScrollReveal direction="left" delay={0.1}>
              <TiltCard intensity={5}>
                <div className="border border-[var(--border-color)] rounded-lg p-5 bg-[var(--bg-card)]">
                  <h3 className="text-[10px] tracking-widest text-[var(--accent-cyan)] mb-3">
                    LOCATION
                  </h3>
                  <p className="text-sm text-[var(--text-primary)]">
                    {location.city}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {location.country}
                  </p>
                  <div className="mt-3 h-28 bg-[var(--bg-secondary)] rounded border border-[var(--border-color)] flex items-center justify-center relative overflow-hidden">
                    <div className="text-center">
                      <p className="text-[var(--accent-cyan)] text-xs font-mono">
                        {location.coordinates}
                      </p>
                      <p className="text-[8px] text-[var(--text-secondary)] mt-1 tracking-wider">
                        {location.sector}
                      </p>
                    </div>
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(0,240,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    />
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <ScrollReveal direction="left" delay={0.15}>
                <TiltCard intensity={5}>
                  <div className="border border-[var(--border-color)] rounded-lg p-5 bg-[var(--bg-card)]">
                    <h3 className="text-[10px] tracking-widest text-[var(--accent-cyan)] mb-3">
                      FIND ME ON
                    </h3>
                    <div className="space-y-2">
                      {socialLinks.map((s) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-xs text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-colors group"
                        >
                          <span className="w-7 h-7 border border-[var(--border-color)] rounded flex items-center justify-center text-[10px] font-bold group-hover:border-[var(--accent-cyan)] transition-colors">
                            {s.icon}
                          </span>
                          {s.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            )}
          </div>

          {/* Contact Form */}
          <ScrollReveal
            direction="right"
            delay={0.15}
            className="md:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="border border-[var(--border-color)] rounded-lg p-6 bg-[var(--bg-card)] space-y-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[var(--accent-green)]" />
                <span className="text-[10px] tracking-widest text-[var(--text-secondary)]">
                  SEND A MESSAGE
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-widest text-[var(--text-secondary)]">
                  YOUR NAME
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:border-[var(--accent-cyan)] focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-widest text-[var(--text-secondary)]">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:border-[var(--accent-cyan)] focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-widest text-[var(--text-secondary)]">
                  MESSAGE
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  required
                  rows={5}
                  placeholder="What would you like to discuss?"
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:border-[var(--accent-cyan)] focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full py-3 bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)] text-xs tracking-[0.3em] rounded hover:bg-[var(--accent-cyan)]/20 transition-all disabled:opacity-50"
              >
                {status === "sending"
                  ? "SENDING..."
                  : status === "sent"
                    ? "MESSAGE SENT ✓"
                    : "SEND MESSAGE"}
              </button>

              {status === "error" && (
                <p className="text-red-400 text-xs text-center">
                  Failed to send. Please try again or email me directly.
                </p>
              )}
              {status === "sent" && (
                <p className="text-[var(--accent-green)] text-xs text-center">
                  Message received. I'll get back to you within 24 hours.
                </p>
              )}
            </form>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
