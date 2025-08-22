import React, { useMemo, useState } from "react";

/**
 * CINEMATIC NOIR — One-file prototype (Velvet Red + Video Hero + Contact Form)
 * - Responsive, bilingual (EN / 繁中)
 * - TailwindCSS utility classes
 * - Accessible semantics + keyboard focus
 * - Sticky mobile contact bar
 * - Sections: Hero (16:9 video), Showreel, Advantages, Case Studies, Process, FAQ, Final CTA, Contact Form, Footer
 * NOTE: Replace placeholder media sources with your reels/images.
 */

const ACCENT = {
  base: "#B80F2A", // velvet red accent
  hover: "#9A0C22",
};

const LANG = {
  EN: "EN",
  ZH: "ZH",
} as const;

type Lang = typeof LANG[keyof typeof LANG];

const copy = {
  heroTitle: {
    EN: "Cinematic AI Visuals, Delivered Like a Feature Film",
    ZH: "AI 電影級視覺，像上映一部專屬長片",
  },
  heroSubtitle: {
    EN: "Premium short-form ads for beauty & lifestyle brands. 72-hour turnaround, 40–70% lower cost.",
    ZH: "專為醫美與生活風格品牌打造的高級短片。72 小時交付，成本降低 40–70%。",
  },
  ctaPrimary: {
    EN: "Book a Discovery Call",
    ZH: "預約諮詢",
  },
  ctaSecondary: {
    EN: "Watch 30s Showreel",
    ZH: "觀看 30 秒精選",
  },
  trustBullets: {
    EN: ["NDA Available", "Invoice Ready", "Taipei・Taichung"],
    ZH: ["可簽 NDA", "可開立發票", "台北・台中"],
  },
  advantagesTitle: { EN: "Our Edge", ZH: "我們的優勢" },
  advantages: [
    {
      title: { EN: "AI Core, Human Taste", ZH: "AI 核心、人類美學" },
      desc: {
        EN: "Consistent faces, brand voice, natural skin tones—guided by senior art direction.",
        ZH: "人像一致、品牌語氣維持、自然膚色與光影，由資深美術指導掌舵。",
      },
      stat: { EN: "95% brand tone match", ZH: "品牌語氣維持率 95%" },
    },
    {
      title: { EN: "Speed & Cost", ZH: "效率與成本" },
      desc: {
        EN: "From brief to delivery in as fast as 72 hours, 40–70% below traditional shoots.",
        ZH: "最短 72 小時從需求到交付，成本較傳統拍攝降低 40–70%。",
      },
      stat: { EN: "72h turnaround", ZH: "72 小時交付" },
    },
    {
      title: { EN: "Aesthetic-Driven", ZH: "美學驅動" },
      desc: {
        EN: "Noir lighting, premium color, and editorial pacing crafted for conversion.",
        ZH: "黑色電影燈光、高級色調、編輯級節奏，為轉單率而生。",
      },
      stat: { EN: "+18–35% conversions", ZH: "轉單率 +18–35%" },
    },
  ],
  showreelTitle: { EN: "Showreel", ZH: "精選作品" },
  casesTitle: { EN: "Case Highlights", ZH: "案例精選" },
  processTitle: { EN: "Production in Four Scenes", ZH: "四個場景完成製作" },
  scenes: [
    {
      title: { EN: "Scene I · Briefing", ZH: "場景一・需求討論" },
      text: {
        EN: "LINE or call. Define offer, audience, and tone. 15–30 minutes.",
        ZH: "LINE/電話快速確認訴求、受眾、語氣。15–30 分鐘。",
      },
    },
    {
      title: { EN: "Scene II · Script", ZH: "場景二・腳本" },
      text: {
        EN: "We draft a 15–30s script + storyboard within 24 hours.",
        ZH: "24 小時內提供 15–30 秒腳本與故事板。",
      },
    },
    {
      title: { EN: "Scene III · Visuals", ZH: "場景三・視覺確認" },
      text: {
        EN: "Noir lighting, talent consistency, voice options. Approve in 24–48h.",
        ZH: "黑色電影光影、人物一致、配音選擇。於 24–48 小時內確認。",
      },
    },
    {
      title: { EN: "Scene IV · Delivery", ZH: "場景四・交付" },
      text: {
        EN: "Export formats for ads & socials. Source available upon request.",
        ZH: "輸出廣告與社群格式。可另付費提供專案檔。",
      },
    },
  ],
  faqTitle: { EN: "FAQ", ZH: "常見問題" },
  faqs: [
    {
      q: {
        EN: "Can you sign an NDA?",
        ZH: "可以簽署保密協議嗎？",
      },
      a: {
        EN: "Yes. We frequently work under NDA for clinics and brands.",
        ZH: "可以。我們常與診所與品牌以 NDA 合作。",
      },
    },
    {
      q: {
        EN: "Do you offer pricing packages?",
        ZH: "有方案價格嗎？",
      },
      a: {
        EN: "Yes—Starter, Standard, and Launch packages. Contact us for a quote.",
        ZH: "有：入門／標準／上市方案，歡迎聯繫估價。",
      },
    },
  ],
  finalTitle: {
    EN: "Ready for your brand’s close‑up?",
    ZH: "準備好讓品牌走到鏡頭前了嗎？",
  },
  finalSubtitle: {
    EN: "Book a 15‑minute discovery call. We’ll share a mini-script free.",
    ZH: "預約 15 分鐘諮詢，我們免費提供一段迷你腳本。",
  },
  footerCopy: {
    EN: "LYQD Media · Cinematic AI Production",
    ZH: "LYQD Media · 電影級 AI 製作",
  },
};

