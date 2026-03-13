import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProjectsClient from "./ProjectsClient";
import { dedupeProjects, type ProjectRecord } from "@/lib/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore projects by Ahsan Burki across web projects, data analysis, machine learning, deep learning, NLP, and AI agents.",
};

export default async function ProjectsPage() {
  let projects: ProjectRecord[] = [];

  try {
    const data = await prisma.project.findMany({
      orderBy: [{ featured: "desc" }, { order: "asc" }],
    });
    projects = dedupeProjects(data);
  } catch {
    // DB not available during build or cold start
  }

  return <ProjectsClient projects={projects} />;
}
