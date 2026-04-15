import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

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
