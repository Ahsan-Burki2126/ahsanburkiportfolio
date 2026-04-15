"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import ScrollReveal from "@/components/ScrollReveal";
import GlitchText from "@/components/GlitchText";
import TiltCard from "@/components/TiltCard";
import ProjectThumbnail from "@/components/ProjectThumbnail";
import {
  dedupeProjects,
  getProjectFilterLabel,
  normalizeProjectUrl,
  PROJECT_FILTER_TABS,
  resolveProjectCategory,
  type ProjectFilterValue,
  type ProjectRecord,
} from "@/lib/projects";

const ParticleField = dynamic(() => import("@/components/ParticleField"), {
  ssr: false,
});

export default function ProjectsClient({
  projects,
}: {
  projects: ProjectRecord[];
}) {
  const normalizedProjects = useMemo(
    () => dedupeProjects(projects),
    [projects],
  );
  const [filter, setFilter] = useState<ProjectFilterValue>(
    PROJECT_FILTER_TABS[0],
  );

  const filtered = normalizedProjects.filter(
    (project) => resolveProjectCategory(project.category) === filter,
  );

  return (
    <div className="min-h-screen py-20 px-6 relative">
      <ParticleField />
      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <ScrollReveal>
          <div className="space-y-2">
            <p className="text-xs tracking-[0.3em] text-[var(--accent-purple)]">
              // 02.EXPERIMENT_LOG
            </p>
            <GlitchText
              text="PROJECT ARCHIVE"
              as="h1"
              className="text-3xl md:text-5xl font-bold"
            />
            <p className="text-[var(--text-secondary)] text-sm max-w-lg">
              A curated collection of experiments in AI, web development, and
              creative coding.
            </p>
          </div>
        </ScrollReveal>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {PROJECT_FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 text-[10px] tracking-widest uppercase rounded transition-all ${
                filter === tab
                  ? "bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)]"
                  : "border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-purple)]/50"
              }`}
            >
              {getProjectFilterLabel(tab)}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)]">
            <p className="text-[var(--text-secondary)] text-sm">
              No projects found in this category.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((project, index) => (
              <ScrollReveal key={project.id} delay={index * 0.1}>
                <TiltCard intensity={5}>
                  {(() => {
                    const normalizedLiveUrl = normalizeProjectUrl(
                      project.liveUrl,
                    );
                    return (
                      <div
                        className={`border rounded-lg bg-[var(--bg-card)] overflow-hidden group hover:border-[var(--accent-cyan)]/30 transition-all duration-300 h-full flex flex-col ${
                          project.featured
                            ? "border-[var(--accent-cyan)]/30 md:col-span-2"
                            : "border-[var(--border-color)]"
                        }`}
                      >
                        <ProjectThumbnail
                          project={project}
                          liveUrl={normalizedLiveUrl}
                        />

                        {/* Content */}
                        <div className="p-6 space-y-4 flex-1 flex flex-col">
                          <h3 className="text-lg font-bold min-h-14">
                            {project.title}
                          </h3>
                          <p className="text-[var(--text-secondary)] text-sm leading-relaxed h-24 overflow-y-auto pr-1">
                            {project.description}
                          </p>

                          {/* Tech stack */}
                          <div className="flex flex-wrap gap-2 h-16 overflow-y-auto pr-1">
                            {project.techStack.split(",").map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-1 text-[9px] tracking-wider border border-[var(--border-color)] rounded text-[var(--text-secondary)]"
                              >
                                {tech.trim()}
                              </span>
                            ))}
                          </div>

                          {/* Links */}
                          <div className="flex gap-3 pt-2 mt-auto">
                            {normalizedLiveUrl && (
                              <a
                                href={normalizedLiveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 text-[10px] tracking-widest bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)] rounded hover:bg-[var(--accent-cyan)]/20 transition-colors"
                              >
                                LIVE DEMO →
                              </a>
                            )}
                            {project.repoUrl && (
                              <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 text-[10px] tracking-widest border border-[var(--border-color)] text-[var(--text-secondary)] rounded hover:border-[var(--accent-purple)] hover:text-[var(--accent-purple)] transition-colors"
                              >
                                SOURCE CODE
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
