"use client";

import React, { useState, useEffect, useRef } from "react";
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

/* ============================================================
   DATA
   ============================================================ */

const FALLBACK_MARQUEE = [
  "LogiCraft", "Shipping", "Delivery", "Logistics",
  "LogiCraft", "Budget", "Delivery", "LogiCraft",
  "Shipping", "Delivery", "Logistics", "LogiCraft",
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

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [heroRes, servicesRes, statsRes, processRes, newsRes, marqueeRes] = await Promise.all([
          fetch("/api/admin/logistics/hero"),
          fetch("/api/admin/logistics/services"),
          fetch("/api/admin/logistics/stats"),
          fetch("/api/admin/logistics/process"),
          fetch("/api/admin/logistics/news"),
          fetch("/api/admin/logistics/marquee"),
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
      } catch { /* silently fail, fallback UI shown */ }
    })();
    return () => { mounted = false; };
  }, []);

  const marquee = marqueeWords.length > 0 ? marqueeWords : FALLBACK_MARQUEE;

  const activeService = services[activeServiceIdx] ?? null;

  return (
    <div className="overflow-x-hidden">
      <main>
        {/* ========== HERO SECTION ========== */}
        <div className="bg-[#1a214f]">
          <section
            id="track"
            className="pt-8 sm:pt-10 lg:pt-12 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-10"
            aria-label="Hero"
          >
            <div className="max-w-[1320px] mx-auto">
              <div
                className="relative w-full rounded-[28px] overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #1a214f 0%, #2a3470 50%, #3d4a8f 100%)",
                }}
              >
                {/* Background Image */}
                {(hero?.backgroundImage || !hero) && (
                  <Image
                    src={hero?.backgroundImage || "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920&q=80"}
                    alt="Colorful shipping containers stacked at a busy international port terminal against blue sky"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1320px"
                  />
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a214f]/95 via-[#1a214f]/75 to-[#1a214f]/20 md:to-transparent" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] px-6 sm:px-10 lg:px-14 xl:px-20 py-12">
                  <div className="max-w-xl">
                    <p className="text-[#f06721] text-xs sm:text-sm font-medium tracking-widest uppercase mb-4">
                      {hero?.badge ?? "Leading Logistics Provider"}
                    </p>
                    <h1 className="text-white text-[40px] sm:text-[52px] lg:text-[68px] font-extrabold leading-[1.05] mb-3 tracking-tight">
                      {hero?.title ?? "LOGI CRAFT"}
                    </h1>
                    <p className="text-white/90 text-lg sm:text-xl lg:text-2xl font-medium mb-5 italic">
                      {hero?.subtitle ?? "Crafting Your Logistics Success"}
                    </p>
                    <p className="text-white/60 text-sm sm:text-[15px] mb-8 leading-relaxed max-w-md">
                      {hero?.description ??
                        "Leading global logistics provider delivering comprehensive transport, freight, and supply chain solutions. From packaging to final delivery, we handle every detail with precision."}
                    </p>

                    {/* Track Shipment */}
                    <div className="flex items-center bg-white rounded-full pl-4 sm:pl-5 pr-1.5 py-1.5 max-w-[420px] mb-6 shadow-xl shadow-black/10">
                      <svg
                        className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <input
                        type="text"
                        placeholder={hero?.searchPlaceholder ?? "Track My Shipment"}
                        className="bg-transparent text-gray-800 text-sm outline-none w-full placeholder-gray-400"
                        aria-label="Enter tracking number"
                      />
                      <button
                        className="bg-[#1a214f] text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-[#162d52] transition-colors flex-shrink-0"
                        aria-label="Track shipment"
                      >
                        <svg
                          className="w-4 h-4"
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
                      </button>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={hero?.button1Link ?? "#services"}
                        className="border border-white/30 text-white px-6 py-2.5 rounded-full text-[13px] sm:text-sm font-semibold hover:bg-white/10 transition-all backdrop-blur-sm"
                      >
                        {hero?.button1Text ?? "Delivery & coverage"}
                      </Link>
                      <Link
                        href={hero?.button2Link ?? "#solutions"}
                        className="bg-[#f06721] text-white px-6 py-2.5 rounded-full text-[13px] sm:text-sm font-semibold hover:bg-[#d95a1b] transition-all shadow-lg shadow-[#f06721]/30"
                      >
                        {hero?.button2Text ?? "Costs Calculators"}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ========== SERVICES + TRANSPORT SOLUTIONS ========== */}
        <section
          id="services"
          className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-10 bg-[#f4f4f4]"
          aria-label="Services and Transport Solutions"
        >
          <div className="max-w-[1320px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
              {/* Left: Numbered Services (clickable tabs) */}
              <div>
                {(services.length > 0
                  ? services
                  : [
                      { id: "f-1", number: "01", label: "By Road", title: "", description: "", buttonText: "", buttonLink: "", order: 0 },
                      { id: "f-2", number: "02", label: "By Air", title: "", description: "", buttonText: "", buttonLink: "", order: 1 },
                      { id: "f-3", number: "03", label: "By Sea", title: "", description: "", buttonText: "", buttonLink: "", order: 2 },
                    ]
                ).map((service, index, arr) => {
                  const isActive = index === activeServiceIdx;
                  return (
                    <div key={service.id}>
                      <button
                        type="button"
                        onClick={() => setActiveServiceIdx(index)}
                        className="w-full flex items-center justify-between py-5 sm:py-7 group cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-5 sm:gap-8">
                          <span
                            className={`text-[32px] sm:text-[40px] lg:text-[48px] font-extrabold transition-colors duration-300 ${
                              isActive ? "text-[#f06721]" : "text-gray-200 group-hover:text-[#f06721]"
                            }`}
                          >
                            {service.number}
                          </span>
                          <h3
                            className={`text-lg sm:text-xl lg:text-2xl font-bold transition-colors duration-300 ${
                              isActive ? "text-[#f06721]" : "text-[#1a214f] group-hover:text-[#f06721]"
                            }`}
                          >
                            {service.label}
                          </h3>
                        </div>
                        <div
                          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
                            isActive
                              ? "border-[#f06721] bg-[#f06721]"
                              : "border-gray-200 group-hover:border-[#f06721] group-hover:bg-[#f06721]"
                          }`}
                        >
                          <svg
                            className={`w-4 h-4 transition-colors duration-300 ${
                              isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                            }`}
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
                        </div>
                      </button>
                      {index < arr.length - 1 && <div className="h-px bg-gray-200" />}
                    </div>
                  );
                })}
              </div>

              {/* Right: Dynamic content based on active service */}
              <div className="flex flex-col justify-center lg:pt-4">
                <h2
                  key={activeService?.id ?? "default-title"}
                  className="text-[28px] sm:text-[32px] lg:text-[40px] font-extrabold text-[#1a214f] mb-5 leading-[1.15] tracking-tight animate-fade-in-up"
                >
                  {(activeService?.title ?? "Transport Solutions\nFor Business to Solve Any\nDelivery Problems")
                    .split("\n")
                    .map((line, i, arr) => (
                      <span key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </span>
                    ))}
                </h2>
                <p
                  key={activeService?.id ? `${activeService.id}-desc` : "default-desc"}
                  className="text-gray-500 text-[15px] sm:text-base mb-8 leading-relaxed max-w-lg animate-fade-in-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  {activeService?.description ??
                    "Logistics is the Process of Planning, Moving, and Storing Goods and Services with Minute Attention to Details. From Packaging to Maintenance to Transportation."}
                </p>
                <Link
                  href={activeService?.buttonLink ?? "#contact"}
                  className="inline-flex items-center gap-2.5 bg-[#1a214f] text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-[#162d52] transition-colors w-fit shadow-lg shadow-[#1a214f]/20"
                >
                  {activeService?.buttonText ?? "More Info"}
                  <svg
                    className="w-4 h-4"
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
            </div>
          </div>
        </section>

        {/* ========== PROGRESS / STATS SECTION ========== */}
        <section
          className="pt-6 sm:pt-8 lg:pt-10 pb-16 sm:pb-20 lg:pb-28 px-4 sm:px-6 lg:px-10 bg-[#f4f4f4]"
          aria-label="Our Progress in Numbers"
        >
          <div className="max-w-[1320px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
              {/* Left: Description */}
              <div>
                <h2 className="text-[28px] sm:text-[32px] lg:text-[40px] font-extrabold text-[#1a214f] mb-5 leading-[1.15] tracking-tight">
                  {statsSection?.title ?? "Let\u2019s See Our Progress"}
                </h2>
                <p className="text-gray-500 text-[15px] sm:text-base mb-8 leading-relaxed max-w-lg">
                  {statsSection?.description ??
                    "Creating Our Counter: Taking Stock of Our Journey, Embracing Growth, and Finding the Way Forward. Let\u2019s Pause, Reflect, and Renew Our Commitment to Progress."}
                </p>
                <Link
                  href={statsSection?.buttonLink ?? "#about"}
                  className="inline-flex items-center gap-2.5 bg-[#1a214f] text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-[#162d52] transition-colors shadow-lg shadow-[#1a214f]/20"
                >
                  {statsSection?.buttonText ?? "More Info"}
                  <svg
                    className="w-4 h-4"
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

              {/* Right: Stats Grid */}
              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                {(statItems.length > 0
                  ? statItems
                  : [
                      { id: "f-1", value: 323, suffix: "K", label: "Shipments Delivered" },
                      { id: "f-2", value: 210, suffix: "K", label: "Happy Clients" },
                      { id: "f-3", value: 1247, suffix: "", label: "Expert Partners" },
                      { id: "f-4", value: 64127, suffix: "", label: "Deliveries On-Time" },
                    ]
                ).map((stat) => (
                  <div
                    key={stat.id}
                    className="bg-[#f4f4f4] rounded-2xl p-5 sm:p-7 lg:p-8 text-center hover:bg-[#f06721]/5 transition-colors duration-300 border border-[#f06721]/10"
                  >
                    <span className="block text-[32px] sm:text-[40px] lg:text-[52px] font-extrabold text-[#1a214f] leading-none mb-2">
                      <CountUp end={stat.value} suffix={stat.suffix ?? ""} />
                    </span>
                    <span className="text-gray-500 text-xs sm:text-sm font-medium">
                      {stat.label}
                    </span>
                  </div>
                ))}
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

                {/* Center image panel after first step on lg screens */}
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
      </main>
    </div>
  );
}
