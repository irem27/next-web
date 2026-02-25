"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

// Helper function to validate image paths
function getValidImageSrc(src: string | null | undefined, fallback: string): string {
  if (!src || src.trim() === '') return fallback
  if (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }
  return fallback
}

interface HeroData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
  heroImage: string;
  isActive: boolean;
}

// Default data for SSR and initial load
const defaultHeroData: HeroData = {
  id: "",
  title: "Pure Rice, Pure Life –",
  subtitle: "Welcome To Organic",
  description: "Grow with an earth-friendly promise. Organic rice is grown with care to ensure purity, sustainability, and natural goodness.",
  buttonText: "Explore Our Rice Fields",
  buttonLink: "/products",
  backgroundImage: "",
  heroImage: "/images/hero-farmer.svg",
  isActive: true,
};

export default function HeroSection() {
  const [heroData, setHeroData] = useState<HeroData>(defaultHeroData);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const res = await fetch("/api/admin/hero");
        if (res.ok) {
          const data = await res.json();
          if (data && data.isActive) {
            setHeroData(data);
          }
        }
      } catch (error) {
        console.error("Hero data fetch error:", error);
      }
    };

    fetchHeroData();
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0c0f23]">
      {/* Background Pattern - Rice Field Illustration */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: heroData.backgroundImage
            ? `url("${heroData.backgroundImage}")`
            : `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 80 Q30 60 40 80 Q50 60 60 80 Q70 60 80 80' stroke='%23ffffff' fill='none' stroke-width='0.5'/%3E%3Cpath d='M10 90 Q20 70 30 90 Q40 70 50 90 Q60 70 70 90 Q80 70 90 90' stroke='%23ffffff' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: heroData.backgroundImage ? "cover" : "200px 200px",
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-8 sm:pt-12 lg:pt-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-8rem)]">
          {/* Left Column - Text Content */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif text-white leading-tight mb-6">
              <span className="italic">{heroData.title}</span>
              <br />
              <span className="text-white">{heroData.subtitle}</span>
            </h1>

            {/* CTA Button and Description Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8">
              <a 
                href={heroData.buttonLink}
                className="group flex items-center gap-3 bg-[#868792] hover:bg-[#6e6f7a] text-white px-5 sm:px-6 py-3 rounded-full font-medium transition-all text-sm sm:text-base"
              >
                <span>{heroData.buttonText}</span>
                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </a>

              <p className="text-gray-400 text-sm max-w-xs">
                {heroData.description}
              </p>
            </div>

            {/* Social Links */}
            <div className="flex flex-col gap-3 mt-4 lg:mt-8">
              <SocialLink
                icon="facebook"
                href="https://facebook.com"
                label="Facebook"
              />
              <SocialLink
                icon="instagram"
                href="https://instagram.com"
                label="Instagram"
              />
              <SocialLink
                icon="youtube"
                href="https://youtube.com"
                label="YouTube"
              />
              <SocialLink icon="x" href="https://x.com" label="X (Twitter)" />
            </div>

            {/* Page Indicator */}
            <div className="hidden lg:flex items-center gap-2 mt-8">
              <span className="text-white text-sm">01</span>
              <div className="w-8 h-[2px] bg-white/30">
                <div className="w-4 h-full bg-white" />
              </div>
              <span className="text-white/50 text-sm">04</span>
            </div>

            {/* Preview Images Text */}
            <div className="hidden lg:block mt-4">
              <span className="text-white/50 text-xs tracking-wider uppercase">
                Preview Images
              </span>
            </div>
          </div>

          {/* Right Column - Image and Navigation */}
          <div className="relative flex flex-col items-center justify-center order-1 lg:order-2">
            {/* Main Hero Image */}
            <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                {/* Placeholder for hero image - replace with actual image */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-green-900/40" />
                <Image
                  src={getValidImageSrc(heroData.heroImage, "/images/hero-farmer.svg")}
                  alt="Farmer harvesting rice in golden sunlight"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                />
              </div>

              {/* Decorative Elements */}
              {/* Rice grain decorations */}
              <div className="absolute -bottom-4 -right-4 lg:-bottom-8 lg:-right-8">
                <RiceGrainDecoration />
              </div>
            </div>

            {/* Right Side Navigation Arrows */}
            <div className="absolute right-0 lg:-right-8 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center gap-4">
              {/* Up Arrow */}
              <button
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                aria-label="Previous slide"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </button>

              {/* Chevron Arrows Decoration */}
              <div className="flex flex-col items-center gap-1 my-4">
                {[...Array(6)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-6 h-3 text-white/60"
                    viewBox="0 0 24 12"
                    fill="none"
                  >
                    <path
                      d="M2 2L12 10L22 2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ))}
              </div>

              {/* Down Arrow */}
              <button
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                aria-label="Next slide"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Decoration - Rice Laurel */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2">
        <RiceLaurelDecoration />
      </div>
    </section>
  );
}

function SocialLink({
  icon,
  href,
  label,
}: {
  icon: string;
  href: string;
  label: string;
}) {
  const icons: Record<string, React.ReactNode> = {
    facebook: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    youtube: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    x: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-[#868792] flex items-center justify-center text-white hover:bg-[#6e6f7a] transition-all"
      aria-label={label}
    >
      {icons[icon]}
    </a>
  );
}

function RiceGrainDecoration() {
  return (
    <svg
      className="w-16 h-24 lg:w-24 lg:h-36 text-[#868792]/60"
      viewBox="0 0 60 90"
      fill="none"
    >
      {/* Left branch */}
      <path
        d="M30 85 Q25 70 20 60 Q15 50 20 40 Q25 30 30 20"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <ellipse
        cx="18"
        cy="55"
        rx="4"
        ry="8"
        fill="currentColor"
        transform="rotate(-20 18 55)"
      />
      <ellipse
        cx="16"
        cy="45"
        rx="4"
        ry="8"
        fill="currentColor"
        transform="rotate(-25 16 45)"
      />
      <ellipse
        cx="18"
        cy="35"
        rx="4"
        ry="8"
        fill="currentColor"
        transform="rotate(-15 18 35)"
      />

      {/* Right branch */}
      <path
        d="M30 85 Q35 70 40 60 Q45 50 40 40 Q35 30 30 20"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <ellipse
        cx="42"
        cy="55"
        rx="4"
        ry="8"
        fill="currentColor"
        transform="rotate(20 42 55)"
      />
      <ellipse
        cx="44"
        cy="45"
        rx="4"
        ry="8"
        fill="currentColor"
        transform="rotate(25 44 45)"
      />
      <ellipse
        cx="42"
        cy="35"
        rx="4"
        ry="8"
        fill="currentColor"
        transform="rotate(15 42 35)"
      />
    </svg>
  );
}

function RiceLaurelDecoration() {
  return (
    <svg
      className="w-12 h-8 sm:w-16 sm:h-12 text-[#868792]/40"
      viewBox="0 0 80 40"
      fill="none"
    >
      {/* Left laurel */}
      <path d="M35 35 Q25 30 20 20 Q15 10 25 5" stroke="currentColor" strokeWidth="1" fill="none" />
      <ellipse cx="22" cy="12" rx="3" ry="6" fill="currentColor" transform="rotate(-30 22 12)" />
      <ellipse cx="25" cy="20" rx="3" ry="6" fill="currentColor" transform="rotate(-20 25 20)" />
      <ellipse cx="30" cy="28" rx="3" ry="6" fill="currentColor" transform="rotate(-10 30 28)" />
      
      {/* Right laurel */}
      <path d="M45 35 Q55 30 60 20 Q65 10 55 5" stroke="currentColor" strokeWidth="1" fill="none" />
      <ellipse cx="58" cy="12" rx="3" ry="6" fill="currentColor" transform="rotate(30 58 12)" />
      <ellipse cx="55" cy="20" rx="3" ry="6" fill="currentColor" transform="rotate(20 55 20)" />
      <ellipse cx="50" cy="28" rx="3" ry="6" fill="currentColor" transform="rotate(10 50 28)" />
    </svg>
  );
}
