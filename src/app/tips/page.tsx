import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "APS备考全攻略 | APSlay",
  description: "APS面试免费攻略：面试流程、必带材料、面试地点、语言选择、笔试口试技巧。一文搞定APS所有基础信息。",
};

function Navbar() {
  return (
    <nav className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border/50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          AP<span className="text-accent">Slay</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/mock-interview" className="text-sm text-muted hover:text-foreground transition hidden sm:block">
            Mock面试
          </Link>
          <Link href="/dashboard" className="text-sm bg-foreground text-background px-5 py-2 rounded-full font-semibold hover:opacity-90 transition">
            开始备考
          </Link>
        </div>
      </div>
    </nav>
  );
}

function SectionBadge({ num }: { num: string }) {
  return (
    <div className="w-10 h-10 bg-card border-2 border-border text-foreground rounded-2xl flex items-center justify-center text-sm font-black shrink-0">
      {num}
    </div>
  );
}

export default function TipsPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ─── Hero ─── */}
        <section className="relative pt-16 pb-12 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-border/30 via-background to-background" />
          <div className="relative max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 border border-border text-muted text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
              免费攻略
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-5">
              备考这件事，<br />
              <span className="text-lime" style={{textShadow: "-2px -2px 0 #1a1a1a, 2px -2px 0 #1a1a1a, -2px 2px 0 #1a1a1a, 2px 2px 0 #1a1a1a"}}>你得认真Slay。</span>
            </h1>
            <p className="text-lg text-muted max-w-xl leading-relaxed mb-10">
              从材料准备到面试技巧，一文搞定APS所有基础信息。
            </p>

            {/* Stats row — uniform treatment */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-md">
              {[
                { value: "3次", label: "一生机会" },
                { value: "65%", label: "首次通过率" },
                { value: "40min", label: "口笔试合计" },
              ].map((s) => (
                <div key={s.label} className="bg-card border-2 border-border rounded-2xl p-3 sm:p-4 text-center overflow-hidden">
                  <div className="text-xl sm:text-3xl font-black leading-none">{s.value}</div>
                  <div className="text-xs text-muted mt-1 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-6 pb-20 space-y-6">

          {/* ─── 01 什么是APS ─── */}
          <section className="bg-card rounded-3xl border-2 border-border p-8 md:p-10">
            <div className="flex items-center gap-3 mb-5">
              <SectionBadge num="01" />
              <h2 className="text-xl font-black">什么是APS？</h2>
            </div>
            <p className="text-muted leading-relaxed mb-4">
              APS（Akademische Prüfstelle，德国驻华使馆文化处留德人员审核部）是中国学生申请德国大学前必须通过的学历审核，目的是验证学历真实性及学业能力。
            </p>
            <p className="text-muted leading-relaxed mb-6">
              面试由两位考官进行，包含<strong className="text-foreground">笔试（约20分钟）</strong>和<strong className="text-foreground">口试（约20分钟）</strong>两个环节。
            </p>
            <div className="bg-coral-light border border-coral/20 rounded-2xl px-5 py-4">
              <p className="text-coral font-bold text-sm">
                重要：每人一生只有3次APS面试机会，首次通过率仅65%。没有退路，必须认真准备。
              </p>
            </div>
          </section>

          {/* ─── 02 面试地点 ─── */}
          <section className="bg-card rounded-3xl border-2 border-border p-8">
            <div className="flex items-center gap-3 mb-6">
              <SectionBadge num="02" />
              <h2 className="text-xl font-black">面试地点与交通</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {/* 北京 — 推荐 */}
              <div className="bg-lime/10 border-2 border-lime/40 rounded-2xl p-5 relative">
                <div className="absolute top-3 right-3 text-[10px] font-black bg-lime/30 text-foreground px-2 py-0.5 rounded-full uppercase tracking-wide">最推荐</div>
                <div className="text-lg font-black mb-1">北京</div>
                <p className="text-sm text-muted leading-relaxed whitespace-pre-line mb-3">朝阳区东方东路19号{"\n"}DRC外交办公大楼 D1-1302</p>
                <p className="text-xs text-muted font-medium mb-3">地铁10号线亮马桥站 步行10分钟</p>
                <p className="text-xs font-semibold text-foreground/70">全国考生均可报名 · 场次最多、等待最短，首选这里。</p>
              </div>
              {/* 上海 — 限制 */}
              <div className="bg-background border border-border rounded-2xl p-5 relative">
                <div className="absolute top-3 right-3 text-[10px] font-black bg-coral/15 text-coral px-2 py-0.5 rounded-full uppercase tracking-wide">有限制</div>
                <div className="text-lg font-black mb-1">上海</div>
                <p className="text-sm text-muted leading-relaxed whitespace-pre-line mb-3">黄浦区南京西路338号{"\n"}天安中心</p>
                <p className="text-xs text-muted font-medium mb-3">地铁2/12/13号线南京西路站</p>
                <div className="bg-coral/10 border border-coral/20 rounded-xl px-3 py-2">
                  <p className="text-xs font-semibold text-coral">⚠ 仅限江苏、浙江、上海、安徽常住居民报名，非以上省份请选北京。</p>
                </div>
              </div>
              {/* 广州 — 等待 */}
              <div className="bg-background border border-border rounded-2xl p-5 relative">
                <div className="absolute top-3 right-3 text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-wide">场次少</div>
                <div className="text-lg font-black mb-1">广州</div>
                <p className="text-sm text-muted leading-relaxed whitespace-pre-line mb-3">天河区天河路208号{"\n"}粤海天河城大厦</p>
                <p className="text-xs text-muted font-medium mb-3">地铁1/3号线体育西路站</p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                  <p className="text-xs font-semibold text-amber-700">⚠ 每年仅开考 1–2 次，等待时间可能较长，建议提前关注官网通知。</p>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-background border border-border rounded-2xl px-5 py-3">
              <p className="text-sm font-medium text-muted">建议提前30分钟到达 · 进入面试区域前电子设备须完全关机</p>
            </div>
          </section>

          {/* ─── 03 必带材料 ─── */}
          <section className="bg-card rounded-3xl border-2 border-border p-8">
            <div className="flex items-center gap-3 mb-6">
              <SectionBadge num="03" />
              <h2 className="text-xl font-black">材料清单</h2>
            </div>

            {/* 前期寄出 */}
            <div className="mb-5">
              <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3">前期寄给审核部（考前完成）</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  { item: "大学成绩单原件", note: "中英文版" },
                  { item: "其他申请材料", note: "按APS官网通知为准" },
                ].map((m) => (
                  <div key={m.item} className="bg-background border border-border rounded-2xl px-4 py-3 flex items-center gap-3">
                    <span className="w-2 h-2 bg-border rounded-full shrink-0" />
                    <div>
                      <span className="text-sm font-bold">{m.item}</span>
                      <span className="text-xs text-muted ml-2">{m.note}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted mt-2 pl-1">进度状态均可在APS官网自行查询</p>
            </div>

            {/* 考试当天 */}
            <div className="mb-4">
              <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3">考试当天必带</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  { item: "身份证原件", note: "唯一必须", highlight: true },
                  { item: "2B铅笔 + 橡皮", note: "笔试必用", highlight: false },
                  { item: "纸质复习材料", note: "可在候场区翻阅", highlight: false },
                ].map((m) => (
                  <div key={m.item} className={`rounded-2xl px-4 py-3 flex items-center gap-3 border ${m.highlight ? "bg-lime/10 border-lime/30" : "bg-background border-border"}`}>
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${m.highlight ? "bg-lime" : "bg-border"}`} />
                    <div>
                      <span className="text-sm font-bold">{m.item}</span>
                      <span className="text-xs text-muted ml-2">{m.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="bg-background border border-border rounded-2xl px-5 py-3">
                <p className="text-sm text-muted">签字笔由考场提供，用于签署保密协议，<strong className="text-foreground">个人笔带不进考场</strong>。</p>
              </div>
              <div className="bg-coral-light border border-coral/20 rounded-2xl px-5 py-3">
                <p className="text-sm font-semibold text-coral">手机等电子设备可以带，但进入面试区域前必须完全关机。</p>
              </div>
            </div>
          </section>

          {/* ─── 04 面试流程 ─── */}
          <section className="bg-card rounded-3xl border-2 border-border p-8">
            <div className="flex items-center gap-3 mb-6">
              <SectionBadge num="04" />
              <h2 className="text-xl font-black">面试流程</h2>
            </div>
            <div className="space-y-3">
              {[
                { num: "1", title: "签到候场", time: "提前15–30分钟", desc: "到达后签到，在等候区等待叫号" },
                { num: "2", title: "笔试环节", time: "约20分钟", desc: "专业课题，通常3–5题，可简答、计算或画图" },
                { num: "3", title: "口试环节", time: "约20分钟", desc: "两位考官提问，专业课 + 学习动机 + 留德计划" },
                { num: "4", title: "结果通知", time: "考完第二天", desc: "在官网查询结果，通过后获得APS证书" },
              ].map((step, i) => (
                <div key={step.num} className="flex gap-4 items-start bg-background border border-border rounded-2xl p-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${i === 3 ? "bg-lime/20 text-foreground" : "bg-foreground text-background"}`}>{step.num}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base font-bold">{step.title}</span>
                      <span className="text-xs text-muted bg-border/60 px-2 py-0.5 rounded-full">{step.time}</span>
                    </div>
                    <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── 05 Do / Don't ─── */}
          <section className="grid md:grid-cols-2 gap-4">
            <div className="bg-card rounded-3xl p-7 border-2 border-border">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-lime/20 rounded-xl flex items-center justify-center font-black text-sm">Do</div>
                <h2 className="text-lg font-black">必须做到</h2>
              </div>
              <ul className="space-y-3">
                {[
                  "用自己的话解释概念，不要死背课本",
                  "不懂的问题诚实说不知道",
                  "理工科可用画图辅助解释",
                  "提前准备好1–2分钟自我介绍",
                  "着装得体即可，穿自己喜欢的风格",
                  "保持微笑，展现自信",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm">
                    <span className="w-5 h-5 bg-lime/20 rounded-full flex items-center justify-center text-foreground text-[10px] font-black shrink-0 mt-0.5">+</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-3xl p-7 border-2 border-border">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-coral-light rounded-xl flex items-center justify-center text-coral font-black text-sm">No</div>
                <h2 className="text-lg font-black">千万别做</h2>
              </div>
              <ul className="space-y-3">
                {[
                  "背诵式回答，考官一听就知道",
                  "紧张到语速过快",
                  "对成绩差的课程完全不准备",
                  "忽略基础课（概率论、线代等）",
                  "迟到",
                  "网上分享具体面试题目（违规！）",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm">
                    <span className="w-5 h-5 bg-coral-light rounded-full flex items-center justify-center text-coral text-[10px] font-black shrink-0 mt-0.5">×</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ─── 06 语言选择 ─── */}
          <section className="bg-card rounded-3xl border-2 border-border p-8">
            <div className="flex items-center gap-3 mb-6">
              <SectionBadge num="06" />
              <h2 className="text-xl font-black">面试语言选择</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background border-2 border-border rounded-2xl p-6">
                <div className="text-2xl font-black mb-2">英语审核</div>
                <p className="text-sm text-muted leading-relaxed mb-3">适合目标英语授课项目，或德语未达B2的同学。大多数同学的选择，专业术语更熟悉。</p>
                <div className="text-xs font-bold bg-foreground text-background rounded-xl px-3 py-2 inline-block">推荐大多数同学选择</div>
              </div>
              <div className="bg-lime/8 border-2 border-lime/20 rounded-2xl p-6">
                <div className="text-2xl font-black mb-2">德语审核</div>
                <p className="text-sm text-muted leading-relaxed mb-3">适合德语B2以上且自信表达专业知识的同学。目标德语授课项目可加分。</p>
                <div className="text-xs font-bold bg-lime/20 text-foreground rounded-xl px-3 py-2 inline-block">德语B2+ 考虑选择</div>
              </div>
            </div>
            <p className="text-sm text-muted mt-4">APSlay生成的所有备考材料均支持中英/中德双语对照。</p>
          </section>

          {/* ─── 考后玄学 ─── */}
          <section className="bg-card rounded-3xl border-2 border-border p-8 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-7xl opacity-10 select-none rotate-12">☕</div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-foreground text-background rounded-2xl flex items-center justify-center text-sm font-black">玄</div>
                <h2 className="text-xl font-black">考后玄学 · 传说中的必做</h2>
              </div>
              <p className="text-[15px] leading-relaxed text-muted mb-4">
                APS考完走出审核部，第一件事：去买一杯<strong className="text-foreground">红茶拿铁</strong>。
              </p>
              <p className="text-sm text-muted leading-relaxed">
                不知道从哪届开始流传下来的仪式感。具体原理不明，反正买了也没坏处。
                毕竟熬过了备考，一杯奶茶是你应得的。
              </p>
            </div>
          </section>

          {/* ─── CTA ─── */}
          <section className="bg-foreground rounded-3xl p-8 md:p-10 text-background text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-lime/15 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-black mb-3">知道了？现在开始Slay</h2>
              <p className="text-background/50 mb-7">上传成绩单，AI帮你找出高风险课程，逐个击破</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/dashboard" className="bg-lime text-foreground px-8 py-3.5 rounded-full font-bold hover:scale-105 transition-transform text-sm">
                  免费开始备考 →
                </Link>
                <Link href="/mock-interview" className="border-2 border-background/20 text-background px-8 py-3.5 rounded-full font-semibold hover:border-background/50 transition text-sm">
                  了解Mock面试
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
