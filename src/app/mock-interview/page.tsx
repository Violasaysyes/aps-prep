import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Mock面试预约 | APSlay",
  description: "真人1v1 APS模拟面试，¥300/次。专业教练模拟考官提问，考后书面反馈，帮你一次通过APS。",
};

function Navbar() {
  return (
    <nav className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border/50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          AP<span className="text-accent">Slay</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/tips" className="text-sm text-muted hover:text-foreground transition hidden sm:block">APS攻略</Link>
          <Link href="/dashboard" className="text-sm bg-foreground text-background px-5 py-2 rounded-full font-semibold hover:opacity-90 transition">
            免费备考
          </Link>
        </div>
      </div>
    </nav>
  );
}

const FAQ = [
  {
    q: "模拟面试通过什么方式进行？",
    a: "通过腾讯会议或Zoom进行视频面试，完整模拟真实面对面场景，包含摄像头互动。",
  },
  {
    q: "需要提前准备什么？",
    a: "预约确认后请将成绩单发给我们，以便针对性出题。建议先用APSlay的AI分析功能，了解自己的高风险课程。",
  },
  {
    q: "可以指定英语或德语面试吗？",
    a: "可以。预约时说明语言选择，我们会安排对应语言的面试官。英审和德审都支持。",
  },
  {
    q: "面试后多久收到反馈？",
    a: "通常在模拟面试结束后24小时内发送详细书面反馈报告，包含评分、盲点和改进建议。",
  },
  {
    q: "一次模拟面试够吗？",
    a: "取决于你的准备程度。距离考试较远的同学通常做1次；考试在2周内的建议做2次（第二次验证改进效果）。",
  },
  {
    q: "VIP价¥200怎么获得？",
    a: "购买APSlay VIP套餐（¥99）后，模拟面试自动享受¥200优惠价，节省¥100。",
  },
];

