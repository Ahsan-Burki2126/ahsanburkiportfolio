"use client";

import { useState } from "react";
import { formatProjectCategoryLabel, type ProjectRecord } from "@/lib/projects";

export default function ProjectThumbnail({
  project,
  liveUrl,
  height = "h-48",
}: {
  project: ProjectRecord;
  liveUrl: string | null;
  height?: string;
}) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div
      className={`${height} bg-[var(--bg-secondary)] relative flex items-center justify-center overflow-hidden`}
    >
      {showPreview && liveUrl ? (
        <iframe
          src={liveUrl}
          title={`${project.title} live preview`}
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          className="w-full h-full border-0"
        />
      ) : project.imageUrl ? (
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

      {liveUrl && !showPreview && (
        <button
          onClick={() => setShowPreview(true)}
          className="absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <span className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--accent-cyan)]/40 text-[var(--accent-cyan)] text-[9px] tracking-widest rounded">
            LOAD PREVIEW
          </span>
        </button>
      )}

      {project.featured && (
        <div className="absolute top-3 right-3 px-2 py-1 bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 rounded text-[8px] tracking-widest text-[var(--accent-cyan)]">
          FEATURED
        </div>
      )}
      <div className="absolute top-3 left-3 px-2 py-1 bg-[var(--bg-primary)]/80 border border-[var(--border-color)] rounded text-[8px] tracking-widest text-[var(--accent-purple)] uppercase">
        {formatProjectCategoryLabel(project.category)}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent-cyan)]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    </div>
  );
}
