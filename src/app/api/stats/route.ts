import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

export async function GET(req: NextRequest) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const totalDownloads = await prisma.downloadLog.count();
  const totalMessages = await prisma.message.count();
  const unreadMessages = await prisma.message.count({
    where: { isRead: false },
  });
  const totalProjects = await prisma.project.count();
  const totalAssets = await prisma.asset.count();

  return NextResponse.json({
    totalDownloads,
    totalMessages,
    unreadMessages,
    totalProjects,
    totalAssets,
  });
}
