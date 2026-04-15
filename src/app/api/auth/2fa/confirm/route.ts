import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import { prisma } from "@/lib/prisma";
import { getJwtSecret, markTotpCodeUsed } from "@/lib/auth";

// POST — verify the user's first TOTP code, then save the secret to the DB.
// Called after /api/auth/2fa/setup during initial 2FA enrollment.
export async function POST(req: NextRequest) {
  try {
    const { token, secret, code } = await req.json();

    if (!token || !secret || !code) {
      return NextResponse.json(
        { error: "Token, secret, and code are required" },
        { status: 400 }
      );
    }

    const decoded = jwt.verify(token, getJwtSecret()) as { userId: string };

    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.userId },
    });
    if (!admin) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (admin.totpSecret) {
      return NextResponse.json(
        { error: "2FA already configured" },
        { status: 400 }
      );
    }

    const isValid = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token: code,
      window: 1,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid code — make sure your authenticator app is synced" },
        { status: 401 }
      );
    }

    // Code is valid — now persist the secret
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { totpSecret: secret },
    });

    // Mark the code as used so it can't be replayed
    markTotpCodeUsed(admin.id, code);

    // Issue a full session token
    const sessionToken = jwt.sign(
      { userId: admin.id, username: admin.username },
      getJwtSecret(),
      { expiresIn: "24h" }
    );

    return NextResponse.json({ token: sessionToken });
  } catch {
    return NextResponse.json({ error: "Confirmation failed" }, { status: 500 });
  }
}
