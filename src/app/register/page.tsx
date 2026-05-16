"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PERKS = [
  { icon: "AI", color: "bg-accent/15 text-accent", label: "AI成绩单分析" },
  { icon: "↔", color: "bg-lime text-black", label: "Swipe刷课系统" },
  { icon: "1:1", color: "bg-coral/15 text-coral", label: "Mock面试预约" },
  { icon: "GG", color: "bg-sky/20 text-sky", label: "趣味成就系统" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password || !confirm) { setError("请填写所有字段"); return; }
    if (password.length < 6) { setError("密码至少6位"); return; }
    if (password !== confirm) { setError("两次密码不一致"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "注册失败"); return; }
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-background">
        <div className="max-w-sm w-full text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-accent to-coral rounded-3xl flex items-center justify-center text-3xl font-black text-white mb-6">
            GG
          </div>
          <h1 className="text-3xl font-black mb-3 tracking-tight">成功入场！</h1>
          <p className="text-muted mb-8 leading-relaxed">
            欢迎来到APSlay。<br />2500块审核费已交，没有退路了。
          </p>
          <div className="w-6 h-6 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left: Brand panel (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-coral/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-lime/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10">
          <Link href="/" className="text-xl font-extrabold text-background">
            AP<span className="text-accent">Slay</span>
          </Link>
        </div>

        <div className="relative z-10">
          <p className="text-background/40 text-sm font-bold uppercase tracking-widest mb-4">APS备考平台</p>
          <h2 className="text-4xl font-black text-background leading-tight tracking-tight mb-8">
            Don&apos;t just pass.
            <br />
            <span className="bg-gradient-to-r from-accent via-coral to-warning bg-clip-text text-transparent">
              SLAY it.
            </span>
          </h2>
          <div className="space-y-3">
            {PERKS.map((p) => (
              <div key={p.label} className="flex items-center gap-3">
                <div className={`w-9 h-9 ${p.color} bg-white/5 rounded-xl flex items-center justify-center text-xs font-black`}>
                  {p.icon}
                </div>
                <span className="text-background/70 text-sm font-medium">{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3">
            <div className="w-8 h-8 bg-lime/20 rounded-full flex items-center justify-center text-lime text-xs font-black">65</div>
            <div>
              <div className="text-background/80 text-xs font-bold">APS首次通过率仅65%</div>
              <div className="text-background/40 text-[11px]">APSlay用户表现更好</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="lg:hidden mb-8 text-center">
          <Link href="/" className="text-2xl font-extrabold">
            AP<span className="text-accent">Slay</span>
          </Link>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight mb-2">创建账号</h1>
            <p className="text-muted">注册后立即开始备考</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border-2 border-border rounded-2xl px-4 py-3.5 text-[15px] bg-background focus:outline-none focus:border-accent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少6位"
                className="w-full border-2 border-border rounded-2xl px-4 py-3.5 text-[15px] bg-background focus:outline-none focus:border-accent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">确认密码</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="再次输入密码"
                className="w-full border-2 border-border rounded-2xl px-4 py-3.5 text-[15px] bg-background focus:outline-none focus:border-accent transition"
              />
            </div>

            {error && (
              <div className="p-4 bg-danger-light text-danger text-sm rounded-2xl font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-background py-4 rounded-2xl text-[15px] font-bold hover:scale-[1.02] transition-transform active:scale-[0.98] mt-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  注册中...
                </span>
              ) : "注册 — 开始Slay"}
            </button>
          </form>

          <div className="mt-6 bg-card border border-border rounded-2xl px-4 py-3.5 text-sm text-center">
            <span className="text-muted">Basic ¥29 起 · Pro ¥59 · Max ¥99 · </span>
            <span className="font-bold text-foreground">一次付费永久使用</span>
          </div>

          <p className="text-center text-sm text-muted mt-6">
            已有账号？{" "}
            <Link href="/login" className="text-accent font-bold hover:underline">
              立即登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
