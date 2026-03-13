"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import ScrollReveal from "@/components/ScrollReveal";
import GlitchText from "@/components/GlitchText";
import TiltCard from "@/components/TiltCard";
import {
  dedupeProjects,
  formatProjectCategoryLabel,
  getProjectFilterLabel,
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
  const normalizedProjects = useMemo(() => dedupeProjects(projects), [projects]);
  const [filter, setFilter] = useState<ProjectFilterValue>(PROJECT_FILTER_TABS[0]);

  const filtered = normalizedProjects.filter(
    (project) => resolveProjectCategory(project.category) === filter,
  );

  useEffect(() => {
    if (normalizedProjects.length === 0) return;
    const hasResultsForCurrentFilter = normalizedProjects.some(
      (project) => resolveProjectCategory(project.category) === filter,
    );
    if (hasResultsForCurrentFilter) return;

    const firstCategoryWithProjects = PROJECT_FILTER_TABS.find((tab) =>
      normalizedProjects.some(
        (project) => resolveProjectCategory(project.category) === tab,
      ),
    );
    if (firstCategoryWithProjects && firstCategoryWithProjects !== filter) {
      setFilter(firstCategoryWithProjects);
    }
  }, [filter, normalizedProjects]);

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
            <p className="text-[10px] text-[var(--text-secondary)] mt-2">
              Projects can be added via the Admin Dashboard.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((project, index) => (
              <ScrollReveal key={project.id} delay={index * 0.1}>
                <TiltCard intensity={5}>
                  <div
                    className={`border rounded-lg bg-[var(--bg-card)] overflow-hidden group hover:border-[var(--accent-cyan)]/30 transition-all duration-300 ${
                      project.featured
                        ? "border-[var(--accent-cyan)]/30 md:col-span-2"
                        : "border-[var(--border-color)]"
                    }`}
                  >
                    {/* Image placeholder */}
                    <div className="h-48 bg-[var(--bg-secondary)] relative flex items-center justify-center overflow-hidden">
                      {project.imageUrl ? (
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-[var(--accent-cyan)]/20 text-6xl font-bold group-hover:scale-125 transition-transform duration-500">
                          {project.title.charAt(0)}
                        </div>
                      )}
                      {project.featured && (
                        <div className="absolute top-3 right-3 px-2 py-1 bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 rounded text-[8px] tracking-widest text-[var(--accent-cyan)]">
                          FEATURED
                        </div>
                      )}
                      <div className="absolute top-3 left-3 px-2 py-1 bg-[var(--bg-primary)]/80 border border-[var(--border-color)] rounded text-[8px] tracking-widest text-[var(--accent-purple)] uppercase">
                        {formatProjectCategoryLabel(project.category)}
                      </div>
                      {/* Shimmer on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent-cyan)]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <h3 className="text-lg font-bold">{project.title}</h3>
                      <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                        {project.description}
                      </p>

                      {/* Tech stack */}
                      <div className="flex flex-wrap gap-2">
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
                      <div className="flex gap-3 pt-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
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
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
