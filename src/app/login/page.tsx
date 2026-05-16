"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("请填写邮箱和密码"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "登录失败"); return; }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left: Brand panel (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-lime/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

        <div className="relative z-10">
          <Link href="/" className="text-xl font-extrabold text-background">
            AP<span className="text-accent">Slay</span>
          </Link>
        </div>

        <div className="relative z-10">
          <p className="text-background/40 text-sm font-bold uppercase tracking-widest mb-4">欢迎回来</p>
          <h2 className="text-4xl font-black text-background leading-tight tracking-tight mb-6">
            继续Slay,
            <br />
            <span className="text-lime">考官等着你。</span>
          </h2>
          <p className="text-background/50 text-[15px] leading-relaxed max-w-xs">
            你的备考进度已经保存。登录后继续刷课、查看风险分析，一步步接近通过。
          </p>
        </div>

        <div className="relative z-10">
          <div className="bg-white/5 rounded-2xl p-5">
            <div className="flex gap-3 mb-4">
              {["01","05","S+"].map((label, i) => (
                <div key={label} className="w-10 h-10 bg-gradient-to-br from-accent to-coral rounded-xl flex items-center justify-center text-white text-xs font-black" style={{ opacity: 0.5 + i * 0.2 }}>
                  {label}
                </div>
              ))}
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-background/30 text-xs font-black">+4</div>
            </div>
            <p className="text-background/50 text-xs">继续解锁你的备考成就</p>
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
            <h1 className="text-3xl font-black tracking-tight mb-2">欢迎回来</h1>
            <p className="text-muted">登录继续你的备考之旅</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                className="w-full border-2 border-border rounded-2xl px-4 py-3.5 text-[15px] bg-background focus:outline-none focus:border-accent transition"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold">密码</label>
                <button type="button" className="text-xs text-accent hover:underline font-medium">
                  忘记密码？
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入密码"
                autoComplete="current-password"
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
                  登录中...
                </span>
              ) : "登录"}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-8">
            还没有账号？{" "}
            <Link href="/register" className="text-accent font-bold hover:underline">
              免费注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
