import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  dedupeProjects,
  getProjectFingerprint,
  normalizeProjectCategory,
} from "@/lib/projects";

async function verifyAuth(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  try {
    const jwt = await import("jsonwebtoken");
    jwt.default.verify(
      authHeader.split(" ")[1],
      process.env.JWT_SECRET || "fallback-secret",
    );
    return true;
  } catch {
    return false;
  }
}

// GET all projects
export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }],
  });
  return NextResponse.json(dedupeProjects(projects));
}

// POST create project (admin only)
export async function POST(req: NextRequest) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    title,
    description,
    techStack,
    category,
    imageUrl,
    liveUrl,
    repoUrl,
    featured,
  } = body;

  if (!title || !description || !techStack) {
    return NextResponse.json(
      { error: "Title, description, and techStack are required" },
      { status: 400 },
    );
  }

  const normalizedTitle = String(title).trim();
  const normalizedDescription = String(description).trim();
  const normalizedTechStack = String(techStack).trim();
  const normalizedCategory = normalizeProjectCategory(category);
  const normalizedImageUrl = imageUrl ? String(imageUrl).trim() : null;
  const normalizedLiveUrl = liveUrl ? String(liveUrl).trim() : null;
  const normalizedRepoUrl = repoUrl ? String(repoUrl).trim() : null;
  const normalizedFeatured = Boolean(featured);

  const newProjectFingerprint = getProjectFingerprint({
    title: normalizedTitle,
    description: normalizedDescription,
    techStack: normalizedTechStack,
    category: normalizedCategory,
    liveUrl: normalizedLiveUrl,
    repoUrl: normalizedRepoUrl,
  });

  const potentialDuplicates = await prisma.project.findMany({
    where: {
      title: { equals: normalizedTitle, mode: "insensitive" },
    },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      techStack: true,
      liveUrl: true,
      repoUrl: true,
      featured: true,
      category: true,
    },
  });

  const existing = potentialDuplicates.find(
    (project) => getProjectFingerprint(project) === newProjectFingerprint,
  );
  if (existing) {
    return NextResponse.json(existing);
  }

  const project = await prisma.project.create({
    data: {
      title: normalizedTitle,
      description: normalizedDescription,
      techStack: normalizedTechStack,
      category: normalizedCategory,
      imageUrl: normalizedImageUrl,
      liveUrl: normalizedLiveUrl,
      repoUrl: normalizedRepoUrl,
      featured: normalizedFeatured,
    },
  });

  return NextResponse.json(project, { status: 201 });
}
