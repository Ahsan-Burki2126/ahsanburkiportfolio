import { prisma } from "@/lib/prisma";
import ProjectsClient from "./ProjectsClient";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  let projects: {
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    techStack: string;
    liveUrl: string | null;
    repoUrl: string | null;
    featured: boolean;
    category: string;
  }[] = [];

  try {
    projects = await prisma.project.findMany({
      orderBy: [{ featured: "desc" }, { order: "asc" }],
    });
  } catch {
    // DB not available during build or cold start
  }

  return <ProjectsClient projects={projects} />;
}
