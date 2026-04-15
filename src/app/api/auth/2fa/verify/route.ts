import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import { prisma } from "@/lib/prisma";
import {
  getJwtSecret,
  getClientIp,
  isRateLimited,
  isTotpCodeUsed,
  markTotpCodeUsed,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  // 5 attempts per 10 minutes per IP — tighter than login
  const ip = getClientIp(req);
  if (isRateLimited(`2fa:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 }
    );
  }

  try {
    const { tempToken, code } = await req.json();

    if (!tempToken || !code) {
      return NextResponse.json(
        { error: "Token and code required" },
        { status: 400 }
      );
    }

    const secret = getJwtSecret();
    const decoded = jwt.verify(tempToken, secret) as {
      userId: string;
      pending2FA?: boolean;
    };

    if (!decoded.pending2FA) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.userId },
    });
    if (!admin || !admin.totpSecret) {
      return NextResponse.json({ error: "2FA not configured" }, { status: 400 });
    }

    // Replay protection — reject a code that was already accepted
    if (isTotpCodeUsed(admin.id, code)) {
      return NextResponse.json(
        { error: "Code already used. Wait for the next code." },
        { status: 401 }
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
        { status: 401 }
      );
    }

    // Mark code as used before issuing the session token
    markTotpCodeUsed(admin.id, code);

    const token = jwt.sign(
      { userId: admin.id, username: admin.username },
      secret,
      { expiresIn: "30d" }
    );

    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
