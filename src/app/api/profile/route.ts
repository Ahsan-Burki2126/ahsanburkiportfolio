import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

// GET profile
export async function GET() {
  let profile = await prisma.profile.findUnique({ where: { id: "singleton" } });
  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        id: "singleton",
        bio: "AI Engineer and Full-Stack Developer from Waziristan, Pakistan.",
      },
    });
  }
  return NextResponse.json(profile);
}

// PUT update profile (admin only)
export async function PUT(req: NextRequest) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const profile = await prisma.profile.upsert({
    where: { id: "singleton" },
    update: body,
    create: {
      id: "singleton",
      bio: body.bio || "",
      ...body,
    },
  });

  return NextResponse.json(profile);
}
