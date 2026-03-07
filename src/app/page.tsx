"use client";

import dynamic from "next/dynamic";
import TerminalText from "@/components/TerminalText";
import ScrollReveal, { StaggerReveal } from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import GlitchText from "@/components/GlitchText";
import TiltCard from "@/components/TiltCard";
import Link from "next/link";
import { useEffect, useState } from "react";

const Brain3D = dynamic(() => import("@/components/Brain3D"), { ssr: false });
const ParticleField = dynamic(() => import("@/components/ParticleField"), {
  ssr: false,
});

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string;
  category: string;
  featured: boolean;
  liveUrl: string | null;
  repoUrl: string | null;
}

const testimonials = [
  {
    name: "Dr. Ahmad Shah",
    role: "AI Research Supervisor",
    text: "Ahsan's work on intelligent agents demonstrates a rare combination of technical depth and creative vision. His projects consistently push boundaries.",
    initials: "AS",
  },
  {
    name: "Sara Khan",
    role: "Senior Developer, TechCorp",
    text: "One of the most talented full-stack developers I've worked with. His attention to detail and clean architecture is exceptional.",
    initials: "SK",
  },
  {
    name: "Rizwan Ali",
    role: "Project Lead, StartupPK",
    text: "Ahsan delivered SafarDost ahead of schedule with features we hadn't even thought of. A true innovator from Waziristan.",
    initials: "RA",
  },
];

