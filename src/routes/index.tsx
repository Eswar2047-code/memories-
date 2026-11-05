import { createFileRoute, useSearch } from "@tanstack/react-router";
import { TeacherProvider, useTeacher } from "../context/TeacherContext";
import { TeacherLoadingScreen } from "../components/TeacherLoadingScreen";
import { TeacherErrorScreen } from "../components/TeacherErrorScreen";
import { TeacherExperienceView } from "../components/TeacherExperienceView";

export const Route = createFileRoute("/")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    to: typeof search["to"] === "string" ? search["to"] : undefined,
    teacherId: typeof search["teacherId"] === "string" ? search["teacherId"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "The Classroom of Memories — A Teachers' Day Experience" },
      {
        name: "description",
        content:
          "An interactive 3D Teachers' Day journey: from a classroom of memories to a universe of gratitude, with a personalized message for your teacher.",
      },
      { property: "og:title", content: "The Classroom of Memories" },
      {
        property: "og:description",
        content:
          "Some lessons end with the bell. The best ones never do. A 3D Teachers' Day journey.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JourneyWrapper,
});

function JourneyInner() {
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

function JourneyWrapper() {
  const { to, teacherId } = useSearch({ from: "/" });
  const activeId = teacherId || to || "001";

  return (
    <TeacherProvider teacherId={activeId}>
      <JourneyInner />
    </TeacherProvider>
  );
}
