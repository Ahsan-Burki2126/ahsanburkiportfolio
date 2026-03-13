export interface ProjectRecord {
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

export type ProjectCategoryValue =
  | "web-projects"
  | "data-analysis"
  | "machine-learning"
  | "deep-learning"
  | "nlp"
  | "ai-agents-and-agentic-ai";

export type ProjectFilterValue = ProjectCategoryValue;

export const DEFAULT_PROJECT_CATEGORY: ProjectCategoryValue = "web-projects";

export const PROJECT_CATEGORY_OPTIONS: ReadonlyArray<{
  value: ProjectCategoryValue;
  label: string;
}> = [
  { value: "web-projects", label: "Web Projects" },
  { value: "data-analysis", label: "Data Analysis" },
  { value: "machine-learning", label: "Machine Learning" },
  { value: "deep-learning", label: "Deep Learning" },
  { value: "nlp", label: "NLP" },
  { value: "ai-agents-and-agentic-ai", label: "AI Agents and Agentic AI" },
];

export const PROJECT_FILTER_TABS: ReadonlyArray<ProjectFilterValue> =
  PROJECT_CATEGORY_OPTIONS.map((option) => option.value);

const categoryLabelByValue: Record<ProjectCategoryValue, string> =
  PROJECT_CATEGORY_OPTIONS.reduce(
    (acc, option) => {
      acc[option.value] = option.label;
      return acc;
    },
    {} as Record<ProjectCategoryValue, string>,
  );

const categoryAliasMap: Record<string, ProjectCategoryValue> = {
  web: "web-projects",
  "web project": "web-projects",
  "web projects": "web-projects",
  "web app": "web-projects",
  "web apps": "web-projects",
  "web development": "web-projects",
  frontend: "web-projects",
  "front end": "web-projects",
  backend: "web-projects",
  "back end": "web-projects",
  "full stack": "web-projects",
  fullstack: "web-projects",
  portfolio: "web-projects",
  "data analysis": "data-analysis",
  "data analytics": "data-analysis",
  "data science": "data-analysis",
  eda: "data-analysis",
  analytics: "data-analysis",
  "machine learning": "machine-learning",
  ml: "machine-learning",
  "deep learning": "deep-learning",
  dl: "deep-learning",
  nlp: "nlp",
  "natural language processing": "nlp",
  "ai agents": "ai-agents-and-agentic-ai",
  "ai agent": "ai-agents-and-agentic-ai",
  "agentic ai": "ai-agents-and-agentic-ai",
  agents: "ai-agents-and-agentic-ai",
  ai: "ai-agents-and-agentic-ai",
  "ai agents and agentic ai": "ai-agents-and-agentic-ai",
};

function normalizeText(value: string | null | undefined) {
  return (value || "").trim();
}

function normalizeIdentityText(value: string | null | undefined) {
  return normalizeText(value).toLowerCase().replace(/\s+/g, " ");
}

function normalizeLooseCategoryKey(value: string | null | undefined) {
  return normalizeIdentityText(value)
    .replace(/&/g, " and ")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toTitleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      const lowered = word.toLowerCase();
      if (lowered === "nlp") return "NLP";
      if (lowered === "ai") return "AI";
      return lowered.charAt(0).toUpperCase() + lowered.slice(1);
    })
    .join(" ");
}

export function resolveProjectCategory(
  category: string | null | undefined,
): ProjectCategoryValue | null {
  const key = normalizeLooseCategoryKey(category);
  if (!key) return null;
  return categoryAliasMap[key] || null;
}

export function normalizeProjectCategory(category: string | null | undefined) {
  return resolveProjectCategory(category) || DEFAULT_PROJECT_CATEGORY;
}

export function getProjectFilterLabel(value: ProjectFilterValue) {
  return categoryLabelByValue[value];
}

export function formatProjectCategoryLabel(
  category: string | null | undefined,
) {
  const canonical = resolveProjectCategory(category);
  if (canonical) {
    return categoryLabelByValue[canonical];
  }

  const normalized = normalizeLooseCategoryKey(category);
  if (!normalized) {
    return categoryLabelByValue[DEFAULT_PROJECT_CATEGORY];
  }

  return toTitleCase(normalized);
}

export function getProjectFingerprint(project: {
  title: string;
  description: string;
  techStack?: string | null;
  category: string;
  liveUrl: string | null;
  repoUrl: string | null;
}) {
  const categoryPart =
    resolveProjectCategory(project.category) ||
    normalizeLooseCategoryKey(project.category) ||
    "uncategorized";
  return [
    normalizeIdentityText(project.title),
    normalizeIdentityText(project.description),
    normalizeIdentityText(project.techStack || ""),
    categoryPart,
  ].join("::");
}

export function dedupeProjects(projects: ProjectRecord[]) {
  const seenIds = new Set<string>();
  const seenFingerprints = new Set<string>();

  return projects.reduce<ProjectRecord[]>((unique, project) => {
    const normalized = {
      ...project,
      category: normalizeText(project.category),
    };
    const fingerprint = getProjectFingerprint(normalized);

    if (seenIds.has(normalized.id) || seenFingerprints.has(fingerprint)) {
      return unique;
    }

    seenIds.add(normalized.id);
    seenFingerprints.add(fingerprint);
    unique.push(normalized);
    return unique;
  }, []);
}
