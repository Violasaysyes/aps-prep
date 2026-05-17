"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type Tier = "basic" | "pro" | "max";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (tier: Tier) => void;
  defaultTier?: Tier;
}

const TIERS: Record<Tier, {
  name: string;
  price: number;
  subtitle: string;
  features: string[];
  accentClass: string;
  badgeClass: string;
}> = {
  basic: {
    name: "Basic",
    price: 29,
    subtitle: "一次付费 · 永久使用",
    features: [
      "上传成绩单 + AI解析",
      "课程风险等级（高 / 中 / 低）",
      "AI自我介绍生成（1次）",
      "APS基础攻略完整版",
      "一次付费 · 永久解锁",
    ],
    accentClass: "text-foreground",
    badgeClass: "bg-foreground/10 text-foreground",
  },
  pro: {
    name: "Pro",
    price: 59,
    subtitle: "一次付费 · 永久解锁",
    features: [
      "Basic全部功能",
      "考官预测题目（每课2-3题）+ 参考回答",
      "Swipe刷课完整版 + AI润色编辑",
      "AI自我介绍不限次数重新生成",
      "进度追踪 + 成就解锁",
    ],
    accentClass: "text-lime",
    badgeClass: "bg-lime/20 text-foreground",
  },
  max: {
    name: "Max",
    price: 99,
    subtitle: "含Mock面试折扣",
    features: [
      "Pro全部功能",
      "AI学习排期（按考试日期）",
      "WeChat备考社群入口",
      "Mock面试 ¥200/次（省¥100）",
      "优先预约名额",
    ],
    accentClass: "text-accent",
    badgeClass: "bg-accent/15 text-accent",
  },
};

