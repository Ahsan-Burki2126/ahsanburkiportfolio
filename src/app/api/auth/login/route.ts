import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { getJwtSecret, getClientIp, isRateLimited } from "@/lib/auth";

export async function POST(req: NextRequest) {
  // 10 attempts per 15 minutes per IP
  const ip = getClientIp(req);
  if (isRateLimited(`login:${ip}`, 10, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 }
    );
  }

  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      );
    }

    const admin = await prisma.adminUser.findUnique({ where: { username } });
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const secret = getJwtSecret();

    if (admin.totpSecret) {
      return NextResponse.json({
        requires2FA: true,
        tempToken: jwt.sign(
          { userId: admin.id, pending2FA: true },
          secret,
          { expiresIn: "5m" }
        ),
      });
    }

    const token = jwt.sign(
      { userId: admin.id, username: admin.username },
      secret,
      { expiresIn: "24h" }
    );

    return NextResponse.json({ token, needs2FASetup: true });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