export default function MockInterviewPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ─── Hero ─── */}
        <section className="relative bg-foreground overflow-hidden">
          {/* Background blobs */}
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-accent/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-lime/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-0 w-48 h-48 bg-coral/10 rounded-full blur-2xl" />

          <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-lime/15 text-lime text-xs font-bold px-4 py-2 rounded-full mb-7 uppercase tracking-wide">
                <span className="w-2 h-2 bg-lime rounded-full animate-pulse" />
                核心服务
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-background tracking-tight leading-[1.05] mb-5">
                真人1对1
                <br />
                模拟面试
              </h1>
              <p className="text-background/60 text-lg leading-relaxed mb-8 max-w-md">
                APS通过者亲自模拟，完整还原笔试+口试流程。面试后提供详细书面反馈，帮你精准查漏补缺。
              </p>

              {/* Price */}
              <div className="flex items-end gap-4 mb-8">
                <div>
                  <span className="text-6xl md:text-7xl font-black text-lime leading-none">¥300</span>
                  <span className="text-background/40 text-xl ml-2">/次</span>
                </div>
                <div className="mb-2">
                  <div className="bg-warning/20 text-warning text-sm font-bold px-3 py-1.5 rounded-full">
                    VIP专享 ¥200
                  </div>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <a
                  href="#contact"
                  className="bg-lime text-foreground px-8 py-4 rounded-full font-black hover:scale-105 transition-transform text-base"
                >
                  立即预约
                </a>
                <Link
                  href="/register"
                  className="border-2 border-background/20 text-background px-8 py-4 rounded-full font-semibold hover:border-background/40 transition text-base"
                >
                  先免费注册
                </Link>
              </div>
            </div>

            {/* Right: fake session UI */}
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-80 bg-background/8 backdrop-blur-sm rounded-3xl p-7 border border-background/10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-lime/20 rounded-full flex items-center justify-center text-lime font-black text-sm">M</div>
                      <div>
                        <div className="text-sm font-bold text-background">模拟面试进行中</div>
                        <div className="text-xs text-background/40">00:23:45</div>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-lime rounded-full animate-pulse" />
                  </div>
                  {/* Chat bubbles */}
                  <div className="space-y-3 mb-5">
                    <div className="bg-background/8 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-background/70">
                      &quot;请介绍一下高等数学在你专业中的应用...&quot;
                    </div>
                    <div className="bg-lime/15 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-lime/90 ml-8">
                      &quot;在数值分析课程中，我们用到了...&quot;
                    </div>
                    <div className="bg-background/8 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-background/70">
                      &quot;好的，那请你解释一下极限的...&quot;
                    </div>
                  </div>
                  {/* Feedback preview */}
                  <div className="bg-background/5 rounded-2xl p-4">
                    <div className="text-xs text-background/40 mb-2 font-semibold uppercase tracking-wide">实时评分</div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-lime/15 rounded-xl py-2 text-center text-xs font-bold text-lime">专业知识 ★★★★</div>
                      <div className="flex-1 bg-warning/15 rounded-xl py-2 text-center text-xs font-bold text-warning">表达流畅 ★★★</div>
                    </div>
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-lime rounded-2xl px-4 py-2.5 shadow-xl">
                  <div className="text-xl font-black text-foreground">88分</div>
                  <div className="text-[10px] font-bold text-foreground/50">模拟得分</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-6 py-16 space-y-8">

          {/* ─── Why mock interview ─── */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black mb-6 tracking-tight">为什么需要模拟面试？</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: "?!", color: "bg-coral-light border-coral/20 text-coral", title: "发现盲点", desc: "自己复习容易遗漏，模拟面试帮你找到真正的知识漏洞，针对性补救。" },
                { icon: "心", color: "bg-accent-light border-accent/20 text-accent", title: "建立信心", desc: "提前体验面试压力，正式考试时不再因紧张而发挥失常。" },
                { icon: "A+", color: "bg-lime-light border-lime/20 text-foreground/50", title: "专业反馈", desc: "APS通过者提供书面反馈，清楚知道哪里需要改进、怎么改。" },
              ].map((c) => (
                <div key={c.title} className={`${c.color} border rounded-3xl p-7`}>
                  <div className={`w-11 h-11 bg-current/10 rounded-2xl flex items-center justify-center text-sm font-black mb-4`} style={{color: "inherit"}}>
                    {c.icon}
                  </div>
                  <h3 className="text-lg font-black mb-2">{c.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ─── What's included ─── */}
          <section className="bg-card rounded-3xl border-2 border-border p-8">
            <h2 className="text-2xl font-black mb-6 tracking-tight">一次模拟面试包含</h2>
            <div className="space-y-4">
              {[
                { num: "1", title: "面试前沟通", time: "10分钟", desc: "了解你的专业背景、目标院校、已准备程度，确定本次模拟重点课程。", color: "bg-sky text-white" },
                { num: "2", title: "完整口试模拟", time: "40分钟", desc: "模拟真实APS口试：自我介绍 → 专业课深度提问 → 留学动机。全程英语或德语进行。", color: "bg-accent text-white" },
                { num: "3", title: "实时笔试模拟", time: "20分钟", desc: "针对你的高风险课程出笔试题，模拟真实考场氛围。", color: "bg-coral text-white" },
                { num: "4", title: "详细书面反馈", time: "面试后24h", desc: "评分、知识盲点、表达改进建议、后续复习重点。不是口头说说，是真实文档。", color: "bg-lime text-foreground" },
              ].map((step) => (
                <div key={step.num} className="flex gap-4 items-start bg-background rounded-2xl p-5">
                  <div className={`w-10 h-10 ${step.color} rounded-2xl flex items-center justify-center text-sm font-black shrink-0`}>{step.num}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-black text-base">{step.title}</span>
                      <span className="text-xs bg-border text-muted px-2 py-0.5 rounded-full font-medium">{step.time}</span>
                    </div>
                    <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Pricing ─── */}
          <section>
            <h2 className="text-2xl font-black mb-6 tracking-tight">价格</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-card rounded-3xl border-2 border-border p-8 text-center">
                <div className="text-sm text-muted font-semibold mb-2">标准价</div>
                <div className="text-6xl font-black mb-1">¥300</div>
                <p className="text-muted text-sm mb-6">单次模拟面试 · 全流程包含</p>
                <a href="#contact" className="block border-2 border-foreground py-3.5 rounded-full font-bold text-sm hover:bg-foreground hover:text-background transition">
                  预约标准价
                </a>
              </div>
              <div className="bg-foreground text-background rounded-3xl p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-lime/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <div className="inline-block bg-lime/15 text-lime text-xs font-bold px-4 py-1.5 rounded-full mb-2">VIP专享</div>
                  <div className="text-6xl font-black mb-1 text-lime">¥200</div>
                  <p className="text-background/50 text-sm mb-2">购买VIP套餐(¥99)后享受</p>
                  <p className="text-background/40 text-xs mb-6">每次节省¥100 · 优先预约资格</p>
                  <Link href="/register" className="block bg-lime text-foreground py-3.5 rounded-full font-black text-sm hover:scale-105 transition-transform">
                    先买VIP套餐 省¥100
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ─── Expert intro ─── */}
          <section className="bg-gradient-to-br from-accent-light to-sky-light rounded-3xl p-8 border border-accent/10">
            <h2 className="text-2xl font-black mb-6 tracking-tight">面试官是谁？</h2>
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 bg-accent/20 rounded-3xl flex items-center justify-center text-2xl font-black text-accent shrink-0">
                Aps
              </div>
              <div>
                <h3 className="text-lg font-black mb-2">APSlay团队</h3>
                <p className="text-sm text-muted leading-relaxed mb-4 max-w-xl">
                  模拟面试官均为APS一次通过者，涵盖艺术、商科、工程、计算机等专业方向。深度了解考官提问风格和评分标准，能给出真正有价值的反馈。
                </p>
                <div className="flex flex-wrap gap-2">
                  {["艺术设计", "商科/经济", "工程类", "计算机"].map((tag) => (
                    <span key={tag} className="bg-white/60 text-foreground/70 text-xs font-bold px-3 py-1.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ─── WeChat / Booking ─── */}
          <section id="contact" className="bg-foreground rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-48 h-48 bg-lime/10 rounded-full blur-2xl -translate-y-1/2 -translate-x-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-2xl translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-black text-background mb-3 tracking-tight">
                通过微信预约
              </h2>
              <p className="text-background/50 mb-8">添加微信，24小时内回复，选择时间，付款即确认</p>

              {/* QR placeholder */}
              <div className="inline-block bg-white rounded-3xl p-6 mb-6">
                <div className="w-44 h-44 bg-background rounded-2xl flex flex-col items-center justify-center text-muted text-sm gap-2">
                  <div className="w-10 h-10 bg-border rounded-xl" />
                  <span className="text-xs">微信二维码</span>
                  <span className="text-[10px]">替换为实际QR码</span>
                </div>
              </div>

              <p className="text-background/70 text-sm mb-1">
                微信号：<span className="font-mono font-bold text-lime">your_wechat_id</span>
              </p>
              <p className="text-background/40 text-xs mt-2">
                添加时请备注「APS模拟面试 + 你的专业」
              </p>
            </div>
          </section>

          {/* ─── FAQ ─── */}
          <section>
            <h2 className="text-2xl font-black mb-6 tracking-tight">常见问题</h2>
            <div className="space-y-3">
              {FAQ.map((item, i) => (
                <div key={i} className="bg-card rounded-2xl border-2 border-border p-6">
                  <h3 className="font-bold mb-2 text-[15px]">Q: {item.q}</h3>
                  <p className="text-sm text-muted leading-relaxed">A: {item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Bottom CTA ─── */}
          <section className="grid md:grid-cols-2 gap-4">
            <div className="bg-lime-light rounded-3xl p-7 border border-lime/20">
              <h3 className="text-xl font-black mb-2">还没开始备考？</h3>
              <p className="text-muted text-sm mb-5 leading-relaxed">先用AI分析成绩单，找出高风险课程，再来模拟面试效果更好。</p>
              <Link href="/dashboard" className="inline-block bg-foreground text-background px-6 py-3 rounded-full text-sm font-bold hover:scale-105 transition-transform">
                先免费AI备考 →
              </Link>
            </div>
            <div className="bg-coral-light rounded-3xl p-7 border border-coral/20">
              <h3 className="text-xl font-black mb-2">想了解APS基础知识？</h3>
              <p className="text-muted text-sm mb-5 leading-relaxed">查看面试流程、必带材料、面试技巧全攻略，免费阅读。</p>
              <Link href="/tips" className="inline-block bg-foreground text-background px-6 py-3 rounded-full text-sm font-bold hover:scale-105 transition-transform">
                查看APS攻略 →
              </Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
