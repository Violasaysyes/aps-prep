import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row justify-between gap-8">
          {/* Brand */}
          <div>
            <div className="text-lg font-extrabold mb-2">
              AP<span className="text-accent">Slay</span>
            </div>
            <p className="text-sm text-muted max-w-xs leading-relaxed">
              AI驱动的APS备考平台。<br />
              Slay your APS interview.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12 text-sm">
            <div>
              <p className="font-bold mb-3">备考</p>
              <ul className="space-y-2 text-muted">
                <li><Link href="/dashboard" className="hover:text-foreground transition">开始备考</Link></li>
                <li><Link href="/tips" className="hover:text-foreground transition">APS攻略</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-3">服务</p>
              <ul className="space-y-2 text-muted">
                <li><Link href="/mock-interview" className="hover:text-foreground transition">Mock面试</Link></li>
                <li><Link href="/mock-interview#contact" className="hover:text-foreground transition">微信咨询</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-3">账号</p>
              <ul className="space-y-2 text-muted">
                <li><Link href="/register" className="hover:text-foreground transition">注册</Link></li>
                <li><Link href="/login" className="hover:text-foreground transition">登录</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-muted">© 2026 APSlay. Slay your APS, not your life.</p>
          <p className="text-xs text-muted">微信：APSlay_support</p>
        </div>
      </div>
    </footer>
  );
}
