"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Helper function to validate image paths
function getValidImageSrc(src: string | null | undefined, fallback: string): string {
  if (!src || src.trim() === '') return fallback
  if (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }
  return fallback
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image: string | null;
  author: string;
  date: string;
  featured: boolean;
}

interface SectionSettings {
  badgeText: string;
  title: string;
  description: string | null;
  buttonText: string;
  buttonLink: string;
}

const defaultSection: SectionSettings = {
  badgeText: "Our Blog",
  title: "Stories Of Rice Crops & Organic",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
  buttonText: "View All Blogs",
  buttonLink: "/blog",
};

const defaultPosts: BlogPost[] = [
  {
    id: "1",
    title: "Explore The World Of Clean Farming, Honest Food, And Natural Living.",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
    date: "2025-01-30",
    author: "John Doe",
    image: "/images/blog-1.svg",
    slug: "clean-farming-natural-living",
    featured: true,
  },
  {
    id: "2",
    title: "Explore The World",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt.",
    date: "2025-01-30",
    author: "John Doe",
    image: "/images/blog-2.svg",
    slug: "explore-the-world",
    featured: false,
  },
  {
    id: "3",
    title: "Rice Farming Techniques",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt.",
    date: "2025-01-30",
    author: "John Doe",
    image: "/images/blog-3.svg",
    slug: "rice-farming-techniques",
    featured: false,
  },
];

export default function BlogSection() {
  const [section, setSection] = useState<SectionSettings>(defaultSection);
  const [posts, setPosts] = useState<BlogPost[]>(defaultPosts);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/blog");
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
        console.error("Blog data fetch error:", error);
      }
    };

    fetchData();
  }, []);

  const featuredPost = posts.find((post) => post.featured);
  const sidePosts = posts.filter((post) => !post.featured).slice(0, 2);

  // Title'ı iki satıra böl
  const titleParts = section.title.split(/\n|(?=Crops)|(?=&)/);
  const titleLine1 = titleParts[0]?.trim() || section.title;
  const titleLine2 = titleParts.slice(1).join("").trim();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section className="bg-[#f4f4f4] py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      {/* Background decoration - wheat/rice stalks */}
      <div className="absolute left-0 bottom-0 opacity-10 pointer-events-none">
        <svg
          className="w-64 h-96 text-[#868792]"
          viewBox="0 0 200 300"
          fill="currentColor"
        >
          <path d="M50 300 Q60 250 55 200 Q65 150 60 100 Q70 50 65 0" stroke="currentColor" strokeWidth="2" fill="none"/>
          <ellipse cx="55" cy="80" rx="15" ry="30" transform="rotate(-20 55 80)"/>
          <ellipse cx="65" cy="120" rx="15" ry="30" transform="rotate(15 65 120)"/>
          <ellipse cx="58" cy="160" rx="15" ry="30" transform="rotate(-10 58 160)"/>
        </svg>
      </div>
      <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
        <svg
          className="w-64 h-96 text-[#868792]"
          viewBox="0 0 200 300"
          fill="currentColor"
        >
          <path d="M150 300 Q140 250 145 200 Q135 150 140 100 Q130 50 135 0" stroke="currentColor" strokeWidth="2" fill="none"/>
          <ellipse cx="145" cy="80" rx="15" ry="30" transform="rotate(20 145 80)"/>
          <ellipse cx="135" cy="120" rx="15" ry="30" transform="rotate(-15 135 120)"/>
          <ellipse cx="142" cy="160" rx="15" ry="30" transform="rotate(10 142 160)"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-16 mb-12 lg:mb-16">
          {/* Left Side - Title */}
          <div className="lg:w-1/2">
            {/* Our Blog Badge */}
            <div className="flex items-center gap-3 mb-6">
              <RiceGrainBadge />
              <span className="text-gray-500 text-sm font-medium tracking-wider uppercase">
                {section.badgeText}
              </span>
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

            {/* View All Blog Button */}
            <Link
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
            </Link>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Featured Post - Left Column */}
          {featuredPost && (
            <article className="flex flex-col">
              {/* Featured Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 group">
                <Image
                  src={getValidImageSrc(featuredPost.image, "/images/blog-1.svg")}
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Meta */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <span>{formatDate(featuredPost.date)}</span>
                <span>-</span>
                <span>{featuredPost.author}</span>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-serif text-[#0c0f23] leading-snug mb-4">
                {featuredPost.title}
              </h3>

              {/* Excerpt */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                {featuredPost.excerpt}
              </p>

              {/* Learn More Button */}
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group inline-flex items-center gap-3 bg-[#0c0f23] hover:bg-[#1a1d3a] text-white px-5 py-2.5 rounded-full font-medium transition-all self-start"
              >
                <span>Learn More</span>
                <span className="w-7 h-7 rounded-full bg-[#868792] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <svg
                    className="w-3.5 h-3.5 text-white"
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
              </Link>
            </article>
          )}

          {/* Side Posts - Right Column */}
          <div className="flex flex-col gap-8">
            {sidePosts.map((post) => (
              <article key={post.id} className="flex flex-col sm:flex-row gap-5">
                {/* Image */}
                <div className="relative w-full sm:w-48 lg:w-56 aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden flex-shrink-0 group">
                  <Image
                    src={getValidImageSrc(post.image, "/images/blog-1.svg")}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 224px"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center">
                  {/* Meta */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <span>{formatDate(post.date)}</span>
                    <span>-</span>
                    <span>{post.author}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-serif text-[#0c0f23] leading-snug mb-3">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {post.excerpt}
                  </p>

                  {/* Learn More Button */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group inline-flex items-center gap-3 bg-[#0c0f23] hover:bg-[#1a1d3a] text-white px-4 py-2 rounded-full font-medium transition-all self-start text-sm"
                  >
                    <span>Learn More</span>
                    <span className="w-6 h-6 rounded-full bg-[#868792] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <svg
                        className="w-3 h-3 text-white"
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
                  </Link>
                </div>
              </article>
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
      <path
        d="M2 10 Q10 10 20 10 Q30 10 38 10"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
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
