import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import {
  getJwtSecret,
  getClientIp,
  isRateLimited,
  generateEmailOtp,
  verifyEmailOtp,
} from "@/lib/auth";

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD env vars are required");
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

function decodeTemp(tempToken: string) {
  const secret = getJwtSecret();
  const decoded = jwt.verify(tempToken, secret) as {
    userId: string;
    pending2FA?: boolean;
  };
  if (!decoded.pending2FA) throw new Error("Invalid token");
  return decoded;
}

// POST { tempToken, action: "send" }  →  sends OTP email
// POST { tempToken, code }            →  verifies OTP, returns session token
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(`email-otp:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  try {
    const body = await req.json();
    const { tempToken, action, code } = body;

    if (!tempToken) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    const decoded = decodeTemp(tempToken);

    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.userId },
    });
    if (!admin) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ── Send OTP ──────────────────────────────────────────────────────────────
    if (action === "send") {
      const otp = generateEmailOtp(admin.id);
      const transporter = getTransporter();
      await transporter.sendMail({
        from: `"Lab Control" <${process.env.GMAIL_USER}>`,
        to: admin.username, // username is the email
        subject: "Your Lab Control Login Code",
        text: `Your one-time login code is: ${otp}\n\nThis code expires in 10 minutes.`,
        html: `
          <div style="font-family:monospace;background:#0a0a0a;color:#e0e0e0;padding:32px;border-radius:8px;max-width:400px">
            <p style="color:#888;font-size:11px;letter-spacing:0.2em;margin:0 0 16px">LAB CONTROL — LOGIN CODE</p>
            <p style="font-size:36px;letter-spacing:0.5em;color:#00f0ff;margin:0 0 16px;font-weight:bold">${otp}</p>
            <p style="color:#888;font-size:12px;margin:0">Expires in 10 minutes. Do not share this code.</p>
          </div>
        `,
      });
      return NextResponse.json({ sent: true, email: admin.username });
    }

    // ── Verify OTP ────────────────────────────────────────────────────────────
    if (!code) {
      return NextResponse.json({ error: "Code required" }, { status: 400 });
    }

    const valid = verifyEmailOtp(admin.id, code);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 401 },
      );
    }

    const secret = getJwtSecret();
    const token = jwt.sign(
      { userId: admin.id, username: admin.username },
      secret,
      { expiresIn: "30d" },
    );

    return NextResponse.json({ token });
  } catch {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }
}