const caseStudies = [
  {
    title: { EN: "Laser Treatment Launch", ZH: "皮秒雷射上新" },
    metric: { EN: "+31% lead forms", ZH: "潛在客填單 +31%" },
    plot: {
      EN: "Clinic needed cinematic launch assets in 72h.",
      ZH: "診所需於 72 小時內完成上新影片。",
    },
    cut: {
      EN: "Noir-grade lighting, AI talent continuity, editorial pacing.",
      ZH: "黑色電影光影、AI 人物一致、節奏剪輯。",
    },
    poster:
      "https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: { EN: "Skincare Rebrand", ZH: "保養品牌改造" },
    metric: { EN: "+22% CTR", ZH: "點擊率 +22%" },
    plot: {
      EN: "Needed high-end feel without a full shoot.",
      ZH: "不拍攝也要高級影調。",
    },
    cut: {
      EN: "AI product shots + voiceover, velvet-red-on-black art direction.",
      ZH: "AI 產生產品鏡頭與配音，絲絨紅黑配色美術指導。",
    },
    poster:
      "https://images.unsplash.com/photo-1512203492609-8f7f06f1f3c4?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: { EN: "Wellness City Teaser", ZH: "身心城市預告" },
    metric: { EN: "+18% saves", ZH: "收藏率 +18%" },
    plot: {
      EN: "Teaser for pop-up event targeting young pros.",
      ZH: "面向年輕專業族群的快閃活動預告。",
    },
    cut: {
      EN: "Gritty grain, moody silhouettes, rhythmic captions.",
      ZH: "顆粒質感、剪影氛圍、節奏字幕。",
    },
    poster:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1400&auto=format&fit=crop",
  },
];

