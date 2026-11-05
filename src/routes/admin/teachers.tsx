import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { fetchAllTeachers } from "../../services/teacherService";
import { TeacherPhoto } from "../../components/TeacherPhoto";
import type { TeacherListItem } from "../../types/teacher";
import { TEACHER_API_URL } from "../../config";

export const Route = createFileRoute("/admin/teachers")({
  component: AdminTeachersComponent,
});

function AdminTeachersComponent() {
  const [teachers, setTeachers] = useState<TeacherListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchAllTeachers()
      .then((data) => {
        if (mounted) {
          setTeachers(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch teachers:", err);
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredTeachers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return teachers;
    return teachers.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        (t.subject && t.subject.toLowerCase().includes(q)) ||
        (t.department && t.department.toLowerCase().includes(q)),
    );
  }, [teachers, search]);

  const copyLink = (id: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/teacher/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  return (
    <div className="relative min-h-screen bg-deep px-4 py-8 text-chalk sm:px-8 sm:py-12">
      <div className="pointer-events-none fixed inset-0 [background:radial-gradient(ellipse_at_top,#1a1326_0%,#07060d_70%)]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs tracking-widest text-gold uppercase">
                ✦ Teacher Directory
              </span>
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${
                  TEACHER_API_URL
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-gold/15 text-gold border border-gold/30"
                }`}
              >
                {TEACHER_API_URL ? "Live Google Sheet API" : "Local Database Mode"}
              </span>
            </div>
            <h1 className="mt-1 font-display text-2xl tracking-wide text-chalk sm:text-3xl">
              Personalized Teacher Links &amp; Directory
            </h1>
            <p className="mt-1 font-body text-xs text-chalk-dim">
              Manage teacher records, generate shareable personalized links, and preview the 3D
              experiences.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/admin"
              className="rounded-full border border-gold/60 bg-gold/15 px-4 py-2 font-body text-xs tracking-wider text-gold uppercase transition-colors hover:bg-gold/25"
            >
              + Submit New Response
            </Link>
            <Link
              to="/"
              className="rounded-full border border-border bg-deep/80 px-4 py-2 font-body text-xs tracking-wider text-chalk-dim uppercase transition-colors hover:border-gold/40 hover:text-chalk"
            >
              ← Back to App
            </Link>
          </div>
        </header>

        {/* Search & Filter Bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Teacher ID, Name, or Subject…"
              className="w-full rounded-xl border border-border/80 bg-deep/80 px-4 py-2.5 pl-10 font-body text-xs text-chalk placeholder:text-chalk-dim/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
            <span className="absolute left-3.5 top-3 text-xs text-chalk-dim">🔍</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-chalk-dim">
            <span>Showing {filteredTeachers.length} teacher(s)</span>
          </div>
        </div>

        {/* Teachers Table Card */}
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-deep/90 shadow-2xl backdrop-blur-md">
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
              <p className="mt-3 font-display text-sm text-chalk-dim">Loading teacher directory…</p>
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-display text-lg text-chalk">
                No teachers found matching &ldquo;{search}&rdquo;
              </p>
              <p className="mt-2 font-body text-xs text-chalk-dim">
                Submit a new response using the Google Form or clear your search filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body text-xs">
                <thead>
                  <tr className="border-b border-border/60 bg-deep/60 text-[11px] font-mono tracking-wider text-chalk-dim uppercase">
                    <th className="px-5 py-3.5">Teacher ID</th>
                    <th className="px-5 py-3.5">Teacher Name</th>
                    <th className="px-5 py-3.5">Subject &amp; Dept</th>
                    <th className="px-5 py-3.5">Share Link</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredTeachers.map((t) => {
                    const relativeLink = `/teacher/${t.id}`;
                    return (
                      <tr key={t.id} className="transition-colors hover:bg-white/[0.03]">
                        <td className="px-5 py-4 font-mono font-bold text-gold">{t.id}</td>
                        <td className="px-5 py-4 font-semibold text-chalk">
                          <div className="flex items-center gap-3">
                            <TeacherPhoto
                              url={t.photo}
                              name={t.name}
                              teacherId={t.id}
                              size="sm"
                              className="h-9 w-9 ring-1 ring-gold/30"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span>{t.name}</span>
                                {t.salutation && (
                                  <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-chalk-dim">
                                    {t.salutation}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-chalk-dim">
                          <span className="text-chalk">{t.subject || "General"}</span>
                          {t.department && (
                            <span className="block text-[11px] text-chalk-dim/70">
                              {t.department}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <code className="rounded bg-black/40 px-2 py-1 font-mono text-[11px] text-gold/90">
                            {relativeLink}
                          </code>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => copyLink(t.id)}
                              className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 font-mono text-[11px] text-gold transition-colors hover:bg-gold/20"
                            >
                              {copiedId === t.id ? "✓ Copied Link" : "Copy Link"}
                            </button>

                            <Link
                              to="/teacher/$teacherId"
                              params={{ teacherId: t.id }}
                              className="rounded-full border border-border/80 bg-white/5 px-3 py-1.5 font-mono text-[11px] text-chalk-dim transition-colors hover:border-gold/50 hover:bg-gold/15 hover:text-chalk"
                            >
                              Preview ↗
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Setup documentation & instructions for Google Apps Script */}
        <div className="mt-10 rounded-2xl border border-border/70 bg-deep/60 p-6 backdrop-blur-sm sm:p-8">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base text-chalk">
              Google Apps Script API Integration Guide
            </h3>
            <span className="font-mono text-xs text-gold">google-apps-script.js</span>
          </div>
          <p className="mt-2 font-body text-xs leading-relaxed text-chalk-dim">
            To connect your live Google Sheet responses directly to this website without manual
            exports:
          </p>
          <ol className="mt-3 list-inside list-decimal space-y-1.5 font-body text-xs text-chalk-dim/90">
            <li>Open your Google Sheet linked to the Google Form.</li>
            <li>
              Click <strong className="text-chalk">Extensions → Apps Script</strong> and paste the
              contents of <code className="text-gold">google-apps-script.js</code> from this
              repository.
            </li>
            <li>
              Click <strong className="text-chalk">Deploy → New deployment</strong>, select{" "}
              <strong className="text-chalk">Web app</strong>, set &ldquo;Who has access&rdquo; to{" "}
              <strong className="text-chalk">Anyone</strong>.
            </li>
            <li>
              Copy the Web App URL and set it in <code className="text-gold">.env</code>:{" "}
              <code className="text-gold">
                VITE_TEACHER_API_URL=https://script.google.com/macros/s/.../exec
              </code>
              .
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
