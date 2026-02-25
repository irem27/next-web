"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

function getValidImageSrc(src: string | null | undefined, fallback: string): string {
  if (!src || src.trim() === "") return fallback;
  if (src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://")) return src;
  return fallback;
}

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
  isActive: boolean;
}

const defaultAboutData: AboutData = {
  id: "",
  badgeText: "About Us",
  title: "Rice Grown With Integrity And Love",
  subtitle: null,
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
  happyUsersCount: "2000+",
  happyUsersText: "Happy Users Rating",
  image1: "/images/rice-bowl.svg",
  image1Alt: "Fresh basmati rice in a wooden bowl with green rice fields in background",
  image2: "/images/farmer-harvest.svg",
  image2Alt: "Farmer harvesting rice in golden sunlight",
  infoCardTitle: "Alamira Basmati Sella Rice",
  infoCardText:
    "Whether you are making a curry in a hurry or simple rice salad, we never compromise on purity, taste, quality or nutrition, so with Tilda you know you are in good hands.",
  badgePercent: "100%",
  badgeSubtext: "Pure Rice, Pure Life",
  isActive: true,
};

interface AboutSectionProps {
  siteKey?: string;
}

export default function AboutSection({ siteKey = "alamira" }: AboutSectionProps) {
  const [aboutData, setAboutData] = useState<AboutData>(defaultAboutData);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await fetch(`/api/admin/about?siteKey=${siteKey}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.isActive) {
            setAboutData(data);
          }
        }
      } catch (error) {
        console.error("About data fetch error:", error);
      }
    };

    fetchAboutData();
  }, [siteKey]);

  const titleParts = aboutData.title.split(/\n|(?<=With)/);
  const titleLine1 = titleParts[0] || aboutData.title;
  const titleLine2 = titleParts.slice(1).join(" ").trim();

  return (
    <section className="bg-[#f5f5f0] py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-16 mb-12 lg:mb-16">
          {/* Left Side - Title */}
          <div className="lg:w-1/2">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(4)].map((_, i) => (
                  <svg key={`left-${i}`} className="w-2 h-3 text-[#f06721]" viewBox="0 0 8 12" fill="currentColor">
                    <path d="M0 6L8 0V12L0 6Z" />
                  </svg>
                ))}
              </div>
              <span className="text-[#f06721] text-sm font-medium tracking-wider uppercase">
                {aboutData.badgeText}
              </span>
              <div className="flex items-center gap-1">
                {[...Array(4)].map((_, i) => (
                  <svg key={`right-${i}`} className="w-2 h-3 text-[#f06721]" viewBox="0 0 8 12" fill="currentColor">
                    <path d="M8 6L0 0V12L8 6Z" />
                  </svg>
                ))}
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1a214f] leading-tight">
              {titleLine1}
              {titleLine2 && (
                <>
                  <br />
                  {titleLine2}
                </>
              )}
            </h2>
          </div>

          {/* Right Side - Rating */}
          <div className="lg:w-1/2 lg:pt-8">
            <div className="flex items-start gap-4">
              <div className="flex -space-x-3">
                {["amber", "blue", "rose"].map((color) => (
                  <div
                    key={color}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-${color}-200 to-${color}-400 border-2 border-white flex items-center justify-center overflow-hidden`}
                  >
                    <svg className={`w-6 h-6 text-${color}-700`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-[#1a214f]">
                    {aboutData.happyUsersCount}
                  </span>
                </div>
                <p className="text-[#f06721] text-sm font-medium">{aboutData.happyUsersText}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm sm:text-base mt-4 max-w-md leading-relaxed">
              {aboutData.description}
            </p>
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="flex flex-col gap-4 lg:gap-6">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={getValidImageSrc(aboutData.image1, "/images/rice-bowl.svg")}
                alt={aboutData.image1Alt || "Image 1"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="bg-[#1a214f] rounded-2xl p-6 sm:p-8">
              <h3 className="text-[#f06721] text-xl sm:text-2xl font-serif mb-4">{aboutData.infoCardTitle}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{aboutData.infoCardText}</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:gap-6">
            <div className="relative aspect-[16/12] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={getValidImageSrc(aboutData.image2, "/images/farmer-harvest.svg")}
                alt={aboutData.image2Alt || "Image 2"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-[#f06721] rounded-xl p-4 sm:p-6 min-w-[140px] sm:min-w-[180px]">
                <span className="block text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  {aboutData.badgePercent}
                </span>
                <span className="text-white/90 text-sm sm:text-base">{aboutData.badgeSubtext}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
