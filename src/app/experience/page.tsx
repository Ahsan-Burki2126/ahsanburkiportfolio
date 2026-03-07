"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ScrollReveal, { StaggerReveal } from "@/components/ScrollReveal";
import GlitchText from "@/components/GlitchText";

const ParticleField = dynamic(() => import("@/components/ParticleField"), {
  ssr: false,
});

const timeline = [
  {
    year: "2022",
    title: "The Awakening",
    role: "Started BS in Artificial Intelligence",
    description:
      "Left the mountains of Waziristan with a burning curiosity for technology. Enrolled in AI degree, discovered the intersection of code and intelligence.",
    tags: ["Python", "Mathematics", "Linear Algebra"],
    type: "education" as const,
  },
  {
    year: "2023",
    title: "First Neural Sparks",
    role: "ML Research & Web Development",
    description:
      "Built first machine learning models, developed web applications using React and Flask. Started exploring computer vision and NLP fundamentals.",
    tags: ["React", "Flask", "TensorFlow", "Computer Vision"],
    type: "project" as const,
  },
  {
    year: "2023",
    title: "SafarDost Genesis",
    role: "Lead Developer — SafarDost Travel Platform",
    description:
      "Conceived and built SafarDost — an AI-powered travel companion to showcase Pakistan's hidden gems. Integrated intelligent recommendations, dynamic routing, and immersive UI.",
    tags: ["Next.js", "AI Agents", "Maps API", "Full-Stack"],
    type: "project" as const,
  },
  {
    year: "2024",
    title: "Deep Learning Dive",
    role: "AI Agent Development & Research",
    description:
      "Specialized in building autonomous AI agents. Developed custom frameworks for multi-agent orchestration, prompt engineering, and tool-use architectures.",
    tags: ["LangChain", "GPT-4", "Agent Framework", "RAG"],
    type: "research" as const,
  },
  {
    year: "2024",
    title: "Creative Coding Era",
    role: "3D Web & Cinematic Photography",
    description:
      "Merged technical skills with creative passion. Built immersive 3D web experiences with Three.js, captured cinematic photography of Pakistan's landscapes.",
    tags: ["Three.js", "Blender", "GSAP", "Photography"],
    type: "creative" as const,
  },
  {
    year: "2025",
    title: "The OmniLab",
    role: "Full-Stack AI Engineer — Present",
    description:
      "Building production-grade AI systems, contributing to open-source, and developing this portfolio as a living experiment in creative coding and modern web architecture.",
    tags: ["Next.js 16", "Prisma", "TypeScript", "LLMs"],
    type: "present" as const,
  },
];

const typeColors: Record<string, string> = {
  education: "var(--accent-green)",
  project: "var(--accent-cyan)",
  research: "var(--accent-purple)",
  creative: "#f59e0b",
  present: "var(--accent-cyan)",
};

