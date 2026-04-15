"use client";

import { useState } from "react";
import Image from "next/image";

type Stage = "credentials" | "2fa-verify" | "2fa-setup" | "2fa-email";

export default function LoginPanel({
  onLogin,
}: {
  onLogin: (token: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [totpSecret, setTotpSecret] = useState("");
  const [setupToken, setSetupToken] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState("");
  const [stage, setStage] = useState<Stage>("credentials");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      if (data.requires2FA) {
        setTempToken(data.tempToken);
        setStage("2fa-verify");
      } else if (data.needs2FASetup) {
        const setupRes = await fetch("/api/auth/2fa/setup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: data.token }),
        });
        const setupData = await setupRes.json();
        if (setupRes.ok) {
          setQrCode(setupData.qrCode);
          setTotpSecret(setupData.secret);
          setSetupToken(data.token);
          setStage("2fa-setup");
        } else {
          setError(setupData.error || "Failed to setup 2FA");
        }
      } else {
        onLogin(data.token);
      }
    } catch {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempToken, code: totpCode }),
      });

      const data = await res.json();
      if (res.ok) {
        onLogin(data.token);
      } else {
        setError(data.error || "Verification failed");
      }
    } catch {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/2fa/email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempToken, action: "send" }),
      });
      const data = await res.json();
      if (res.ok) {
        setEmailSent(true);
        setSentToEmail(data.email || "");
        setStage("2fa-email");
      } else {
        setError(data.error || "Failed to send email code");
      }
    } catch {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/2fa/email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempToken, code: emailCode }),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.token);
      } else {
        setError(data.error || "Invalid code");
      }
    } catch {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSetupComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/2fa/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: setupToken,
          secret: totpSecret,
          code: totpCode,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        onLogin(data.token);
      } else {
        setError(data.error || "Invalid code");
      }
    } catch {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  const backToCredentials = () => {
    setStage("credentials");
    setTotpCode("");
    setEmailCode("");
    setEmailSent(false);
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-6">
      <div className="w-full max-w-sm">
        <div className="border border-[var(--border-color)] rounded-lg p-8 bg-[var(--bg-card)] space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 border border-[var(--accent-purple)] rounded-lg mx-auto flex items-center justify-center">
              <span className="text-[var(--accent-purple)] font-bold text-lg">
                LC
              </span>
            </div>
            <h1 className="text-sm tracking-[0.3em] font-bold">LAB CONTROL</h1>
            <p className="text-[10px] text-[var(--text-secondary)] tracking-wider">
              {stage === "credentials" && "AUTHENTICATION REQUIRED"}
              {stage === "2fa-verify" && "TWO-FACTOR VERIFICATION"}
              {stage === "2fa-setup" && "CONFIGURE 2FA"}
              {stage === "2fa-email" && "EMAIL VERIFICATION"}
            </p>
          </div>

          {/* Stage 1: Credentials */}
          {stage === "credentials" && (
            <form onSubmit={handleCredentials} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] tracking-widest text-[var(--text-secondary)]">
                  OPERATOR ID
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm focus:border-[var(--accent-purple)] focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-widest text-[var(--text-secondary)]">
                  ACCESS KEY
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm focus:border-[var(--accent-purple)] focus:outline-none transition-colors"
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/30 text-[var(--accent-purple)] text-xs tracking-[0.3em] rounded hover:bg-[var(--accent-purple)]/20 transition-all disabled:opacity-50"
              >
                {loading ? "AUTHENTICATING..." : "INITIALIZE"}
              </button>
            </form>
          )}

          {/* Stage 2: 2FA Setup (first time) */}
          {stage === "2fa-setup" && (
            <form onSubmit={handleSetupComplete} className="space-y-4">
              <div className="text-center space-y-3">
                <p className="text-xs text-[var(--text-secondary)]">
                  Scan this QR code with your authenticator app (Google
                  Authenticator, Authy, etc.)
                </p>
                {qrCode && (
                  <div className="flex justify-center">
                    <Image
                      src={qrCode}
                      alt="2FA QR Code"
                      width={200}
                      height={200}
                      className="rounded border border-[var(--border-color)]"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-[10px] text-[var(--text-secondary)] tracking-wider">
                    MANUAL KEY
                  </p>
                  <p className="text-xs font-mono text-[var(--accent-cyan)] break-all select-all">
                    {totpSecret}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-widest text-[var(--text-secondary)]">
                  ENTER 6-DIGIT CODE TO CONFIRM
                </label>
                <input
                  type="text"
                  value={totpCode}
                  onChange={(e) =>
                    setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  required
                  maxLength={6}
                  placeholder="000000"
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm text-center tracking-[0.5em] font-mono focus:border-[var(--accent-purple)] focus:outline-none transition-colors"
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || totpCode.length !== 6}
                className="w-full py-3 bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/30 text-[var(--accent-purple)] text-xs tracking-[0.3em] rounded hover:bg-[var(--accent-purple)]/20 transition-all disabled:opacity-50"
              >
                {loading ? "VERIFYING..." : "ACTIVATE 2FA"}
              </button>
            </form>
          )}

          {/* Stage 3: 2FA Verification (authenticator app) */}
          {stage === "2fa-verify" && (
            <form onSubmit={handleVerify2FA} className="space-y-4">
              <p className="text-xs text-[var(--text-secondary)] text-center">
                Enter the 6-digit code from your authenticator app
              </p>

              <div className="space-y-1">
                <label className="text-[10px] tracking-widest text-[var(--text-secondary)]">
                  VERIFICATION CODE
                </label>
                <input
                  type="text"
                  value={totpCode}
                  onChange={(e) =>
                    setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  required
                  maxLength={6}
                  placeholder="000000"
                  autoFocus
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm text-center tracking-[0.5em] font-mono focus:border-[var(--accent-purple)] focus:outline-none transition-colors"
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || totpCode.length !== 6}
                className="w-full py-3 bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/30 text-[var(--accent-purple)] text-xs tracking-[0.3em] rounded hover:bg-[var(--accent-purple)]/20 transition-all disabled:opacity-50"
              >
                {loading ? "VERIFYING..." : "VERIFY"}
              </button>

              {/* Email OTP alternative */}
              <div className="border-t border-[var(--border-color)] pt-3 space-y-2">
                <p className="text-[9px] text-[var(--text-secondary)] text-center tracking-wider">
                  DON&apos;T HAVE YOUR PHONE?
                </p>
                <button
                  type="button"
                  onClick={handleSendEmailOtp}
                  disabled={loading}
                  className="w-full py-2 text-[10px] tracking-widest border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)] rounded hover:bg-[var(--accent-cyan)]/10 transition-colors disabled:opacity-50"
                >
                  {loading ? "SENDING..." : "SEND CODE TO MY EMAIL"}
                </button>
              </div>

              <button
                type="button"
                onClick={backToCredentials}
                className="w-full py-2 text-[10px] text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-colors tracking-wider"
              >
                BACK TO LOGIN
              </button>
            </form>
          )}

          {/* Stage 4: Email OTP verification */}
          {stage === "2fa-email" && (
            <form onSubmit={handleVerifyEmailOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <p className="text-xs text-[var(--text-secondary)]">
                  A 6-digit code was sent to
                </p>
                <p className="text-xs text-[var(--accent-cyan)] font-mono">
                  {sentToEmail}
                </p>
                <p className="text-[9px] text-[var(--text-secondary)]">
                  Check your inbox and spam. Expires in 10 minutes.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-widest text-[var(--text-secondary)]">
                  EMAIL CODE
                </label>
                <input
                  type="text"
                  value={emailCode}
                  onChange={(e) =>
                    setEmailCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  required
                  maxLength={6}
                  placeholder="000000"
                  autoFocus
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm text-center tracking-[0.5em] font-mono focus:border-[var(--accent-purple)] focus:outline-none transition-colors"
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || emailCode.length !== 6}
                className="w-full py-3 bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/30 text-[var(--accent-purple)] text-xs tracking-[0.3em] rounded hover:bg-[var(--accent-purple)]/20 transition-all disabled:opacity-50"
              >
                {loading ? "VERIFYING..." : "VERIFY"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmailSent(false);
                  setEmailCode("");
                  setError("");
                  setStage("2fa-verify");
                }}
                className="w-full py-2 text-[10px] text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-colors tracking-wider"
              >
                USE AUTHENTICATOR APP INSTEAD
              </button>

              {emailSent && (
                <button
                  type="button"
                  onClick={handleSendEmailOtp}
                  disabled={loading}
                  className="w-full py-2 text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors tracking-wider"
                >
                  RESEND CODE
                </button>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
