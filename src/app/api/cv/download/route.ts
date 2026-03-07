import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readFile, readdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  try {
    const cvDir = path.join(process.cwd(), "uploads", "cv");

    if (!existsSync(cvDir)) {
      return NextResponse.json({ error: "No CV available" }, { status: 404 });
    }

    const files = await readdir(cvDir);
    const pdfFiles = files.filter((f) => f.endsWith(".pdf"));

    if (pdfFiles.length === 0) {
      return NextResponse.json({ error: "No CV available" }, { status: 404 });
    }

    // Get the latest CV file
    const latestFile = pdfFiles[pdfFiles.length - 1];
    const filepath = path.join(cvDir, latestFile);
    const fileBuffer = await readFile(filepath);

    // Log download (hash the IP for privacy)
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";
    const ipHash = crypto
      .createHash("sha256")
      .update(ip)
      .digest("hex")
      .slice(0, 16);

    await prisma.downloadLog.create({
      data: {
        filename: latestFile,
        ipHash,
      },
    });

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Ahsan_Burki_CV.pdf"',
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
