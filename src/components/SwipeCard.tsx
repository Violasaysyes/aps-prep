"use client";

import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { useState, useEffect } from "react";

export interface CourseCard {
  id: string;
  name: string;
  nameEn: string;
  grade: number;
  credits: number;
  risk: "high" | "medium" | "low";
  reason: string;
  questions: string[];
  answers: string[];
  summary: string;
}

export type Tier = "none" | "basic" | "pro" | "max";

const riskConfig = {
  high: {
    label: "HIGH 高风险",
    bg: "bg-coral-light",
    badge: "bg-coral text-white",
    border: "border-coral/30",
  },
  medium: {
    label: "MED 中风险",
    bg: "bg-card",
    badge: "bg-foreground text-background",
    border: "border-border",
  },
  low: {
    label: "LOW 低风险",
    bg: "bg-lime/10",
    badge: "bg-lime/30 text-foreground",
    border: "border-lime/20",
  },
};

interface SwipeCardProps {
  course: CourseCard;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
  tier?: Tier;
  onUpgrade?: (target: "basic" | "pro") => void;
}

type EditState = "idle" | "suggesting" | "loading" | "reviewing";

function EditableField({
  value,
  onSave,
  className = "",
  context = "",
  type = "answer",
}: {
  value: string;
  onSave: (v: string) => void;
  className?: string;
  context?: string;
  type?: "summary" | "answer";
}) {
  const [editState, setEditState] = useState<EditState>("idle");
  const [suggestions, setSuggestions] = useState("");
  const [refined, setRefined] = useState("");
  const [error, setError] = useState("");

  const reset = () => {
    setEditState("idle");
    setSuggestions("");
    setRefined("");
    setError("");
  };

  const runRefine = async () => {
    if (!suggestions.trim()) return;
    setEditState("loading");
    setError("");
    try {
      const res = await fetch("/api/ai-refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original: value, suggestions, context, type }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "失败");
      setRefined(data.refined);
      setEditState("reviewing");
    } catch (e) {
      setError((e as Error).message || "润色失败，请重试");
      setEditState("suggesting");
    }
  };

  if (editState === "idle") {
    return (
      <div className={`group relative ${className}`}>
        <span className="leading-relaxed">{value}</span>
        <button
          onClick={(e) => { e.stopPropagation(); setEditState("suggesting"); }}
          className="opacity-0 group-hover:opacity-100 ml-1.5 align-middle text-[10px] px-1.5 py-0.5 rounded bg-foreground/10 text-muted transition-opacity hover:bg-accent/20"
          title="AI润色"
        >✏️</button>
      </div>
    );
  }

  if (editState === "suggesting") {
    return (
      <div className="space-y-2">
        <div className="text-[13px] text-muted leading-relaxed line-clamp-2 opacity-60">{value}</div>
        <div className="bg-accent/8 border border-accent/20 rounded-xl p-3 space-y-2">
          <p className="text-[11px] font-bold text-accent uppercase tracking-widest">✦ AI润色</p>
          <textarea
            className="w-full text-[13px] bg-white/70 border border-border rounded-lg px-2.5 py-2 resize-none outline-none focus:border-accent transition placeholder:text-muted/50"
            rows={2}
            placeholder={type === "summary"
              ? "例：我们还学了傅里叶变换，考试是开卷的，加上一个实验项目..."
              : "例：可以更简洁，加入具体例子，用第一人称..."}
            value={suggestions}
            onChange={(e) => setSuggestions(e.target.value)}
            autoFocus
            onKeyDown={(e) => { if (e.key === "Escape") reset(); }}
          />
          {error && <p className="text-[11px] text-coral">{error}</p>}
          <div className="flex gap-1.5 justify-end">
            <button onClick={reset} className="text-[11px] px-2.5 py-1.5 rounded-lg bg-border text-muted font-medium">取消</button>
            <button
              onClick={runRefine}
              disabled={!suggestions.trim()}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-accent text-white font-bold disabled:opacity-40 transition hover:opacity-90"
            >✦ AI润色</button>
          </div>
        </div>
      </div>
    );
  }

  if (editState === "loading") {
    return (
      <div className="space-y-2">
        <div className="text-[13px] text-muted leading-relaxed line-clamp-2 opacity-60">{value}</div>
        <div className="bg-accent/8 border border-accent/20 rounded-xl p-3 flex items-center gap-2.5">
          <span className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin shrink-0" />
          <span className="text-[12px] text-accent font-medium">AI润色中...</span>
        </div>
      </div>
    );
  }

  // reviewing
  return (
    <div className="space-y-2">
      <div className="bg-accent/8 border border-accent/20 rounded-xl p-3 space-y-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-accent uppercase tracking-widest">✦ 润色结果</span>
        </div>
        <p className="text-[13px] leading-relaxed">{refined}</p>
        <div className="flex gap-1.5 justify-end pt-0.5">
          <button
            onClick={() => { setSuggestions(""); setEditState("suggesting"); }}
            className="text-[11px] px-2.5 py-1.5 rounded-lg bg-border text-muted font-medium"
          >重来</button>
          <button
            onClick={() => { onSave(refined); reset(); }}
            className="text-[11px] px-3 py-1.5 rounded-lg bg-foreground text-background font-bold transition hover:opacity-90"
          >采用 ✓</button>
        </div>
      </div>
    </div>
  );
}

export function SwipeCard({ course, onSwipe, isTop, tier = "none", onUpgrade }: SwipeCardProps) {
  const isPro = tier === "pro" || tier === "max";
  const isBasic = tier === "basic";

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-12, 0, 12]);
  const opacity = useTransform(x, [-300, -100, 0, 100, 300], [0.5, 1, 1, 1, 0.5]);
  const rightOverlayOpacity = useTransform(x, [0, 80, 180], [0, 0.7, 1]);
  const leftOverlayOpacity = useTransform(x, [-180, -80, 0], [1, 0.7, 0]);

  const config = riskConfig[course.risk];

  // Persisted edits in localStorage
  const storageKey = `aps_edit_${course.id}`;
  const [editedSummary, setEditedSummary] = useState(course.summary);
  const [editedAnswers, setEditedAnswers] = useState<string[]>(course.answers);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.summary) setEditedSummary(parsed.summary);
        if (parsed.answers) setEditedAnswers(parsed.answers);
      }
    } catch { /* ignore */ }
  }, [storageKey]);

  const persistEdit = (summary: string, answers: string[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ summary, answers }));
    } catch { /* ignore */ }
  };

  const saveSummary = (v: string) => {
    setEditedSummary(v);
    persistEdit(v, editedAnswers);
  };

  const saveAnswer = (idx: number, v: string) => {
    const next = [...editedAnswers];
    next[idx] = v;
    setEditedAnswers(next);
    persistEdit(editedSummary, next);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setIsDragging(false);
    if (info.offset.x > 120) onSwipe("right");
    else if (info.offset.x < -120) onSwipe("left");
  };

  return (
    <motion.div
      className={`absolute inset-0 ${isTop && !isDragging ? "cursor-grab active:cursor-grabbing" : ""}`}
      style={{ x: isTop ? x : 0, rotate: isTop ? rotate : 0, opacity: isTop ? opacity : 1 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
      animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
      exit={{ x: 500, opacity: 0, transition: { duration: 0.25 } }}
    >
      <div className={`${config.bg} border-2 ${config.border} rounded-3xl p-5 sm:p-6 h-full flex flex-col overflow-hidden`}>

        {/* Risk badge + grade */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <span className={`${config.badge} text-xs font-bold px-4 py-1.5 rounded-full`}>
            {config.label}
          </span>
          <span className="text-sm text-muted font-medium">{course.grade}分 · {course.credits}学分</span>
        </div>

        {/* Course name */}
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-0.5 tracking-tight shrink-0">{course.name}</h2>
        <p className="text-sm text-muted mb-4 shrink-0">{course.nameEn}</p>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 -mr-1">

          {/* Course summary — visible to all, editable for Pro/Max */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl px-4 py-3">
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Course Overview</p>
            {isPro ? (
              <EditableField
                value={editedSummary}
                onSave={saveSummary}
                className="text-[14px] leading-relaxed text-foreground"
                context={`${course.nameEn} (${course.name}), ${course.grade} points, ${course.credits} credits`}
                type="summary"
              />
            ) : (
              <p className="text-[14px] leading-relaxed text-foreground">{editedSummary}</p>
            )}
          </div>

          {/* Risk reason — blurred for none, visible for basic+ */}
          <div className="relative">
            <p className={`text-[13px] text-muted leading-relaxed ${tier === "none" ? "blur-sm select-none pointer-events-none" : ""}`}>
              <span className="font-semibold text-foreground/70">风险原因：</span>{course.reason}
            </p>
            {tier === "none" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs bg-foreground/10 backdrop-blur px-3 py-1 rounded-full text-muted">升级 Basic 解锁</span>
              </div>
            )}
          </div>

          {/* Q&A — Pro/Max only */}
          {isPro ? (
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">考官可能会问</p>
              {course.questions.map((q, i) => (
                <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-3 space-y-2">
                  <p className="text-[13px] font-semibold leading-snug">{q}</p>
                  <div className="border-t border-border/40 pt-2">
                    <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">参考回答</p>
                    <EditableField
                      value={editedAnswers[i] ?? ""}
                      onSave={(v) => saveAnswer(i, v)}
                      className="text-[13px] text-muted leading-relaxed"
                      context={`${course.nameEn} (${course.name}) — Question: "${q}"`}
                      type="answer"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : isBasic ? (
            /* Basic → upgrade to Pro CTA */
            <div className="border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center gap-2.5 p-5">
              <div className="w-9 h-9 bg-foreground text-background rounded-xl flex items-center justify-center font-black text-xs">Pro</div>
              <div>
                <p className="font-black text-sm mb-1">考官会问什么？</p>
                <p className="text-xs text-muted leading-relaxed">
                  解锁 {course.questions.length} 个预测问题 + 参考回答<br />
                  <span className="text-foreground/60">可按自身情况自由编辑内容</span>
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onUpgrade?.("pro"); }}
                className="bg-foreground text-background text-xs font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition active:scale-95"
              >
                补差价 ¥30 升级Pro →
              </button>
            </div>
          ) : (
            /* None → upgrade to Basic CTA */
            <div className="border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center gap-2.5 p-5">
              <div className="w-9 h-9 bg-foreground text-background rounded-xl flex items-center justify-center font-black text-xs">Basic</div>
              <div>
                <p className="font-black text-sm mb-1">解锁完整分析</p>
                <p className="text-xs text-muted leading-relaxed">
                  风险原因分析 + {course.questions.length} 个预测问题<br />
                  <span className="text-foreground/60">升级Pro还可自定义编辑内容</span>
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onUpgrade?.("basic"); }}
                className="bg-foreground text-background text-xs font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition active:scale-95"
              >
                升级 Basic · ¥29
              </button>
            </div>
          )}
        </div>

        {/* Swipe overlays */}
        {isTop && (
          <>
            <motion.div
              className="absolute inset-0 rounded-3xl flex items-center justify-center bg-success/20 backdrop-blur-sm pointer-events-none"
              style={{ opacity: rightOverlayOpacity }}
              aria-hidden
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-success rounded-full flex items-center justify-center text-white text-3xl font-extrabold mb-3">✓</div>
                <div className="text-2xl font-extrabold text-success">搞定了!</div>
                <div className="text-sm text-success/70 mt-1">考官失去了一个提问机会</div>
              </div>
            </motion.div>
            <motion.div
              className="absolute inset-0 rounded-3xl flex items-center justify-center bg-foreground/15 backdrop-blur-sm pointer-events-none"
              style={{ opacity: leftOverlayOpacity }}
              aria-hidden
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-border rounded-full flex items-center justify-center text-foreground/40 text-3xl font-extrabold mb-3">←</div>
                <div className="text-2xl font-extrabold text-muted">战略性撤退</div>
                <div className="text-sm text-muted/70 mt-1">这门课先跳过，待会再战</div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}

interface SwipeButtonsProps {
  onSwipe: (direction: "left" | "right") => void;
}

export function SwipeButtons({ onSwipe }: SwipeButtonsProps) {
  return (
    <div className="flex gap-3 justify-center mt-4">
      <button
        onClick={() => onSwipe("left")}
        className="flex-1 max-w-[160px] bg-card border-2 border-border rounded-2xl py-3.5 text-[14px] font-semibold text-muted hover:border-foreground/30 transition active:scale-95"
      >
        ← 先跳过
      </button>
      <button
        onClick={() => onSwipe("right")}
        className="flex-1 max-w-[160px] bg-foreground text-background rounded-2xl py-3.5 text-[14px] font-semibold hover:opacity-90 transition active:scale-95"
      >
        搞定了 →
      </button>
    </div>
  );
}
