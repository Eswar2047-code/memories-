import type { Teacher, TeacherValidationResult } from "../types/teacher";

/**
 * Normalizes a Teacher ID into a URL-safe, trimmed string.
 * Example: "  Anitha01  " -> "anitha01", "001" -> "001"
 */
export function normalizeTeacherId(id: string | null | undefined): string {
  if (!id) return "";
  return String(id)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");
}

/**
 * Converts Google Drive sharing links into direct image URLs that can render in <img> tags without CORS or frame blocking.
 */
export function formatPhotoUrl(url?: string | null): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  // Pattern 1: drive.google.com/open?id=FILE_ID or ?id=FILE_ID or &id=FILE_ID
  const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) {
    return `https://lh3.googleusercontent.com/d/${matchId[1]}`;
  }

  // Pattern 2: drive.google.com/file/d/FILE_ID/...
  const matchPath = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchPath && matchPath[1]) {
    return `https://lh3.googleusercontent.com/d/${matchPath[1]}`;
  }

  return trimmed;
}

/**
 * Validates a Teacher object against required and optional fields.
 */
export function validateTeacher(teacher: unknown): TeacherValidationResult {
  const errors: string[] = [];

  if (!teacher || typeof teacher !== "object") {
    return {
      valid: false,
      errors: ["Teacher record is invalid or empty."],
    };
  }

  const t = teacher as Partial<Teacher>;

  if (!t.id || typeof t.id !== "string" || !t.id.trim()) {
    errors.push("Teacher ID is required.");
  } else if (!/^[a-zA-Z0-9_-]+$/.test(t.id.trim())) {
    errors.push("Teacher ID must be alphanumeric and URL-safe (e.g. 001 or anitha01).");
  }

  if (!t.name || typeof t.name !== "string" || !t.name.trim()) {
    errors.push("Teacher Name is required.");
  }

  if (!t.salutation || typeof t.salutation !== "string" || !t.salutation.trim()) {
    errors.push("Salutation (Sir/Madam) is required.");
  }

  if (!t.subject || typeof t.subject !== "string" || !t.subject.trim()) {
    errors.push("Subject is required.");
  }

  if (!t.department || typeof t.department !== "string" || !t.department.trim()) {
    errors.push("Department is required.");
  }

  if (!t.specialQuality || typeof t.specialQuality !== "string" || !t.specialQuality.trim()) {
    errors.push("Special Quality is required.");
  }

  if (!t.memory || typeof t.memory !== "string" || !t.memory.trim()) {
    errors.push("Memorable Moment is required.");
  }

  if (!t.lesson || typeof t.lesson !== "string" || !t.lesson.trim()) {
    errors.push("What I Learned From You (Lesson) is required.");
  }

  if (!t.message || typeof t.message !== "string" || !t.message.trim()) {
    errors.push("Personal Message is required.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Converts a Teacher into a compatible Faculty object for existing 3D scenes.
 */
export function teacherToFaculty(teacher: Teacher) {
  // Extract clean letters for the 3D constellation letters
  const cleanConstellation =
    teacher.name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 10) || "TEACHER";

  // Derive prominent constellation quality stars
  const fallbackQualities = [
    "GUIDANCE",
    "PATIENCE",
    "KNOWLEDGE",
    "INSPIRATION",
    "DEDICATION",
    "HUMILITY",
  ];

  let derivedQualities: string[] = fallbackQualities;
  if (teacher.specialQuality) {
    const rawWords = teacher.specialQuality
      .replace(/[,;.\n]/g, " ")
      .split(/\s+/)
      .map((w) => w.toUpperCase().replace(/[^A-Z]/g, ""))
      .filter(
        (w) => w.length >= 4 && !["WITH", "THAT", "THIS", "THEY", "DEEP", "MORE"].includes(w),
      );

    if (rawWords.length >= 3) {
      derivedQualities = Array.from(new Set(rawWords)).slice(0, 6);
    }
  }

  return {
    slug: teacher.id,
    name: `${teacher.name} ${teacher.salutation}`.trim(),
    rawName: teacher.name,
    honorific: teacher.salutation,
    subject: teacher.subject,
    department: teacher.department,
    constellationName: cleanConstellation,
    lesson: teacher.lesson,
    memory: teacher.memory,
    qualities: derivedQualities,
    message: teacher.message,
    quote: teacher.quote || "The best teachers teach from the heart.",
    photo: formatPhotoUrl(teacher.photo),
    signature: teacher.signature || "Your grateful students",
  };
}
