"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface AboutData {
  id: string;
  badgeText: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  happyUsersCount: string;
  happyUsersText: string;
  image1: string | null;
  image1Alt: string | null;
  image2: string | null;
  image2Alt: string | null;
  infoCardTitle: string | null;
  infoCardText: string | null;
  badgePercent: string;
  badgeSubtext: string;
}

export default function AboutPageContent() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [valuesSection, setValuesSection] = useState<{ badgeText: string; title: string; isActive: boolean } | null>(null);
  const [valueItems, setValueItems] = useState<Array<{ id: string; title: string; description: string | null; icon: string; order: number; isActive: boolean }>>([]);
  const [cta, setCta] = useState<{
    title: string;
    description: string | null;
    primaryButtonText: string | null;
    primaryButtonLink: string | null;
    secondaryButtonText: string | null;
    secondaryButtonLink: string | null;
    isActive: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const [aboutRes, valuesRes] = await Promise.all([
        fetch("/api/admin/about?siteKey=about"),
        fetch("/api/admin/about-values?siteKey=about"),
      ]);

      if (aboutRes.ok) setAboutData(await aboutRes.json());

      if (valuesRes.ok) {
        const v = await valuesRes.json();
        if (v?.section) setValuesSection(v.section);
        if (Array.isArray(v?.items)) setValueItems(v.items);
      }

      const ctaRes = await fetch("/api/admin/about-cta?siteKey=about");
      if (ctaRes.ok) setCta(await ctaRes.json());
    } catch (error) {
      console.error("Error fetching about data:", error);
    } finally {
      setLoading(false);
    }
  };

  const icons: Record<string, JSX.Element> = {
    heart: (
      <svg className="w-10 h-10 text-[#f06721]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    shield: (
      <svg className="w-10 h-10 text-[#f06721]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    globe: (
      <svg className="w-10 h-10 text-[#f06721]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    users: (
      <svg className="w-10 h-10 text-[#f06721]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  };

  if (loading) {
    return (
      <div className="bg-[#f4f4f4] flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f06721]"></div>
      </div>
    );
  }

  return (
    <main className="bg-[#f4f4f4]">
      {/* Hero Section */}
      <section className="bg-[#1a214f] text-white py-16 md:py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#f06721] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#f06721] rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-[#f06721] text-lg">❯❯❯❯❯</span>
              <span className="text-[#f06721] font-medium text-sm tracking-wider uppercase">
                {aboutData?.badgeText || "About Us"}
              </span>
              <span className="text-[#f06721] text-lg">❮❮❮❮❮</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-6">
              {aboutData?.title || "Rice Grown With Integrity And Love"}
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              {aboutData?.description ||
                "We are committed to bringing you the finest quality rice, grown with care and respect for nature."}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                    <Image
                      src={aboutData?.image1 || "/images/rice-bowl.svg"}
                      alt={aboutData?.image1Alt || "Rice bowl"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Stats Card */}
                  <div className="bg-[#f06721] rounded-2xl p-6 text-center">
                    <div className="text-4xl font-bold text-white mb-1">
                      {aboutData?.happyUsersCount || "2000+"}
                    </div>
                    <div className="text-white/80 text-sm">
                      {aboutData?.happyUsersText || "Happy Customers"}
                    </div>
                  </div>
                </div>
                <div className="pt-8">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                    <Image
                      src={aboutData?.image2 || "/images/farmer-harvest.svg"}
                      alt={aboutData?.image2Alt || "Farmer harvesting"}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 hidden md:block">
                <div className="text-3xl font-bold text-[#1a214f]">
                  {aboutData?.badgePercent || "100%"}
                </div>
                <div className="text-gray-500 text-sm">
                  {aboutData?.badgeSubtext || "Pure Rice, Pure Life"}
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#f06721] text-lg">❯❯❯❯❯</span>
                <span className="text-[#f06721] font-medium text-sm tracking-wider uppercase">
                  Our Story
                </span>
                <span className="text-[#f06721] text-lg">❮❮❮❮❮</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-[#1a214f] mb-6">
                {aboutData?.infoCardTitle || "Alamira Basmati Sella Rice"}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {aboutData?.infoCardText ||
                  "Whether you are making a curry in a hurry or simple rice salad, we never compromise on purity, taste, quality or nutrition, so with Alamira you know you are in good hands."}
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Our journey began with a simple mission: to bring the finest quality rice from the fields to your table. 
                Every grain of Alamira rice tells a story of dedication, sustainability, and pure goodness.
              </p>

              {/* Features List */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#f06721]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#f06721]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a214f]">Premium Quality Grains</h3>
                    <p className="text-gray-500 text-sm">Only the finest grains selected through rigorous quality checks</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#f06721]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#f06721]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a214f]">Sustainable Farming</h3>
                    <p className="text-gray-500 text-sm">Environmentally conscious practices that protect our planet</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#f06721]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#f06721]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a214f]">100% Natural</h3>
                    <p className="text-gray-500 text-sm">No artificial additives, preservatives, or chemicals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-[#1a214f] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {valuesSection?.isActive !== false && (
            <>
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-[#f06721] text-lg">❯❯❯❯❯</span>
                  <span className="text-[#f06721] font-medium text-sm tracking-wider uppercase">
                    {valuesSection?.badgeText || "Unsere Werte"}
                  </span>
                  <span className="text-[#f06721] text-lg">❮❮❮❮❮</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif text-white">
                  {valuesSection?.title || "Was uns besonders macht"}
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {(valueItems.length > 0
                  ? valueItems.filter((i) => i.isActive)
                  : [
                      { id: "d1", title: "Leidenschaft", description: "Jedes Detail wird mit Hingabe und Qualitätsbewusstsein umgesetzt.", icon: "heart", order: 0, isActive: true },
                      { id: "d2", title: "Integrität", description: "Transparente Prozesse und verlässliche Partnerschaften – von Anfang bis Ende.", icon: "shield", order: 1, isActive: true },
                      { id: "d3", title: "Nachhaltigkeit", description: "Wir handeln verantwortungsvoll und denken langfristig – für Menschen und Umwelt.", icon: "globe", order: 2, isActive: true },
                      { id: "d4", title: "Gemeinschaft", description: "Wir fördern Zusammenarbeit und bauen langfristige Beziehungen auf.", icon: "users", order: 3, isActive: true },
                    ]
                ).map((item) => (
                  <div key={item.id} className="text-center">
                    <div className="w-20 h-20 mx-auto bg-[#f06721]/20 rounded-2xl flex items-center justify-center mb-6">
                      {icons[item.icon] || icons.heart}
                    </div>
                    <h3 className="text-white font-semibold text-xl mb-3">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-[#f06721] text-lg">❯❯❯❯❯</span>
              <span className="text-[#f06721] font-medium text-sm tracking-wider uppercase">
                Our Journey
              </span>
              <span className="text-[#f06721] text-lg">❮❮❮❮❮</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a214f]">
              Milestones Along The Way
            </h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#f06721]/30 -translate-x-1/2"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {/* Item 1 */}
              <div className="relative flex flex-col md:flex-row md:items-center gap-8">
                <div className="md:w-1/2 md:text-right md:pr-12">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <span className="text-[#f06721] font-bold text-2xl">2010</span>
                    <h3 className="text-xl font-semibold text-[#1a214f] mt-2">The Beginning</h3>
                    <p className="text-gray-600 mt-2">Started our journey with a small rice farm and a big dream.</p>
                  </div>
                </div>
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-[#f06721] rounded-full border-4 border-white shadow"></div>
                <div className="md:w-1/2"></div>
              </div>

              {/* Item 2 */}
              <div className="relative flex flex-col md:flex-row md:items-center gap-8">
                <div className="md:w-1/2"></div>
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-[#f06721] rounded-full border-4 border-white shadow"></div>
                <div className="md:w-1/2 md:pl-12">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <span className="text-[#f06721] font-bold text-2xl">2015</span>
                    <h3 className="text-xl font-semibold text-[#1a214f] mt-2">Organic Certification</h3>
                    <p className="text-gray-600 mt-2">Achieved organic certification, committing to sustainable farming practices.</p>
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="relative flex flex-col md:flex-row md:items-center gap-8">
                <div className="md:w-1/2 md:text-right md:pr-12">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <span className="text-[#f06721] font-bold text-2xl">2020</span>
                    <h3 className="text-xl font-semibold text-[#1a214f] mt-2">Global Expansion</h3>
                    <p className="text-gray-600 mt-2">Expanded to international markets, sharing our premium rice worldwide.</p>
                  </div>
                </div>
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-[#f06721] rounded-full border-4 border-white shadow"></div>
                <div className="md:w-1/2"></div>
              </div>

              {/* Item 4 */}
              <div className="relative flex flex-col md:flex-row md:items-center gap-8">
                <div className="md:w-1/2"></div>
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-[#f06721] rounded-full border-4 border-white shadow"></div>
                <div className="md:w-1/2 md:pl-12">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <span className="text-[#f06721] font-bold text-2xl">2026</span>
                    <h3 className="text-xl font-semibold text-[#1a214f] mt-2">Today & Beyond</h3>
                    <p className="text-gray-600 mt-2">Continuing our mission to bring pure, quality rice to families everywhere.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#f5f5f0] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {(cta?.isActive ?? true) && (
            <>
              <h2 className="text-3xl md:text-4xl font-serif text-[#1a214f] mb-6">
                {cta?.title || "Ready to Experience Pure Rice?"}
              </h2>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                {cta?.description ||
                  "Discover our premium collection of Basmati and Sella rice. Taste the difference that quality and care makes."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {(cta?.primaryButtonText || cta?.primaryButtonLink) && (
                  <a
                    href={cta?.primaryButtonLink || "/products"}
                    className="inline-flex items-center justify-center gap-2 bg-[#f06721] hover:bg-[#d95a1b] text-white font-semibold px-8 py-4 rounded-full transition-colors"
                  >
                    {cta?.primaryButtonText || "View Our Products"}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                )}
                {(cta?.secondaryButtonText || cta?.secondaryButtonLink) && (
                  <a
                    href={cta?.secondaryButtonLink || "/contact"}
                    className="inline-flex items-center justify-center gap-2 bg-[#1a214f] hover:bg-[#2a3342] text-white font-semibold px-8 py-4 rounded-full transition-colors"
                  >
                    {cta?.secondaryButtonText || "Contact Us"}
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
