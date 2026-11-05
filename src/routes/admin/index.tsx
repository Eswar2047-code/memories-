import { createFileRoute, Link } from "@tanstack/react-router";
import { GOOGLE_FORM_URL } from "../../config";

export const Route = createFileRoute("/admin/")({
  component: AdminIndexComponent,
});

function AdminIndexComponent() {
  const embedUrl = `${GOOGLE_FORM_URL}&embedded=true`;

  return (
    <div className="relative min-h-screen bg-deep px-4 py-8 text-chalk sm:px-8 sm:py-12">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 [background:radial-gradient(ellipse_at_top,#1f182c_0%,#07060d_70%)]" />

      <div className="relative mx-auto max-w-5xl">
        {/* Navigation & Header */}
        <header className="mb-8 flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs tracking-widest text-gold uppercase">
                ✦ Admin Portal
              </span>
            </div>
            <h1 className="mt-1 font-display text-2xl tracking-wide text-chalk sm:text-3xl">
              Teacher Data Entry &amp; Google Form
            </h1>
            <p className="mt-1 font-body text-xs text-chalk-dim">
              Submit personalized responses for each teacher to generate their unique Classroom of
              Memories experience.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/admin/teachers"
              className="rounded-full border border-gold/60 bg-gold/15 px-4 py-2 font-body text-xs tracking-wider text-gold uppercase transition-colors hover:bg-gold/25"
            >
              Teacher Directory &amp; Links →
            </Link>
            <Link
              to="/"
              className="rounded-full border border-border bg-deep/80 px-4 py-2 font-body text-xs tracking-wider text-chalk-dim uppercase transition-colors hover:border-gold/40 hover:text-chalk"
            >
              ← Back to App
            </Link>
          </div>
        </header>

        {/* Step-by-step instructions */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border/80 bg-deep/70 p-4 backdrop-blur-sm">
            <div className="mb-2 font-mono text-xs text-gold">STEP 1</div>
            <h3 className="font-display text-sm font-semibold text-chalk">Assign Teacher ID</h3>
            <p className="mt-1 font-body text-xs text-chalk-dim leading-relaxed">
              Use a clean, unique ID such as <span className="font-mono text-gold/90">001</span>,{" "}
              <span className="font-mono text-gold/90">002</span>, or{" "}
              <span className="font-mono text-gold/90">anitha01</span>.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-deep/70 p-4 backdrop-blur-sm">
            <div className="mb-2 font-mono text-xs text-gold">STEP 2</div>
            <h3 className="font-display text-sm font-semibold text-chalk">Fill Out Memories</h3>
            <p className="mt-1 font-body text-xs text-chalk-dim leading-relaxed">
              Write their subject, unforgettable moments, special qualities, and personal letter of
              gratitude.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-deep/70 p-4 backdrop-blur-sm">
            <div className="mb-2 font-mono text-xs text-gold">STEP 3</div>
            <h3 className="font-display text-sm font-semibold text-chalk">Submit Form</h3>
            <p className="mt-1 font-body text-xs text-chalk-dim leading-relaxed">
              Submit the response directly below or open the full Google Form in a new tab.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-deep/70 p-4 backdrop-blur-sm">
            <div className="mb-2 font-mono text-xs text-gold">STEP 4</div>
            <h3 className="font-display text-sm font-semibold text-chalk">Share Magic Link</h3>
            <p className="mt-1 font-body text-xs text-chalk-dim leading-relaxed">
              Open <span className="font-mono text-gold/90">/teacher/&lt;ID&gt;</span> to experience
              their 3D universe.
            </p>
          </div>
        </div>

        {/* Embedded Google Form Card */}
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-deep/90 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-border/60 bg-deep/60 px-5 py-3.5">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-destructive/80" />
              <span className="h-3 w-3 rounded-full bg-gold/80" />
              <span className="h-3 w-3 rounded-full bg-star/80" />
              <span className="ml-2 font-mono text-xs text-chalk-dim">
                Google Form: Teachers&apos; Day Personalized Submission
              </span>
            </div>

            <a
              href={GOOGLE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-gold hover:underline"
            >
              Open Form in New Tab ↗
            </a>
          </div>

          <div className="relative min-h-[750px] w-full bg-white/5">
            <iframe
              src={embedUrl}
              title="Teachers Day Google Form"
              className="h-[800px] w-full border-none"
              loading="lazy"
            >
              Loading Google Form…
            </iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
