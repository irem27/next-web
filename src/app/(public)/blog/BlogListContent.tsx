"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

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

export default function BlogListContent() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/blog");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredPost = filteredPosts.find((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  if (loading) {
    return (
      <div className="bg-[#f4f4f4] flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#868792]"></div>
      </div>
    );
  }

  return (
    <main className="bg-[#f4f4f4]">
      {/* Hero Section */}
      <section className="bg-[#0c0f23] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-[#868792] text-lg">❯❯❯❯❯</span>
              <span className="text-[#868792] font-medium text-sm tracking-wider uppercase">
                Our Blog
              </span>
              <span className="text-[#868792] text-lg">❮❮❮❮❮</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-6">
              Stories Of Rice Crops & Organic
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Discover our collection of recipes, farming stories, and tips for healthy living with organic rice.
            </p>

            {/* Search */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3.5 pl-12 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#868792] focus:border-transparent transition-all"
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {searchQuery ? "Sonuç bulunamadı" : "Henüz blog yazısı yok"}
              </h3>
              <p className="mt-2 text-gray-500">
                {searchQuery
                  ? "Farklı bir arama terimi deneyin"
                  : "Yakında yeni içerikler eklenecek"}
              </p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && !searchQuery && (
                <div className="mb-16">
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="group block"
                  >
                    <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                      <div className="relative aspect-[4/3] md:aspect-auto">
                        <Image
                          src={featuredPost.image || "/images/blog-placeholder.svg"}
                          alt={featuredPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-[#868792] text-white text-xs font-medium px-3 py-1.5 rounded-full">
                            Featured
                          </span>
                        </div>
                      </div>
                      <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                          <span>{featuredPost.author}</span>
                          <span>•</span>
                          <time dateTime={featuredPost.date}>
                            {formatDate(featuredPost.date)}
                          </time>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-serif text-[#0c0f23] mb-4 group-hover:text-[#868792] transition-colors">
                          {featuredPost.title}
                        </h2>
                        {featuredPost.excerpt && (
                          <p className="text-gray-600 line-clamp-3 mb-6">
                            {featuredPost.excerpt}
                          </p>
                        )}
                        <div className="flex items-center text-[#868792] font-medium group-hover:gap-3 transition-all">
                          <span>Read More</span>
                          <svg
                            className="w-5 h-5 ml-2"
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
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Posts Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {(searchQuery ? filteredPosts : regularPosts).map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group block"
                  >
                    <article className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={post.image || "/images/blog-placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {post.featured && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-[#868792] text-white text-xs font-medium px-2.5 py-1 rounded-full">
                              Featured
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                          <span className="font-medium">{post.author}</span>
                          <span>•</span>
                          <time dateTime={post.date}>
                            {formatDate(post.date)}
                          </time>
                        </div>
                        <h3 className="text-lg font-semibold text-[#0c0f23] mb-2 line-clamp-2 group-hover:text-[#868792] transition-colors">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center text-[#868792] text-sm font-medium mt-auto">
                          <span>Read More</span>
                          <svg
                            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
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
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Load More - Future Enhancement */}
              {filteredPosts.length > 9 && (
                <div className="text-center mt-12">
                  <button className="inline-flex items-center gap-2 bg-[#0c0f23] hover:bg-[#1a1d3a] text-white px-8 py-3.5 rounded-full font-medium transition-colors">
                    Load More
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
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
