import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "页面不见了 | APSlay",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-8">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          AP<span className="text-accent">Slay</span>
        </Link>
      </div>

      <div className="w-20 h-20 bg-foreground text-background rounded-3xl flex items-center justify-center text-3xl font-black mb-8">
        404
      </div>

      <h1 className="text-3xl font-black tracking-tight mb-3">
        这页面去备考了
      </h1>
      <p className="text-muted text-lg mb-10 max-w-sm leading-relaxed">
        你要找的页面不见了。也许它也在刷swipe卡片。
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="bg-foreground text-background px-8 py-3.5 rounded-full font-bold hover:opacity-90 transition text-sm"
        >
          回首页
        </Link>
        <Link
          href="/dashboard"
          className="border-2 border-border px-8 py-3.5 rounded-full font-semibold hover:border-foreground/40 transition text-sm"
        >
          开始备考
        </Link>
      </div>
    </div>
  );
}