const processSteps = [
  {
    number: "01",
    title: "RESEARCH",
    description:
      "Deep-dive into the problem space. Analyze data, study existing solutions, identify gaps.",
    icon: "🔍",
  },
  {
    number: "02",
    title: "ARCHITECT",
    description:
      "Design the system blueprint — APIs, data flow, model architecture, and user experience.",
    icon: "📐",
  },
  {
    number: "03",
    title: "BUILD",
    description:
      "Write clean, tested code. Train models. Iterate rapidly with continuous integration.",
    icon: "⚡",
  },
  {
    number: "04",
    title: "DEPLOY",
    description:
      "Ship to production. Monitor performance. Gather feedback. Optimize and evolve.",
    icon: "🚀",
  },
];

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        const featured = (data as Project[])
          .filter((p) => p.featured)
          .slice(0, 3);
        const fallback =
          featured.length > 0 ? featured : (data as Project[]).slice(0, 3);
        setProjects(fallback);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      <ParticleField />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 py-20 max-w-7xl mx-auto w-full gap-8 relative z-10">
        {/* Left text */}
        <div className="flex-1 space-y-6">
          <ScrollReveal direction="left" duration={1}>
            <div className="space-y-2">
              <p className="text-xs tracking-[0.3em] text-[var(--accent-purple)] uppercase">
                // system.identity
              </p>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                AHSAN{" "}
                <GlitchText
                  text="BURKI"
                  as="span"
                  className="gradient-text text-4xl md:text-6xl font-bold"
                />
              </h1>
              <h2 className="text-lg md:text-xl text-[var(--accent-cyan)] font-light tracking-wider text-shadow-glow">
                AI SYSTEMS ARCHITECT
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-[var(--text-secondary)] text-sm md:text-base max-w-lg leading-relaxed">
              Engineering intelligent agents and immersive web experiences from
              Waziristan to the world. Specializing in AI/ML systems, full-stack
              development, and 3D creative coding.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="px-6 py-3 bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)] text-xs tracking-widest rounded hover:bg-[var(--accent-cyan)]/20 transition-all animate-shimmer"
              >
                VIEW EXPERIMENTS →
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 border border-[var(--border-color)] text-[var(--text-secondary)] text-xs tracking-widest rounded hover:border-[var(--accent-purple)] hover:text-[var(--accent-purple)] transition-all"
              >
                OPEN UPLINK
              </Link>
            </div>
          </ScrollReveal>

          {/* Animated Stats */}
          <ScrollReveal delay={0.4}>
            <div className="flex gap-8 pt-4">
              <AnimatedCounter
                target={10}
                suffix="+"
                duration={2}
                className="text-2xl font-bold text-[var(--accent-cyan)]"
                label="PROJECTS"
                labelClassName="text-[10px] tracking-widest text-[var(--text-secondary)]"
              />
              <AnimatedCounter
                target={5}
                suffix="+"
                duration={2.2}
                className="text-2xl font-bold text-[var(--accent-cyan)]"
                label="AI MODELS"
                labelClassName="text-[10px] tracking-widest text-[var(--text-secondary)]"
              />
              <AnimatedCounter
                target={3}
                suffix=""
                duration={1.5}
                className="text-2xl font-bold text-[var(--accent-cyan)]"
                label="LANGUAGES"
                labelClassName="text-[10px] tracking-widest text-[var(--text-secondary)]"
              />
            </div>
          </ScrollReveal>
        </div>

        {/* Right 3D */}
        <ScrollReveal
          direction="right"
          duration={1.2}
          className="flex-1 h-[400px] md:h-[500px] w-full relative"
        >
          <Brain3D />
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[var(--accent-cyan)]/30 animate-border-pulse" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[var(--accent-cyan)]/30 animate-border-pulse" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[var(--accent-cyan)]/30 animate-border-pulse" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[var(--accent-cyan)]/30 animate-border-pulse" />
        </ScrollReveal>
      </section>

      {/* Terminal strip */}
      <ScrollReveal className="px-6 pb-8 max-w-7xl mx-auto w-full relative z-10">
        <TerminalText />
      </ScrollReveal>

      {/* Divider */}
      <div className="section-divider" />

      {/* How I Work — Process Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <ScrollReveal>
            <div className="space-y-2 text-center">
              <p className="text-xs tracking-[0.3em] text-[var(--accent-purple)]">
                // METHODOLOGY
              </p>
              <h2 className="text-2xl md:text-4xl font-bold">
                HOW I <span className="gradient-text">WORK</span>
              </h2>
            </div>
          </ScrollReveal>

          <StaggerReveal
            className="grid md:grid-cols-4 gap-6"
            staggerDelay={0.15}
          >
            {processSteps.map((step) => (
              <TiltCard key={step.number} intensity={8}>
                <div className="border border-[var(--border-color)] rounded-lg p-6 bg-[var(--bg-card)] h-full relative overflow-hidden group hover:border-[var(--accent-cyan)]/30 transition-all">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div
                    className="text-3xl mb-4 animate-float"
                    style={{
                      animationDelay: `${parseInt(step.number) * 0.5}s`,
                    }}
                  >
                    {step.icon}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[var(--accent-cyan)] text-xs font-bold">
                      {step.number}
                    </span>
                    <h3 className="text-sm font-bold tracking-wider">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </TiltCard>
            ))}
          </StaggerReveal>
        </div>
      </section>

      <div className="section-divider" />

      {/* Featured Projects Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <ScrollReveal>
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <p className="text-xs tracking-[0.3em] text-[var(--accent-purple)]">
                  // FEATURED_EXPERIMENTS
                </p>
                <h2 className="text-2xl md:text-4xl font-bold">
                  SELECT <span className="gradient-text">PROJECTS</span>
                </h2>
              </div>
              <Link
                href="/projects"
                className="hidden sm:block text-xs tracking-widest text-[var(--accent-cyan)] hover:underline underline-offset-4"
              >
                VIEW ALL →
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {projects.length > 0
              ? projects.map((project, i) => (
                  <ScrollReveal
                    key={project.id}
                    delay={i * 0.15}
                    direction="up"
                  >
                    <TiltCard intensity={6}>
                      <div className="border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] overflow-hidden h-full flex flex-col group hover:border-[var(--accent-cyan)]/30 transition-all duration-300">
                        <div className="h-40 bg-[var(--bg-secondary)] flex items-center justify-center relative overflow-hidden">
                          <span className="text-5xl font-bold text-[var(--accent-cyan)]/10 group-hover:scale-125 transition-transform duration-500">
                            {project.title.charAt(0)}
                          </span>
                          <div className="absolute top-3 left-3 px-2 py-1 bg-[var(--bg-primary)]/80 border border-[var(--border-color)] rounded text-[8px] tracking-widest text-[var(--accent-purple)] uppercase">
                            {project.category}
                          </div>
                          {/* Shimmer on hover */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent-cyan)]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        </div>
                        <div className="p-5 space-y-3 flex-1 flex flex-col">
                          <h3 className="text-sm font-bold tracking-wide group-hover:text-[var(--accent-cyan)] transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-[var(--text-secondary)] text-xs leading-relaxed flex-1">
                            {project.description.length > 120
                              ? project.description.slice(0, 120) + "..."
                              : project.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {project.techStack
                              .split(",")
                              .slice(0, 3)
                              .map((t) => (
                                <span
                                  key={t}
                                  className="px-2 py-0.5 text-[9px] tracking-wider border border-[var(--border-color)] rounded text-[var(--text-secondary)]"
                                >
                                  {t.trim()}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </ScrollReveal>
                ))
              : [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] h-72 animate-pulse"
                  />
                ))}
          </div>

          <ScrollReveal className="text-center sm:hidden">
            <Link
              href="/projects"
              className="text-xs tracking-widest text-[var(--accent-cyan)] hover:underline underline-offset-4"
            >
              VIEW ALL PROJECTS →
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <div className="section-divider" />

      {/* Stats Banner */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="border border-[var(--border-color)] rounded-lg p-8 md:p-12 bg-[var(--bg-card)] relative overflow-hidden animate-shimmer">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)]/50 to-transparent" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <AnimatedCounter
                  target={500}
                  suffix="+"
                  duration={2.5}
                  className="text-3xl md:text-4xl font-bold text-[var(--accent-cyan)]"
                  label="COMMITS"
                  labelClassName="text-[10px] tracking-widest text-[var(--text-secondary)] mt-1"
                />
                <AnimatedCounter
                  target={15}
                  suffix="+"
                  duration={2}
                  className="text-3xl md:text-4xl font-bold text-[var(--accent-purple)]"
                  label="REPOSITORIES"
                  labelClassName="text-[10px] tracking-widest text-[var(--text-secondary)] mt-1"
                />
                <AnimatedCounter
                  target={1000}
                  suffix="+"
                  duration={3}
                  className="text-3xl md:text-4xl font-bold text-[var(--accent-green)]"
                  label="CUPS OF COFFEE"
                  labelClassName="text-[10px] tracking-widest text-[var(--text-secondary)] mt-1"
                />
                <AnimatedCounter
                  target={24}
                  suffix="/7"
                  duration={1.5}
                  className="text-3xl md:text-4xl font-bold text-[var(--accent-cyan)]"
                  label="UPTIME"
                  labelClassName="text-[10px] tracking-widest text-[var(--text-secondary)] mt-1"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="section-divider" />

      {/* Testimonials Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <ScrollReveal>
            <div className="space-y-2 text-center">
              <p className="text-xs tracking-[0.3em] text-[var(--accent-purple)]">
                // SIGNAL_INTERCEPTS
              </p>
              <h2 className="text-2xl md:text-4xl font-bold">
                WHAT THEY <span className="gradient-text">SAY</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 0.15}>
                <TiltCard intensity={5}>
                  <div className="border border-[var(--border-color)] rounded-lg p-6 bg-[var(--bg-card)] h-full flex flex-col relative overflow-hidden group hover:border-[var(--accent-purple)]/30 transition-all duration-300">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-purple)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed flex-1 italic">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[var(--border-color)]">
                      <div className="w-9 h-9 rounded-full border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/5 flex items-center justify-center group-hover:border-[var(--accent-cyan)] transition-colors">
                        <span className="text-[10px] font-bold text-[var(--accent-cyan)]">
                          {t.initials}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--text-primary)]">
                          {t.name}
                        </p>
                        <p className="text-[10px] text-[var(--text-secondary)] tracking-wider">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <div className="border border-[var(--border-color)] rounded-lg p-8 md:p-12 bg-[var(--bg-card)] text-center relative overflow-hidden glow-border">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)]/50 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-purple)]/50 to-transparent" />

              <p className="text-xs tracking-[0.3em] text-[var(--accent-purple)] mb-4">
                // INITIATE_CONTACT
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                LET&apos;S BUILD{" "}
                <span className="gradient-text">SOMETHING</span> TOGETHER
              </h2>
              <p className="text-[var(--text-secondary)] text-sm mb-8 max-w-lg mx-auto">
                Whether it&apos;s an AI agent, a web application, or a creative
                experiment — I&apos;m always open to new collaborations and
                ideas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="px-8 py-3 bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)] text-xs tracking-[0.3em] rounded hover:bg-[var(--accent-cyan)]/20 transition-all"
                >
                  OPEN UPLINK →
                </Link>
                <Link
                  href="/experience"
                  className="px-8 py-3 border border-[var(--border-color)] text-[var(--text-secondary)] text-xs tracking-[0.3em] rounded hover:border-[var(--accent-purple)] hover:text-[var(--accent-purple)] transition-all"
                >
                  VIEW JOURNEY
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Tech stack bar */}
      <section className="relative z-10 border-t border-[var(--border-color)] py-8">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[10px] tracking-[0.3em] text-[var(--text-secondary)] mb-4 text-center">
            // TECH_STACK.ACTIVE
          </p>
          <StaggerReveal
            className="flex flex-wrap justify-center gap-4"
            staggerDelay={0.04}
          >
            {[
              "Python",
              "TypeScript",
              "React",
              "Next.js",
              "Flask",
              "TensorFlow",
              "Three.js",
              "GSAP",
              "Prisma",
              "Blender",
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-[10px] tracking-wider border border-[var(--border-color)] rounded text-[var(--text-secondary)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/5 transition-all cursor-default"
              >
                {tech}
              </span>
            ))}
          </StaggerReveal>
        </div>
      </section>
    </div>
  );
}
