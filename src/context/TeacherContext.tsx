import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { Teacher } from "../types/teacher";
import { fetchTeacherById, TeacherNotFoundError } from "../services/teacherService";

export interface TeacherContextValue {
  teacher: Teacher | null;
  loading: boolean;
  error: string | null;
  isNotFound: boolean;
  teacherId: string;
  refreshTeacher: () => Promise<void>;
}

export const TeacherContext = createContext<TeacherContextValue | null>(null);

export function TeacherProvider({
  teacherId,
  children,
}: {
  teacherId: string;
  children: ReactNode;
}) {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  const loadTeacher = useCallback(async () => {
    if (!teacherId || !teacherId.trim()) {
      setTeacher(null);
      setLoading(false);
      setIsNotFound(true);
      setError("Teacher ID is missing in URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setIsNotFound(false);

    try {
      const data = await fetchTeacherById(teacherId);
      setTeacher(data);
    } catch (err: unknown) {
      setTeacher(null);
      if (err instanceof TeacherNotFoundError) {
        setIsNotFound(true);
        setError(`Teacher experience for "${teacherId}" was not found.`);
      } else {
        setIsNotFound(false);
        setError(err instanceof Error ? err.message : "Unable to load teacher data.");
      }
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    loadTeacher();
  }, [loadTeacher]);

  const value: TeacherContextValue = {
    teacher,
    loading,
    error,
    isNotFound,
    teacherId,
    refreshTeacher: loadTeacher,
  };

  return <TeacherContext.Provider value={value}>{children}</TeacherContext.Provider>;
}

export { useTeacher } from "./useTeacher";
