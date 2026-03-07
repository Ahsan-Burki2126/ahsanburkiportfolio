"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface Asset {
  id: string;
  filename: string;
  filepath: string;
  fileType: string;
  fileSize: number;
  category: string;
  createdAt: string;
}

export default function AssetManager({ token }: { token: string }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const fetchAssets = useCallback(() => {
    setLoading(true);
    fetch("/api/assets", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setAssets(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const uploadCV = async (file: File) => {
    setCvUploading(true);
    const formData = new FormData();
    formData.append("cv", file);

    await fetch("/api/cv/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    setCvUploading(false);
    fetchAssets();
  };

  const uploadAsset = async (file: File, category: string) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    await fetch("/api/assets", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    setUploading(false);
    fetchAssets();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      uploadCV(file);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-sm tracking-widest text-[var(--accent-purple)]">
        ASSET MANAGER
      </h2>

      {/* CV Upload Zone */}
      <div className="border border-[var(--border-color)] rounded-lg p-6 bg-[var(--bg-card)] space-y-4">
        <h3 className="text-[10px] tracking-widest text-[var(--accent-cyan)]">
          CV UPLOAD // DRAG & DROP
        </h3>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => cvInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/5"
              : "border-[var(--border-color)] hover:border-[var(--accent-cyan)]/50"
          }`}
        >
          <input
            ref={cvInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadCV(file);
            }}
          />
          {cvUploading ? (
            <div>
              <p className="text-[var(--accent-cyan)] text-sm">UPLOADING...</p>
              <div className="w-32 h-1 bg-[var(--bg-secondary)] rounded-full mx-auto mt-3 overflow-hidden">
                <div
                  className="h-full bg-[var(--accent-cyan)] rounded-full animate-pulse"
                  style={{ width: "70%" }}
                />
              </div>
            </div>
          ) : (
            <div>
              <p className="text-3xl mb-2">📄</p>
              <p className="text-sm text-[var(--text-primary)]">
                Drop your CV here or click to upload
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] mt-1">
                PDF only — automatically replaces previous version
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Gallery Upload */}
      <div className="border border-[var(--border-color)] rounded-lg p-6 bg-[var(--bg-card)] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] tracking-widest text-[var(--accent-cyan)]">
            IMAGE GALLERY
          </h3>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-3 py-1.5 text-[10px] tracking-widest border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)] rounded hover:bg-[var(--accent-cyan)]/10 transition-colors disabled:opacity-50"
          >
            {uploading ? "UPLOADING..." : "+ ADD IMAGE"}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadAsset(file, "gallery");
          }}
        />

        {loading ? (
          <p className="text-[var(--text-secondary)] text-sm text-center py-8">
            Loading assets...
          </p>
        ) : assets.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[var(--border-color)] rounded-lg">
            <p className="text-[var(--text-secondary)] text-sm">
              No assets uploaded yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="border border-[var(--border-color)] rounded-lg p-3 bg-[var(--bg-secondary)] space-y-2"
              >
                <div className="h-20 flex items-center justify-center text-2xl">
                  {asset.fileType.startsWith("image/") ? "🖼️" : "📄"}
                </div>
                <p className="text-[10px] text-[var(--text-primary)] truncate">
                  {asset.filename}
                </p>
                <div className="flex justify-between text-[9px] text-[var(--text-secondary)]">
                  <span>{formatSize(asset.fileSize)}</span>
                  <span className="uppercase">{asset.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
