import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: "singleton" },
      select: { cvUrl: true },
    });

    if (!profile?.cvUrl) {
      return NextResponse.json({ error: "No CV available" }, { status: 404 });
    }

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
        filename: "Ahsan_Burki_CV.pdf",
        ipHash,
      },
    });

    return NextResponse.redirect(profile.cvUrl);
  } catch {
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
