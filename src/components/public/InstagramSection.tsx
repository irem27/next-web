"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

// Helper function to validate image paths
function getValidImageSrc(src: string | null | undefined, fallback: string): string {
  if (!src || src.trim() === '') return fallback
  if (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }
  return fallback
}

interface InstagramPost {
  id: string;
  image: string;
  alt: string | null;
  link: string | null;
}

interface SectionSettings {
  badgeText: string;
  title: string;
  description: string | null;
}

const defaultSection: SectionSettings = {
  badgeText: "@alamira.rice",
  title: "Alamira on Instagram",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
};

const defaultPosts: InstagramPost[] = [
  { id: "1", image: "/images/instagram-1.svg", alt: "Green rice fields", link: "https://instagram.com/alamira.rice" },
  { id: "2", image: "/images/instagram-2.svg", alt: "Golden rice stalks", link: "https://instagram.com/alamira.rice" },
  { id: "3", image: "/images/instagram-3.svg", alt: "Rice fields with mountain", link: "https://instagram.com/alamira.rice" },
  { id: "4", image: "/images/instagram-1.svg", alt: "Paddy fields at sunrise", link: "https://instagram.com/alamira.rice" },
  { id: "5", image: "/images/instagram-2.svg", alt: "Organic rice plants", link: "https://instagram.com/alamira.rice" },
];

export default function InstagramSection() {
  const [section, setSection] = useState<SectionSettings>(defaultSection);
  const [posts, setPosts] = useState<InstagramPost[]>(defaultPosts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [slidesToShow, setSlidesToShow] = useState(3);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/instagram");
        if (res.ok) {
          const data = await res.json();
          if (data.section) {
            setSection(data.section);
          }
          if (data.posts && data.posts.length > 0) {
            setPosts(data.posts);
          }
        }
      } catch (error) {
        console.error("Instagram data fetch error:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, posts.length - slidesToShow);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    if (sliderRef.current) {
      const slideWidth = 100 / slidesToShow;
      sliderRef.current.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
    }
  }, [currentIndex, slidesToShow]);

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxIndex]);

  return (
    <section className="bg-[#f4f4f4] py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-16 mb-12 lg:mb-16">
          {/* Left Side - Title */}
          <div className="lg:w-1/2">
            {/* @alamira.rice Badge */}
            <div className="flex items-center gap-3 mb-6">
              {/* Rice grain decoration left */}
              <RiceGrainBadge />
              <span className="text-[#868792] text-sm font-medium">
                {section.badgeText}
              </span>
              {/* Rice grain decoration right */}
              <RiceGrainBadge flipped />
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#0c0f23] leading-tight">
              {section.title.split(/\n|(?= on )/i).map((part, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {part}
                </span>
              ))}
            </h2>
          </div>

          {/* Right Side - Description */}
          <div className="lg:w-1/2 lg:pt-8">
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-md">
              {section.description}
            </p>
          </div>
        </div>

        {/* Instagram Slider */}
        <div className="relative">
          {/* Slider Container */}
          <div className="overflow-hidden">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-500 ease-out"
              style={{ width: `${(posts.length / slidesToShow) * 100}%` }}
            >
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className="px-2 sm:px-3"
                  style={{ width: `${100 / posts.length}%` }}
                >
                  <a
                    href={post.link || "https://instagram.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block relative aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                    aria-label={`Instagram post: ${post.alt || ""}`}
                  >
                    {/* Image */}
                    <Image
                      src={getValidImageSrc(post.image, "/images/instagram-placeholder.jpg")}
                      alt={post.alt || "Instagram post"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Plus Icon Overlay */}
                    <div className="absolute top-4 right-4">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          index === 1
                            ? "bg-[#868792] text-white"
                            : "bg-white/90 text-gray-700 group-hover:bg-[#868792] group-hover:text-white"
                        }`}
                      >
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[#0c0f23]/0 group-hover:bg-[#0c0f23]/10 transition-colors duration-300" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-[#0c0f23] hover:bg-[#868792] hover:text-white transition-all duration-300 z-10"
            aria-label="Previous slide"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-[#0c0f23] hover:bg-[#868792] hover:text-white transition-all duration-300 z-10"
            aria-label="Next slide"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "w-8 bg-[#868792]"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RiceGrainBadge({ flipped = false }: { flipped?: boolean }) {
  return (
    <svg
      className={`w-10 h-5 text-[#868792] ${flipped ? "scale-x-[-1]" : ""}`}
      viewBox="0 0 40 20"
      fill="none"
    >
      {/* Rice grain branch */}
      <path
        d="M2 10 Q10 10 20 10 Q30 10 38 10"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      {/* Rice grains */}
      <ellipse cx="8" cy="6" rx="2.5" ry="4" fill="currentColor" transform="rotate(-20 8 6)" />
      <ellipse cx="16" cy="5" rx="2.5" ry="4" fill="currentColor" transform="rotate(-10 16 5)" />
      <ellipse cx="24" cy="5" rx="2.5" ry="4" fill="currentColor" transform="rotate(10 24 5)" />
      <ellipse cx="32" cy="6" rx="2.5" ry="4" fill="currentColor" transform="rotate(20 32 6)" />
      
      <ellipse cx="12" cy="14" rx="2.5" ry="4" fill="currentColor" transform="rotate(15 12 14)" />
      <ellipse cx="20" cy="15" rx="2.5" ry="4" fill="currentColor" transform="rotate(0 20 15)" />
      <ellipse cx="28" cy="14" rx="2.5" ry="4" fill="currentColor" transform="rotate(-15 28 14)" />
    </svg>
  );
}
