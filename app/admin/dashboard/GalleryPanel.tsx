"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Upload, Trash2, Copy, Check, ImageIcon, X, Loader2 } from "lucide-react";

type GalleryImage = {
  public_id: string;
  filename: string;
  url: string;
  size: number;
  createdAt: string;
  width?: number;
  height?: number;
};

export default function GalleryPanel() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [preview, setPreview] = useState<GalleryImage | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function fetchImages() {
    setLoading(true);
    const res = await fetch("/api/admin/gallery");
    const data = await res.json();
    setImages(data);
    setLoading(false);
  }

  useEffect(() => { fetchImages(); }, []);

  async function uploadFiles(files: FileList | File[]) {
    setUploadError("");
    setUploading(true);
    const arr = Array.from(files);
    const results: GalleryImage[] = [];

    for (const file of arr) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.message ?? "Upload gagal.");
        break;
      }
      results.push({ public_id: data.public_id, filename: data.filename, url: data.url, size: file.size, createdAt: new Date().toISOString() });
    }

    setImages((prev) => [...results, ...prev]);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleDelete(img: GalleryImage) {
    if (!confirm(`Hapus gambar "${img.filename}"?`)) return;
    setDeleting(img.filename);
    await fetch("/api/admin/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_id: img.public_id }),
    });
    setImages((prev) => prev.filter((i) => i.public_id !== img.public_id));
    setDeleting(null);
    if (preview?.public_id === img.public_id) setPreview(null);
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Galeri Gambar
          <span className="ml-2 text-sm font-normal text-gray-500">({images.length} file)</span>
        </h2>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 rounded-xl bg-teal px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal/90 disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Mengupload..." : "Upload Gambar"}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && uploadFiles(e.target.files)}
      />

      {/* Drag & drop area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          uploadFiles(e.dataTransfer.files);
        }}
        onClick={() => fileRef.current?.click()}
        className={`mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-8 transition ${
          dragOver
            ? "border-teal bg-teal/5"
            : "border-gray-200 hover:border-teal/50 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-teal/50 dark:hover:bg-gray-800/50"
        }`}
      >
        <ImageIcon className="h-8 w-8 text-gray-400" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Drag & drop gambar di sini, atau <span className="font-semibold text-teal">klik untuk pilih</span>
        </p>
        <p className="text-xs text-gray-400">JPG, PNG, WebP — maks. 5MB per file</p>
      </div>

      {uploadError && (
        <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
          {uploadError}
        </p>
      )}

      {/* Image grid */}
      {loading ? (
        <div className="mt-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : images.length === 0 ? (
        <p className="mt-8 text-center text-gray-400">Belum ada gambar. Upload gambar pertama Anda.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {images.map((img) => (
            <div
              key={img.filename}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Thumbnail */}
              <div
                className="relative aspect-square cursor-pointer overflow-hidden bg-gray-100 dark:bg-gray-700"
                onClick={() => setPreview(img)}
              >
                <Image
                  src={img.url}
                  alt={img.filename}
                  fill
                  sizes="200px"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>

              {/* Actions overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition group-hover:opacity-100">
                <button
                  onClick={() => copyUrl(img.url)}
                  title="Copy URL"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-700 transition hover:bg-teal hover:text-white"
                >
                  {copied === img.url ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => handleDelete(img)}
                  disabled={deleting === img.filename}
                  title="Hapus"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-700 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
                >
                  {deleting === img.filename
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Trash2 className="h-4 w-4" />}
                </button>
              </div>

              {/* Filename + size */}
              <div className="p-2">
                <p className="truncate text-[11px] font-medium text-gray-700 dark:text-gray-300">{img.filename}</p>
                <p className="text-[10px] text-gray-400">{formatSize(img.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox preview */}
      {preview && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
          onClick={() => setPreview(null)}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setPreview(null)}
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="relative max-h-[85vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={preview.url}
              alt={preview.filename}
              className="max-h-[80vh] max-w-[88vw] rounded-xl object-contain"
            />
            <div className="mt-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white">{preview.filename}</p>
                <p className="text-xs text-gray-400">{formatSize(preview.size)}</p>
              </div>
              <button
                onClick={() => copyUrl(preview.url)}
                className="flex items-center gap-2 rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal/90"
              >
                {copied === preview.url ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === preview.url ? "Disalin!" : "Copy URL"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
