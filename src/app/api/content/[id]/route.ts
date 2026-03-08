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

// DELETE content by id
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.siteContent.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
