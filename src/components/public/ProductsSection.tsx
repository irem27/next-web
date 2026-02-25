"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

// Helper function to validate image paths
function getValidImageSrc(src: string | null | undefined, fallback: string): string {
  if (!src || src.trim() === '') return fallback
  if (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }
  return fallback
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  image: string | null;
  category?: Category;
}

interface SectionSettings {
  badgeText: string;
  title: string;
  description: string | null;
  buttonText: string;
  buttonLink: string;
}

const defaultSection: SectionSettings = {
  badgeText: "Alamira Products",
  title: "Pure Products And Honest Practices",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
  buttonText: "View All Product",
  buttonLink: "/products",
};

const defaultCategories: Category[] = [
  { id: "1", name: "Microwave Rice", slug: "microwave" },
  { id: "2", name: "Dry Rice", slug: "dry" },
  { id: "3", name: "Boil in Bag Rice", slug: "boil" },
];

export default function ProductsSection() {
  const [section, setSection] = useState<SectionSettings>(defaultSection);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/products");
        if (res.ok) {
          const data = await res.json();
          if (data.section) {
            setSection(data.section);
          }
          if (data.categories && data.categories.length > 0) {
            setCategories(data.categories);
          }
          if (data.latestProducts && data.latestProducts.length > 0) {
            setProducts(data.latestProducts);
          }
        }
      } catch (error) {
        console.error("Products data fetch error:", error);
      }
    };

    fetchData();
  }, []);

  // Filter products by category
  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter((p) => p.category?.slug === activeCategory);

  // Slider navigation
  const itemsPerView = 3;
  const maxSlide = Math.max(0, filteredProducts.length - itemsPerView);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlide));
  }, [maxSlide]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  // Reset slide when category changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [activeCategory]);

  // Title'ı iki satıra böl
  const titleParts = section.title.split(/\n|(?<=And)/);
  const titleLine1 = titleParts[0] || section.title;
  const titleLine2 = titleParts.slice(1).join(" ").trim();

  return (
    <section className="bg-[#f4f4f4] py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Category Tabs */}
        <div className="flex justify-center mb-12 lg:mb-16">
          <div className="inline-flex bg-[#0c0f23] rounded-full p-1.5 flex-wrap justify-center gap-1">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                activeCategory === "all"
                  ? "bg-[#868792] text-white"
                  : "text-white hover:text-[#868792]"
              }`}
            >
              Tümü
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.slug)}
                className={`px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                  activeCategory === category.slug
                    ? "bg-[#868792] text-white"
                    : "text-white hover:text-[#868792]"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-16 mb-12 lg:mb-16">
          {/* Left Side - Title */}
          <div className="lg:w-1/2">
            {/* Alamira Products Badge */}
            <div className="flex items-center gap-3 mb-6">
              {/* Rice grain decoration left */}
              <RiceGrainBadge />
              <span className="text-gray-600 text-sm font-medium tracking-wider uppercase">
                {section.badgeText}
              </span>
              {/* Rice grain decoration right */}
              <RiceGrainBadge flipped />
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#0c0f23] leading-tight">
              {titleLine1}
              {titleLine2 && (
                <>
                  <br />
                  {titleLine2}
                </>
              )}
            </h2>
          </div>

          {/* Right Side - Description & CTA */}
          <div className="lg:w-1/2 lg:pt-8">
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 max-w-md">
              {section.description}
            </p>

            {/* View All Product Button */}
            <a
              href={section.buttonLink}
              className="group inline-flex items-center gap-3 bg-[#868792] hover:bg-[#6e6f7a] text-white px-5 sm:px-6 py-3 rounded-full font-medium transition-all"
            >
              <span>{section.buttonText}</span>
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
          </div>
        </div>

        {/* Products Slider */}
        <div className="relative">
          {/* Slider Navigation - Left */}
          {currentSlide > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-10 w-12 h-12 bg-[#0c0f23] hover:bg-[#868792] text-white rounded-full flex items-center justify-center transition-all shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Slider Navigation - Right */}
          {currentSlide < maxSlide && filteredProducts.length > itemsPerView && (
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 z-10 w-12 h-12 bg-[#0c0f23] hover:bg-[#868792] text-white rounded-full flex items-center justify-center transition-all shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Slider Container */}
          <div className="overflow-hidden" ref={sliderRef}>
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * (100 / itemsPerView)}%)` }}
            >
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
                >
                  <div className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                    {/* Product Image */}
                    <div className="relative aspect-[3/4] flex items-center justify-center bg-[#f4f4f4]">
                      <Image
                        src={getValidImageSrc(product.image, "/images/rice-bag-1.svg")}
                        alt={product.name}
                        fill
                        className="object-contain p-6"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-4 text-center">
                      <h3 className="text-[#0c0f23] font-medium text-lg">{product.name}</h3>
                      {product.category && (
                        <span className="text-[#868792] text-sm">{product.category.name}</span>
                      )}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[#868792]/0 group-hover:bg-[#868792]/5 transition-colors duration-300 rounded-2xl pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider Dots */}
          {filteredProducts.length > itemsPerView && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: maxSlide + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "bg-[#868792] w-8"
                      : "bg-[#0c0f23]/30 hover:bg-[#0c0f23]/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Bu kategoride ürün bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function RiceGrainBadge({ flipped = false }: { flipped?: boolean }) {
  return (
    <svg
      className={`w-12 h-6 text-[#868792] ${flipped ? "scale-x-[-1]" : ""}`}
      viewBox="0 0 48 24"
      fill="none"
    >
      {/* Rice grain branch */}
      <path
        d="M4 12 Q12 12 20 12 Q28 12 36 12 Q44 12 46 12"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      {/* Rice grains */}
      <ellipse cx="10" cy="8" rx="3" ry="5" fill="currentColor" transform="rotate(-20 10 8)" />
      <ellipse cx="18" cy="6" rx="3" ry="5" fill="currentColor" transform="rotate(-10 18 6)" />
      <ellipse cx="26" cy="5" rx="3" ry="5" fill="currentColor" transform="rotate(5 26 5)" />
      <ellipse cx="34" cy="6" rx="3" ry="5" fill="currentColor" transform="rotate(15 34 6)" />
      <ellipse cx="42" cy="8" rx="3" ry="5" fill="currentColor" transform="rotate(25 42 8)" />
      
      <ellipse cx="14" cy="16" rx="3" ry="5" fill="currentColor" transform="rotate(15 14 16)" />
      <ellipse cx="22" cy="18" rx="3" ry="5" fill="currentColor" transform="rotate(5 22 18)" />
      <ellipse cx="30" cy="18" rx="3" ry="5" fill="currentColor" transform="rotate(-5 30 18)" />
      <ellipse cx="38" cy="16" rx="3" ry="5" fill="currentColor" transform="rotate(-15 38 16)" />
    </svg>
  );
}
