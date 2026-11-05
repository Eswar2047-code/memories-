import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { Experience } from "../experience/Experience";
import { Overlay } from "../experience/Overlay";
import { playCue } from "../experience/audio";
import { ClassroomLandingBackdrop } from "./ClassroomLandingBackdrop";
import { teacherToFaculty } from "../utils/validateTeacher";
import type { Teacher } from "../types/teacher";

const SCENE_COUNT = 11;
const SCENE_NAMES: Record<number, string> = {
  0: "The Threshold",
  1: "The Classroom",
  2: "The Teacher",
  3: "Dissolve",
  4: "Constellation",
  5: "The Lesson",
  6: "The Memory",
  7: "CSE Terminal",
  8: "Gratitude",
  9: "The Letter",
  10: "Eternal Constellation",
};

export function TeacherExperienceView({ teacher }: { teacher: Teacher }) {
  const [scene, setScene] = useState(0);

  const faculty = useMemo(() => teacherToFaculty(teacher), [teacher]);

  const goToScene = useCallback((nextScene: number | ((s: number) => number)) => {
    setScene((prev) => {
      const target = typeof nextScene === "function" ? nextScene(prev) : nextScene;
      const clamped = Math.max(0, Math.min(SCENE_COUNT - 1, target));
      if (clamped !== prev) {
        playCue("transition");
      }
      return clamped;
    });
  }, []);

  const next = useCallback(() => {
    goToScene((s) => s + 1);
  }, [goToScene]);

  const prev = useCallback(() => {
    goToScene((s) => s - 1);
  }, [goToScene]);

  const replay = useCallback(() => {
    goToScene(0);
  }, [goToScene]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        e.preventDefault();
        replay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev, replay]);

  return (
    <main className="fixed inset-0 h-screen w-screen overflow-hidden bg-deep text-chalk select-none">
      {/* Single unified full-screen background container to prevent vertical layout shifting */}
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden">
        <ClassroomLandingBackdrop active={scene === 0} />
        <Experience scene={scene} faculty={faculty} />
      </div>

      {/* Atmospheric transition wash */}
      <AnimatePresence>
        <motion.div
          key={`scene-wash-${scene}`}
          initial={{ opacity: 0.28 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="pointer-events-none fixed inset-0 z-20 bg-gold/10 mix-blend-screen"
        />
      </AnimatePresence>

      <Overlay
        scene={scene}
        faculty={faculty}
        teacher={teacher}
        onNext={next}
        onPrev={prev}
        onReplay={replay}
      />

      <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex flex-col items-center gap-2.5 p-4 sm:p-6">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {Array.from({ length: SCENE_COUNT }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToScene(i)}
              title={`${i + 1}. ${SCENE_NAMES[i] ?? ""}`}
              aria-label={`Jump to scene ${i + 1}: ${SCENE_NAMES[i] ?? ""}`}
              className="pointer-events-auto group relative flex items-center justify-center p-1 focus:outline-none"
            >
              <span
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === scene
                    ? "w-7 bg-gold shadow-[0_0_8px_var(--gold)]"
                    : i < scene
                      ? "w-2.5 bg-gold/50 group-hover:w-4 group-hover:bg-gold"
                      : "w-2.5 bg-chalk/20 group-hover:w-4 group-hover:bg-chalk/50"
                }`}
              />
            </button>
          ))}
        </div>
        <span className="font-display text-xs italic text-chalk-dim/80">
          Some lessons end with the bell. The best ones never do.
        </span>
      </footer>
    </main>
  );
}
