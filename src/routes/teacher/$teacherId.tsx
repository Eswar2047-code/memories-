import { createFileRoute } from "@tanstack/react-router";
import { TeacherProvider, useTeacher } from "../../context/TeacherContext";
import { TeacherLoadingScreen } from "../../components/TeacherLoadingScreen";
import { TeacherErrorScreen } from "../../components/TeacherErrorScreen";
import { TeacherExperienceView } from "../../components/TeacherExperienceView";

export const Route = createFileRoute("/teacher/$teacherId")({
  component: TeacherRouteComponent,
});

function TeacherExperienceContent() {
  const { teacher, loading, error, isNotFound, teacherId, refreshTeacher } = useTeacher();

  if (loading) {
    return <TeacherLoadingScreen teacherId={teacherId} />;
  }

  if (isNotFound || error || !teacher) {
    return (
      <TeacherErrorScreen
        isNotFound={isNotFound}
        errorMessage={error}
        teacherId={teacherId}
        onRetry={refreshTeacher}
      />
    );
  }

  return <TeacherExperienceView teacher={teacher} />;
}

function TeacherRouteComponent() {
  const { teacherId } = Route.useParams();

  return (
    <TeacherProvider teacherId={teacherId}>
      <TeacherExperienceContent />
    </TeacherProvider>
  );
}
