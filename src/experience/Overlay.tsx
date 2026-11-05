import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import type { Faculty } from "../data/faculty";
import type { Teacher } from "../types/teacher";
import { TeacherPhoto } from "../components/TeacherPhoto";
import { playCue, startBackgroundMusic } from "./audio";

function Lines({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <p
          key={`${line}-${i}`}
          className="animate-rise text-balance"
          style={{ animationDelay: `${delay + i * 0.42}s` }}
        >
          {line === "" ? "\u00a0" : line}
        </p>
      ))}
    </>
  );
}

function Petals({ count = 26 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(i * 97) % 100}%`,
        delay: `${(i % 9) * 1.1}s`,
        dur: `${9 + (i % 6) * 1.7}s`,
        drift: `${((i % 7) - 3) * 40}px`,
        size: 5 + (i % 4) * 3,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {petals.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-gold/70"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            ["--drift" as string]: p.drift,
            animation: `petal-fall ${p.dur} linear ${p.delay} infinite`,
            boxShadow: "0 0 12px currentColor",
          }}
        />
      ))}
    </div>
  );
}

function Terminal({
  onDone,
  subject,
  onSkip,
}: {
  onDone: () => void;
  subject: string;
  onSkip: () => void;
}) {
  const script = useMemo(
    () => [
      "> initializing_teacher_impact.exe",
      "",
      `> loading module: ${subject.toLowerCase().replace(/[^a-z]+/g, "_")}`,
      "> calculating_knowledge...",
      "████████████████████ 100%",
      "> calculating_inspiration...",
      "████████████████████ 100%",
      "> calculating_memories...",
      "████████████████████ 100%",
      "",
      "> result:",
      "TEACHER_IMPACT = ∞",
      "",
      "ERROR: value exceeds all known limits.",
      "Your contribution cannot be measured.",
      "",
      "// because some impacts are infinite.",
    ],
    [subject],
  );
  const [lineCount, setLineCount] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const isFinished = lineCount >= script.length;

  useEffect(() => {
    setLineCount(1);
    let currentCount = 1;
    const id = window.setInterval(() => {
      if (currentCount >= script.length) {
        window.clearInterval(id);
        return;
      }
      currentCount += 1;
      const line = script[currentCount - 1];
      if (line && line.trim() !== "") playCue("type");
      setLineCount(currentCount);
    }, 380);
    return () => window.clearInterval(id);
  }, [script]);

  useEffect(() => {
    if (isFinished) {
      onDoneRef.current();
    }
  }, [isFinished]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lineCount]);

  const handleSkip = () => {
    setLineCount(script.length);
    onSkip();
  };

  return (
    <div className="w-full max-w-xl rounded-xl border border-border/80 bg-deep/90 p-4 text-left font-mono text-[12px] leading-relaxed text-chalk shadow-[var(--shadow-glow)] backdrop-blur-md sm:p-6 sm:text-sm">
      <div className="mb-3 flex items-center justify-between border-b border-border/50 pb-2.5 text-[11px] text-chalk-dim">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-gold/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-star/80" />
          <span className="ml-2 font-mono text-[10px] tracking-wider text-chalk-dim uppercase">
            impact_calculation.exe
          </span>
        </div>
        {!isFinished && (
          <button
            onClick={handleSkip}
            className="pointer-events-auto rounded border border-gold/30 bg-gold/10 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-gold transition-colors hover:bg-gold/20"
          >
            Skip calculation →
          </button>
        )}
      </div>

      <div
        ref={scrollRef}
        className="max-h-[38vh] overflow-y-auto space-y-0.5 pr-2 sm:max-h-[42vh]"
      >
        {script.slice(0, lineCount).map((l, i) => (
          <div
            key={i}
            className={
              l.startsWith("ERROR")
                ? "font-semibold text-destructive"
                : l.startsWith("TEACHER_IMPACT")
                  ? "gold-text text-base font-bold sm:text-lg"
                  : l.startsWith("//")
                    ? "italic text-chalk-dim"
                    : "text-chalk-dim"
            }
          >
            {l === "" ? "\u00a0" : l}
          </div>
        ))}
        {!isFinished && (
          <span
            className="inline-block text-gold"
            style={{ animation: "caret 1s steps(1) infinite" }}
          >
            ▌
          </span>
        )}
      </div>
    </div>
  );
}

const shellBase =
  "pointer-events-none fixed inset-0 z-30 flex flex-col items-center justify-center px-6 text-center";

export function Overlay({
  scene,
  faculty,
  teacher,
  onNext,
  onPrev,
  onReplay,
}: {
  scene: number;
  faculty: Faculty;
  teacher?: Teacher | null;
  onNext: () => void;
  onPrev?: () => void;
  onReplay: () => void;
}) {
  const [terminalDone, setTerminalDone] = useState(false);

  const displayName = useMemo(() => {
    if (teacher) {
      if (
        teacher.salutation &&
        !teacher.name.toLowerCase().includes(teacher.salutation.toLowerCase())
      ) {
        return `${teacher.name} ${teacher.salutation}`.trim();
      }
      return teacher.name.trim();
    }
    return faculty.name;
  }, [teacher, faculty.name]);

  const subjectAndDept = useMemo(() => {
    if (teacher) {
      const parts = [teacher.subject, teacher.department].filter(Boolean);
      return parts.join(" • ");
    }
    return faculty.subject;
  }, [teacher, faculty.subject]);

  const handleTerminalDone = useCallback(() => {
    setTerminalDone(true);
  }, []);

  useEffect(() => {
    if (scene !== 7) setTerminalDone(false);
  }, [scene]);

  useEffect(() => {
    if (scene !== 3) return;
    const id = window.setTimeout(onNext, 5200);
    return () => window.clearTimeout(id);
  }, [scene, onNext]);

  const cta = (label: string, action: () => void, key: string) => (
    <button
      key={key}
      onClick={() => {
        void startBackgroundMusic();
        action();
      }}
      className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-gold/45 bg-gold/10 px-7 py-3 font-body text-xs tracking-[0.3em] text-gold uppercase backdrop-blur-sm transition-all duration-500 hover:bg-gold/20 hover:tracking-[0.42em] hover:shadow-[var(--shadow-glow)]"
    >
      {label}
    </button>
  );

  const backBtn = (label: string, action: () => void, key: string) => (
    <button
      key={key}
      onClick={action}
      className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-border/80 bg-deep/70 px-6 py-3 font-body text-xs tracking-[0.25em] text-chalk-dim uppercase backdrop-blur-sm transition-all duration-300 hover:border-gold/40 hover:bg-gold/10 hover:text-gold"
    >
      {label}
    </button>
  );

  return (
    <div className={shellBase}>
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none flex h-full w-full flex-col items-center justify-center"
        >
          {scene === 0 && (
            <div className="flex max-w-lg flex-col items-center font-display text-2xl leading-relaxed text-chalk sm:text-3xl">
              <div className="mb-6 flex flex-col items-center">
                <TeacherPhoto
                  url={teacher?.photo}
                  name={displayName}
                  teacherId={teacher?.id}
                  size="sm"
                />
                <span className="mt-2.5 font-body text-[10px] tracking-[0.32em] text-gold/80 uppercase">
                  In Honor of {displayName}
                </span>
              </div>
              <Lines text={"Some lessons are written on a board..."} />
              <div className="h-6" />
              <Lines text={"...and some are written in our lives."} delay={1.2} />
              <div className="animate-rise mt-8" style={{ animationDelay: "2.0s" }}>
                {cta("Enter the classroom →", onNext, "enter")}
              </div>
            </div>
          )}

          {scene === 1 && (
            <div className="max-w-2xl px-4 text-center">
              <p className="animate-rise font-display text-3xl tracking-wide text-chalky sm:text-5xl drop-shadow-md">
                WELCOME, {displayName.toUpperCase()}
              </p>
              {teacher?.department && (
                <p
                  className="animate-rise mt-3 font-body text-[11px] tracking-[0.35em] text-chalk-dim uppercase drop-shadow"
                  style={{ animationDelay: "0.3s" }}
                >
                  {teacher.department}
                </p>
              )}
              <p
                className="animate-rise mt-6 font-body text-[11px] tracking-[0.42em] text-chalk-dim uppercase drop-shadow"
                style={{ animationDelay: "0.6s" }}
              >
                Today&apos;s lesson
              </p>
              <p
                className="animate-rise gold-text mt-2 font-display text-4xl sm:text-6xl drop-shadow-lg"
                style={{ animationDelay: "0.9s" }}
              >
                GRATITUDE ❤
              </p>
              <div
                className="animate-rise mt-10 flex flex-wrap items-center justify-center gap-4"
                style={{ animationDelay: "1.2s" }}
              >
                {onPrev && backBtn("← Back", onPrev, "s1-back")}
                {cta("Continue →", onNext, "s1")}
              </div>
            </div>
          )}

          {scene === 2 && (
            <div className="max-w-2xl px-4 flex flex-col items-center text-center">
              <TeacherPhoto
                url={teacher?.photo}
                name={displayName}
                teacherId={teacher?.id}
                size="md"
                className="mb-6"
              />
              <div className="font-display text-xl leading-relaxed text-chalky sm:text-2xl">
                <Lines
                  text={
                    "Every student remembers\na few teachers differently.\n\nBut some teachers...\nare impossible to forget."
                  }
                />
              </div>
              <p
                className="animate-rise gold-text mt-8 font-display text-4xl sm:text-6xl drop-shadow-lg"
                style={{ animationDelay: "1.4s" }}
              >
                {displayName}
              </p>
              <p
                className="animate-rise mt-3 font-body text-[11px] tracking-[0.38em] text-chalk-dim uppercase drop-shadow"
                style={{ animationDelay: "1.8s" }}
              >
                {subjectAndDept}
              </p>
              <div
                className="animate-rise mt-10 flex flex-wrap items-center justify-center gap-4"
                style={{ animationDelay: "2.2s" }}
              >
                {onPrev && backBtn("← Back", onPrev, "s2-back")}
                {cta("Let the classroom go →", onNext, "s2")}
              </div>
            </div>
          )}

          {scene === 3 && (
            <div className="max-w-xl font-display text-2xl leading-relaxed text-chalk sm:text-4xl">
              <Lines text={"A teacher's impact\nis bigger than a classroom."} />
              <p
                className="animate-rise gold-text mt-10 font-body text-[11px] tracking-[0.42em] uppercase"
                style={{ animationDelay: "3s" }}
              >
                Welcome to the Universe of Gratitude
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                {onPrev && backBtn("← Back", onPrev, "s3-back")}
                {cta("Enter Universe →", onNext, "s3-skip")}
              </div>
            </div>
          )}

          {scene === 4 && (
            <div className="flex h-full w-full flex-col items-center justify-between py-12">
              <p className="animate-rise font-body text-[11px] tracking-[0.42em] text-chalk-dim uppercase">
                The constellation of {faculty.constellationName}
              </p>
              {teacher?.specialQuality ? (
                <div
                  className="animate-rise mt-auto mb-8 max-w-xl rounded-2xl border border-star/30 bg-deep/90 p-6 shadow-2xl backdrop-blur-xl"
                  style={{ animationDelay: "0.4s" }}
                >
                  <p className="font-body text-[10px] tracking-[0.36em] text-star uppercase">
                    Why You Are Special
                  </p>
                  <p className="mt-3 font-display text-base leading-relaxed text-chalk italic sm:text-lg">
                    &ldquo;{teacher.specialQuality}&rdquo;
                  </p>
                </div>
              ) : (
                <div className="mt-auto mb-8 flex max-w-3xl flex-wrap justify-center gap-x-8 gap-y-3">
                  {faculty.qualities.map((q, i) => (
                    <span
                      key={q}
                      className="animate-rise animate-soft-pulse font-body text-[10px] tracking-[0.36em] text-star uppercase sm:text-xs"
                      style={{ animationDelay: `${0.6 + i * 0.35}s` }}
                    >
                      {q}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap items-center justify-center gap-4">
                {onPrev && backBtn("← Back", onPrev, "s4-back")}
                {cta("Open the book →", onNext, "s4")}
              </div>
            </div>
          )}

          {scene === 5 && (
            <div className="pointer-events-auto w-full max-w-2xl rounded-2xl border border-border bg-deep/55 p-8 backdrop-blur-md sm:p-12">
              <p className="font-body text-[11px] tracking-[0.42em] text-gold uppercase">
                What You Taught Me
              </p>
              <div className="mt-6 space-y-2 font-display text-xl leading-relaxed text-chalk sm:text-2xl">
                <Lines text={teacher?.lesson || faculty.lesson} delay={0.3} />
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                {onPrev && backBtn("← Back", onPrev, "s5-back")}
                {cta("Continue →", onNext, "s5")}
              </div>
            </div>
          )}

          {scene === 6 && (
            <div className="pointer-events-auto w-full max-w-2xl rounded-2xl border border-star/25 bg-[color-mix(in_oklab,var(--star)_8%,transparent)] p-8 shadow-[var(--shadow-glow)] backdrop-blur-xl sm:p-12">
              <p className="font-body text-[11px] tracking-[0.42em] text-star uppercase">
                A memory I&apos;ll always remember
              </p>
              <div className="mt-6 space-y-2 font-display text-xl leading-relaxed text-chalk sm:text-2xl">
                <Lines text={teacher?.memory || faculty.memory} delay={0.3} />
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                {onPrev && backBtn("← Back", onPrev, "s6-back")}
                {cta("Run impact analysis →", onNext, "s6")}
              </div>
            </div>
          )}

          {scene === 7 && (
            <div className="flex w-full flex-col items-center">
              <Terminal
                subject={teacher?.subject || faculty.subject}
                onDone={handleTerminalDone}
                onSkip={() => {
                  handleTerminalDone();
                  onNext();
                }}
              />
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                {onPrev && backBtn("← Back to Memory", onPrev, "s7-back")}
                <button
                  onClick={onNext}
                  className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-gold/45 bg-gold/15 px-7 py-3 font-body text-xs tracking-[0.3em] text-gold uppercase backdrop-blur-sm transition-all duration-500 hover:bg-gold/25 hover:shadow-[var(--shadow-glow)]"
                >
                  {terminalDone ? "Continue to Gratitude →" : "Continue anyway →"}
                </button>
              </div>
            </div>
          )}

          {scene === 8 && (
            <div className="flex max-w-xl flex-col items-center">
              <Petals />
              <TeacherPhoto
                url={teacher?.photo}
                name={displayName}
                teacherId={teacher?.id}
                size="sm"
                className="mb-4"
              />
              <div className="font-display text-2xl leading-relaxed text-chalk sm:text-3xl">
                <Lines
                  text={
                    "Behind every student\nwho learns to believe in themselves,\n\nthere is often a teacher\nwho believed in them first."
                  }
                />
              </div>
              <p
                className="animate-rise gold-text mt-8 font-display text-3xl sm:text-5xl"
                style={{ animationDelay: "3.4s" }}
              >
                Thank you, {displayName}.
              </p>
              <div
                className="animate-rise mt-10 flex flex-wrap items-center justify-center gap-4"
                style={{ animationDelay: "4.2s" }}
              >
                {onPrev && backBtn("← Back", onPrev, "s8-back")}
                {cta("Read the letter →", onNext, "s8")}
              </div>
            </div>
          )}

          {scene === 9 && (
            <div className="pointer-events-auto max-h-[82vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gold/25 bg-deep/75 p-8 text-left shadow-[var(--shadow-glow)] backdrop-blur-md sm:p-12">
              <Petals count={14} />
              <div className="mb-6 flex items-center gap-4 border-b border-gold/20 pb-4">
                <TeacherPhoto
                  url={teacher?.photo}
                  name={displayName}
                  teacherId={teacher?.id}
                  size="sm"
                  className="mx-0"
                />
                <div>
                  <p className="font-display text-lg text-chalk sm:text-xl">{displayName}</p>
                  <p className="font-body text-[10px] tracking-[0.25em] text-chalk-dim uppercase">
                    {subjectAndDept}
                  </p>
                </div>
              </div>
              <div className="space-y-2 font-display text-lg leading-relaxed text-chalk sm:text-2xl">
                <Lines text={teacher?.message || faculty.message} delay={0.2} />
              </div>
              {teacher?.quote && (
                <div
                  className="animate-rise mt-6 rounded-xl border-l-2 border-gold/70 bg-gold/5 p-4 text-left italic"
                  style={{ animationDelay: "1.8s" }}
                >
                  <p className="font-display text-sm text-gold sm:text-base">
                    &ldquo;{teacher.quote}&rdquo;
                  </p>
                </div>
              )}
              <p
                className="gold-text animate-rise mt-8 font-display text-2xl sm:text-3xl"
                style={{ animationDelay: "2.4s" }}
              >
                Happy Teachers&apos; Day ❤
              </p>
              <p
                className="animate-rise mt-4 font-body text-[11px] tracking-[0.32em] text-chalk-dim uppercase"
                style={{ animationDelay: "2.8s" }}
              >
                With respect &amp; gratitude, {teacher?.signature || faculty.signature}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-center">
                {onPrev && backBtn("← Back", onPrev, "s9-back")}
                {cta("One last look up →", onNext, "s9")}
              </div>
            </div>
          )}

          {scene === 10 && (
            <div className="flex h-full w-full flex-col items-center justify-between py-16">
              <div className="flex flex-col items-center">
                <TeacherPhoto
                  url={teacher?.photo}
                  name={displayName}
                  teacherId={teacher?.id}
                  size="md"
                  className="mb-4"
                />
                <p className="animate-rise gold-text font-display text-4xl sm:text-6xl">
                  {faculty.constellationName}
                </p>
              </div>
              <div className="space-y-1 font-body text-[10px] tracking-[0.42em] text-chalk-dim uppercase sm:text-xs">
                <Lines text={"A teacher\nA mentor\nAn inspiration"} delay={1} />
              </div>
              <div>
                <p className="animate-rise font-display text-2xl text-chalky sm:text-4xl">
                  Happy Teachers&apos; Day {displayName} ❤
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                  {onPrev && backBtn("← Back", onPrev, "s10-back")}
                  {cta("Replay the journey ↻", onReplay, "s10")}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
