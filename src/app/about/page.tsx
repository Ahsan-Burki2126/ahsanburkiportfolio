"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import ScrollReveal, { StaggerReveal } from "@/components/ScrollReveal";
import GlitchText from "@/components/GlitchText";
import TiltCard from "@/components/TiltCard";

const ParticleField = dynamic(() => import("@/components/ParticleField"), {
  ssr: false,
});

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function useCountdown(targetMs: number): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const tick = () => {
      const diff = targetMs - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetMs]);

  return timeLeft;
}

const GRAD_DATE_MS = new Date("2026-06-21T00:00:00Z").getTime();

export default function AboutPage() {
  const countdown = useCountdown(GRAD_DATE_MS);
  const [scanning, setScanning] = useState(false);
  const scanRef = useRef<HTMLButtonElement>(null);

  const handleDownloadCV = async () => {
    setScanning(true);
    // GSAP-style scan animation via CSS
    setTimeout(async () => {
      setScanning(false);
      window.open("/api/cv/download", "_blank");
    }, 2000);
  };

  const languages = [
    { name: "English", level: "Professional", percent: 90 },
    { name: "Pashto", level: "Native", percent: 100 },
    { name: "German", level: "A2 / Duolingo", percent: 25 },
  ];

  return (
    <div className="min-h-screen py-20 px-6 relative">
      <ParticleField />
      <div className="max-w-5xl mx-auto space-y-16 relative z-10">
        {/* Header */}
        <ScrollReveal className="space-y-2">
          <p className="text-xs tracking-[0.3em] text-[var(--accent-purple)]">
            // 01.RESEARCH_FILE
          </p>
          <GlitchText
            text="ABOUT AHSAN"
            as="h1"
            className="text-3xl md:text-5xl font-bold"
          />
        </ScrollReveal>

        {/* Biography */}
        <ScrollReveal delay={0.1}>
          <TiltCard intensity={3}>
            <section className="border border-[var(--border-color)] rounded-lg p-6 md:p-8 bg-[var(--bg-card)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent" />
              <h2 className="text-sm tracking-widest text-[var(--accent-cyan)] mb-4">
                BIOGRAPHY // RESEARCH_FILE
              </h2>
              <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
                <p>
                  From the rugged mountains of{" "}
                  <span className="text-[var(--text-primary)]">Waziristan</span>{" "}
                  to the cutting edge of artificial intelligence — my journey is
                  one of relentless curiosity and cultural pride. I grew up
                  surrounded by the rich traditions of{" "}
                  <span className="text-[var(--accent-cyan)]">
                    Pashto culture
                  </span>
                  , where storytelling and resilience are woven into the fabric
                  of daily life.
                </p>
                <p>
                  Inspired by the poetry of{" "}
                  <span className="text-[var(--accent-purple)]">
                    Ghani Khan
                  </span>{" "}
                  — who bridged worlds between East and West — I found my own
                  bridge in technology. Code became my language of expression,
                  and AI became the canvas on which I paint possibilities.
                </p>
                <p>
                  Today, as an{" "}
                  <span className="text-[var(--text-primary)]">
                    AI Engineer & Full-Stack Developer
                  </span>
                  , I build intelligent agents that understand context, craft
                  immersive 3D web experiences, and develop applications like{" "}
                  <span className="text-[var(--accent-cyan)]">SafarDost</span> —
                  a travel companion designed to showcase the hidden beauty of
                  Pakistan. My work sits at the intersection of machine
                  learning, creative coding, and cultural identity.
                </p>
              </div>
            </section>
          </TiltCard>
        </ScrollReveal>

        {/* Education Card with Countdown */}
        <ScrollReveal delay={0.15}>
          <section className="border border-[var(--border-color)] rounded-lg p-6 md:p-8 bg-[var(--bg-card)] glow-border">
            <h2 className="text-sm tracking-widest text-[var(--accent-cyan)] mb-6">
              EDUCATION // DEGREE_STATUS
            </h2>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 space-y-3">
                <h3 className="text-xl font-bold">
                  BS in Artificial Intelligence
                </h3>
                <p className="text-[var(--text-secondary)] text-sm">
                  Expected Graduation: June 21, 2026
                </p>
                <div className="inline-block px-3 py-1 bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/30 rounded text-[var(--accent-green)] text-xs tracking-wider">
                  STATUS: IN_PROGRESS
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "DAYS", value: countdown.days },
                  { label: "HRS", value: countdown.hours },
                  { label: "MIN", value: countdown.minutes },
                  { label: "SEC", value: countdown.seconds },
                ].map((unit) => (
                  <div
                    key={unit.label}
                    className="text-center border border-[var(--border-color)] rounded p-3 bg-[var(--bg-secondary)]"
                  >
                    <p className="text-2xl font-bold text-[var(--accent-cyan)] tabular-nums">
                      {String(unit.value).padStart(2, "0")}
                    </p>
                    <p className="text-[9px] tracking-widest text-[var(--text-secondary)]">
                      {unit.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Language Matrix */}
        <ScrollReveal direction="left" delay={0.1}>
          <section className="border border-[var(--border-color)] rounded-lg p-6 md:p-8 bg-[var(--bg-card)]">
            <h2 className="text-sm tracking-widest text-[var(--accent-cyan)] mb-6">
              LANGUAGE // PROFICIENCY_MATRIX
            </h2>
            <div className="space-y-5">
              {languages.map((lang) => (
                <div key={lang.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-primary)]">
                      {lang.name}
                    </span>
                    <span className="text-[var(--accent-purple)] text-xs">
                      {lang.level}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${lang.percent}%`,
                        background: `linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Key Interests */}
        <ScrollReveal direction="right" delay={0.1}>
          <section className="border border-[var(--border-color)] rounded-lg p-6 md:p-8 bg-[var(--bg-card)]">
            <h2 className="text-sm tracking-widest text-[var(--accent-cyan)] mb-6">
              INTERESTS // ACTIVE_MODULES
            </h2>
            <StaggerReveal
              className="grid grid-cols-2 md:grid-cols-3 gap-3"
              staggerDelay={0.08}
            >
              {[
                { icon: "🤖", label: "AI Agents" },
                { icon: "🧠", label: "Machine Learning" },
                { icon: "📷", label: "Cinematic Photography" },
                { icon: "🎨", label: "3D Rendering (Blender)" },
                { icon: "💻", label: "Creative Coding" },
                { icon: "🌍", label: "Travel Tech" },
              ].map((interest) => (
                <div
                  key={interest.label}
                  className="flex items-center gap-3 p-3 border border-[var(--border-color)] rounded hover:border-[var(--accent-cyan)]/30 hover:bg-[var(--accent-cyan)]/5 transition-all cursor-default"
                >
                  <span className="text-xl">{interest.icon}</span>
                  <span className="text-xs tracking-wider text-[var(--text-secondary)]">
                    {interest.label}
                  </span>
                </div>
              ))}
            </StaggerReveal>
          </section>
        </ScrollReveal>

        {/* CV Download */}
        <ScrollReveal delay={0.2}>
          <section className="text-center space-y-4">
            <button
              ref={scanRef}
              onClick={handleDownloadCV}
              disabled={scanning}
              className={`relative px-8 py-4 border text-xs tracking-[0.3em] rounded transition-all overflow-hidden ${
                scanning
                  ? "border-[var(--accent-cyan)] text-[var(--accent-cyan)]"
                  : "border-[var(--accent-cyan)]/50 text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/10 hover:border-[var(--accent-cyan)]"
              }`}
            >
              {scanning && (
                <div className="absolute inset-0 bg-[var(--accent-cyan)]/5">
                  <div
                    className="absolute top-0 left-0 w-full h-1 bg-[var(--accent-cyan)]"
                    style={{
                      animation: "scan-line 2s linear forwards",
                    }}
                  />
                </div>
              )}
              {scanning ? "SCANNING..." : "DOWNLOAD CV // TRANSMISSION_v2.PDF"}
            </button>
            <p className="text-[10px] text-[var(--text-secondary)] tracking-wider">
              SECURE DOCUMENT TRANSFER PROTOCOL
            </p>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
