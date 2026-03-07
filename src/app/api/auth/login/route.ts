import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 },
      );
    }

    const admin = await prisma.adminUser.findUnique({ where: { username } });
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = jwt.sign(
      { userId: admin.id, username: admin.username },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "24h" },
    );

    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
