import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret",
    ) as { userId: string };

    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.userId },
    });
    if (!admin) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (admin.totpSecret) {
      return NextResponse.json(
        { error: "2FA already configured" },
        { status: 400 },
      );
    }

    const secret = speakeasy.generateSecret({
      name: "LabControl (" + admin.username + ")",
      issuer: "AhsanBurki-LabControl",
    });

    const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url!);

    // Store the secret
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { totpSecret: secret.base32 },
    });

    return NextResponse.json({ qrCode: qrCodeDataUrl, secret: secret.base32 });
  } catch {
    return NextResponse.json(
      { error: "Failed to setup 2FA" },
      { status: 500 },
    );
  }
}
