"use client";

import { useEffect, useState, useCallback } from "react";

interface TimelineEntry {
  year: string;
  title: string;
  role: string;
  description: string;
  tags: string[];
  type: string;
}

interface ContentItem {
  id: string;
  key: string;
  value: string;
  type: string;
  page: string;
  label: string;
}

const TYPE_OPTIONS = ["education", "project", "research", "creative", "present"];

const EMPTY_ENTRY: TimelineEntry = {
  year: new Date().getFullYear().toString(),
  title: "",
  role: "",
  description: "",
  tags: [],
  type: "project",
};

export default function ExperiencePanel({ token }: { token: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [successKey, setSuccessKey] = useState<string | null>(null);
  const [existingKeys, setExistingKeys] = useState<Set<string>>(new Set());

  // Page text fields
  const [pageTitle, setPageTitle] = useState("THE JOURNEY");
  const [pageDescription, setPageDescription] = useState("");

  // Timeline entries
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);

  // Tag input per entry
  const [tagInputs, setTagInputs] = useState<Record<number, string>>({});

  const fetchContent = useCallback(() => {
    setLoading(true);
    fetch("/api/content?page=experience")
      .then((r) => r.json())
      .then((data) => {
        const items: ContentItem[] = data.items || [];
        const keys = new Set(items.map((i: ContentItem) => i.key));
        setExistingKeys(keys);
        const map: Record<string, string> = data.map || {};

        if (map.experience_page_title) setPageTitle(map.experience_page_title);
        if (map.experience_page_description) setPageDescription(map.experience_page_description);

        if (map.experience_timeline) {
          try { setTimeline(JSON.parse(map.experience_timeline)); } catch { /* keep default */ }
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const saveContent = async (key: string, value: string, type: string, label: string) => {
    setSaving(key);
    const exists = existingKeys.has(key);
    const method = exists ? "PUT" : "POST";
    const body = exists
      ? { key, value }
      : { key, value, type, page: "experience", label };

    const res = await fetch("/api/content", {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setExistingKeys((prev) => new Set([...prev, key]));
      setSuccessKey(key);
      setTimeout(() => setSuccessKey(null), 2000);
    }
    setSaving(null);
  };

  const updateEntry = (idx: number, field: keyof TimelineEntry, value: string | string[]) => {
    setTimeline((prev) => prev.map((e, i) => (i === idx ? { ...e, [field]: value } : e)));
  };

  const addEntry = () => {
    setTimeline((prev) => [...prev, { ...EMPTY_ENTRY, tags: [] }]);
  };

  const removeEntry = (idx: number) => {
    setTimeline((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveEntry = (idx: number, direction: "up" | "down") => {
    setTimeline((prev) => {
      const arr = [...prev];
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= arr.length) return arr;
      [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
      return arr;
    });
  };

  const addTag = (idx: number) => {
    const tag = (tagInputs[idx] || "").trim();
    if (!tag) return;
    setTimeline((prev) =>
      prev.map((e, i) => (i === idx ? { ...e, tags: [...e.tags, tag] } : e)),
    );
    setTagInputs((prev) => ({ ...prev, [idx]: "" }));
  };

  const removeTag = (entryIdx: number, tagIdx: number) => {
    setTimeline((prev) =>
      prev.map((e, i) => (i === entryIdx ? { ...e, tags: e.tags.filter((_, ti) => ti !== tagIdx) } : e)),
    );
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-[var(--text-secondary)] text-sm">
        Loading experience data...
      </div>
    );
  }

  const typeColors: Record<string, string> = {
    education: "var(--accent-green)",
    project: "var(--accent-cyan)",
    research: "var(--accent-purple)",
    creative: "#f59e0b",
    present: "var(--accent-cyan)",
  };

  const inputClass =
    "w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm text-[var(--text-primary)] focus:border-[var(--accent-cyan)] focus:outline-none";
  const btnPrimary =
    "px-4 py-1.5 bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)] text-[10px] tracking-widest rounded hover:bg-[var(--accent-cyan)]/20 transition-colors disabled:opacity-50";
  const btnDanger =
    "px-3 py-1.5 border border-red-500/30 text-red-400 text-[10px] tracking-widest rounded hover:bg-red-500/10 transition-colors";
  const btnSecondary =
    "px-3 py-1.5 border border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] tracking-widest rounded hover:bg-white/5 transition-colors";

  const SaveButton = ({ contentKey, onClick }: { contentKey: string; onClick: () => void }) => (
    <div className="flex items-center gap-3">
      <button onClick={onClick} disabled={saving === contentKey} className={btnPrimary}>
        {saving === contentKey ? "SAVING..." : "SAVE"}
      </button>
      {successKey === contentKey && (
        <span className="text-[10px] text-[var(--accent-green)] tracking-wider">SAVED ✓</span>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-sm tracking-widest text-[var(--accent-purple)]">EXPERIENCE MANAGER</h2>
      </div>

      {/* Page Title & Description */}
      <div className="border border-[var(--border-color)] rounded-lg p-5 bg-[var(--bg-card)] space-y-4">
        <h3 className="text-xs tracking-widest text-[var(--accent-cyan)]">PAGE HEADER</h3>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] tracking-widest text-[var(--text-secondary)] block mb-1">TITLE</label>
            <input value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-[10px] tracking-widest text-[var(--text-secondary)] block mb-1">DESCRIPTION</label>
            <textarea value={pageDescription} onChange={(e) => setPageDescription(e.target.value)} rows={2} className={inputClass} />
          </div>
          <div className="flex gap-2">
            <SaveButton
              contentKey="experience_page_title"
              onClick={() => saveContent("experience_page_title", pageTitle, "text", "Experience Page Title")}
            />
            <SaveButton
              contentKey="experience_page_description"
              onClick={() => saveContent("experience_page_description", pageDescription, "text", "Experience Page Description")}
            />
          </div>
        </div>
      </div>

      {/* Timeline Entries */}
      <div className="border border-[var(--border-color)] rounded-lg p-5 bg-[var(--bg-card)] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs tracking-widest text-[var(--accent-cyan)]">TIMELINE ENTRIES</h3>
          <button onClick={addEntry} className={btnSecondary}>+ ADD ENTRY</button>
        </div>
        <p className="text-[9px] text-[var(--text-secondary)] tracking-wider">
          Entries appear in the order shown below. Use arrows to reorder.
        </p>

        <div className="space-y-4">
          {timeline.map((entry, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-4 space-y-3 bg-[var(--bg-secondary)]"
              style={{ borderColor: `color-mix(in srgb, ${typeColors[entry.type] || "var(--border-color)"} 40%, transparent)` }}
            >
              {/* Entry header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 text-[8px] tracking-widest uppercase border rounded"
                    style={{
                      color: typeColors[entry.type],
                      borderColor: `color-mix(in srgb, ${typeColors[entry.type]} 30%, transparent)`,
                      backgroundColor: `color-mix(in srgb, ${typeColors[entry.type]} 5%, transparent)`,
                    }}
                  >
                    {entry.type}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">{entry.year} — {entry.title || "Untitled"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveEntry(idx, "up")}
                    disabled={idx === 0}
                    className={`${btnSecondary} disabled:opacity-30`}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveEntry(idx, "down")}
                    disabled={idx === timeline.length - 1}
                    className={`${btnSecondary} disabled:opacity-30`}
                  >
                    ↓
                  </button>
                  <button onClick={() => removeEntry(idx)} className={btnDanger}>REMOVE</button>
                </div>
              </div>

              {/* Entry fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] tracking-widest text-[var(--text-secondary)] block mb-1">YEAR</label>
                  <input
                    value={entry.year}
                    onChange={(e) => updateEntry(idx, "year", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 2024"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-widest text-[var(--text-secondary)] block mb-1">TITLE</label>
                  <input
                    value={entry.title}
                    onChange={(e) => updateEntry(idx, "title", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Deep Learning Dive"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-widest text-[var(--text-secondary)] block mb-1">TYPE</label>
                  <select
                    value={entry.type}
                    onChange={(e) => updateEntry(idx, "type", e.target.value)}
                    className={inputClass}
                  >
                    {TYPE_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] tracking-widest text-[var(--text-secondary)] block mb-1">ROLE</label>
                <input
                  value={entry.role}
                  onChange={(e) => updateEntry(idx, "role", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. AI Agent Development & Research"
                />
              </div>

              <div>
                <label className="text-[10px] tracking-widest text-[var(--text-secondary)] block mb-1">DESCRIPTION</label>
                <textarea
                  value={entry.description}
                  onChange={(e) => updateEntry(idx, "description", e.target.value)}
                  rows={3}
                  className={inputClass}
                  placeholder="Describe this milestone..."
                />
              </div>

              {/* Tags */}
              <div>
                <label className="text-[10px] tracking-widest text-[var(--text-secondary)] block mb-1">TAGS</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {entry.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="flex items-center gap-1 px-2 py-0.5 text-[9px] tracking-wider border border-[var(--border-color)] rounded text-[var(--text-secondary)] bg-[var(--bg-primary)]"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(idx, tagIdx)}
                        className="text-red-400 hover:text-red-300 ml-0.5"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={tagInputs[idx] || ""}
                    onChange={(e) => setTagInputs((prev) => ({ ...prev, [idx]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag(idx);
                      }
                    }}
                    className={`${inputClass} flex-1`}
                    placeholder="Add tag and press Enter"
                  />
                  <button onClick={() => addTag(idx)} className={btnSecondary}>ADD</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <SaveButton
          contentKey="experience_timeline"
          onClick={() => saveContent("experience_timeline", JSON.stringify(timeline), "json", "Experience Timeline")}
        />
      </div>
    </div>
  );
}
