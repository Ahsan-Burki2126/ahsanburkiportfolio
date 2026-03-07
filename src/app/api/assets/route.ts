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

// GET - list assets (admin only)
export async function GET(req: NextRequest) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const assets = await prisma.asset.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(assets);
}

// POST - upload asset (admin only)
export async function POST(req: NextRequest) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    // Validate file type (images only for gallery)
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (max 20MB)" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const hash = crypto
      .createHash("sha256")
      .update(buffer)
      .digest("hex")
      .slice(0, 12);
    const ext = file.name.split(".").pop() || "bin";
    // Sanitize extension
    const safeExt = ext.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);
    const filename = `${category}_${hash}.${safeExt}`;

    const uploadDir = path.join(process.cwd(), "uploads", category);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const asset = await prisma.asset.create({
      data: {
        filename: file.name,
        filepath,
        fileType: file.type,
        fileSize: file.size,
        category,
      },
    });

    return NextResponse.json(asset, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
