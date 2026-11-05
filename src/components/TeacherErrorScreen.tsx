import { Link } from "@tanstack/react-router";

export function TeacherErrorScreen({
  isNotFound,
  errorMessage,
  teacherId,
  onRetry,
}: {
  isNotFound: boolean;
  errorMessage?: string | null;
  teacherId: string;
  onRetry?: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-deep px-6 text-center">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_center,#1b1220_0%,#07060d_80%)]" />

      <div className="relative max-w-md rounded-2xl border border-border/80 bg-deep/90 p-8 shadow-2xl backdrop-blur-md sm:p-10">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-destructive/40 bg-destructive/10 text-destructive">
          <span className="font-mono text-2xl">{isNotFound ? "✦" : "!"}</span>
        </div>

        {isNotFound ? (
          <>
            <h1 className="font-display text-2xl text-chalk sm:text-3xl">
              Teacher Experience Not Found
            </h1>
            <p className="mt-3 font-body text-sm leading-relaxed text-chalk-dim">
              This personalized Teachers&apos; Day page does not exist. Please verify the unique
              link or check with the student who shared it.
            </p>
            {teacherId && (
              <p className="mt-2 font-mono text-xs text-gold/80">
                Requested ID: &ldquo;{teacherId}&rdquo;
              </p>
            )}
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl text-chalk sm:text-3xl">Something went wrong</h1>
            <p className="mt-3 font-body text-sm leading-relaxed text-chalk-dim">
              Unable to load this Teachers&apos; Day experience at this moment.
            </p>
            {errorMessage && (
              <p className="mt-2 font-mono text-xs text-destructive/80">{errorMessage}</p>
            )}
          </>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {!isNotFound && onRetry && (
            <button
              onClick={onRetry}
              className="rounded-full border border-gold/60 bg-gold/15 px-6 py-2.5 font-body text-xs tracking-[0.25em] text-gold uppercase transition-colors hover:bg-gold/25"
            >
              Try Again ↻
            </button>
          )}

          <Link
            to="/admin/teachers"
            className="rounded-full border border-border px-5 py-2.5 font-body text-xs tracking-[0.2em] text-chalk-dim uppercase transition-colors hover:border-gold/50 hover:text-gold"
          >
            Teacher Directory
          </Link>

          <Link
            to="/"
            className="rounded-full border border-border px-5 py-2.5 font-body text-xs tracking-[0.2em] text-chalk-dim uppercase transition-colors hover:border-gold/50 hover:text-gold"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