export default function ExperiencePage() {
  const [quote, setQuote] = useState({ text: "", author: "" });
  const [quoteLoading, setQuoteLoading] = useState(true);

  useEffect(() => {
    fetch("/api/quote")
      .then((r) => r.json())
      .then((data) => setQuote(data))
      .catch(() =>
        setQuote({
          text: "The mind is like a parachute — it works best when open.",
          author: "Ghani Khan",
        }),
      )
      .finally(() => setQuoteLoading(false));
  }, []);

  return (
    <div className="min-h-screen py-20 px-6 relative">
      <ParticleField />
      <div className="max-w-5xl mx-auto space-y-16 relative z-10">
        {/* Header */}
        <ScrollReveal>
          <div className="space-y-2">
            <p className="text-xs tracking-[0.3em] text-[var(--accent-purple)]">
              // 04.MISSION_LOG
            </p>
            <GlitchText
              text="THE JOURNEY"
              as="h1"
              className="text-3xl md:text-5xl font-bold"
            />
            <p className="text-[var(--text-secondary)] text-sm max-w-lg">
              A chronological record of pivotal moments, experiments, and
              milestones in the evolution of an AI systems architect.
            </p>
          </div>
        </ScrollReveal>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--accent-cyan)]/50 via-[var(--accent-purple)]/50 to-transparent" />

          <div className="space-y-12">
            {timeline.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <ScrollReveal
                  key={i}
                  direction={isLeft ? "left" : "right"}
                  delay={i * 0.1}
                  distance={80}
                >
                  <div
                    className={`relative flex items-start gap-8 ${
                      isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Content card */}
                    <div
                      className={`flex-1 ml-16 md:ml-0 ${
                        isLeft
                          ? "md:text-right md:pr-12"
                          : "md:text-left md:pl-12"
                      }`}
                    >
                      <div className="border border-[var(--border-color)] rounded-lg p-6 bg-[var(--bg-card)] hover:border-[var(--accent-cyan)]/30 transition-all duration-300 group relative overflow-hidden">
                        {/* Top glow */}
                        <div
                          className="absolute top-0 left-0 w-full h-px opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            background: `linear-gradient(90deg, transparent, ${typeColors[item.type]}, transparent)`,
                          }}
                        />

                        <div
                          className={`flex items-center gap-3 mb-3 ${
                            isLeft ? "md:justify-end" : "md:justify-start"
                          }`}
                        >
                          <span
                            className="text-xs font-bold tracking-widest"
                            style={{ color: typeColors[item.type] }}
                          >
                            {item.year}
                          </span>
                          <span
                            className="px-2 py-0.5 text-[8px] tracking-widest uppercase border rounded"
                            style={{
                              color: typeColors[item.type],
                              borderColor: `color-mix(in srgb, ${typeColors[item.type]} 30%, transparent)`,
                              backgroundColor: `color-mix(in srgb, ${typeColors[item.type]} 5%, transparent)`,
                            }}
                          >
                            {item.type}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                        <p className="text-[var(--accent-cyan)] text-xs tracking-wider mb-3">
                          {item.role}
                        </p>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                          {item.description}
                        </p>

                        <div
                          className={`flex flex-wrap gap-1.5 mt-4 ${
                            isLeft ? "md:justify-end" : "md:justify-start"
                          }`}
                        >
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-[9px] tracking-wider border border-[var(--border-color)] rounded text-[var(--text-secondary)] group-hover:border-[var(--accent-cyan)]/20 transition-colors"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Timeline dot */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <div
                        className="w-4 h-4 rounded-full border-2 z-10"
                        style={{
                          borderColor: typeColors[item.type],
                          backgroundColor:
                            i === timeline.length - 1
                              ? typeColors[item.type]
                              : "var(--bg-primary)",
                          boxShadow: `0 0 12px color-mix(in srgb, ${typeColors[item.type]} 40%, transparent)`,
                        }}
                      />
                    </div>

                    {/* Empty space for opposite side */}
                    <div className="flex-1 hidden md:block" />
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* Philosophy Quote */}
        <ScrollReveal delay={0.2}>
          <div className="border border-[var(--border-color)] rounded-lg p-8 md:p-12 bg-[var(--bg-card)] text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-purple)]/50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)]/50 to-transparent" />
            <p className="text-[var(--accent-purple)] text-xs tracking-[0.3em] mb-4">
              // PHILOSOPHY
            </p>
            {quoteLoading ? (
              <div className="h-20 flex items-center justify-center">
                <span className="text-[var(--text-secondary)] text-xs tracking-widest animate-pulse">
                  INTERCEPTING SIGNAL...
                </span>
              </div>
            ) : (
              <>
                <blockquote className="text-xl md:text-2xl font-light leading-relaxed text-[var(--text-primary)]">
                  &ldquo;
                  <span className="gradient-text font-semibold">
                    {quote.text}
                  </span>
                  &rdquo;
                </blockquote>
                <p className="text-[var(--text-secondary)] text-xs mt-4 tracking-wider">
                  — {quote.author.toUpperCase()}
                </p>
              </>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
