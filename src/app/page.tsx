import Link from "next/link";

/* ─── Navbar ─── */
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          AP<span className="text-accent">Slay</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="#features" className="text-muted hover:text-foreground transition">Features</Link>
          <Link href="#how" className="text-muted hover:text-foreground transition">How it works</Link>
          <Link href="#pricing" className="text-muted hover:text-foreground transition">Pricing</Link>
          <Link href="/tips" className="text-muted hover:text-foreground transition">APS攻略</Link>
          <Link href="/mock-interview" className="text-muted hover:text-foreground transition">Mock面试</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-muted hover:text-foreground transition hidden sm:block">
            登录
          </Link>
          <Link
            href="/register"
            className="text-sm bg-foreground text-background px-5 py-2 rounded-full font-semibold hover:opacity-90 transition"
          >
            免费注册
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ─── Hero: Gradient + Giant SLAY + floating product cards ─── */
function Hero() {
  return (
    <section className="relative pt-16 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/8 via-coral/5 to-background" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute top-40 right-1/4 w-72 h-72 bg-coral/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-lime/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8 md:pt-24 md:pb-12">
        {/* Top badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-5 py-2 text-sm font-semibold text-accent">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            APS一次通过率仅65% — 你准备好了吗？
          </div>
        </div>

        {/* Giant heading with SLAY highlight */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95]">
            Don&apos;t just pass.
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-accent via-coral to-warning bg-clip-text text-transparent">
                SLAY it.
              </span>
              {/* Underline decoration */}
              <span className="absolute -bottom-2 left-0 right-0 h-4 bg-lime/40 rounded-full -skew-x-3 z-0" />
            </span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-muted max-w-xl mx-auto leading-relaxed">
            AI分析你的成绩单，预测考官提问。
            <br className="hidden md:block" />
            Swipe刷课逐个击破 + 真人模拟面试，一次通过APS。
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 md:mb-20">
          <Link
            href="/register"
            className="bg-foreground text-background px-8 py-4 rounded-full text-base font-bold hover:scale-105 transition-transform shadow-lg shadow-foreground/20"
          >
            免费开始备考
          </Link>
          <Link
            href="/mock-interview"
            className="border-2 border-foreground/15 px-8 py-4 rounded-full text-base font-semibold hover:border-foreground/30 transition"
          >
            了解Mock面试
          </Link>
        </div>

        {/* Floating product preview cards — bento style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
          {/* Card 1: Risk analysis preview */}
          <div className="col-span-2 bg-card rounded-3xl border border-border/60 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 bg-coral rounded-full" />
              <span className="text-xs font-bold text-coral uppercase tracking-wide">High Risk</span>
            </div>
            <div className="text-2xl font-extrabold mb-1">高等数学</div>
            <div className="text-sm text-muted mb-4">Advanced Mathematics · 92分 · 5学分</div>
            <div className="space-y-2">
              <div className="bg-coral-light rounded-xl px-3 py-2 text-sm">Q: 请解释极限的定义和应用</div>
              <div className="bg-coral-light rounded-xl px-3 py-2 text-sm">Q: 微积分基本定理的意义是什么？</div>
            </div>
          </div>

          {/* Card 2: Swipe preview */}
          <div className="bg-lime-light rounded-3xl p-5 flex flex-col items-center justify-center text-center min-h-[200px]">
            <div className="w-14 h-14 bg-lime/30 rounded-2xl flex items-center justify-center text-2xl font-black text-foreground/50 mb-3 rotate-3">
              →
            </div>
            <div className="text-lg font-extrabold mb-1">Swipe</div>
            <div className="text-xs text-muted">右滑搞定 左滑跳过</div>
          </div>

          {/* Card 3: Achievement preview */}
          <div className="bg-gradient-to-br from-accent to-coral rounded-3xl p-5 text-white flex flex-col justify-between min-h-[200px]">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-sm font-black">
              GG
            </div>
            <div>
              <div className="text-lg font-extrabold mb-1">成就解锁</div>
              <div className="text-xs text-white/70">审核部请注意，我来了</div>
            </div>
          </div>

          {/* Card 4: Mock interview */}
          <div className="col-span-2 md:col-span-1 bg-foreground text-background rounded-3xl p-5 flex flex-col justify-between min-h-[180px]">
            <div className="w-10 h-10 bg-lime/20 rounded-xl flex items-center justify-center text-lime text-sm font-black">
              1:1
            </div>
            <div>
              <div className="text-xl font-extrabold mb-1">Mock面试</div>
              <div className="text-sm text-background/50">真人模拟 · ¥300/次</div>
            </div>
          </div>

          {/* Card 5: Stats */}
          <div className="bg-accent-light rounded-3xl p-5 flex flex-col justify-center items-center text-center min-h-[180px]">
            <div className="text-4xl font-black text-accent mb-1">65%</div>
            <div className="text-xs text-muted font-medium">APS一次通过率</div>
            <div className="mt-2 text-xs text-accent font-bold">APSlay用户: 更高</div>
          </div>

          {/* Card 6: AI intro */}
          <div className="bg-sky-light rounded-3xl p-5 min-h-[180px] flex flex-col justify-between">
            <div className="w-10 h-10 bg-sky/30 rounded-xl flex items-center justify-center text-sm font-black text-sky">
              AI
            </div>
            <div>
              <div className="text-base font-extrabold mb-1">自我介绍</div>
              <div className="text-xs text-muted">中英/中德双语生成</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Brand Story ─── */
function BrandStory() {
  return (
    <section className="py-20 md:py-28 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block bg-lime/20 text-foreground text-xs font-bold px-4 py-2 rounded-full mb-8 uppercase tracking-widest">
          Why APSlay
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-8">
          APS审核不是你的终点，
          <br />
          <span className="text-accent">是你Slay的起点。</span>
        </h2>
        <p className="text-lg text-muted leading-relaxed max-w-2xl mx-auto mb-12">
          每年超过10,000名中国学生参加APS审核，首次通过率仅65%，一生只有3次机会。
          别再用碎片化的小红书攻略准备了 — APSlay用AI帮你精准备考，用真人Mock帮你查漏补缺。
        </p>
        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
          <div>
            <div className="text-3xl md:text-4xl font-black text-accent">10K+</div>
            <div className="text-xs text-muted mt-1">每年考生</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-coral">3次</div>
            <div className="text-xs text-muted mt-1">一生机会</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-lime">65%</div>
            <div className="text-xs text-muted mt-1">首次通过率</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Mock Interview Banner (primary revenue) ─── */
function MockInterviewBanner() {
  return (
    <section className="px-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="bg-foreground rounded-[2rem] overflow-hidden">
          <div className="grid md:grid-cols-[1.2fr_1fr] items-center">
            <div className="p-8 md:p-12 lg:p-16">
              <div className="inline-flex items-center gap-2 bg-lime/15 text-lime text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-wide">
                <span className="w-2 h-2 bg-lime rounded-full" />
                核心服务
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-background tracking-tight leading-[1.1] mb-5">
                真人1对1
                <br />
                模拟面试
              </h2>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-5xl md:text-6xl font-black text-lime">¥300</span>
                <span className="text-lg text-background/40">/次</span>
                <span className="bg-warning/20 text-warning text-xs font-bold px-3 py-1 rounded-full ml-2">Max价 ¥200</span>
              </div>
              <ul className="space-y-3 text-background/70 text-[15px] mb-8">
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-lime/20 rounded-full flex items-center justify-center text-lime text-xs font-bold">+</span>
                  APS通过者亲自模拟，完整还原笔试+口试
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-lime/20 rounded-full flex items-center justify-center text-lime text-xs font-bold">+</span>
                  面试后提供详细书面反馈和改进建议
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-lime/20 rounded-full flex items-center justify-center text-lime text-xs font-bold">+</span>
                  支持英审 & 德审，覆盖全专业
                </li>
              </ul>
              <div className="flex gap-3 flex-wrap">
                <Link
                  href="/mock-interview"
                  className="bg-lime text-foreground px-7 py-3.5 rounded-full font-bold hover:scale-105 transition-transform text-[15px]"
                >
                  预约模拟面试
                </Link>
                <Link
                  href="/mock-interview#contact"
                  className="border border-background/20 text-background px-7 py-3.5 rounded-full font-semibold hover:border-background/40 transition text-[15px]"
                >
                  微信咨询
                </Link>
              </div>
            </div>
            {/* Right side — visual element */}
            <div className="hidden md:flex items-center justify-center p-8">
              <div className="relative">
                {/* Fake interview UI card */}
                <div className="w-72 bg-background/10 backdrop-blur-sm rounded-3xl p-6 border border-background/10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-lime/20 rounded-full flex items-center justify-center text-lime font-bold text-sm">M</div>
                    <div>
                      <div className="text-sm font-bold text-background">Mock Interview</div>
                      <div className="text-xs text-background/40">45 min session</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-background/5 rounded-xl px-4 py-3 text-sm text-background/70">
                      &quot;请介绍一下你自己...&quot;
                    </div>
                    <div className="bg-lime/10 rounded-xl px-4 py-3 text-sm text-lime/90">
                      &quot;这门课的核心概念是...&quot;
                    </div>
                    <div className="bg-background/5 rounded-xl px-4 py-3 text-sm text-background/70">
                      &quot;你为什么选择这个专业？&quot;
                    </div>
                  </div>
                  <div className="mt-5 flex gap-2">
                    <div className="flex-1 bg-coral/20 rounded-xl py-2 text-center text-xs font-bold text-coral">需改进</div>
                    <div className="flex-1 bg-lime/20 rounded-xl py-2 text-center text-xs font-bold text-lime">通过</div>
                  </div>
                </div>
                {/* Floating score badge */}
                <div className="absolute -top-4 -right-4 bg-lime rounded-2xl px-4 py-3 shadow-lg">
                  <div className="text-2xl font-black text-foreground">92</div>
                  <div className="text-[10px] font-bold text-foreground/60">得分</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Features Bento Grid ─── */
function Features() {
  return (
    <section id="features" className="py-20 md:py-28 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            Everything you need to
            <span className="text-accent"> Slay</span>
          </h2>
          <p className="text-lg text-muted">从AI分析到真人模拟，一站式APS备考</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Feature 1: AI成绩单分析 — large */}
          <div className="md:col-span-2 bg-gradient-to-br from-accent-light to-background rounded-3xl p-8 border border-border/50">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-accent/15 rounded-2xl flex items-center justify-center text-accent font-black text-sm">AI</div>
              <h3 className="text-xl font-bold">智能成绩单分析</h3>
            </div>
            <p className="text-muted text-[15px] mb-6 max-w-md">上传PDF/Word成绩单，AI自动识别每门课程，按考官提问风险等级排列 — 高/中/低一目了然。</p>
            {/* Mini preview */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-coral-light rounded-2xl p-3 text-center">
                <div className="w-7 h-7 mx-auto bg-coral/20 rounded-lg flex items-center justify-center mb-2"><span className="w-2 h-2 bg-coral rounded-full" /></div>
                <div className="text-xs font-bold">高风险</div>
                <div className="text-[10px] text-muted">3门课</div>
              </div>
              <div className="bg-warning-light rounded-2xl p-3 text-center">
                <div className="w-7 h-7 mx-auto bg-warning/20 rounded-lg flex items-center justify-center mb-2"><span className="w-2 h-2 bg-warning rounded-full" /></div>
                <div className="text-xs font-bold">中风险</div>
                <div className="text-[10px] text-muted">5门课</div>
              </div>
              <div className="bg-lime-light rounded-2xl p-3 text-center">
                <div className="w-7 h-7 mx-auto bg-lime/20 rounded-lg flex items-center justify-center mb-2"><span className="w-2 h-2 bg-lime rounded-full" /></div>
                <div className="text-xs font-bold">低风险</div>
                <div className="text-[10px] text-muted">8门课</div>
              </div>
            </div>
          </div>

          {/* Feature 2: Swipe刷课 */}
          <div className="bg-lime-light rounded-3xl p-8 border border-lime/20 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 bg-lime/20 rounded-2xl flex items-center justify-center text-lg font-black text-foreground/40 mb-5 -rotate-6">→</div>
              <h3 className="text-xl font-bold mb-3">Swipe刷课</h3>
              <p className="text-muted text-[15px]">逐门课程击破。右滑 = 搞定，左滑 = 跳过。刷完一门少一门。</p>
            </div>
            <div className="mt-6 flex gap-2">
              <div className="flex-1 bg-white/60 rounded-xl py-2.5 text-center text-xs font-bold text-muted">← 还没准备好</div>
              <div className="flex-1 bg-foreground text-background rounded-xl py-2.5 text-center text-xs font-bold">搞定了! →</div>
            </div>
          </div>

          {/* Feature 3: 成就系统 */}
          <div className="bg-gradient-to-br from-coral-light to-warning-light rounded-3xl p-8 border border-coral/10">
            <div className="w-11 h-11 bg-coral/15 rounded-2xl flex items-center justify-center text-sm font-black text-coral mb-5">!!</div>
            <h3 className="text-xl font-bold mb-3">趣味成就</h3>
            <p className="text-muted text-[15px] mb-5">解锁搞笑成就徽章，分享到朋友圈。&quot;APS韭菜已入场&quot; &quot;审核部请注意，我来了&quot;</p>
            <div className="flex gap-2">
              <div className="bg-white/50 rounded-xl px-3 py-2 text-xs font-bold flex items-center gap-1.5">
                <span className="w-5 h-5 bg-accent/20 rounded-md flex items-center justify-center text-[10px] font-black text-accent">01</span> APS韭菜已入场
              </div>
              <div className="bg-white/50 rounded-xl px-3 py-2 text-xs font-bold flex items-center gap-1.5">
                <span className="w-5 h-5 bg-coral/20 rounded-md flex items-center justify-center text-[10px] font-black text-coral">GG</span> 我来了
              </div>
            </div>
          </div>

          {/* Feature 4: AI自我介绍 */}
          <div className="bg-sky-light rounded-3xl p-8 border border-sky/20">
            <div className="w-11 h-11 bg-sky/20 rounded-2xl flex items-center justify-center text-sm font-black text-sky mb-5">Bi</div>
            <h3 className="text-xl font-bold mb-3">双语自我介绍</h3>
            <p className="text-muted text-[15px]">输入你的专业和院校，AI生成中英/中德双语面试自我介绍。多版本、可调节语气。</p>
          </div>

          {/* Feature 5: 进度追踪 */}
          <div className="bg-accent-light rounded-3xl p-8 border border-accent/10">
            <div className="w-11 h-11 bg-accent/15 rounded-2xl flex items-center justify-center text-sm font-black text-accent mb-5">%</div>
            <h3 className="text-xl font-bold mb-3">进度追踪</h3>
            <p className="text-muted text-[15px] mb-5">按学期追踪复习进度，一眼看到哪些课已搞定、哪些还在拖延。</p>
            {/* Mini progress bar */}
            <div className="bg-white/60 rounded-full h-3 overflow-hidden">
              <div className="bg-accent h-full rounded-full w-3/5" />
            </div>
            <div className="text-xs text-accent font-bold mt-2">60% 完成</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ─── */
function HowItWorks() {
  const steps = [
    { num: "01", title: "选择专业", desc: "告诉我们你学什么、去哪个大学", color: "bg-accent", textColor: "text-white" },
    { num: "02", title: "上传成绩单", desc: "PDF或Word，AI秒速解析全部课程", color: "bg-coral", textColor: "text-white" },
    { num: "03", title: "Swipe刷课", desc: "像刷短视频一样逐门击破高风险课", color: "bg-lime", textColor: "text-foreground" },
    { num: "04", title: "Mock面试", desc: "真人1v1模拟，给你最真实的反馈", color: "bg-foreground", textColor: "text-background" },
  ];

  return (
    <section id="how" className="py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            4步，Slay your APS
          </h2>
          <p className="text-lg text-muted">从注册到通过，最快一周</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {steps.map((s) => (
            <div key={s.num} className={`${s.color} ${s.textColor} rounded-3xl p-6 md:p-8 flex flex-col justify-between min-h-[220px]`}>
              <div className="text-5xl md:text-6xl font-black opacity-30">{s.num}</div>
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-sm opacity-70 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ─── */
function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28 px-6 bg-card">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            选择你的Slay方案
          </h2>
          <p className="text-lg text-muted">一杯奶茶钱，换APS一次通过</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {/* Basic */}
          <div className="bg-background p-7 rounded-3xl border-2 border-border">
            <h3 className="text-lg font-bold mb-1">Basic</h3>
            <div className="text-4xl font-black mb-1">¥29</div>
            <p className="text-sm text-muted mb-8">一次付费 · 永久使用</p>
            <ul className="space-y-3.5 text-sm mb-10">
              <li className="flex items-center gap-3"><span className="w-5 h-5 bg-success/15 rounded-full flex items-center justify-center text-success text-[10px] font-bold">+</span>APS基础攻略</li>
              <li className="flex items-center gap-3"><span className="w-5 h-5 bg-success/15 rounded-full flex items-center justify-center text-success text-[10px] font-bold">+</span>AI自我介绍（1次）</li>
              <li className="flex items-center gap-3"><span className="w-5 h-5 bg-success/15 rounded-full flex items-center justify-center text-success text-[10px] font-bold">+</span>成绩单解析 + 风险等级</li>
              <li className="flex items-center gap-3 text-foreground/30"><span className="w-5 h-5 bg-border rounded-full" />考官预测题目</li>
              <li className="flex items-center gap-3 text-foreground/30"><span className="w-5 h-5 bg-border rounded-full" />Swipe刷课 + 进度追踪</li>
            </ul>
            <Link href="/dashboard" className="block text-center border-2 border-border py-3 rounded-full hover:bg-card transition text-sm font-semibold">
              开始体验
            </Link>
          </div>

          {/* Pro — highlighted */}
          <div className="bg-foreground text-background p-7 rounded-3xl relative scale-[1.02] shadow-xl shadow-foreground/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-lime text-foreground text-xs px-5 py-1.5 rounded-full font-bold">
              Most popular
            </div>
            <h3 className="text-lg font-bold mb-1">Pro</h3>
            <div className="text-4xl font-black mb-1">¥59</div>
            <p className="text-sm text-background/50 mb-8">一次付费 · 永久解锁</p>
            <ul className="space-y-3.5 text-sm mb-10">
              <li className="flex items-center gap-3"><span className="w-5 h-5 bg-lime/20 rounded-full flex items-center justify-center text-lime text-[10px] font-bold">+</span>Basic全部功能</li>
              <li className="flex items-center gap-3"><span className="w-5 h-5 bg-lime/20 rounded-full flex items-center justify-center text-lime text-[10px] font-bold">+</span><strong>考官预测题目（每课2-3题）</strong></li>
              <li className="flex items-center gap-3"><span className="w-5 h-5 bg-lime/20 rounded-full flex items-center justify-center text-lime text-[10px] font-bold">+</span><strong>Swipe刷课完整版</strong></li>
              <li className="flex items-center gap-3"><span className="w-5 h-5 bg-lime/20 rounded-full flex items-center justify-center text-lime text-[10px] font-bold">+</span>AI自我介绍不限次数</li>
              <li className="flex items-center gap-3"><span className="w-5 h-5 bg-lime/20 rounded-full flex items-center justify-center text-lime text-[10px] font-bold">+</span>成就解锁 + 进度追踪</li>
            </ul>
            <Link href="/dashboard" className="block text-center bg-lime text-foreground py-3 rounded-full text-sm font-bold hover:opacity-90 transition">
              升级 Pro
            </Link>
          </div>

          {/* Max */}
          <div className="bg-gradient-to-b from-accent-light to-background p-7 rounded-3xl border-2 border-accent/20">
            <h3 className="text-lg font-bold mb-1">Max</h3>
            <div className="text-4xl font-black mb-1">¥99</div>
            <p className="text-sm text-muted mb-8">含Mock面试折扣</p>
            <ul className="space-y-3.5 text-sm mb-10">
              <li className="flex items-center gap-3"><span className="w-5 h-5 bg-accent/15 rounded-full flex items-center justify-center text-accent text-[10px] font-bold">+</span>Pro全部功能</li>
              <li className="flex items-center gap-3"><span className="w-5 h-5 bg-accent/15 rounded-full flex items-center justify-center text-accent text-[10px] font-bold">+</span><strong>AI学习排期</strong></li>
              <li className="flex items-center gap-3"><span className="w-5 h-5 bg-accent/15 rounded-full flex items-center justify-center text-accent text-[10px] font-bold">+</span><strong>WeChat备考社群</strong></li>
              <li className="flex items-center gap-3"><span className="w-5 h-5 bg-accent/15 rounded-full flex items-center justify-center text-accent text-[10px] font-bold">+</span><strong>Mock面试 ¥200/次</strong></li>
              <li className="flex items-center gap-3"><span className="w-5 h-5 bg-accent/15 rounded-full flex items-center justify-center text-accent text-[10px] font-bold">+</span>优先预约名额</li>
            </ul>
            <Link href="/dashboard" className="block text-center bg-accent text-white py-3 rounded-full text-sm font-bold hover:opacity-90 transition">
              成为 Max
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA + Registration ─── */
function CTARegister() {
  return (
    <section className="py-20 md:py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-accent via-coral to-warning rounded-[2rem] p-8 md:p-14 text-center text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
              Ready to Slay?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-md mx-auto">
              免费注册，30秒上传成绩单，AI帮你规划全部备考路线。
            </p>

            {/* Inline registration form */}
            <div className="bg-white rounded-2xl p-6 max-w-sm mx-auto text-left">
              <div className="space-y-3 mb-4">
                <input
                  type="email"
                  placeholder="你的邮箱"
                  className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm text-foreground bg-background placeholder:text-muted focus:outline-none focus:border-accent transition"
                  readOnly
                />
                <input
                  type="password"
                  placeholder="设置密码"
                  className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm text-foreground bg-background placeholder:text-muted focus:outline-none focus:border-accent transition"
                  readOnly
                />
              </div>
              <Link
                href="/register"
                className="block w-full bg-foreground text-background text-center py-3.5 rounded-xl text-sm font-bold hover:opacity-90 transition"
              >
                免费注册 — 开始Slay
              </Link>
              <p className="text-center text-[11px] text-muted mt-3">
                已有账号？ <Link href="/login" className="text-accent font-semibold hover:underline">登录</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="border-t border-border py-14 px-6 bg-card">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        <div>
          <div className="text-xl font-extrabold mb-3">
            AP<span className="text-accent">Slay</span>
          </div>
          <p className="text-sm text-muted max-w-xs leading-relaxed">
            Slay your APS interview.
            <br />
            AI分析 + 真人Mock面试。
          </p>
        </div>
        <div className="flex gap-14">
          <div>
            <h4 className="font-bold text-sm mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-muted">
              <li><Link href="#features" className="hover:text-foreground transition">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-foreground transition">Pricing</Link></li>
              <li><Link href="/tips" className="hover:text-foreground transition">APS攻略</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4">Service</h4>
            <ul className="space-y-2.5 text-sm text-muted">
              <li><Link href="/mock-interview" className="hover:text-foreground transition">Mock面试</Link></li>
              <li><Link href="/mock-interview#contact" className="hover:text-foreground transition">微信咨询</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-border text-xs text-muted">
        © 2026 APSlay. Slay your APS, not your life.
      </div>
    </footer>
  );
}

/* ─── Page ─── */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <BrandStory />
        <MockInterviewBanner />
        <Features />
        <HowItWorks />
        <Pricing />
        <CTARegister />
      </main>
      <Footer />
    </>
  );
}