const TIER_ORDER: Tier[] = ["basic", "pro", "max"];
const QR_API = (url: string) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}`;

type PayState = "idle" | "loading" | "qr" | "polling" | "success" | "error";

export function UpgradeModal({ open, onClose, onSuccess, defaultTier = "pro" }: UpgradeModalProps) {
  const [selected, setSelected] = useState<Tier>(defaultTier);
  const [payState, setPayState] = useState<PayState>("idle");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [outTradeNo, setOutTradeNo] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollCountRef = useRef(0);

  useEffect(() => {
    if (open) {
      setSelected(defaultTier);
      resetPayState();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      stopPolling();
    }
    return () => { document.body.style.overflow = ""; stopPolling(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultTier]);

  // Reset payment state when tier changes
  useEffect(() => { resetPayState(); }, [selected]);

  function resetPayState() {
    stopPolling();
    setPayState("idle");
    setPaymentUrl("");
    setOutTradeNo("");
    setErrMsg("");
    pollCountRef.current = 0;
  }

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  function startPolling(tradeNo: string, tier: Tier) {
    pollCountRef.current = 0;
    pollRef.current = setInterval(async () => {
      pollCountRef.current++;
      // Stop after 5 minutes (100 × 3s)
      if (pollCountRef.current > 100) {
        stopPolling();
        setErrMsg("支付超时，请重新生成订单");
        setPayState("error");
        return;
      }
      try {
        const res = await fetch(`/api/payment/check-order?out_trade_no=${tradeNo}`);
        const data = await res.json();
        if (data.paid) {
          stopPolling();
          setPayState("success");
          setTimeout(() => {
            onSuccess(tier);
            onClose();
          }, 1500);
        }
      } catch { /* retry next tick */ }
    }, 3000);
  }

  async function handlePay() {
    setPayState("loading");
    setErrMsg("");
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: selected }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrMsg(data.error ?? "创建订单失败");
        setPayState("error");
        return;
      }

      // Mock mode (虎皮椒 not configured) — fall back to manual QR
      if (data.mockMode) {
        setPayState("qr");
        setPaymentUrl(""); // shows static QR
        return;
      }

      setPaymentUrl(data.paymentUrl);
      setOutTradeNo(data.out_trade_no);
      setPayState("polling");
      startPolling(data.out_trade_no, selected);
    } catch {
      setErrMsg("网络错误，请重试");
      setPayState("error");
    }
  }

  // Dev shortcut — simulates payment confirmation
  function devUnlock() {
    stopPolling();
    setPayState("success");
    setTimeout(() => { onSuccess(selected); onClose(); }, 800);
  }

  if (!open) return null;

  const tier = TIERS[selected];
  const isLive = payState === "qr" && paymentUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4">
      <div className="absolute inset-0 bg-foreground/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-background w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Dark header */}
        <div className="bg-foreground text-background px-7 pt-7 pb-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-background/60 hover:bg-white/20 transition text-lg"
          >×</button>

          <div className="flex gap-2 mb-5">
            {TIER_ORDER.map((t) => (
              <button
                key={t}
                onClick={() => setSelected(t)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition
                  ${selected === t ? "bg-background text-foreground" : "bg-white/10 text-background/60 hover:bg-white/20"}`}
              >
                {TIERS[t].name}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-2 mb-1">
            <span className={`text-5xl font-black ${
              tier.accentClass === "text-lime" ? "text-lime"
              : tier.accentClass === "text-accent" ? "text-accent"
              : "text-background"}`}>
              ¥{tier.price}
            </span>
            <span className="text-background/40 text-sm pb-2">{tier.subtitle}</span>
          </div>
        </div>

        <div className="px-7 pt-6 pb-5">
          {/* Feature list */}
          <ul className="space-y-3 mb-6">
            {tier.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 ${tier.badgeClass}`}>✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {/* ── Payment area ── */}
          {payState === "idle" && (
            <button
              onClick={handlePay}
              className="w-full bg-foreground text-background py-4 rounded-2xl text-[15px] font-bold hover:opacity-90 transition active:scale-[0.98]"
            >
              立即付款 ¥{tier.price} →
            </button>
          )}

          {payState === "loading" && (
            <div className="flex items-center justify-center gap-2.5 py-5 text-muted">
              <span className="w-4 h-4 border-2 border-border border-t-foreground rounded-full animate-spin" />
              <span className="text-sm">生成支付二维码...</span>
            </div>
          )}

          {(payState === "qr" || payState === "polling") && (
            <div className="bg-card border-2 border-border rounded-2xl p-5 text-center">
              <p className="text-[11px] font-bold text-muted uppercase tracking-widest mb-3">
                支付宝扫码付款
              </p>
              <p className="text-[10px] text-muted mb-3">暂只支持支付宝 · 微信支付即将上线</p>

              <div className="w-48 h-48 mx-auto mb-4 rounded-2xl overflow-hidden relative bg-white flex items-center justify-center">
                {isLive ? (
                  /* Live QR from 虎皮椒 payment URL */
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={QR_API(paymentUrl)}
                    alt="支付二维码"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  /* Static WeChat collection QR (mock mode) */
                  <Image src="/wechat-pay-qr.jpg" alt="微信收款码" fill className="object-contain" unoptimized />
                )}
              </div>

              {payState === "polling" ? (
                <div className="flex items-center justify-center gap-2 text-muted mb-2">
                  <span className="w-3 h-3 border-2 border-border border-t-accent rounded-full animate-spin shrink-0" />
                  <span className="text-xs">等待支付确认...</span>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-muted mb-1">
                    付款 <strong className="text-foreground">¥{tier.price}</strong> 后截图发给微信
                  </p>
                  <p className="text-xs text-muted">备注：<strong className="text-foreground">{tier.name} + 邮箱</strong></p>
                </div>
              )}
            </div>
          )}

          {payState === "success" && (
            <div className="bg-lime/10 border-2 border-lime/30 rounded-2xl p-6 text-center">
              <div className="w-14 h-14 bg-lime/20 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">✓</div>
              <p className="font-black text-lg mb-1">{tier.name} 已解锁！</p>
              <p className="text-sm text-muted">正在为你开通权限...</p>
            </div>
          )}

          {payState === "error" && (
            <div className="space-y-3">
              <div className="bg-coral-light border border-coral/20 rounded-2xl p-4 text-center">
                <p className="text-sm text-coral font-medium">{errMsg}</p>
              </div>
              <button
                onClick={() => setPayState("idle")}
                className="w-full border-2 border-border rounded-2xl py-3.5 text-sm font-semibold text-muted hover:border-foreground/30 transition"
              >重试</button>
            </div>
          )}

          {/* Dev shortcut */}
          {(payState === "idle" || payState === "qr" || payState === "polling") && (
            <button
              onClick={devUnlock}
              className="w-full mt-3 border border-dashed border-border rounded-2xl py-3 text-xs text-muted hover:border-foreground/20 transition"
            >
              🛠 开发模式：模拟支付成功
            </button>
          )}
        </div>

        <div className="h-safe-bottom" />
      </div>
    </div>
  );
}
