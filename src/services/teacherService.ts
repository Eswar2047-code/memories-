import { TEACHER_API_URL } from "../config";
import mockTeachersData from "../data/mockTeacher.json";
import type { Teacher, TeacherApiResponse, TeacherListItem } from "../types/teacher";
import { formatPhotoUrl, normalizeTeacherId, validateTeacher } from "../utils/validateTeacher";

const mockTeachers: Teacher[] = (mockTeachersData as Teacher[]).map((t) => ({
  ...t,
  photo: formatPhotoUrl(t.photo),
}));

export class TeacherNotFoundError extends Error {
  constructor(id: string) {
    super(`Teacher with ID "${id}" was not found.`);
    this.name = "TeacherNotFoundError";
  }
}

export class TeacherApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TeacherApiError";
  }
}

/**
 * In-memory cache so repeated animations or scene changes do NOT trigger repeated API calls.
 */
const teacherCache = new Map<string, Teacher>();

/**
 * Fetches a single teacher by their unique teacher ID.
 * Strict ID matching: NEVER falls back to another teacher's data.
 */
export async function fetchTeacherById(rawId: string): Promise<Teacher> {
  const teacherId = normalizeTeacherId(rawId);
  if (!teacherId) {
    throw new TeacherNotFoundError(rawId || "unknown");
  }

  // Check cache first
  if (teacherCache.has(teacherId)) {
    return teacherCache.get(teacherId)!;
  }

  // 1. Try Google Apps Script API if configured
  if (TEACHER_API_URL) {
    try {
      const url = `${TEACHER_API_URL}?teacherId=${encodeURIComponent(teacherId)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new TeacherApiError(`API returned status ${res.status}`);
      }

      const data: TeacherApiResponse = await res.json();

      if (!data.success) {
        if (data.error === "TEACHER_NOT_FOUND") {
          // If the real API explicitly said teacher is not found, do NOT disguise with another teacher
          throw new TeacherNotFoundError(rawId);
        }
        throw new TeacherApiError(data.message || data.error || "Failed to retrieve teacher data");
      }

      if (data.teacher) {
        const formattedTeacher: Teacher = {
          ...data.teacher,
          id: String(data.teacher.id).trim(),
          photo: formatPhotoUrl(data.teacher.photo),
        };

        const validation = validateTeacher(formattedTeacher);
        if (!validation.valid) {
          console.warn("Teacher data has validation warnings:", validation.errors);
        }

        teacherCache.set(teacherId, formattedTeacher);
        return formattedTeacher;
      }
    } catch (err) {
      if (err instanceof TeacherNotFoundError) {
        throw err;
      }
      console.warn("Live API fetch failed, checking local mock database...", err);
      // Fall through to check local mock database for development / preloaded responses
    }
  }

  // 2. Strict lookup against local mock teachers for exact ID match
  const mockMatch = mockTeachers.find((t) => normalizeTeacherId(t.id) === teacherId);

  if (mockMatch) {
    teacherCache.set(teacherId, mockMatch);
    return mockMatch;
  }

  // 3. Strict failure: Never show a default teacher if ID is unknown!
  throw new TeacherNotFoundError(rawId);
}

/**
 * Fetches all teachers for the admin management view.
 */
export async function fetchAllTeachers(): Promise<TeacherListItem[]> {
  if (TEACHER_API_URL) {
    try {
      const url = `${TEACHER_API_URL}?action=list`;
      const res = await fetch(url);
      if (res.ok) {
        const data: TeacherApiResponse = await res.json();
        if (data.success && Array.isArray(data.teachers)) {
          return data.teachers;
        }
      }
    } catch (err) {
      console.warn("Could not fetch list from API, falling back to local list:", err);
    }
  }

  // Fallback to local mock data list
  return mockTeachers.map((t) => ({
    id: t.id,
    name: t.name,
    salutation: t.salutation,
    subject: t.subject,
    department: t.department,
    specialQuality: t.specialQuality,
    hasMessage: Boolean(t.message),
    hasPhoto: Boolean(t.photo),
    photo: t.photo,
  }));
}

/**
 * Clears cached data if needed
 */
export function clearTeacherCache() {
  teacherCache.clear();
}
