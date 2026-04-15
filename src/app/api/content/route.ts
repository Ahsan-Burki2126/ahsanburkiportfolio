import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

// GET content - optionally filter by ?page=home or ?key=hero_name
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");
  const key = searchParams.get("key");

  if (key) {
    const item = await prisma.siteContent.findUnique({ where: { key } });
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  }

  const where = page ? { page } : {};
  const items = await prisma.siteContent.findMany({
    where,
    orderBy: { key: "asc" },
  });

  // Return as key-value map for easy consumption
  const map: Record<string, string> = {};
  for (const item of items) {
    map[item.key] = item.value;
  }

  return NextResponse.json({ items, map });
}

// PUT update content (admin only)
export async function PUT(req: NextRequest) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { key, value } = body;

  if (!key || value === undefined) {
    return NextResponse.json(
      { error: "key and value are required" },
      { status: 400 },
    );
  }

  const item = await prisma.siteContent.update({
    where: { key },
    data: { value },
  });

  return NextResponse.json(item);
}

// POST create content (admin only)
export async function POST(req: NextRequest) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { key, value, type, page, label } = body;

  if (!key || value === undefined || !page) {
    return NextResponse.json(
      { error: "key, value, and page are required" },
      { status: 400 },
    );
  }

  const item = await prisma.siteContent.create({
    data: {
      key,
      value,
      type: type || "text",
      page,
      label: label || key,
    },
  });

  return NextResponse.json(item);
}
