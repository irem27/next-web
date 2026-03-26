"use client";

import React, { useState, useEffect, useRef, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

/* ============================================================
   TYPES
   ============================================================ */

type HeroData = {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  searchPlaceholder: string;
  button1Text: string;
  button1Link: string;
  button2Text: string;
  button2Link: string;
};

type ServiceItemData = {
  id: string;
  number: string;
  label: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  order: number;
};

type StatsSectionData = {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
};

type StatItemData = {
  id: string;
  value: number;
  suffix: string;
  label: string;
};

type ProcessSectionData = {
  title: string;
  description: string;
};

type ProcessStepData = {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string | null;
  imageAlt: string | null;
  icon: string | null;
  badgeText: string | null;
  colorTheme: string;
  isDark: boolean;
  hasImage: boolean;
  order: number;
};

type NewsSectionData = {
  title: string;
  description: string;
};

type NewsArticleData = {
  id: string;
  title: string;
  slug: string | null;
  image: string | null;
  imageAlt: string | null;
  link: string | null;
};

type PublicSettings = {
  logisticsContactEmail: string | null;
  logisticsContactPhone: string | null;
};

/* ============================================================
   DATA
   ============================================================ */

const FALLBACK_MARQUEE = [
  "Grainfood", "Shipping", "Delivery", "Logistics",
  "Grainfood", "Budget", "Delivery", "Grainfood",
  "Shipping", "Delivery", "Logistics", "Grainfood",
];

/* ============================================================
   HELPER COMPONENTS
   ============================================================ */

function CountUp({
  end,
  suffix = "",
  duration = 2000,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (hasAnimated || !ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          const startTime = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
            else setCount(end);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function StepIcon({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    order: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
    route: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
    package: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    tracking: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    delivery: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h.008M21 12.75V6.375c0-.621-.504-1.125-1.125-1.125H12.25l-2.5-3H5.625c-.621 0-1.125.504-1.125 1.125v10.875" />
      </svg>
    ),
  };
  return <>{icons[icon] || icons.package}</>;
}

/* ============================================================
   MAIN PAGE COMPONENT
   ============================================================ */

export default function LogisticsLandingPage() {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [services, setServices] = useState<ServiceItemData[]>([]);
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);
  const [statsSection, setStatsSection] = useState<StatsSectionData | null>(null);
  const [statItems, setStatItems] = useState<StatItemData[]>([]);
  const [processSection, setProcessSection] = useState<ProcessSectionData | null>(null);
  const [processSteps, setProcessSteps] = useState<ProcessStepData[]>([]);
  const [newsSection, setNewsSection] = useState<NewsSectionData | null>(null);
  const [newsArticles, setNewsArticles] = useState<NewsArticleData[]>([]);
  const [marqueeWords, setMarqueeWords] = useState<string[]>([]);
  const [publicSettings, setPublicSettings] = useState<PublicSettings | null>(null);

  /* Angebotformular state */
  const [angebotForm, setAngebotForm] = useState({
    firmenname: "",
    ansprechpartner: "",
    adresse: "",
    email: "",
    telefonnummer: "",
    artDerWare: [] as string[],
    nachricht: "",
  });
  const [angebotStatus, setAngebotStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleAngebotChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAngebotForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleWareToggle = (ware: string) => {
    setAngebotForm((prev) => ({
      ...prev,
      artDerWare: prev.artDerWare.includes(ware)
        ? prev.artDerWare.filter((w) => w !== ware)
        : [...prev.artDerWare, ware],
    }));
  };

  const handleAngebotSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!angebotForm.firmenname || !angebotForm.email || !angebotForm.ansprechpartner) return;
    setAngebotStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: angebotForm.firmenname,
          email: angebotForm.email,
          phone: angebotForm.telefonnummer,
          message: `Angebotformular\n\nFirmenname: ${angebotForm.firmenname}\nAnsprechpartner: ${angebotForm.ansprechpartner}\nAdresse: ${angebotForm.adresse}\nE-Mail: ${angebotForm.email}\nTelefonnummer: ${angebotForm.telefonnummer}\nArt der Ware: ${angebotForm.artDerWare.join(", ") || "—"}`,
        }),
      });
      if (res.ok) {
        setAngebotStatus("success");
        setAngebotForm({ firmenname: "", ansprechpartner: "", adresse: "", email: "", telefonnummer: "", artDerWare: [], nachricht: "" });
        setTimeout(() => setAngebotStatus("idle"), 4000);
      } else {
        setAngebotStatus("error");
        setTimeout(() => setAngebotStatus("idle"), 4000);
      }
    } catch {
      setAngebotStatus("error");
      setTimeout(() => setAngebotStatus("idle"), 4000);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [heroRes, servicesRes, statsRes, processRes, newsRes, marqueeRes, settingsRes] = await Promise.all([
          fetch("/api/admin/logistics/hero"),
          fetch("/api/admin/logistics/services"),
          fetch("/api/admin/logistics/stats"),
          fetch("/api/admin/logistics/process"),
          fetch("/api/admin/logistics/news"),
          fetch("/api/admin/logistics/marquee"),
          fetch("/api/settings"),
        ]);
        if (mounted) {
          if (heroRes.ok) setHero(await heroRes.json());
          if (servicesRes.ok) {
            const sData = await servicesRes.json();
            if (Array.isArray(sData)) setServices(sData);
          }
          if (statsRes.ok) {
            const stData = await statsRes.json();
            if (stData.section) setStatsSection(stData.section);
            if (Array.isArray(stData.items)) setStatItems(stData.items);
          }
          if (settingsRes.ok) setPublicSettings(await settingsRes.json());
          if (processRes.ok) {
            const pData = await processRes.json();
            if (pData.section) setProcessSection(pData.section);
            if (Array.isArray(pData.steps)) setProcessSteps(pData.steps);
          }
          if (newsRes.ok) {
            const nData = await newsRes.json();
            if (nData.section) setNewsSection(nData.section);
            if (Array.isArray(nData.articles)) setNewsArticles(nData.articles);
          }
          if (marqueeRes.ok) {
            const mData = await marqueeRes.json();
            if (Array.isArray(mData)) setMarqueeWords(mData.map((w: { word: string }) => w.word));
          }
        }
      } catch {
        // ignore fetch errors
      }
    })();
    return () => { mounted = false; };
  }, []);

  const activeService = services[activeServiceIdx] ?? null;
  const marquee = marqueeWords.length > 0 ? marqueeWords : FALLBACK_MARQUEE;

  return (
    <div>
      <main>
        {/* ========== HERO SECTION ========== */}
        <section
          className="relative min-h-[600px] sm:min-h-[700px] lg:min-h-[85vh] flex items-center px-4 sm:px-6 lg:px-10 overflow-hidden"
          aria-label="Hero"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={hero?.backgroundImage || "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920&q=80"}
              alt="Logistics background"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a214f]/90 via-[#1a214f]/70 to-[#1a214f]/40" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-[1320px] mx-auto w-full py-20 lg:py-28">
            <div className="max-w-2xl">
              {/* Badge */}
              {hero?.badge && (
                <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-xs sm:text-sm font-medium px-4 py-2 rounded-full mb-6 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-[#f06721] animate-pulse" />
                  {hero.badge}
                </span>
              )}

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white mb-4 tracking-tight leading-[1.1]">
                {hero?.title || "LOGI CRAFT"}
              </h1>

              {/* Subtitle */}
              <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#f06721] mb-6">
                {hero?.subtitle || "Crafting Your Logistics Success"}
              </p>

              {/* Description */}
              <p className="text-white/70 text-sm sm:text-base lg:text-lg leading-relaxed mb-10 max-w-xl">
                {hero?.description ||
                  "Leading global logistics provider delivering comprehensive transport, freight, and supply chain solutions."}
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4">
                {hero?.button1Text && (
                  <Link
                    href={hero.button1Link || "#services"}
                    className="inline-flex items-center gap-2.5 bg-[#f06721] text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-[#d95a1b] transition-colors shadow-lg shadow-[#f06721]/30"
                  >
                    {hero.button1Text}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                )}
                {hero?.button2Text && (
                  <Link
                    href={hero.button2Link || "#solutions"}
                    className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-white/20 transition-colors border border-white/20"
                  >
                    {hero.button2Text}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ========== MARQUEE DIVIDER ========== */}
        <div
          className="py-5 sm:py-6 overflow-hidden bg-[#EFF6FF]"
          aria-hidden="true"
        >
          {/* Row 1 */}
          <div className="flex whitespace-nowrap animate-marquee mb-3">
            {[...marquee, ...marquee].map((word, i) => (
              <span key={`r1-${i}`} className="inline-flex items-center mx-3 sm:mx-5">
                <span
                  className={`text-[#1a214f] text-base sm:text-lg lg:text-xl font-bold ${
                    i % 3 === 0
                      ? "opacity-100"
                      : i % 3 === 1
                        ? "opacity-30"
                        : "opacity-60"
                  }`}
                >
                  {word}
                </span>
                <span className="mx-3 sm:mx-5 text-[#f06721] text-xs">●</span>
              </span>
            ))}
          </div>
          {/* Row 2 (reverse) */}
          <div className="flex whitespace-nowrap animate-marquee-reverse">
            {[...marquee, ...marquee].map((word, i) => (
              <span key={`r2-${i}`} className="inline-flex items-center mx-3 sm:mx-5">
                <span
                  className={`text-[#1a214f] text-base sm:text-lg lg:text-xl font-bold ${
                    i % 3 === 1
                      ? "opacity-100"
                      : i % 3 === 2
                        ? "opacity-30"
                        : "opacity-60"
                  }`}
                >
                  {word}
                </span>
                <span className="mx-3 sm:mx-5 text-[#f06721] text-xs">●</span>
              </span>
            ))}
          </div>
        </div>

        {/* ========== HOW WE WORK ========== */}
        <section
          id="solutions"
          className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-10 bg-[#FAFBFF]"
          aria-label="How We Work"
        >
          <div className="max-w-[1320px] mx-auto">
            <div className="text-center mb-12 lg:mb-16 max-w-2xl mx-auto">
              <h2 className="text-[28px] sm:text-[32px] lg:text-[40px] font-extrabold text-[#1a214f] mb-4 tracking-tight">
                {processSection?.title ?? "How We Work"}
              </h2>
              <p className="text-gray-500 text-[15px] sm:text-base leading-relaxed">
                {processSection?.description ??
                  "Discover our streamlined process that ensures efficiency and excellence at every step of the way."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {processSteps.map((step, idx) => {
                const theme = step.colorTheme || "blue";
                const bgMap: Record<string, string> = {
                  blue: "bg-orange-50 text-[#f06721]",
                  green: "bg-green-50 text-green-600",
                  orange: "bg-orange-50 text-orange-600",
                  purple: "bg-purple-50 text-purple-600",
                };
                const lineMap: Record<string, string> = {
                  blue: "from-orange-200",
                  green: "from-green-200",
                  orange: "from-orange-200",
                  purple: "from-purple-200",
                };
                const badgeColorMap: Record<string, string> = {
                  blue: "text-[#f06721]",
                  green: "text-green-600",
                  orange: "text-orange-600",
                  purple: "text-purple-600",
                };
                const imgGradMap: Record<string, string> = {
                  blue: "from-orange-100 to-orange-50",
                  green: "from-green-100 to-green-50",
                  orange: "from-orange-100 to-orange-50",
                  purple: "from-purple-100 to-purple-50",
                };

                // Center image panel after first step on lg screens
                const showCenterPanel = idx === 1 && processSteps.length >= 2;

                return (
                  <React.Fragment key={step.id}>
                    {showCenterPanel && (
                      <div className="hidden lg:flex relative rounded-[20px] overflow-hidden min-h-[360px] items-end">
                        <Image
                          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"
                          alt="Shipping containers being loaded at a port crane"
                          fill
                          className="object-cover"
                          sizes="33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a214f]/60 to-transparent" />
                        <div className="relative z-10 p-6">
                          <span className="text-white/80 text-xs font-medium tracking-widest uppercase">
                            Global Network
                          </span>
                          <p className="text-white text-lg font-bold mt-1">
                            150+ Countries Connected
                          </p>
                        </div>
                      </div>
                    )}

                    <div
                      className={`rounded-[20px] p-7 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                        step.isDark
                          ? "bg-[#1a214f]"
                          : "bg-white border border-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-5">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-lg ${
                            step.isDark ? "bg-white/10 text-white" : bgMap[theme] ?? bgMap.blue
                          }`}
                        >
                          {step.number}
                        </div>
                        <div
                          className={`h-px flex-1 bg-gradient-to-r to-transparent ${
                            step.isDark ? "from-white/20" : lineMap[theme] ?? lineMap.blue
                          }`}
                        />
                      </div>
                      <h3
                        className={`text-xl font-bold mb-3 ${
                          step.isDark ? "text-white" : "text-[#1a214f]"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`text-sm leading-relaxed ${
                          step.isDark ? "text-white/60" : "text-gray-500"
                        } ${step.hasImage && step.image ? "mb-5" : ""}`}
                      >
                        {step.description}
                      </p>

                      {step.hasImage && step.image ? (
                        <div className={`relative h-36 rounded-xl overflow-hidden bg-gradient-to-br ${imgGradMap[theme] ?? imgGradMap.blue}`}>
                          <Image
                            src={step.image}
                            alt={step.imageAlt ?? step.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      ) : step.badgeText && step.icon ? (
                        <div
                          className={`flex items-center gap-2 mt-6 ${
                            step.isDark ? "text-[#f06721]" : badgeColorMap[theme] ?? badgeColorMap.blue
                          }`}
                        >
                          <StepIcon icon={step.icon} />
                          <span className="text-sm font-semibold">{step.badgeText}</span>
                        </div>
                      ) : null}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========== LATEST NEWS ========== */}
        <section
          className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-10 bg-[#f4f4f4]"
          aria-label="Latest News"
        >
          <div className="max-w-[1320px] mx-auto">
            <div className="text-center mb-12 lg:mb-16 max-w-2xl mx-auto">
              <h2 className="text-[28px] sm:text-[32px] lg:text-[40px] font-extrabold text-[#1a214f] mb-4 tracking-tight">
                {newsSection?.title ?? "Latest News"}
              </h2>
              <p className="text-gray-500 text-[15px] sm:text-base leading-relaxed">
                {newsSection?.description ??
                  "Creating Our Counter: Taking Stock of Our Journey, Embracing Growth, and Finding the Way Forward. Let\u2019s Pause, Reflect, and Renew Our Commitment to Progress."}
              </p>
              <div className="mt-7">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 bg-[#1a214f] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#162d52] transition-colors shadow-lg shadow-[#1a214f]/20"
                >
                  Alle News
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {newsArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  {article.image && (
                    <div className="relative h-[200px] sm:h-[220px] overflow-hidden">
                      <Image
                        src={article.image}
                        alt={article.imageAlt ?? article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  )}
                  <div className="p-6 sm:p-7">
                    <h3 className="text-[#1a214f] text-base sm:text-lg font-bold leading-snug line-clamp-3 group-hover:text-[#f06721] transition-colors">
                      {article.title}
                    </h3>
                    <Link
                      href={article.slug ? `/news/${article.slug}` : (article.link ?? "#")}
                      className="inline-flex items-center gap-1.5 text-[#f06721] text-sm font-semibold mt-4 hover:gap-2.5 transition-all"
                    >
                      Mehr lesen
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ========== ANGEBOTFORMULAR ========== */}
        <section
          className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-10 bg-[#FAFBFF]"
          aria-label="Angebotformular"
        >
          <div className="max-w-[1320px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left – Info */}
              <div>
                <p className="text-[#f06721] text-xs sm:text-sm font-medium tracking-widest uppercase mb-4">
                  Kontakt
                </p>
                <h2 className="text-[28px] sm:text-[32px] lg:text-[40px] font-extrabold text-[#1a214f] mb-5 leading-[1.15] tracking-tight">
                  Angebotformular
                </h2>
                <p className="text-gray-500 text-[15px] sm:text-base leading-relaxed max-w-lg mb-8">
                  Fordern Sie jetzt Ihr individuelles Angebot an. Füllen Sie das Formular aus und wir melden uns schnellstmöglich bei Ihnen.
                </p>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#f06721]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#f06721]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#1a214f] font-semibold text-sm">E-Mail</p>
                    <p className="text-gray-500 text-sm">{publicSettings?.logisticsContactEmail ?? "info@grainfood.de"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#f06721]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#f06721]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#1a214f] font-semibold text-sm">Telefon</p>
                    <p className="text-gray-500 text-sm">{publicSettings?.logisticsContactPhone ?? "+49 123 456789"}</p>
                  </div>
                </div>
              </div>

              {/* Right – Form */}
              <div className="bg-white rounded-[24px] p-7 sm:p-10 shadow-xl shadow-[#1a214f]/5 border border-gray-100">
                <form onSubmit={handleAngebotSubmit} className="space-y-5">
                  {/* Firmenname */}
                  <div>
                    <label htmlFor="firmenname" className="block text-[#1a214f] text-sm font-semibold mb-1.5">
                      Firmenname <span className="text-[#f06721]">*</span>
                    </label>
                    <input
                      id="firmenname"
                      name="firmenname"
                      type="text"
                      required
                      value={angebotForm.firmenname}
                      onChange={handleAngebotChange}
                      placeholder="Ihre Firma"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#f06721] focus:ring-2 focus:ring-[#f06721]/10 transition-all"
                    />
                  </div>

                  {/* Ansprechpartner */}
                  <div>
                    <label htmlFor="ansprechpartner" className="block text-[#1a214f] text-sm font-semibold mb-1.5">
                      Ansprechpartner <span className="text-[#f06721]">*</span>
                    </label>
                    <input
                      id="ansprechpartner"
                      name="ansprechpartner"
                      type="text"
                      required
                      value={angebotForm.ansprechpartner}
                      onChange={handleAngebotChange}
                      placeholder="Vor- und Nachname"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#f06721] focus:ring-2 focus:ring-[#f06721]/10 transition-all"
                    />
                  </div>

                  {/* Adresse */}
                  <div>
                    <label htmlFor="adresse" className="block text-[#1a214f] text-sm font-semibold mb-1.5">
                      Adresse
                    </label>
                    <input
                      id="adresse"
                      name="adresse"
                      type="text"
                      value={angebotForm.adresse}
                      onChange={handleAngebotChange}
                      placeholder="Straße, PLZ, Ort"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#f06721] focus:ring-2 focus:ring-[#f06721]/10 transition-all"
                    />
                  </div>

                  {/* E-Mail & Telefonnummer – 2 columns on sm+ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Nachricht (Müşteri mesajı) */}
                  <div>
                    <label htmlFor="nachricht" className="block text-[#1a214f] text-sm font-semibold mb-1.5">
                      Nachricht
                    </label>
                    <textarea
                      id="nachricht"
                      name="nachricht"
                      value={angebotForm.nachricht}
                      onChange={handleAngebotChange}
                      placeholder="Ihre Nachricht an uns..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#f06721] focus:ring-2 focus:ring-[#f06721]/10 transition-all min-h-[100px]"
                    />
                  </div>
                    <div>
                      <label htmlFor="angebot-email" className="block text-[#1a214f] text-sm font-semibold mb-1.5">
                        E-Mail <span className="text-[#f06721]">*</span>
                      </label>
                      <input
                        id="angebot-email"
                        name="email"
                        type="email"
                        required
                        value={angebotForm.email}
                        onChange={handleAngebotChange}
                        placeholder="name@firma.de"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#f06721] focus:ring-2 focus:ring-[#f06721]/10 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="telefonnummer" className="block text-[#1a214f] text-sm font-semibold mb-1.5">
                        Telefonnummer
                      </label>
                      <input
                        id="telefonnummer"
                        name="telefonnummer"
                        type="tel"
                        value={angebotForm.telefonnummer}
                        onChange={handleAngebotChange}
                        placeholder="+49 123 456 789"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#f06721] focus:ring-2 focus:ring-[#f06721]/10 transition-all"
                      />
                    </div>
                  </div>

                  {/* Art der Ware */}
                  <div>
                    <p className="text-[#1a214f] text-sm font-semibold mb-3">Art der Ware</p>
                    <div className="flex flex-wrap gap-2.5">
                      {["Stückgut", "Palette", "Maschinen", "Lebensmittel"].map((ware) => {
                        const isSelected = angebotForm.artDerWare.includes(ware);
                        return (
                          <button
                            key={ware}
                            type="button"
                            onClick={() => handleWareToggle(ware)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                              isSelected
                                ? "bg-[#f06721] text-white border-[#f06721] shadow-lg shadow-[#f06721]/20"
                                : "bg-white text-[#1a214f] border-gray-200 hover:border-[#f06721] hover:text-[#f06721]"
                            }`}
                          >
                            {ware}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={angebotStatus === "loading"}
                    className="w-full bg-[#1a214f] text-white py-3.5 rounded-full text-sm font-semibold hover:bg-[#162d52] transition-all shadow-lg shadow-[#1a214f]/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {angebotStatus === "loading" ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Wird gesendet…
                      </>
                    ) : (
                      <>
                        Angebot anfordern
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>

                  {/* Success / Error messages */}
                  {angebotStatus === "success" && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-xl px-4 py-3 text-sm font-medium">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Vielen Dank! Ihre Anfrage wurde erfolgreich gesendet.
                    </div>
                  )}
                  {angebotStatus === "error" && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl px-4 py-3 text-sm font-medium">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
