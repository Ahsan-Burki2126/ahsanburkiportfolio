import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProjectFingerprint, normalizeProjectCategory } from "@/lib/projects";

async function verifyAuth(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const current = await prisma.project.findUnique({ where: { id } });
  if (!current) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const data: {
    title?: string;
    description?: string;
    techStack?: string;
    category?: string;
    imageUrl?: string | null;
    liveUrl?: string | null;
    repoUrl?: string | null;
    featured?: boolean;
    order?: number;
  } = {};

  if ("title" in body) data.title = String(body.title || "").trim();
  if ("description" in body)
    data.description = String(body.description || "").trim();
  if ("techStack" in body) data.techStack = String(body.techStack || "").trim();
  if ("category" in body)
    data.category = normalizeProjectCategory(body.category);
  if ("imageUrl" in body)
    data.imageUrl = body.imageUrl ? String(body.imageUrl).trim() : null;
  if ("liveUrl" in body)
    data.liveUrl = body.liveUrl ? String(body.liveUrl).trim() : null;
  if ("repoUrl" in body)
    data.repoUrl = body.repoUrl ? String(body.repoUrl).trim() : null;
  if ("featured" in body) data.featured = Boolean(body.featured);
  if ("order" in body && typeof body.order === "number") data.order = body.order;

  if ("title" in data && !data.title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if ("description" in data && !data.description) {
    return NextResponse.json(
      { error: "Description is required" },
      { status: 400 },
    );
  }
  if ("techStack" in data && !data.techStack) {
    return NextResponse.json({ error: "Tech stack is required" }, { status: 400 });
  }

  const merged = {
    ...current,
    ...data,
    title: data.title ?? current.title,
    description: data.description ?? current.description,
    techStack: data.techStack ?? current.techStack,
    category: data.category ?? current.category,
    liveUrl: data.liveUrl ?? current.liveUrl,
    repoUrl: data.repoUrl ?? current.repoUrl,
  };

  const updatedFingerprint = getProjectFingerprint({
    title: merged.title,
    description: merged.description,
    techStack: merged.techStack,
    category: merged.category,
    liveUrl: merged.liveUrl,
    repoUrl: merged.repoUrl,
  });

  const potentialDuplicates = await prisma.project.findMany({
    where: {
      id: { not: id },
      title: { equals: merged.title, mode: "insensitive" },
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

  const duplicate = potentialDuplicates.find(
    (project) => getProjectFingerprint(project) === updatedFingerprint,
  );
  if (duplicate) {
    return NextResponse.json(
      { error: "Duplicate project detected", duplicateId: duplicate.id },
      { status: 409 },
    );
  }

  const project = await prisma.project.update({
    where: { id },
    data,
  });

  return NextResponse.json(project);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
