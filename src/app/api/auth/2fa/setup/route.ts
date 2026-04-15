import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { getJwtSecret } from "@/lib/auth";

// POST — generate a 2FA secret and return the QR code.
// The secret is NOT saved to the database yet; it is only saved once the
// user proves they can generate valid codes via /api/auth/2fa/confirm.
export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
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

    const secret = speakeasy.generateSecret({
      name: "LabControl (" + admin.username + ")",
      issuer: "AhsanBurki-LabControl",
    });

    const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url!);

    // Return the secret to the frontend — it will be passed back to
    // /api/auth/2fa/confirm along with the user's first valid code.
    // The secret is saved to the DB only after confirmation succeeds.
    return NextResponse.json({
      qrCode: qrCodeDataUrl,
      secret: secret.base32,
    });
  } catch {
    return NextResponse.json({ error: "Failed to setup 2FA" }, { status: 500 });
  }
}
