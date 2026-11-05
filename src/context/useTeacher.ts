import { useContext } from "react";
import { TeacherContext, type TeacherContextValue } from "./TeacherContext";

export function useTeacher(): TeacherContextValue {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error("useTeacher must be used within a TeacherProvider");
  }
  return context;
}
