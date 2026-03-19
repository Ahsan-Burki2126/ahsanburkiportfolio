"use client";

import { useEffect, useState, useCallback } from "react";

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

interface ContentItem {
  id: string;
  key: string;
  value: string;
  type: string;
  page: string;
  label: string;
}

const EMPTY_CATEGORY: SkillCategory = {
  title: "",
  icon: "",
  color: "var(--accent-cyan)",
  skills: [{ name: "", level: 50 }],
};

const EMPTY_RADAR: RadarSkill = { name: "", value: 0.5 };
const EMPTY_LEARNING: LearningItem = { name: "", status: "Exploring", note: "" };

export default function SkillsPanel({ token }: { token: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [successKey, setSuccessKey] = useState<string | null>(null);
  const [existingKeys, setExistingKeys] = useState<Set<string>>(new Set());

  // Page text fields
  const [pageTitle, setPageTitle] = useState("SKILL MATRIX");
  const [pageDescription, setPageDescription] = useState("");

  // Skill categories
  const [categories, setCategories] = useState<SkillCategory[]>([]);

  // Radar skills
  const [radarSkills, setRadarSkills] = useState<RadarSkill[]>([]);

  // Currently learning
  const [learningItems, setLearningItems] = useState<LearningItem[]>([]);

  // Full tech stack
  const [techStack, setTechStack] = useState<string[]>([]);
  const [newTech, setNewTech] = useState("");

  const fetchContent = useCallback(() => {
    setLoading(true);
    fetch("/api/content?page=skills")
      .then((r) => r.json())
      .then((data) => {
        const items: ContentItem[] = data.items || [];
        const keys = new Set(items.map((i: ContentItem) => i.key));
        setExistingKeys(keys);
        const map: Record<string, string> = data.map || {};

        if (map.skills_page_title) setPageTitle(map.skills_page_title);
        if (map.skills_page_description) setPageDescription(map.skills_page_description);

        if (map.skills_categories) {
          try { setCategories(JSON.parse(map.skills_categories)); } catch { /* keep default */ }
        }
        if (map.skills_radar) {
          try { setRadarSkills(JSON.parse(map.skills_radar)); } catch { /* keep default */ }
        }
        if (map.skills_currently_learning) {
          try { setLearningItems(JSON.parse(map.skills_currently_learning)); } catch { /* keep default */ }
        }
        if (map.skills_full_stack) {
          try { setTechStack(JSON.parse(map.skills_full_stack)); } catch { /* keep default */ }
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
      : { key, value, type, page: "skills", label };

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

  // Category helpers
  const updateCategory = (idx: number, field: keyof SkillCategory, value: string) => {
    setCategories((prev) => prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c)));
  };

  const updateSkill = (catIdx: number, skillIdx: number, field: keyof Skill, value: string | number) => {
    setCategories((prev) =>
      prev.map((c, ci) =>
        ci === catIdx
          ? { ...c, skills: c.skills.map((s, si) => (si === skillIdx ? { ...s, [field]: value } : s)) }
          : c,
      ),
    );
  };

  const addSkillToCategory = (catIdx: number) => {
    setCategories((prev) =>
      prev.map((c, i) => (i === catIdx ? { ...c, skills: [...c.skills, { name: "", level: 50 }] } : c)),
    );
  };

  const removeSkillFromCategory = (catIdx: number, skillIdx: number) => {
    setCategories((prev) =>
      prev.map((c, i) => (i === catIdx ? { ...c, skills: c.skills.filter((_, si) => si !== skillIdx) } : c)),
    );
  };

  const addCategory = () => {
    setCategories((prev) => [...prev, { ...EMPTY_CATEGORY, skills: [{ name: "", level: 50 }] }]);
  };

  const removeCategory = (idx: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== idx));
  };

  // Radar helpers
  const updateRadar = (idx: number, field: keyof RadarSkill, value: string | number) => {
    setRadarSkills((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
  };

  // Learning helpers
  const updateLearning = (idx: number, field: keyof LearningItem, value: string) => {
    setLearningItems((prev) => prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l)));
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-[var(--text-secondary)] text-sm">
        Loading skills data...
      </div>
    );
  }

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
        <h2 className="text-sm tracking-widest text-[var(--accent-purple)]">SKILLS MANAGER</h2>
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
              contentKey="skills_page_title"
              onClick={() => saveContent("skills_page_title", pageTitle, "text", "Skills Page Title")}
            />
            <SaveButton
              contentKey="skills_page_description"
              onClick={() => saveContent("skills_page_description", pageDescription, "text", "Skills Page Description")}
            />
          </div>
        </div>
      </div>

      {/* Skill Categories */}
      <div className="border border-[var(--border-color)] rounded-lg p-5 bg-[var(--bg-card)] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs tracking-widest text-[var(--accent-cyan)]">SKILL CATEGORIES</h3>
          <button onClick={addCategory} className={btnSecondary}>+ ADD CATEGORY</button>
        </div>

        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="border border-[var(--border-color)] rounded-lg p-4 space-y-3 bg-[var(--bg-secondary)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-widest text-[var(--text-secondary)]">CATEGORY {catIdx + 1}</span>
              <button onClick={() => removeCategory(catIdx)} className={btnDanger}>REMOVE</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] tracking-widest text-[var(--text-secondary)] block mb-1">TITLE</label>
                <input value={cat.title} onChange={(e) => updateCategory(catIdx, "title", e.target.value)} className={inputClass} placeholder="e.g. AI / Machine Learning" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest text-[var(--text-secondary)] block mb-1">ICON (EMOJI)</label>
                <input value={cat.icon} onChange={(e) => updateCategory(catIdx, "icon", e.target.value)} className={inputClass} placeholder="e.g. 🧠" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest text-[var(--text-secondary)] block mb-1">COLOR</label>
                <input value={cat.color} onChange={(e) => updateCategory(catIdx, "color", e.target.value)} className={inputClass} placeholder="e.g. var(--accent-purple)" />
              </div>
              <div className="flex items-end">
                <button onClick={() => addSkillToCategory(catIdx)} className={btnSecondary}>+ ADD SKILL</button>
              </div>
            </div>

            {/* Skills in this category */}
            <div className="space-y-2">
              {cat.skills.map((skill, skillIdx) => (
                <div key={skillIdx} className="flex items-center gap-3">
                  <input
                    value={skill.name}
                    onChange={(e) => updateSkill(catIdx, skillIdx, "name", e.target.value)}
                    className={`${inputClass} flex-1`}
                    placeholder="Skill name"
                  />
                  <div className="flex items-center gap-2 min-w-[160px]">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={skill.level}
                      onChange={(e) => updateSkill(catIdx, skillIdx, "level", parseInt(e.target.value))}
                      className="flex-1 accent-[var(--accent-cyan)]"
                    />
                    <span className="text-xs text-[var(--text-secondary)] tabular-nums w-8 text-right">{skill.level}%</span>
                  </div>
                  <button
                    onClick={() => removeSkillFromCategory(catIdx, skillIdx)}
                    className="text-red-400 hover:text-red-300 text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <SaveButton
          contentKey="skills_categories"
          onClick={() => saveContent("skills_categories", JSON.stringify(categories), "json", "Skill Categories")}
        />
      </div>

      {/* Radar Skills */}
      <div className="border border-[var(--border-color)] rounded-lg p-5 bg-[var(--bg-card)] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs tracking-widest text-[var(--accent-cyan)]">COMPETENCY RADAR</h3>
          <button onClick={() => setRadarSkills((prev) => [...prev, { ...EMPTY_RADAR }])} className={btnSecondary}>+ ADD POINT</button>
        </div>
        <p className="text-[9px] text-[var(--text-secondary)] tracking-wider">
          These appear on the hexagonal radar chart. Best with exactly 6 items, values between 0 and 1.
        </p>

        <div className="space-y-2">
          {radarSkills.map((rs, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <input
                value={rs.name}
                onChange={(e) => updateRadar(idx, "name", e.target.value)}
                className={`${inputClass} flex-1`}
                placeholder="e.g. AI/ML"
              />
              <div className="flex items-center gap-2 min-w-[180px]">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(rs.value * 100)}
                  onChange={(e) => updateRadar(idx, "value", parseInt(e.target.value) / 100)}
                  className="flex-1 accent-[var(--accent-cyan)]"
                />
                <span className="text-xs text-[var(--text-secondary)] tabular-nums w-10 text-right">
                  {(rs.value * 100).toFixed(0)}%
                </span>
              </div>
              <button
                onClick={() => setRadarSkills((prev) => prev.filter((_, i) => i !== idx))}
                className="text-red-400 hover:text-red-300 text-xs px-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <SaveButton
          contentKey="skills_radar"
          onClick={() => saveContent("skills_radar", JSON.stringify(radarSkills), "json", "Radar Skills")}
        />
      </div>

      {/* Currently Learning */}
      <div className="border border-[var(--border-color)] rounded-lg p-5 bg-[var(--bg-card)] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs tracking-widest text-[var(--accent-cyan)]">CURRENTLY LEARNING</h3>
          <button onClick={() => setLearningItems((prev) => [...prev, { ...EMPTY_LEARNING }])} className={btnSecondary}>+ ADD ITEM</button>
        </div>

        <div className="space-y-3">
          {learningItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 border border-[var(--border-color)] rounded p-3 bg-[var(--bg-secondary)]">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  value={item.name}
                  onChange={(e) => updateLearning(idx, "name", e.target.value)}
                  className={inputClass}
                  placeholder="Technology name"
                />
                <select
                  value={item.status}
                  onChange={(e) => updateLearning(idx, "status", e.target.value)}
                  className={inputClass}
                >
                  <option value="Exploring">Exploring</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Active">Active</option>
                  <option value="Researching">Researching</option>
                  <option value="Completed">Completed</option>
                </select>
                <input
                  value={item.note}
                  onChange={(e) => updateLearning(idx, "note", e.target.value)}
                  className={inputClass}
                  placeholder="Short note"
                />
              </div>
              <button
                onClick={() => setLearningItems((prev) => prev.filter((_, i) => i !== idx))}
                className="text-red-400 hover:text-red-300 text-xs px-1 mt-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <SaveButton
          contentKey="skills_currently_learning"
          onClick={() => saveContent("skills_currently_learning", JSON.stringify(learningItems), "json", "Currently Learning")}
        />
      </div>

      {/* Full Tech Stack */}
      <div className="border border-[var(--border-color)] rounded-lg p-5 bg-[var(--bg-card)] space-y-4">
        <h3 className="text-xs tracking-widest text-[var(--accent-cyan)]">TOOLS & TECHNOLOGIES</h3>
        <p className="text-[9px] text-[var(--text-secondary)] tracking-wider">
          The tag cloud displayed at the bottom of the skills page.
        </p>

        <div className="flex flex-wrap gap-2">
          {techStack.map((tech, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-wider border border-[var(--border-color)] rounded text-[var(--text-secondary)] bg-[var(--bg-secondary)]"
            >
              {tech}
              <button
                onClick={() => setTechStack((prev) => prev.filter((_, i) => i !== idx))}
                className="text-red-400 hover:text-red-300 ml-1"
              >
                ✕
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={newTech}
            onChange={(e) => setNewTech(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newTech.trim()) {
                setTechStack((prev) => [...prev, newTech.trim()]);
                setNewTech("");
              }
            }}
            className={`${inputClass} flex-1`}
            placeholder="Type a technology and press Enter"
          />
          <button
            onClick={() => {
              if (newTech.trim()) {
                setTechStack((prev) => [...prev, newTech.trim()]);
                setNewTech("");
              }
            }}
            className={btnSecondary}
          >
            ADD
          </button>
        </div>

        <SaveButton
          contentKey="skills_full_stack"
          onClick={() => saveContent("skills_full_stack", JSON.stringify(techStack), "json", "Full Tech Stack")}
        />
      </div>
    </div>
  );
}
