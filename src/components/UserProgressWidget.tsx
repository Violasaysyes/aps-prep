"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SavedSession {
  major?: string;
  intro?: string;
  analysis?: { semesters: Array<{ courses: Array<unknown> }> };
  completedCourses?: string[];
}

export function UserProgressWidget() {
  const [session, setSession] = useState<SavedSession | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("aps_session");
      if (raw) setSession(JSON.parse(raw));
    } catch {}
  }, []);

  if (!session || !session.major) return null;

  const totalCourses =
    session.analysis?.semesters.reduce((sum, s) => sum + s.courses.length, 0) ?? 0;
  const completedCount = session.completedCourses?.length ?? 0;
  const pct = totalCourses > 0 ? Math.round((completedCount / totalCourses) * 100) : 0;

  return (
    <section className="px-6 pb-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-card border-2 border-lime/30 rounded-3xl p-5 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold text-muted uppercase tracking-wide mb-1.5">继续备考</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-sm truncate">{session.major}</span>
              {session.intro && (
                <span className="text-xs bg-success/15 text-success font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                  自我介绍 ✓
                </span>
              )}
              {totalCourses > 0 && (
                <span className="text-xs text-muted whitespace-nowrap">
                  Swipe {pct}%
                  {pct > 0 && (
                    <span className="ml-1 text-lime font-bold">({completedCount}/{totalCourses}门搞定)</span>
                  )}
                </span>
              )}
            </div>
          </div>
          <Link
            href="/dashboard"
            className="shrink-0 bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition"
          >
            继续 →
          </Link>
        </div>
      </div>
    </section>
  );
}
