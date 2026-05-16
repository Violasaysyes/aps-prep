"use client";

import { useState, useEffect, useCallback } from "react";

type Tier = "none" | "basic" | "pro" | "max";

interface Payment {
  amount: number;
  tier: string;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  tier: Tier;
  createdAt: string;
  payments: Payment[];
}

interface Stats {
  total: number;
  tiers: Record<string, number>;
  revenue: number;
}

const TIER_COLORS: Record<string, string> = {
  none: "bg-border text-muted",
  basic: "bg-foreground/10 text-foreground",
  pro: "bg-lime/20 text-foreground",
  max: "bg-accent/15 text-accent",
};

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authErr, setAuthErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [savedSecret, setSavedSecret] = useState("");

  const fetchUsers = useCallback(async (sec: string, q: string, p: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/users?q=${encodeURIComponent(q)}&page=${p}`,
        { headers: { "x-admin-secret": sec } }
      );
      if (res.status === 401) { setAuthed(false); return; }
      const data = await res.json();
      setUsers(data.users ?? []);
      setStats(data.stats ?? null);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthErr("");
    const res = await fetch("/api/admin/users?page=1", {
      headers: { "x-admin-secret": secret },
    });
    if (res.status === 401) { setAuthErr("密码错误"); return; }
    const data = await res.json();
    setSavedSecret(secret);
    setAuthed(true);
    setUsers(data.users ?? []);
    setStats(data.stats ?? null);
    setTotal(data.total ?? 0);
  };

  useEffect(() => {
    if (authed) fetchUsers(savedSecret, search, page);
  }, [authed, search, page, savedSecret, fetchUsers]);

  const updateTier = async (userId: string, tier: Tier) => {
    setSaving((s) => ({ ...s, [userId]: true }));
    try {
      await fetch("/api/admin/update-tier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": savedSecret,
        },
        body: JSON.stringify({ userId, tier }),
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, tier } : u))
      );
    } finally {
      setSaving((s) => ({ ...s, [userId]: false }));
    }
  };

  const totalPages = Math.ceil(total / 20);

  // ── Login gate ──
  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="w-14 h-14 bg-foreground text-background rounded-2xl flex items-center justify-center text-xl font-black mx-auto mb-4">⚙</div>
            <h1 className="text-2xl font-black">管理后台</h1>
            <p className="text-muted text-sm mt-1">APSlay Admin</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="管理员密码"
              className="w-full border-2 border-border rounded-2xl px-4 py-3.5 text-[15px] bg-background focus:outline-none focus:border-foreground transition"
              autoFocus
            />
            {authErr && <p className="text-sm text-coral text-center">{authErr}</p>}
            <button
              type="submit"
              className="w-full bg-foreground text-background py-4 rounded-2xl font-bold hover:opacity-90 transition"
            >
              进入后台
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Main dashboard ──
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black">APSlay 管理后台</h1>
          <p className="text-background/40 text-xs">{total} 个用户</p>
        </div>
        <button
          onClick={() => { setAuthed(false); setSavedSecret(""); setSecret(""); }}
          className="text-xs bg-white/10 px-3 py-1.5 rounded-lg text-background/60 hover:bg-white/20 transition"
        >退出</button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "总用户", value: stats.total },
              { label: "Basic", value: stats.tiers["basic"] ?? 0 },
              { label: "Pro", value: stats.tiers["pro"] ?? 0 },
              { label: "Max", value: stats.tiers["max"] ?? 0 },
            ].map(({ label, value }) => (
              <div key={label} className="bg-card border-2 border-border rounded-2xl p-4 text-center">
                <div className="text-2xl font-black">{value}</div>
                <div className="text-xs text-muted mt-1">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Revenue + Free */}
        {stats && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-lime/10 border-2 border-lime/20 rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-foreground">¥{stats.revenue.toFixed(0)}</div>
              <div className="text-xs text-muted mt-1">累计收入（已付款）</div>
            </div>
            <div className="bg-card border-2 border-border rounded-2xl p-4 text-center">
              <div className="text-2xl font-black">{stats.tiers["none"] ?? 0}</div>
              <div className="text-xs text-muted mt-1">免费用户（未付款）</div>
            </div>
          </div>
        )}

        {/* User table */}
        <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b border-border">
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="搜索邮箱..."
              className="w-full border-2 border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:border-foreground transition"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-muted">
              <span className="w-4 h-4 border-2 border-border border-t-foreground rounded-full animate-spin" />
              <span className="text-sm">加载中...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wider">邮箱</th>
                    <th className="px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wider">当前套餐</th>
                    <th className="px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wider">注册时间</th>
                    <th className="px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wider">付款记录</th>
                    <th className="px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wider">改套餐</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-background/50 transition">
                      <td className="px-4 py-3.5 font-medium max-w-[200px] truncate">{user.email}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${TIER_COLORS[user.tier] ?? "bg-border text-muted"}`}>
                          {user.tier === "none" ? "免费" : user.tier.charAt(0).toUpperCase() + user.tier.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-muted text-xs">
                        {new Date(user.createdAt).toLocaleDateString("zh-CN")}
                      </td>
                      <td className="px-4 py-3.5 text-muted text-xs">
                        {user.payments.length > 0 ? (
                          <div className="space-y-0.5">
                            {user.payments.slice(0, 2).map((p, i) => (
                              <div key={i}>¥{p.amount} · {p.tier}</div>
                            ))}
                          </div>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <select
                            defaultValue={user.tier}
                            onChange={(e) => updateTier(user.id, e.target.value as Tier)}
                            disabled={saving[user.id]}
                            className="border border-border rounded-lg px-2 py-1.5 text-xs bg-background focus:outline-none focus:border-foreground transition disabled:opacity-50"
                          >
                            <option value="none">免费</option>
                            <option value="basic">Basic</option>
                            <option value="pro">Pro</option>
                            <option value="max">Max</option>
                          </select>
                          {saving[user.id] && (
                            <span className="w-3 h-3 border-2 border-border border-t-foreground rounded-full animate-spin" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {users.length === 0 && (
                <div className="text-center py-16 text-muted text-sm">
                  {search ? `没有匹配"${search}"的用户` : "还没有用户注册"}
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <span className="text-xs text-muted">第 {page} / {totalPages} 页</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="text-xs px-3 py-1.5 border border-border rounded-lg disabled:opacity-30 hover:border-foreground/30 transition"
                >← 上一页</button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="text-xs px-3 py-1.5 border border-border rounded-lg disabled:opacity-30 hover:border-foreground/30 transition"
                >下一页 →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
