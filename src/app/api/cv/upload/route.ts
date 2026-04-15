import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { verifyAuth } from "@/lib/auth";

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

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files allowed" },
        { status: 400 },
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (max 10MB)" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { url } = await uploadToCloudinary(buffer, {
      folder: "portfolio/cv",
      resource_type: "raw",
      public_id: "ahsan_burki_cv",
    });

    await prisma.profile.upsert({
      where: { id: "singleton" },
      update: { cvUrl: url },
      create: { id: "singleton", cvUrl: url, bio: "" },
    });

    await prisma.asset.create({
      data: {
        filename: file.name,
        filepath: url,
        fileType: "cv",
        fileSize: file.size,
        category: "cv",
      },
    });

    return NextResponse.json({ success: true, url });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
