"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  techStack: string;
  liveUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  category: string;
}

const emptyProject = {
  title: "",
  description: "",
  techStack: "",
  category: "web",
  imageUrl: "",
  liveUrl: "",
  repoUrl: "",
  featured: false,
};

export default function ProjectsPanel({ token }: { token: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyProject);
  const [editing, setEditing] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [categories, setCategories] = useState<string[]>([
    "web",
    "ai",
    "3d",
    "photography",
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [catSaving, setCatSaving] = useState(false);

  const fetchCategories = useCallback(() => {
    fetch("/api/content?key=project_categories")
      .then((r) => r.json())
      .then((data) => {
        if (data.value) {
          try {
            setCategories(JSON.parse(data.value));
          } catch {
            /* keep defaults */
          }
        }
      })
      .catch(() => {});
  }, []);

  const saveCategories = async (updated: string[]) => {
    setCatSaving(true);
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        key: "project_categories",
        value: JSON.stringify(updated),
      }),
    });
    if (!res.ok) {
      // Key might not exist yet — create it
      await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          key: "project_categories",
          value: JSON.stringify(updated),
          type: "json",
          page: "global",
          label: "Project Categories",
        }),
      });
    }
    setCategories(updated);
    setCatSaving(false);
  };

  const addCategory = async () => {
    const name = newCategory.trim().toLowerCase();
    if (!name || categories.includes(name)) return;
    await saveCategories([...categories, name]);
    setNewCategory("");
  };

  const deleteCategory = async (cat: string) => {
    const inUse = projects.some((p) => p.category === cat);
    if (
      inUse &&
      !confirm(`Category "${cat}" is used by existing projects. Delete anyway?`)
    )
      return;
    await saveCategories(categories.filter((c) => c !== cat));
  };

  const fetchProjects = useCallback(() => {
    setLoading(true);
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, [fetchProjects, fetchCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editing ? `/api/projects/${editing}` : "/api/projects";
    const method = editing ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    setForm(emptyProject);
    setEditing(null);
    fetchProjects();
  };

  const startEdit = (project: Project) => {
    setEditing(project.id);
    setForm({
      title: project.title,
      description: project.description,
      techStack: project.techStack,
      category: project.category,
      imageUrl: project.imageUrl || "",
      liveUrl: project.liveUrl || "",
      repoUrl: project.repoUrl || "",
      featured: project.featured,
    });
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

      {/* Form */}
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
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
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
              type="url"
              value={form.liveUrl}
              onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
              className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm focus:border-[var(--accent-cyan)] focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] tracking-widest text-[var(--text-secondary)]">
              REPO URL
            </label>
            <input
              type="url"
              value={form.repoUrl}
              onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
              className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm focus:border-[var(--accent-cyan)] focus:outline-none"
            />
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
            className="px-6 py-2 bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)] text-[10px] tracking-widest rounded hover:bg-[var(--accent-cyan)]/20 transition-colors"
          >
            {editing ? "UPDATE" : "CREATE"} EXPERIMENT
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(emptyProject);
              }}
              className="px-6 py-2 border border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] tracking-widest rounded hover:border-red-500/30 hover:text-red-400 transition-colors"
            >
              CANCEL
            </button>
          )}
        </div>
      </form>

      {/* Category Manager */}
      <div className="border border-[var(--border-color)] rounded-lg p-6 bg-[var(--bg-card)] space-y-4">
        <h3 className="text-[10px] tracking-widest text-[var(--accent-purple)]">
          CATEGORY MANAGER
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-xs"
            >
              <span className="uppercase tracking-wider">{cat}</span>
              <button
                onClick={() => deleteCategory(cat)}
                disabled={catSaving}
                className="text-red-400 hover:text-red-300 transition-colors text-sm leading-none"
                title={`Delete ${cat}`}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addCategory())
            }
            placeholder="New category name..."
            className="flex-1 max-w-xs px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm focus:border-[var(--accent-cyan)] focus:outline-none"
          />
          <button
            type="button"
            onClick={addCategory}
            disabled={catSaving || !newCategory.trim()}
            className="px-4 py-2 bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/30 text-[var(--accent-purple)] text-[10px] tracking-widest rounded hover:bg-[var(--accent-purple)]/20 transition-colors disabled:opacity-50"
          >
            {catSaving ? "SAVING..." : "ADD CATEGORY"}
          </button>
        </div>
      </div>

      {/* Project list */}
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
                    {project.category}
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
