"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import ScrollReveal, { StaggerReveal } from "@/components/ScrollReveal";
import GlitchText from "@/components/GlitchText";
import TiltCard from "@/components/TiltCard";
import { useCmsContent } from "@/lib/useContent";

const ParticleField = dynamic(() => import("@/components/ParticleField"), {
  ssr: false,
});

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  icon: string;
  color: string;
  skills: Skill[];
}

interface RadarSkill {
  name: string;
  value: number;
}

interface LearningItem {
  name: string;
  status: string;
  note: string;
}

const defaultSkillCategories: SkillCategory[] = [
  {
    title: "AI / Machine Learning",
    icon: "🧠",
    color: "var(--accent-purple)",
    skills: [
      { name: "Python", level: 92 },
      { name: "TensorFlow / Keras", level: 80 },
      { name: "LangChain / Agents", level: 88 },
      { name: "Prompt Engineering", level: 95 },
      { name: "NLP / Text Processing", level: 78 },
      { name: "Computer Vision", level: 72 },
    ],
  },
  {
    title: "Web Development",
    icon: "💻",
    color: "var(--accent-cyan)",
    skills: [
      { name: "TypeScript", level: 88 },
      { name: "React / Next.js", level: 90 },
      { name: "Node.js / Express", level: 82 },
      { name: "Prisma / Databases", level: 78 },
      { name: "REST / GraphQL APIs", level: 85 },
      { name: "Tailwind CSS", level: 92 },
    ],
  },
  {
    title: "Creative & 3D",
    icon: "🎨",
    color: "#f59e0b",
    skills: [
      { name: "Three.js / WebGL", level: 75 },
      { name: "GSAP Animations", level: 80 },
      { name: "Blender 3D", level: 70 },
      { name: "Cinematic Photography", level: 85 },
      { name: "UI / UX Design", level: 78 },
      { name: "Motion Graphics", level: 65 },
    ],
  },
  {
    title: "DevOps & Tools",
    icon: "⚙️",
    color: "var(--accent-green)",
    skills: [
      { name: "Git / GitHub", level: 90 },
      { name: "Docker", level: 68 },
      { name: "Linux / CLI", level: 82 },
      { name: "Vercel / AWS", level: 75 },
      { name: "CI / CD Pipelines", level: 70 },
      { name: "VS Code / Cursor", level: 95 },
    ],
  },
];

function AnimatedBar({
  level,
  color,
  delay,
}: {
  level: number;
  color: string;
  delay: number;
}) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;

    gsap.set(el, { width: "0%" });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(el, {
              width: `${level}%`,
              duration: 1.2,
              delay,
              ease: "power3.out",
            });
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [level, delay]);

  return (
    <div className="w-full h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
      <div
        ref={barRef}
        className="h-full rounded-full"
        style={{
          background: `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 60%, white))`,
          boxShadow: `0 0 8px color-mix(in srgb, ${color} 40%, transparent)`,
        }}
      />
    </div>
  );
}

