import { useState, useEffect, useRef } from "react";
import { Sparkles, Upload, X, Maximize2 } from "lucide-react";

export interface TeacherPhotoProps {
  url?: string;
  name: string;
  teacherId?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  allowUpload?: boolean;
}

const DEFAULT_FALLBACK_PORTRAIT = "/teacher-portrait.svg";

export function getTeacherPortrait(teacherId?: string, name?: string): string {
  const normName = (name || "").toLowerCase();
  if (teacherId === "001" || normName.includes("shoban") || normName.includes("shobhan")) {
    return "/shobhana-portrait.svg";
  }
  if (teacherId === "003" || normName.includes("aruna") || normName.includes("@run@")) {
    return "/aruna-portrait.svg";
  }
  return DEFAULT_FALLBACK_PORTRAIT;
}

/**
 * Extracts Google Drive file ID if present
 */
function extractDriveId(url?: string): string | null {
  if (!url) return null;
  const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) return matchId[1];
  const matchPath = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchPath && matchPath[1]) return matchPath[1];
  return null;
}

export function TeacherPhoto({
  url,
  name,
  teacherId = "001",
  className = "",
  size = "md",
  allowUpload = true,
}: TeacherPhotoProps) {
  const [retryIndex, setRetryIndex] = useState(0);
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load custom stored photo for this specific teacher
  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(`teacher_custom_photo_${teacherId}`) ||
        localStorage.getItem("teacher_custom_photo_global");
      if (stored) {
        setCustomPhoto(stored);
      }
    } catch {
      // Ignore storage errors
    }
  }, [teacherId]);

  const specificPortrait = getTeacherPortrait(teacherId, name);

  // Google Drive alternative URL formats in order of fallback
  const driveId = extractDriveId(url);
  const candidateUrls: string[] = [];

  if (customPhoto) {
    candidateUrls.push(customPhoto);
  } else if (url && url.trim()) {
    if (driveId) {
      candidateUrls.push(`https://lh3.googleusercontent.com/d/${driveId}`);
      candidateUrls.push(`https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`);
      candidateUrls.push(`https://drive.usercontent.google.com/download?id=${driveId}&export=view`);
    } else {
      candidateUrls.push(url.trim());
    }
  }
  candidateUrls.push(specificPortrait);
  candidateUrls.push(DEFAULT_FALLBACK_PORTRAIT);

  const activeSrc = candidateUrls[retryIndex] || specificPortrait;

  const handleImageError = () => {
    if (retryIndex < candidateUrls.length - 1) {
      setRetryIndex((prev) => prev + 1);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setCustomPhoto(base64);
        setRetryIndex(0);
        try {
          localStorage.setItem(`teacher_custom_photo_${teacherId}`, base64);
        } catch {
          // Ignore
        }
        setUploadSuccess(true);
        setIsModalOpen(false);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.removeItem(`teacher_custom_photo_${teacherId}`);
      localStorage.removeItem("teacher_custom_photo_global");
    } catch {
      // Ignore
    }
    setCustomPhoto(null);
    setRetryIndex(0);
    setIsModalOpen(false);
  };

  const sizeClasses = {
    sm: "h-20 w-20 sm:h-24 sm:w-24",
    md: "h-28 w-28 sm:h-36 sm:w-36",
    lg: "h-36 w-36 sm:h-44 sm:w-44",
    xl: "h-44 w-44 sm:h-52 sm:w-52",
  }[size];

  return (
    <div
      className={`pointer-events-auto relative mx-auto group flex flex-col items-center justify-center ${className}`}
    >
      {/* Outer Halo Glow */}
      <div className="absolute -inset-2 rounded-full bg-accent/20 blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 animate-pulse pointer-events-none" />

      {/* Main Circular Portrait Container */}
      <div
        className={`relative ${sizeClasses} rounded-full border-2 border-accent/80 bg-deep/90 p-1 shadow-[0_0_35px_rgba(238,195,115,0.4)] backdrop-blur-md overflow-hidden transition-transform duration-500 group-hover:scale-105`}
      >
        <img
          key={activeSrc}
          src={activeSrc}
          alt={`Portrait of ${name}`}
          onError={handleImageError}
          className="h-full w-full rounded-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Delicate Golden Inner Ring Border */}
        <div className="pointer-events-none absolute inset-0 rounded-full border border-accent/30" />

        {/* Hover / Touch Overlay Button */}
        {allowUpload && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-parchment text-[11px] font-medium cursor-pointer p-1 backdrop-blur-xs"
            title="Click to preview picture"
            aria-label="View picture"
          >
            <Maximize2 className="w-5 h-5 text-accent mb-1" />
            <span className="font-body text-center leading-tight">View Picture</span>
          </button>
        )}
      </div>

      {/* Upload Confirmation Badge */}
      {uploadSuccess && (
        <div className="absolute -bottom-6 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[11px] font-medium shadow-lg flex items-center gap-1.5 animate-bounce z-10">
          <Sparkles className="w-3 h-3" />
          Photo updated!
        </div>
      )}

      {/* Quick View Pill for Touch Devices */}
      {allowUpload && (
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-black/40 px-2.5 py-0.5 font-body text-[10px] tracking-wider text-parchment/70 uppercase backdrop-blur-sm transition-colors hover:border-accent hover:text-accent sm:hidden"
        >
          <Maximize2 className="h-3 w-3 text-accent" />
          <span>View Picture</span>
        </button>
      )}

      {/* Picture Preview Modal (Lightbox) */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative flex flex-col items-center max-w-lg w-full rounded-2xl border border-gold/40 bg-zinc-950 p-4 sm:p-5 text-left shadow-2xl text-chalk animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex w-full items-center justify-between pb-3 border-b border-gold/20">
              <h3 className="font-display text-base sm:text-lg text-gold font-medium truncate pr-2">
                {name}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-chalk-dim hover:bg-white/10 hover:text-chalk transition-colors shrink-0"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Picture Preview (What Exists) */}
            <div className="my-4 flex items-center justify-center w-full max-h-[65vh] overflow-hidden rounded-xl bg-black/60 border border-white/10 p-2">
              <img
                src={activeSrc}
                alt={name}
                className="max-h-[58vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
              />
            </div>

            {/* Clean Footer Controls */}
            <div className="flex w-full items-center justify-between pt-3 border-t border-white/10">
              {customPhoto ? (
                <button
                  type="button"
                  onClick={handleResetPhoto}
                  className="text-xs text-red-400 hover:text-red-300 hover:underline transition-colors"
                >
                  Reset Photo
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gold/40 bg-gold/10 hover:bg-gold/20 text-gold text-xs font-medium transition-colors cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Change Photo</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-chalk text-xs font-medium transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
