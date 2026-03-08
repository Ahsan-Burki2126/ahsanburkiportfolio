import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { tempToken, code } = await req.json();

    if (!tempToken || !code) {
      return NextResponse.json(
        { error: "Token and code required" },
        { status: 400 },
      );
    }

    const decoded = jwt.verify(
      tempToken,
      process.env.JWT_SECRET || "fallback-secret",
    ) as { userId: string; pending2FA?: boolean };

    if (!decoded.pending2FA) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.userId },
    });
    if (!admin || !admin.totpSecret) {
      return NextResponse.json(
        { error: "2FA not configured" },
        { status: 400 },
      );
    }

    const isValid = speakeasy.totp.verify({
      secret: admin.totpSecret,
      encoding: "base32",
      token: code,
      window: 1,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid verification code" },
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
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 },
    );
  }
}
