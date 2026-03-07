import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
  return NextResponse.json(projects);
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

  const project = await prisma.project.create({
    data: {
      title,
      description,
      techStack,
      category: category || "web",
      imageUrl: imageUrl || null,
      liveUrl: liveUrl || null,
      repoUrl: repoUrl || null,
      featured: featured || false,
    },
  });

  return NextResponse.json(project, { status: 201 });
}