function HexagonSkillMap({ radarSkills }: { radarSkills: RadarSkill[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const skills =
    radarSkills.length > 0
      ? radarSkills
      : [
          { name: "AI/ML", value: 0.88 },
          { name: "Frontend", value: 0.9 },
          { name: "Backend", value: 0.82 },
          { name: "Creative", value: 0.78 },
          { name: "DevOps", value: 0.72 },
          { name: "Research", value: 0.85 },
        ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 300;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const maxR = 110;

    const drawRadar = (progress: number) => {
      ctx.clearRect(0, 0, size, size);

      // Draw concentric hexagons (levels)
      for (let lvl = 1; lvl <= 4; lvl++) {
        const r = (maxR * lvl) / 4;
        ctx.beginPath();
        for (let i = 0; i <= 6; i++) {
          const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(39, 39, 42, 0.6)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw axis lines
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + maxR * Math.cos(angle), cy + maxR * Math.sin(angle));
        ctx.strokeStyle = "rgba(39, 39, 42, 0.4)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw data polygon
      ctx.beginPath();
      skills.forEach((skill, i) => {
        const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        const r = maxR * skill.value * progress;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = "rgba(0, 240, 255, 0.08)";
      ctx.fill();
      ctx.strokeStyle = "rgba(0, 240, 255, 0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw data points & labels
      skills.forEach((skill, i) => {
        const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        const r = maxR * skill.value * progress;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);

        // Point
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle =
          hovered === skill.name ? "#a855f7" : "rgba(0, 240, 255, 0.9)";
        ctx.fill();
        ctx.strokeStyle = "#0a0a0f";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        const labelR = maxR + 20;
        const lx = cx + labelR * Math.cos(angle);
        const ly = cy + labelR * Math.sin(angle);
        ctx.fillStyle = "rgba(228, 228, 231, 0.8)";
        ctx.font = "10px JetBrains Mono";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(skill.name, lx, ly);
      });
    };

    // Animate in
    const obj = { progress: 0 };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(obj, {
              progress: 1,
              duration: 1.5,
              ease: "power3.out",
              onUpdate: () => drawRadar(obj.progress),
            });
            observer.unobserve(canvas);
          }
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(canvas);
    drawRadar(0);

    return () => observer.disconnect();
  }, [hovered]);

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        className="cursor-crosshair"
        style={{ width: 300, height: 300 }}
      />
    </div>
  );
}

export default function SkillsPage() {
  const { text, json } = useCmsContent("skills");

  const skillCategories = json<SkillCategory[]>(
    "skills_categories",
    defaultSkillCategories,
  );
  const radarSkills = json<RadarSkill[]>("skills_radar", [
    { name: "AI/ML", value: 0.88 },
    { name: "Frontend", value: 0.9 },
    { name: "Backend", value: 0.82 },
    { name: "Creative", value: 0.78 },
    { name: "DevOps", value: 0.72 },
    { name: "Research", value: 0.85 },
  ]);
  const currentlyLearning = json<LearningItem[]>(
    "skills_currently_learning",
    [],
  );
  const fullTechStack = json<string[]>("skills_full_stack", []);

  return (
    <div className="min-h-screen py-20 px-6 relative">
      <ParticleField />
      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Header */}
        <ScrollReveal>
          <div className="space-y-2">
            <p className="text-xs tracking-[0.3em] text-[var(--accent-purple)]">
              // 05.CAPABILITY_MAP
            </p>
            <GlitchText
              text={text("skills_page_title", "SKILL MATRIX")}
              as="h1"
              className="text-3xl md:text-5xl font-bold"
            />
            <p className="text-[var(--text-secondary)] text-sm max-w-lg">
              {text(
                "skills_page_description",
                "A comprehensive breakdown of technical proficiencies, constantly evolving through experimentation and real-world deployment.",
              )}
            </p>
          </div>
        </ScrollReveal>

        {/* Radar Chart */}
        <ScrollReveal delay={0.1}>
          <div className="border border-[var(--border-color)] rounded-lg p-8 bg-[var(--bg-card)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)]/50 to-transparent" />
            <h2 className="text-sm tracking-widest text-[var(--accent-cyan)] mb-8 text-center">
              COMPETENCY RADAR // OVERVIEW
            </h2>
            <HexagonSkillMap radarSkills={radarSkills} />
          </div>
        </ScrollReveal>

        {/* Skill Categories Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {skillCategories.map((cat, catIdx) => (
            <ScrollReveal
              key={cat.title}
              direction={catIdx % 2 === 0 ? "left" : "right"}
              delay={catIdx * 0.1}
            >
              <TiltCard intensity={5}>
                <div className="border border-[var(--border-color)] rounded-lg p-6 bg-[var(--bg-card)] h-full relative overflow-hidden group">
                  <div
                    className="absolute top-0 left-0 w-full h-px opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)`,
                    }}
                  />

                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">{cat.icon}</span>
                    <h3
                      className="text-sm font-bold tracking-wider"
                      style={{ color: cat.color }}
                    >
                      {cat.title.toUpperCase()}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {cat.skills.map((skill, skillIdx) => (
                      <div key={skill.name} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-[var(--text-primary)]">
                            {skill.name}
                          </span>
                          <span className="text-[var(--text-secondary)] tabular-nums">
                            {skill.level}%
                          </span>
                        </div>
                        <AnimatedBar
                          level={skill.level}
                          color={cat.color}
                          delay={catIdx * 0.1 + skillIdx * 0.05}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>

        {/* Currently Learning */}
        <ScrollReveal delay={0.2}>
          <div className="border border-[var(--border-color)] rounded-lg p-6 md:p-8 bg-[var(--bg-card)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-green)]/50 to-transparent" />
            <h2 className="text-sm tracking-widest text-[var(--accent-green)] mb-6">
              CURRENTLY LEARNING // ACTIVE_MODULES
            </h2>
            <StaggerReveal
              className="grid md:grid-cols-3 gap-4"
              staggerDelay={0.08}
            >
              {(currentlyLearning.length > 0
                ? currentlyLearning
                : [
                    {
                      name: "Rust",
                      status: "Exploring",
                      note: "Systems-level AI performance",
                    },
                    {
                      name: "CUDA / GPU Programming",
                      status: "In Progress",
                      note: "Custom ML kernel optimization",
                    },
                    {
                      name: "German (B1)",
                      status: "Active",
                      note: "Language acquisition via Duolingo",
                    },
                    {
                      name: "Kubernetes",
                      status: "Exploring",
                      note: "Container orchestration for ML pipelines",
                    },
                    {
                      name: "WebGPU",
                      status: "Researching",
                      note: "Next-gen browser compute shaders",
                    },
                    {
                      name: "Multimodal AI",
                      status: "Active",
                      note: "Vision-language model integration",
                    },
                  ]
              ).map((item) => (
                <div
                  key={item.name}
                  className="border border-[var(--border-color)] rounded p-4 hover:border-[var(--accent-green)]/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-[var(--text-primary)]">
                      {item.name}
                    </h4>
                    <span className="text-[8px] tracking-widest text-[var(--accent-green)] px-1.5 py-0.5 rounded border border-[var(--accent-green)]/20 bg-[var(--accent-green)]/5">
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[var(--text-secondary)] text-[10px] leading-relaxed">
                    {item.note}
                  </p>
                </div>
              ))}
            </StaggerReveal>
          </div>
        </ScrollReveal>

        {/* Tools & Technologies Cloud */}
        <ScrollReveal>
          <div className="border border-[var(--border-color)] rounded-lg p-6 md:p-8 bg-[var(--bg-card)]">
            <h2 className="text-sm tracking-widest text-[var(--accent-cyan)] mb-6 text-center">
              TOOLS & TECHNOLOGIES // FULL_STACK
            </h2>
            <StaggerReveal
              className="flex flex-wrap justify-center gap-3"
              staggerDelay={0.03}
            >
              {(fullTechStack.length > 0
                ? fullTechStack
                : [
                    "Python",
                    "TypeScript",
                    "JavaScript",
                    "SQL",
                    "HTML/CSS",
                    "React",
                    "Next.js",
                    "Flask",
                    "Express",
                    "FastAPI",
                    "TensorFlow",
                    "PyTorch",
                    "LangChain",
                    "OpenAI API",
                    "Prisma",
                    "PostgreSQL",
                    "SQLite",
                    "MongoDB",
                    "Three.js",
                    "GSAP",
                    "Tailwind",
                    "Framer Motion",
                    "Git",
                    "Docker",
                    "Vercel",
                    "AWS",
                    "Linux",
                    "Blender",
                    "Figma",
                    "VS Code",
                    "Cursor",
                  ]
              ).map((tech, i) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-[10px] tracking-wider border border-[var(--border-color)] rounded text-[var(--text-secondary)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/5 transition-all cursor-default"
                  style={{
                    animationDelay: `${i * 0.05}s`,
                  }}
                >
                  {tech}
                </span>
              ))}
            </StaggerReveal>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
