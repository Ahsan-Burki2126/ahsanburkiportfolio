import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import crypto from "crypto";

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

// POST - upload CV (admin only)
export async function POST(req: NextRequest) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("cv") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files allowed" },
        { status: 400 },
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (max 10MB)" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate hash-based filename for security
    const hash = crypto
      .createHash("sha256")
      .update(buffer)
      .digest("hex")
      .slice(0, 12);
    const filename = `cv_${hash}.pdf`;

    const uploadDir = path.join(process.cwd(), "uploads", "cv");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Update profile with new CV URL
    await prisma.profile.upsert({
      where: { id: "singleton" },
      update: { cvUrl: `/api/cv/download` },
      create: {
        id: "singleton",
        cvUrl: `/api/cv/download`,
        bio: "",
      },
    });

    // Save asset record
    await prisma.asset.create({
      data: {
        filename: file.name,
        filepath: filepath,
        fileType: "cv",
        fileSize: file.size,
        category: "cv",
      },
    });

    return NextResponse.json({ success: true, filename });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
