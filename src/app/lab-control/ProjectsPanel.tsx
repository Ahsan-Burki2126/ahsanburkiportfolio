"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_PROJECT_CATEGORY,
  dedupeProjects,
  formatProjectCategoryLabel,
  normalizeProjectUrl,
  normalizeProjectCategory,
  PROJECT_CATEGORY_OPTIONS,
  type ProjectRecord,
} from "@/lib/projects";

const emptyProject: {
  title: string;
  description: string;
  techStack: string;
  category: string;
  imageUrl: string;
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
} = {
  title: "",
  description: "",
  techStack: "",
  category: DEFAULT_PROJECT_CATEGORY,
  imageUrl: "",
  liveUrl: "",
  repoUrl: "",
  featured: false,
};

export default function ProjectsPanel({ token }: { token: string }) {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyProject);
  const [editing, setEditing] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchProjects = useCallback(() => {
    setLoading(true);
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        setProjects(dedupeProjects(data));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be under 10MB.");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "portfolio/projects");

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Upload failed");
        return;
      }

      const { url } = await res.json();
      setForm((prev) => ({ ...prev, imageUrl: url }));
      setImagePreview(url);
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, imageUrl: "" }));
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);

    const url = editing ? `/api/projects/${editing}` : "/api/projects";
    const method = editing ? "PUT" : "POST";

    try {
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          category: normalizeProjectCategory(form.category),
          liveUrl: normalizeProjectUrl(form.liveUrl),
          repoUrl: normalizeProjectUrl(form.repoUrl),
        }),
      });

      setForm(emptyProject);
      setEditing(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchProjects();
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (project: ProjectRecord) => {
    setEditing(project.id);
    setForm({
      title: project.title,
      description: project.description,
      techStack: project.techStack,
      category: normalizeProjectCategory(project.category),
      imageUrl: project.imageUrl || "",
      liveUrl: project.liveUrl || "",
      repoUrl: project.repoUrl || "",
      featured: project.featured,
    });
    setImagePreview(project.imageUrl || null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setTimeout(
      () =>
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      100,
    );
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this experiment?")) return;
    await fetch(`/api/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProjects();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-sm tracking-widest text-[var(--accent-purple)]">
        EXPERIMENT MANAGER
      </h2>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="border border-[var(--border-color)] rounded-lg p-6 bg-[var(--bg-card)] space-y-4"
      >
        <h3 className="text-[10px] tracking-widest text-[var(--accent-cyan)]">
          {editing ? "EDIT EXPERIMENT" : "NEW EXPERIMENT"}
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] tracking-widest text-[var(--text-secondary)]">
              TITLE
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm focus:border-[var(--accent-cyan)] focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] tracking-widest text-[var(--text-secondary)]">
              CATEGORY
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm focus:border-[var(--accent-cyan)] focus:outline-none"
            >
              {PROJECT_CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] tracking-widest text-[var(--text-secondary)]">
            DESCRIPTION
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={3}
            className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm focus:border-[var(--accent-cyan)] focus:outline-none resize-none"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] tracking-widest text-[var(--text-secondary)]">
              TECH STACK (comma-separated)
            </label>
            <input
              type="text"
              value={form.techStack}
              onChange={(e) => setForm({ ...form, techStack: e.target.value })}
              required
              className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm focus:border-[var(--accent-cyan)] focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] tracking-widest text-[var(--text-secondary)]">
              LIVE URL
            </label>
            <input
              type="text"
              value={form.liveUrl}
              onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
              placeholder="https://example.com or my-app.vercel.app"
              className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm focus:border-[var(--accent-cyan)] focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] tracking-widest text-[var(--text-secondary)]">
              REPO URL
            </label>
            <input
              type="text"
              value={form.repoUrl}
              onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
              placeholder="https://github.com/user/repo"
              className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm focus:border-[var(--accent-cyan)] focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] tracking-widest text-[var(--text-secondary)]">
            PROJECT IMAGE
          </label>
          <div className="flex items-start gap-4">
            {imagePreview ? (
              <div className="relative w-32 h-20 rounded border border-[var(--border-color)] overflow-hidden shrink-0">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500/80 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer"
                >
                  &times;
                </button>
              </div>
            ) : (
              <div className="w-32 h-20 rounded border border-dashed border-[var(--border-color)] flex items-center justify-center shrink-0">
                <span className="text-[var(--text-secondary)] text-[9px] tracking-wider">
                  NO IMAGE
                </span>
              </div>
            )}
            <div className="flex-1 space-y-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                disabled={uploading}
                className="w-full text-xs text-[var(--text-secondary)] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border file:border-[var(--border-color)] file:bg-[var(--bg-secondary)] file:text-[var(--text-secondary)] file:text-[9px] file:tracking-wider file:cursor-pointer hover:file:border-[var(--accent-cyan)] hover:file:text-[var(--accent-cyan)] disabled:opacity-50"
              />
              <p className="text-[9px] text-[var(--text-secondary)]">
                {uploading ? "Uploading to Cloudinary..." : "Max 10MB. JPG, PNG, WebP, GIF."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4 accent-[var(--accent-cyan)]"
            />
            <span className="text-xs text-[var(--text-secondary)]">
              FEATURED PROJECT
            </span>
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)] text-[10px] tracking-widest rounded hover:bg-[var(--accent-cyan)]/20 transition-colors"
          >
            {saving ? "SAVING..." : editing ? "UPDATE" : "CREATE"} EXPERIMENT
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(emptyProject);
                setImagePreview(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="px-6 py-2 border border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] tracking-widest rounded hover:border-red-500/30 hover:text-red-400 transition-colors"
            >
              CANCEL
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="text-center py-10 text-[var(--text-secondary)] text-sm">
          Loading...
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border border-[var(--border-color)] rounded-lg p-4 bg-[var(--bg-card)] flex items-center justify-between gap-4"
            >
              {project.imageUrl ? (
                <div className="w-12 h-12 rounded border border-[var(--border-color)] overflow-hidden shrink-0">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded border border-[var(--border-color)] flex items-center justify-center shrink-0 bg-[var(--bg-secondary)]">
                  <span className="text-[var(--accent-cyan)]/30 text-lg font-bold">
                    {project.title.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold truncate">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <span className="text-[8px] px-1.5 py-0.5 bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 rounded text-[var(--accent-cyan)] tracking-wider">
                      FEATURED
                    </span>
                  )}
                  <span className="text-[8px] px-1.5 py-0.5 bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/30 rounded text-[var(--accent-purple)] tracking-wider uppercase">
                    {formatProjectCategoryLabel(project.category)}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1 truncate">
                  {project.description}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => startEdit(project)}
                  className="px-3 py-1.5 text-[9px] tracking-wider border border-[var(--border-color)] rounded text-[var(--text-secondary)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] transition-colors cursor-pointer"
                >
                  EDIT
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="px-3 py-1.5 text-[9px] tracking-wider border border-red-500/30 rounded text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  DELETE
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