export default function NoirPrototype() {
  const [lang, setLang] = useState<Lang>(LANG.EN);
  const t = useMemo(() => (key: keyof typeof copy) => copy[key][lang], [lang]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 selection:bg-red-700/30">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <a href="#" className="group inline-flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-sm shadow-[0_0_30px_rgba(184,15,42,.35)]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(184,15,42,1) 0%, rgba(101,9,24,1) 100%)",
              }}
            />
            <span className="font-semibold tracking-wide">LYQD Media</span>
          </a>
          <nav className="hidden gap-8 md:flex">
            <a href="#showreel" className="navlink">Showreel</a>
            <a href="#advantages" className="navlink">Advantages</a>
            <a href="#cases" className="navlink">Cases</a>
            <a href="#process" className="navlink">Process</a>
            <a href="#faq" className="navlink">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <LangSwitch lang={lang} onChange={setLang} />
            <a
              href="#contact"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold md:inline-flex"
              style={{ backgroundColor: ACCENT.base, color: "#111" }}
            >
              {t("ctaPrimary")}
            </a>
          </div>
        </div>
      </header>

      {/* HERO — 16:9 Full-bleed video */}
      <section className="relative isolate overflow-hidden">
        <Grain />
        <div className="relative w-full">
          {/* 16:9 container that grows to viewport width; on tall screens we keep 16:9 to maintain cinematic framing */}
          <div className="relative aspect-[16/9] w-full">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="https://vimeo.com/1102865384" // TODO: replace with your hosted demo video
              autoPlay
              muted
              loop
              playsInline
              poster="https://images.unsplash.com/photo-1518558400203-08fa1b3c85be?q=80&w=1600&auto=format&fit=crop"
            />
            {/* overlay gradient for readability */}
            <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_20%_50%,rgba(0,0,0,.35),transparent_60%),linear-gradient(to_top,rgba(0,0,0,.6),transparent_35%)]" />

            {/* Content */}
            <div className="absolute inset-0">
              <div className="mx-auto flex h-full max-w-7xl items-center px-4">
                <div className="max-w-2xl">
                  <h1 className="text-balance text-4xl font-semibold leading-tight md:text-6xl">
                    {t("heroTitle")}
                  </h1>
                  <p className="mt-5 max-w-xl text-zinc-300 md:text-lg">{t("heroSubtitle")}</p>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <a
                      href="#contact"
                      className="inline-flex min-w-[220px] items-center justify-center rounded-full px-5 py-3 text-sm font-semibold shadow-[0_0_40px_rgba(184,15,42,.35)] transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-600"
                      style={{ backgroundColor: ACCENT.base, color: "#111" }}
                    >
                      {t("ctaPrimary")}
                    </a>
                    <a
                      href="#showreel"
                      className="inline-flex min-w-[200px] items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold hover:border-white/40"
                    >
                      {t("ctaSecondary")}
                    </a>
                  </div>
                  <ul className="mt-6 flex flex-wrap items-center gap-4 text-xs text-zinc-300/90">
                    {copy.trustBullets[lang].map((b) => (
                      <li key={b} className="inline-flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT.base }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOWREEL */}
      <section id="showreel" className="border-t border-white/5 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle>{t("showreelTitle")}</SectionTitle>
          <p className="mt-2 max-w-2xl text-zinc-400">
            {lang === LANG.EN
              ? "A quick look at our tone: noir lighting, premium color, editorial pacing."
              : "快速感受我們的影調：黑色電影光影、高級色彩、節奏剪輯。"}
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {caseStudies.map((c) => (
              <VideoCard key={c.poster} poster={c.poster} title={c.title[lang]} metric={c.metric[lang]} />
            ))}
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section id="advantages" className="border-t border-white/5 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle>{t("advantagesTitle")}</SectionTitle>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {copy.advantages.map((a) => (
              <div
                key={a.title.EN}
                className="group rounded-2xl border border-white/10 bg-zinc-900/40 p-6 transition hover:border-white/20"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-block h-2 w-8 rounded-full" style={{ backgroundColor: ACCENT.base }} />
                  <h3 className="text-lg font-semibold">{a.title[lang]}</h3>
                </div>
                <p className="mt-3 text-sm text-zinc-300">{a.desc[lang]}</p>
                <p className="mt-4 text-xs text-zinc-400">{a.stat[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CASE HIGHLIGHTS */}
      <section id="cases" className="border-t border-white/5 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle>{t("casesTitle")}</SectionTitle>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {caseStudies.map((c) => (
              <div key={c.title.EN} className="rounded-2xl border border-white/10 bg-zinc-900/40 shadow-lg">
                <div className="relative aspect-video overflow-hidden">
                  <img src={c.poster} alt="case poster" className="h-full w-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
                </div>
                <div className="space-y-2 p-6">
                  <h3 className="text-xl font-semibold">{c.title[lang]}</h3>
                  <p className="text-sm" style={{ color: ACCENT.base }}>{c.metric[lang]}</p>
                  <div className="pt-2 text-sm text-zinc-300">
                    <Line label={lang === LANG.EN ? "Plot" : "劇情"} value={c.plot[lang]} />
                    <Line label={lang === LANG.EN ? "Director's Cut" : "導演版"} value={c.cut[lang]} />
                  </div>
                  <a
                    href="#contact"
                    className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold hover:border-white/40"
                  >
                    {lang === LANG.EN ? "Get a similar quote" : "取得類似方案報價"}
                    <ArrowIcon />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="border-t border-white/5 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent)] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle>{t("processTitle")}</SectionTitle>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-4">
            {copy.scenes.map((s, i) => (
              <div key={s.title.EN} className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
                <div className="absolute -left-6 -top-6 rotate-[-12deg] text-[72px] font-black text-white/5">{i + 1}</div>
                <h4 className="text-lg font-semibold">{s.title[lang]}</h4>
                <p className="mt-3 text-sm text-zinc-300">{s.text[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-white/5 py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <SectionTitle>{t("faqTitle")}</SectionTitle>
          <div className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10 bg-zinc-900/40">
            {copy.faqs.map((f, idx) => (
              <details key={idx} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-left hover:bg-white/5">
                  <span className="font-medium">{f.q[lang]}</span>
                  <span className="shrink-0" style={{ color: ACCENT.base }}>＋</span>
                </summary>
                <div className="px-5 pb-5 text-zinc-300">{f.a[lang]}</div>
                {idx < copy.faqs.length - 1 && <div className="h-px bg-white/10" />}
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA (kept minimal per request) */}
      <section id="contact" className="relative isolate overflow-hidden border-t border-white/5 py-16 md:py-24">
        <Grain />
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-pretty text-3xl font-semibold md:text-5xl">{t("finalTitle")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-300">{t("finalSubtitle")}</p>
        </div>
      </section>

      {/* CONTACT FORM (new section) */}
      <section className="border-t border-white/5 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <SectionTitle>{lang === LANG.EN ? "Contact Form" : "聯絡表單"}</SectionTitle>
          <p className="mt-2 max-w-2xl text-zinc-400">
            {lang === LANG.EN
              ? "Prefer email over chat? Leave your details below and we’ll get back within 24 hours."
              : "偏好透過 Email？留下資訊，我們將在 24 小時內回覆。"}
          </p>
          <ContactForm lang={lang} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-sm text-zinc-400 md:flex-row">
          <p>{t("footerCopy")}</p>
          <div className="flex items-center gap-6">
            <a href="#showreel" className="hover:text-zinc-200">Showreel</a>
            <a href="#cases" className="hover:text-zinc-200">Cases</a>
            <a href="#contact" className="hover:text-zinc-200">Contact</a>
          </div>
        </div>
      </footer>

      {/* MOBILE STICKY BAR */}
      <div className="fixed inset-x-0 bottom-0 z-40 bg-black/80 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 px-4 py-3">
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold"
            style={{ backgroundColor: ACCENT.base, color: "#111" }}
          >
            {t("ctaPrimary")}
          </a>
          <a
            href="#showreel"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-3 text-sm font-semibold text-white hover:border-white/40"
          >
            {t("ctaSecondary")}
          </a>
        </div>
      </div>

      <style>{`
        .navlink { @apply text-sm text-zinc-300 hover:text-white; }
        /* subtle film grain overlay using CSS filter */
        .grain:before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background-image: url('data:image/svg+xml;utf8,${encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity=".08"/></svg>`
          )}');
          mix-blend-mode: overlay;
        }
      `}</style>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-pretty text-2xl font-semibold tracking-wide md:text-4xl">
      <span className="mr-3 inline-block h-3 w-12 -translate-y-1 rounded-full" style={{ backgroundColor: ACCENT.base }} />
      {children}
    </h2>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <p className="mt-1 flex items-start gap-2 text-sm text-zinc-300">
      <span className="mt-0.5 inline-flex h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: ACCENT.base }} />
      <span className="text-zinc-400">{label}：</span>
      <span className="text-zinc-200">{value}</span>
    </p>
  );
}

function VideoCard({ poster, title, metric }: { poster: string; title: string; metric: string }) {
  return (
    <figure className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40">
      <div className="relative aspect-video w-full overflow-hidden">
        <img src={poster} alt="reel poster" className="h-full w-full object-cover opacity-80 transition group-hover:scale-[1.02]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
        <button
          className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur hover:border-white/60"
        >
          ▶︎ {" "}
          <span>00:18</span>
        </button>
      </div>
      <figcaption className="flex items-center justify-between p-4">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-xs" style={{ color: ACCENT.base }}>{metric}</p>
        </div>
        <a href="#cases" className="text-xs text-zinc-300 hover:text-white">Details</a>
      </figcaption>
    </figure>
  );
}

function LangSwitch({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="inline-flex overflow-hidden rounded-full border border-white/15">
      {([LANG.EN, LANG.ZH] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={`px-3 py-1.5 text-xs font-semibold transition ${
            lang === l ? "bg-white/10 text-white" : "text-zinc-300 hover:text-white"
          }`}
          aria-pressed={lang === l}
        >
          {l === LANG.EN ? "EN" : "繁中"}
        </button>
      ))}
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Grain() {
  return <div className="grain pointer-events-none absolute inset-0" aria-hidden />;
}

function ContactForm({ lang }: { lang: Lang }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Simple mailto fallback. For real projects, replace with your API/CRM endpoint.
    const subject = encodeURIComponent(
      lang === LANG.EN ? "New inquiry from LYQD site" : "LYQD 網站新詢問"
    );
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mail = `mailto:lyqdmedia@outlook.com?subject=${subject}&body=${body}`;
    if (typeof window !== "undefined") {
      window.location.href = mail;
    }
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm text-zinc-300">{lang === LANG.EN ? "Name" : "姓名"}</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 outline-none ring-0 placeholder:text-zinc-500 focus:border-white/30"
            placeholder={lang === LANG.EN ? "Your name" : "您的姓名"}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-zinc-300">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 outline-none ring-0 placeholder:text-zinc-500 focus:border-white/30"
            placeholder="you@company.com"
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm text-zinc-300">{lang === LANG.EN ? "Message" : "需求 / 留言"}</span>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 outline-none ring-0 placeholder:text-zinc-500 focus:border-white/30"
          placeholder={
            lang === LANG.EN
              ? "Briefly describe your project, timeline, and budget range."
              : "簡述您的專案內容、時程與預算區間。"
          }
        />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold shadow-[0_0_40px_rgba(184,15,42,.35)] focus:outline-none focus:ring-2 focus:ring-red-600"
          style={{ backgroundColor: ACCENT.base, color: "#111" }}
        >
          {lang === LANG.EN ? "Send" : "送出"}
        </button>
        {sent && (
          <span className="text-sm text-zinc-400">
            {lang === LANG.EN
              ? "Your mail app should open. If not, please email us directly."
              : "您的郵件程式應已開啟；若無，請直接寄信給我們。"}
          </span>
        )}
      </div>
    </form>
  );
}
