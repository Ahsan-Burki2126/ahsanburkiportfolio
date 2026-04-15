"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

interface Profile {
  id: string;
  name: string;
  location: string;
  degree: string;
  gradDate: string;
  cvUrl: string | null;
  imageUrl: string | null;
  germanLevel: string;
  bio: string;
}

const germanLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function ProfilePanel({ token }: { token: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploadingImage(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      const updated = { ...profile, imageUrl: url };
      setProfile(updated);
      await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl: url }),
      });
    }
    setUploadingImage(false);
  };

  const fetchProfile = useCallback(() => {
    setLoading(true);
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);

    await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: profile.name,
        location: profile.location,
        degree: profile.degree,
        germanLevel: profile.germanLevel,
        bio: profile.bio,
      }),
    });

    setSaving(false);
  };

  if (loading || !profile) {
    return (
      <div className="text-center py-20 text-[var(--text-secondary)] text-sm">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-sm tracking-widest text-[var(--accent-purple)]">
        PROFILE EDITOR
      </h2>

      {/* Hero Image Upload */}
      <div className="border border-[var(--border-color)] rounded-lg p-6 bg-[var(--bg-card)] space-y-4">
        <h3 className="text-[10px] tracking-widest text-[var(--accent-cyan)]">HERO IMAGE</h3>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-[var(--border-color)] bg-[var(--bg-secondary)] flex-shrink-0">
            {profile.imageUrl ? (
              <Image src={profile.imageUrl} alt="Hero" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)] text-xs">NO IMAGE</div>
            )}
          </div>
          <div className="space-y-2">
            <label className="block">
              <span className="px-4 py-2 bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)] text-[10px] tracking-widest rounded hover:bg-[var(--accent-cyan)]/20 transition-colors cursor-pointer">
                {uploadingImage ? "UPLOADING..." : "UPLOAD PHOTO"}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
            </label>
            <p className="text-[9px] text-[var(--text-secondary)] tracking-wider">Uploads to Cloudinary. Recommended: square, min 600×600px.</p>
          </div>
        </div>
      </div>

      <div className="border border-[var(--border-color)] rounded-lg p-6 bg-[var(--bg-card)] space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] tracking-widest text-[var(--text-secondary)]">
              NAME
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm focus:border-[var(--accent-cyan)] focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] tracking-widest text-[var(--text-secondary)]">
              LOCATION
            </label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) =>
                setProfile({ ...profile, location: e.target.value })
              }
              className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm focus:border-[var(--accent-cyan)] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] tracking-widest text-[var(--text-secondary)]">
              DEGREE
            </label>
            <input
              type="text"
              value={profile.degree}
              onChange={(e) =>
                setProfile({ ...profile, degree: e.target.value })
              }
              className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm focus:border-[var(--accent-cyan)] focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] tracking-widest text-[var(--text-secondary)]">
              GERMAN LEVEL
            </label>
            <div className="flex items-center gap-4">
              <select
                value={profile.germanLevel}
                onChange={(e) =>
                  setProfile({ ...profile, germanLevel: e.target.value })
                }
                className="flex-1 px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm focus:border-[var(--accent-cyan)] focus:outline-none"
              >
                {germanLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <div className="flex gap-1">
                {germanLevels.map((level, i) => (
                  <div
                    key={level}
                    className={`w-6 h-3 rounded-sm ${
                      germanLevels.indexOf(profile.germanLevel) >= i
                        ? "bg-[var(--accent-cyan)]"
                        : "bg-[var(--border-color)]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] tracking-widest text-[var(--text-secondary)]">
            BIO
          </label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows={5}
            className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-sm focus:border-[var(--accent-cyan)] focus:outline-none resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)] text-[10px] tracking-widest rounded hover:bg-[var(--accent-cyan)]/20 transition-colors disabled:opacity-50"
        >
          {saving ? "SAVING..." : "SAVE CHANGES"}
        </button>
      </div>
    </div>
  );
}
